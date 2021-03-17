import { getDbClient } from './../common/db'
import { UndefinedOr } from '@devprotocol/util-ts'

export const updateAlreadySend = async function (
	sendInfoId: number
): Promise<UndefinedOr<boolean>> {
	const client = getDbClient()
	const afterData = await client.send_info.update({
		where: { id: sendInfoId },
		data: { is_already_send: true },
	})
	return afterData.is_already_send
}

export const updateTxHash = async function (
	sendInfoId: number,
	txHash: string
): Promise<UndefinedOr<boolean>> {
	const client = getDbClient()
	const afterData = await client.send_info.update({
		where: { id: sendInfoId },
		data: { tx_hash: txHash, send_at: new Date() },
	})
	return afterData.is_already_send
}
