import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfFindClaimUrlApi> {
	const isParamsUndefined = typeof req.body.code === 'undefined'
	const params = isParamsUndefined
		? undefined
		: ({
				code: req.body.code,
		  } as ParamsOfFindClaimUrlApi)
	return params
}
