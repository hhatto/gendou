import BigNumber from 'bignumber.js'
import { whenDefined, UndefinedOr } from '@devprotocol/util-ts'
import { send_info } from '@prisma/client'
import { updateAlreadySend, updateTxHash } from './db'
import { sendToken } from './token'

export const send = async function (
	params: ParamsOfSendApi,
	sendInfo: send_info
): Promise<UndefinedOr<boolean>> {
	const isUpdate = await updateAlreadySend(sendInfo.id)

	const txHash =
		sendInfo.reward === '0' || isUpdate === false
			? undefined
			: await sendToken(params.address, new BigNumber(sendInfo.reward))

	const isSaved = await whenDefined(
		txHash,
		async (hash) => await updateTxHash(sendInfo.id, hash)
	)
	return isSaved
}
