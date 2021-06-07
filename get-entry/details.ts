import { getIdFromGraphQL } from '../common/github'
import { getDbClient, close, getEntry, getRewordRecordById } from '../common/db'
import { UndefinedOr } from '@devprotocol/util-ts'
import { reward, entry } from '@prisma/client'

export const getEntryInfo = async function (
	accessToken: string
): Promise<UndefinedOr<readonly [entry, reward]>> {
	const githubId = await getIdFromGraphQL(accessToken)
	const dbClient = getDbClient()
	const entry = await getEntry(dbClient, githubId)
	const reward =
		typeof entry === 'undefined'
			? undefined
			: await getRewordRecordById(dbClient, entry.reward_id)

	// eslint-disable-next-line functional/no-expression-statement
	await close(dbClient)
	return typeof entry === 'undefined' || typeof reward === 'undefined'
		? undefined
		: [entry, reward]
}
