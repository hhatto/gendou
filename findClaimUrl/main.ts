import { HttpRequest } from '@azure/functions'
import { whenDefined, UndefinedOr } from '@devprotocol/util-ts'
import { getSendInfoRecord } from '../common/send-info'
import { getParams } from './params'
import { validate } from './validate'
import { updateAt } from './db'
import { send_info } from '@prisma/client'

export const main = async function (
	req: HttpRequest
): Promise<readonly [UndefinedOr<send_info>, UndefinedOr<string>]> {
	const params = getParams(req)
	const record = await whenDefined(
		params,
		async (p) => await getSendInfoRecord(p.message)
	)
	const isValidateOk = await whenDefined(params, async (p) => await validate(p))
	const isUpdate =
		isValidateOk === true
			? await whenDefined(record, async (r) => await updateAt(r.id))
			: undefined
	const errorMessage =
		typeof params === 'undefined'
			? 'parameters error'
			: typeof record === 'undefined'
			? 'not found'
			: typeof isValidateOk === 'undefined'
			? 'validate error'
			: isValidateOk === false
			? 'illegal address'
			: typeof isUpdate === 'undefined'
			? 'unknown error'
			: isUpdate === false
			? 'db access error'
			: undefined
	return [record, errorMessage]
}
