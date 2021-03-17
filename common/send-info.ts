/* eslint-disable functional/no-expression-statement */
import { UndefinedOr } from '@devprotocol/util-ts'
import { getDbClient, close } from './db'
import { send_info } from '@prisma/client'

export const getSendInfoRecord = async function (
	githubId: string
): Promise<UndefinedOr<send_info>> {
	const client = getDbClient()
	const tmp = await client.send_info.findUnique({
		where: {
			github_id: githubId,
		},
	})
	console.log(tmp)
	const result = await close(client)
	console.log(result)
	console.log(tmp)
	const sendInfo = tmp === null || result === false ? undefined : tmp
	console.log(result)
	console.log(tmp)
	console.log(sendInfo)
	return sendInfo
}
