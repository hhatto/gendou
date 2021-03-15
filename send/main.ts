import { HttpRequest } from '@azure/functions'
import { getParams } from './params'
import { validate } from './validate'
import { send } from './send'
import { whenDefined, UndefinedOr } from '@devprotocol/util-ts'

export const main = async function (
	req: HttpRequest
): Promise<UndefinedOr<boolean>> {
	const params = getParams(req)
	const isValidateOk = await whenDefined(params, async (p) => await validate(p))

	const isSend =
		isValidateOk === true
			? whenDefined(params, async (p) => await send(p))
			: undefined

	return isSend
}
