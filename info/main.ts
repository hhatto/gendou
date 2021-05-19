import { getCommitCount, generateErrorApiResponce } from '../common/utils'
import { getClaimUrlRecordByGithubId } from '../common/db/claim-url'
import { getRewordRecordByCommitCount } from '../common/db/reward'
import { getAlreadyClaimRewardInfo, getRewardInfo } from './detail'

export const main = async function (githubId: string): Promise<ApiResponce> {
	const commitCount = await getCommitCount(githubId)
	const rewardRecord = await getRewordRecordByCommitCount(commitCount)
	const claimUrlRecord = await getClaimUrlRecordByGithubId(githubId)
	return typeof rewardRecord === 'undefined'
		? generateErrorApiResponce('not applicable')
		: typeof claimUrlRecord === 'undefined'
		? getRewardInfo(rewardRecord)
		: getAlreadyClaimRewardInfo(rewardRecord, claimUrlRecord)
}
