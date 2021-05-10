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
	const status = typeof record === 'undefined' ? 400 : 200
	const errorMessage =
		typeof params === 'undefined'
			? 'parameters error'
			: typeof record === 'undefined'
			? 'not found'
			: undefined
	const value =
		status === 200 ? await whenDefined(record, (r) => r.reward) : '-1'
	const find_at =
		status === 200 ? await whenDefined(record, (r) => r.find_at) : undefined
	const body =
		status !== 200
			? { message: errorMessage }
			: {
					reward: value,
					find_at: find_at,
			  }

	return {
		status: status,
		body: body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
