import { getCommitCount } from '../common/github-graphql'
import { getTargetDate, generateErrorApiResponce } from '../common/utils'
import { getClaimUrlRecordByGithubId } from '../common/db/claim-url'
import { getRewordRecordByCommitCount } from '../common/db/reward'
import { getAlreadyClaimRewardInfo, getRewardInfo } from './detail'

export const main = async function (githubId: string): Promise<ApiResponce> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const searchDate = getTargetDate(process.env.BASE_DATE!)
	const commitCount = await getCommitCount(
		githubId,
		searchDate.from,
		searchDate.to
	)
	const rewardRecord = await getRewordRecordByCommitCount(commitCount)
	const claimUrlRecord = await getClaimUrlRecordByGithubId(githubId)
	return typeof rewardRecord === 'undefined'
		? generateErrorApiResponce('illegal reward master')
		: typeof claimUrlRecord === 'undefined'
		? getRewardInfo(rewardRecord)
		: getAlreadyClaimRewardInfo(rewardRecord, claimUrlRecord)
}
