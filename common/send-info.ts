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
	const result = await close(client)
	const sendInfo = tmp === null || result === false ? undefined : tmp
	return sendInfo
}
