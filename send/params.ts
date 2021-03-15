import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfSendApi> {
	const isMessageUndefined = typeof req.params.github_id === 'undefined'
	const isSignatureUndefined = typeof req.params.signature === 'undefined'
	const isAddressUndefined = typeof req.params.address === 'undefined'
	const isParamsUndefined =
		isMessageUndefined || isSignatureUndefined || isAddressUndefined
	const params = isParamsUndefined
		? undefined
		: ({
				message: req.params.github_id,
				signature: req.params.signature,
				address: req.params.address,
		  } as ParamsOfSendApi)
	return params
}
