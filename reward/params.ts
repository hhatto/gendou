import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfRewardApi> {
	const isMessageUndefined = typeof req.params.github_id === 'undefined'
	const result = isMessageUndefined
		? undefined
		: ({
				message: req.params.github_id,
		  } as ParamsOfRewardApi)
	return result
}
