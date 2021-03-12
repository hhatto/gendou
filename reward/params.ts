import { HttpRequest } from '@azure/functions'

export const getParams = function (
	req: HttpRequest
): ParamsOfRewardApi | Error {
	const isMessageUndefined = typeof req.params.github_id === 'undefined'
	const result = isMessageUndefined
		? new Error('param is not set')
		: ({
				message: req.params.github_id,
		  } as ParamsOfRewardApi)
	return result
}
