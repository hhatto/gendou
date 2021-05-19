import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfFindClaimUrlApi> {
	const isParamsUndefined =
		typeof req.body.github_id === 'undefined' ||
		typeof req.body.signature === 'undefined' ||
		typeof req.body.address === 'undefined'
	const params = isParamsUndefined
		? undefined
		: ({
				message: req.body.github_id,
				signature: req.body.signature,
				address: req.body.addres,
		  } as ParamsOfFindClaimUrlApi)
	return params
}
