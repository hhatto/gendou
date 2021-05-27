import { generateErrorApiResponce } from '../common/utils'
import { getCommitCountAndId, getApiTokenFromCode } from '../common/github'
import { getRewordRecordByCommitCount, getDbClient, close } from '../common/db'
import { claimUrl } from './details'

export const main = async function (code: string): Promise<ApiResponce> {
	const token = await getApiTokenFromCode(code)
	const githubInfo = await getCommitCountAndId(token)
	const dbClient = getDbClient()
	const rewardRecord = await getRewordRecordByCommitCount(
		dbClient,
		githubInfo.commitCount
	)

	const res =
		typeof rewardRecord === 'undefined'
			? generateErrorApiResponce('not applicable')
			: await claimUrl(dbClient, githubInfo.githubId, rewardRecord)
	const isClosed = await close(dbClient)
	return isClosed ? res : generateErrorApiResponce('db error')
}
