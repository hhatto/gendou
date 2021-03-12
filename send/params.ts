import { HttpRequest } from '@azure/functions'

export const getParams = function (req: HttpRequest): ParamsOfSendApi | Error {
	const isMessageUndefined = typeof req.params.github_id === 'undefined'
	const isSignatureUndefined = typeof req.params.signature === 'undefined'
	const isAddressUndefined = typeof req.params.address === 'undefined'
	const result =
		isMessageUndefined || isSignatureUndefined || isAddressUndefined
			? new Error('param is not set')
			: ({
					message: req.params.github_id,
					signature: req.params.signature,
					address: req.params.address,
			  } as ParamsOfSendApi)
	return result
}
