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
	const is_already_send =
		status === 200
			? await whenDefined(record, (r) => r.is_already_send)
			: undefined
	const tx_hash =
		status === 200 ? await whenDefined(record, (r) => r.tx_hash) : undefined
	const send_at =
		status === 200 ? await whenDefined(record, (r) => r.send_at) : undefined
	const body =
		status !== 200
			? { message: errorMessage, reward: value }
			: is_already_send === false
			? { is_already_send: is_already_send, reward: value }
			: {
					is_already_send: is_already_send,
					reward: value,
					tx_hash: tx_hash,
					send_at: send_at,
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
