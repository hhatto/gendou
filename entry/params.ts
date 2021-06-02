import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfEntryApi> {
	const isIllegal =
		typeof req.body.code === 'undefined' || typeof req.body.sign === 'undefined'
	return isIllegal
		? undefined
		: {
				code: req.body.code,
				sign: req.body.sign,
		  }
}
