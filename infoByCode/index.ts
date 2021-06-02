import { whenDefined } from '@devprotocol/util-ts'
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { generateErrorApiResponce } from '../common/utils'
import { getParams } from './params'
import { getRewardApiResponce } from '../common/responce'
import { getApiTokenFromCode, getIdFromGraphQL } from '../common/github'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const params = getParams(req)
	const accessToken = await whenDefined(params, (p) =>
		getApiTokenFromCode(p.code)
	)
	// const githubId = await whenDefined(accessToken, (t) =>
	// 	getIdFromGraphQL(t)
	// )
	const githubId = ''
	const result =
		typeof params === 'undefined'
			? generateErrorApiResponce('parameters error', 400)
			: typeof accessToken === 'undefined' || typeof githubId === 'undefined'
			? generateErrorApiResponce('illegal oauth token')
			: await getRewardApiResponce(githubId)
	return {
		status: result.status,
		body: result.body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
