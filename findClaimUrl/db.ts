/* eslint-disable functional/no-expression-statement */
import { getDbClient, close } from '../common/db'

export const updateAt = async function (sendInfoId: number): Promise<boolean> {
	const client = getDbClient()
	const afterData = await client.send_info.update({
		where: { id: sendInfoId },
		data: { find_at: new Date() },
	})
	const result = await close(client)
	return result === false ? false : afterData.send_at !== null
}
