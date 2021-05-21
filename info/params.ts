import { HttpRequest } from '@azure/functions'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getParams = function (
	req: HttpRequest
): UndefinedOr<ParamsOfInfoApi> {
	return typeof req.params.github_id === 'undefined'
		? undefined
		: {
				githubId: req.params.github_id,
		  }
}
