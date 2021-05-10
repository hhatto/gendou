import { ethers } from 'ethers'
import { checkSameAddress } from './address'

export const validate = async function (
	params: ParamsOfSendApi
): Promise<boolean> {
	const verifiedAddresss = ethers.utils.verifyMessage(
		params.message,
		params.signature
	)

	return checkSameAddress(verifiedAddresss, params.address)
}
