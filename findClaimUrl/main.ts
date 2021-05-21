import { generateErrorApiResponce } from '../common/utils'
import { getCommitCountAndId, getApiTokenFromCode } from '../common/github'
import { getRewordRecordByCommitCount } from '../common/db'
import { claimUrl } from './details'

export const main = async function (code: string): Promise<ApiResponce> {
	const token = await getApiTokenFromCode(code)
	const githubInfo = await getCommitCountAndId(token)

	const rewardRecord = await getRewordRecordByCommitCount(
		githubInfo.commitCount
	)

	return typeof rewardRecord === 'undefined'
		? generateErrorApiResponce('not applicable')
		: await claimUrl(githubInfo.githubId, rewardRecord)
}
