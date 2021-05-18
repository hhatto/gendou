import { getCommitCount } from '../common/github-graphql'
import { getTargetDate } from '../common/utils'
import { getClaimUrlRecordByGithubId } from '../common/db/claim-url'
import { getRewordRecordByCommitCount } from '../common/db/reward'
import { getAlreadyClaimRewardInfo, getRewardInfo } from './detail'

export const main = async function (githubId: string): Promise<ApiResponce> {
	const searchDate = getTargetDate(process.env.BASE_DATE!)
	const commitCount = await getCommitCount(
		githubId,
		searchDate.from,
		searchDate.to
	)
	const rewardRecord = await getRewordRecordByCommitCount(commitCount)
	const claimUrlRecord = await getClaimUrlRecordByGithubId(githubId)
	return typeof claimUrlRecord === 'undefined'
		? getRewardInfo(rewardRecord)
		: getAlreadyClaimRewardInfo(rewardRecord, claimUrlRecord)
}
