import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { generateErrorApiResponce } from '../common/utils'
import { getParams } from './params'
import { getAirdropIfo, addEntryInfo } from './details'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const params = getParams(req)

	const info =
		typeof params === 'undefined' ? undefined : await getAirdropIfo(params)

	const isInserted =
		typeof info === 'undefined' ? undefined : await addEntryInfo(info)

	const result =
		typeof params === 'undefined'
			? generateErrorApiResponce('parameters error', 400)
			: typeof info === 'undefined'
			? generateErrorApiResponce('get info error')
			: isInserted === false
			? generateErrorApiResponce('db error')
			: {
					status: 200,
					body: { github_id: info.githubId, address: info.address },
			  }
	return {
		status: result.status,
		body: result.body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
