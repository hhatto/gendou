import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfSendApi> {
	const isParamsUndefined =
		typeof req.params.github_id === 'undefined' ||
		typeof req.params.signature === 'undefined' ||
		typeof req.params.address === 'undefined' ||
		typeof req.params.twitter_status === 'undefined'
	const params = isParamsUndefined
		? undefined
		: ({
				message: req.params.github_id,
				signature: req.params.signature,
				address: req.params.address,
				tweetStatus: req.params.twitter_status,
		  } as ParamsOfSendApi)
	return params
}
