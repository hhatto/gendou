import { whenDefined, UndefinedOr } from '@devprotocol/util-ts'
import { ethers } from 'ethers'
import { send_info } from '@prisma/client'
import { checkSameAddress } from './address'
import { checkIncludingUrl } from './twitter'

export const validate = async function (
	params: ParamsOfSendApi,
	sendInfo: send_info
): Promise<UndefinedOr<boolean>> {
	const verifiedAddresss =
		sendInfo.is_already_send === false
			? ethers.utils.verifyMessage(params.message, params.signature)
			: undefined

	const isSameAddress = whenDefined(verifiedAddresss, (address) =>
		checkSameAddress(address, params.address)
	)

	const isIncludingUrl =
		isSameAddress === true
			? await checkIncludingUrl(params.tweetStatus)
			: undefined
	return isIncludingUrl
}
