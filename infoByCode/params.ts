import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfInfoByCodeApi> {
	return typeof req.body.code === 'undefined'
		? undefined
		: {
				code: req.body.code,
		  }
}
