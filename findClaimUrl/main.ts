import { validate } from './validate'
import { generateErrorApiResponce } from './../common/utils'
import { getFindClaimUrlResponce } from './detail'

export const main = async function (
	params: ParamsOfFindClaimUrlApi
): Promise<ApiResponce> {
	const isValidateOk = await validate(params)
	return isValidateOk
		? await getFindClaimUrlResponce(params)
		: generateErrorApiResponce('validate error')
}
