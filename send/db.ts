/* eslint-disable functional/no-expression-statement */
import { getDbClient, close } from './../common/db'

export const updateAlreadySend = async function (
	sendInfoId: number
): Promise<boolean> {
	const client = getDbClient()
	const afterData = await client.send_info.update({
		where: { id: sendInfoId },
		data: { is_already_send: true },
	})
	const result = await close(client)
	return result === false ? false : afterData.is_already_send
}

export const updateTxHash = async function (
	sendInfoId: number,
	txHash: string
): Promise<boolean> {
	const client = getDbClient()
	const afterData = await client.send_info.update({
		where: { id: sendInfoId },
		data: { tx_hash: txHash, send_at: new Date() },
	})
	const result = await close(client)
	return result === false
		? false
		: afterData.tx_hash !== txHash
		? false
		: afterData.send_at !== null
}
