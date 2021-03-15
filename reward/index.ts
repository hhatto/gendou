import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getReward } from '../common/reward'
import { getParams } from './params'
import { whenDefined } from '@devprotocol/util-ts'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const params = getParams(req)
	const reward = await whenDefined(
		params,
		async (p) => await getReward(p.message)
	)
	const status = typeof reward === 'undefined' ? 400 : 200
	const value =
		status === 200 ? await whenDefined(reward, (r) => r.toString()) : '-1'

	return {
		status: status,
		body: { reward: value },
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
