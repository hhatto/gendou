import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfGetEntryApi> {
	const isIllegal = typeof req.body.access_token === 'undefined'
	return isIllegal
		? undefined
		: {
				accessToken: req.body.access_token,
		  }
}
