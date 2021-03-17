import { whenDefined, UndefinedOr } from '@devprotocol/util-ts'
import { ethers } from 'ethers'
import { send_info } from '@prisma/client'
import { checkSameAddress } from './address'
import { checkIncludingUrl } from './twitter'

export const validate = async function (
	params: ParamsOfSendApi,
	sendInfo: send_info
): Promise<UndefinedOr<boolean>> {
	// TODO ethers.utils.verifyMessageがうまくいかなかった時の動作も確認する
	const verifiedAddresss =
		sendInfo.is_already_send === false
			? whenDefined(params, (p) =>
					ethers.utils.verifyMessage(p.message, p.signature)
			  )
			: undefined

	const isSameAddress =
		typeof verifiedAddresss !== 'undefined'
			? whenDefined(params, (p) =>
					checkSameAddress(verifiedAddresss, p.address)
			  )
			: undefined
	const isIncludingUrl =
		isSameAddress === true
			? await whenDefined(
					params,
					async (p) => await checkIncludingUrl(p.tweetStatus)
			  )
			: undefined
	return isIncludingUrl
}
