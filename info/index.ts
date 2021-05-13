import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getSendInfoRecord } from '../common/send-info'
import { getParams } from './params'
import { whenDefined } from '@devprotocol/util-ts'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const params = getParams(req)
	const record = await whenDefined(
		params,
		async (p) => await getSendInfoRecord(p.message)
	)
	const status = typeof params === 'undefined' ? 400 : 200
	const errorMessage =
		typeof params === 'undefined'
			? 'parameters error'
			: typeof record === 'undefined'
			? 'not found'
			: undefined
	const isSuccess = typeof errorMessage === 'undefined' && status === 200
	const value = whenDefined(record, (r) => r.reward)
	const find_at = await whenDefined(record, (r) => r.find_at)
	const body = isSuccess
		? {
				reward: value,
				find_at: find_at,
		  }
		: { message: errorMessage }

	return {
		status: status,
		body: body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
