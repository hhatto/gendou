import { whenDefined, UndefinedOr } from '@devprotocol/util-ts'
import { ethers } from 'ethers'
import { checkSameAddress } from './address'
import { checkIncludingUrl } from './twitter'
import { checkAlreadySendReword } from './db'

export const validate = async function (
	params: ParamsOfSendApi
): Promise<UndefinedOr<boolean>> {
	const isAlreadySendReword = await checkAlreadySendReword(params.message)

	// TODO ethers.utils.verifyMessageがうまくいかなかった時の動作も確認する
	const verifiedAddresss =
		isAlreadySendReword === false
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
