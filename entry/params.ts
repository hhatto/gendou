import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfEntryApi> {
	const isIllegal =
		typeof req.body.access_token === 'undefined' ||
		typeof req.body.sign === 'undefined'
	return isIllegal
		? undefined
		: {
				accessToken: req.body.access_token,
				sign: req.body.sign,
		  }
}
