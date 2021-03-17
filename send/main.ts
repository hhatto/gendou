import { HttpRequest } from '@azure/functions'
import { whenDefined, whenDefinedAll, UndefinedOr } from '@devprotocol/util-ts'
import { getSendInfoRecord } from './../common/send-info'
import { getParams } from './params'
import { validate } from './validate'
import { send } from './send'

export const main = async function (
	req: HttpRequest
): Promise<UndefinedOr<boolean>> {
	const params = getParams(req)
	const record = await whenDefined(
		params,
		async (p) => await getSendInfoRecord(p.message)
	)

	const isValidateOk = await whenDefinedAll(
		[params, record],
		async ([p, r]) => await validate(p, r)
	)

	const isSend =
		isValidateOk === true
			? await whenDefinedAll(
					[params, record],
					async ([p, r]) => await send(p, r)
			  )
			: undefined

	return isSend
}
