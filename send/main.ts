import { HttpRequest } from '@azure/functions'
import { ethers } from 'ethers'
import { getParams } from './params'
import { checkSameAddress } from './address'
import { checkIncludingUrl } from './twitter'
import { getReward } from '../common/reward'
import { checkAlreadySendReword, saveReword } from './db'
import { sendToken } from './token'

export const main = async function (
	req: HttpRequest
): Promise<Promise<Promise<Promise<boolean | Error>>>> {
	const params = getParams(req)
	const isAlreadySendReword =
		params instanceof Error
			? (params as Error)
			: checkAlreadySendReword(params.message)
	const verifiedAddresss =
		isAlreadySendReword instanceof Error
			? (isAlreadySendReword as Error)
			: ethers.utils.verifyMessage(
					(params as ParamsOfSendApi).message,
					(params as ParamsOfSendApi).signature
			  )
	const isSameAddress =
		verifiedAddresss instanceof Error
			? (verifiedAddresss as Error)
			: checkSameAddress(verifiedAddresss, (params as ParamsOfSendApi).address)
	const isIncludingUrl =
		isSameAddress instanceof Error
			? (isSameAddress as Error)
			: isSameAddress === false
			? new Error('wrong address')
			: await checkIncludingUrl((params as ParamsOfSendApi).tweetStatus)
	const reward =
		isIncludingUrl instanceof Error
			? (isIncludingUrl as Error)
			: isIncludingUrl === false
			? new Error('not including url')
			: await getReward((params as ParamsOfSendApi).message)
	const isSaved =
		reward instanceof Error
			? (reward as Error)
			: reward === 0
			? new Error('reword is 0')
			: await saveReword((params as ParamsOfSendApi).message, reward)
	const isSend =
		isSaved instanceof Error
			? (isSaved as Error)
			: isSaved === false
			? new Error('db access error')
			: await sendToken((params as ParamsOfSendApi).address, Number(reward))
	return isSend
}
