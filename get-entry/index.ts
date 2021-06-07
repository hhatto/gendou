import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { generateErrorApiResponce } from '../common/utils'
import { getParams } from './params'
import { getEntryInfo } from './details'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const params = getParams(req)

	const entryInfo =
		typeof params === 'undefined'
			? undefined
			: await getEntryInfo(params.accessToken)
	const result =
		typeof params === 'undefined'
			? generateErrorApiResponce('parameters error', 400)
			: typeof entryInfo === 'undefined'
			? generateErrorApiResponce('not found')
			: {
					status: 200,
					body: {
						id: entryInfo[0].id,
						github_id: entryInfo[0].github_id,
						address: entryInfo[0].address,
						sign: entryInfo[0].sign,
						reward: entryInfo[1].reward,
						contribution_count: entryInfo[0].contribution_count,
						create_at: entryInfo[0].create_at,
						update_at: entryInfo[0].update_at,
					},
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
