import { generateErrorApiResponce } from '../common/utils'
import {
	getClaimUrlRecordByGithubId,
	getRewordRecordByCommitCount,
} from '../common/db'
import { getCommitCount } from '../common/github'
import { getAlreadyClaimRewardInfo, getRewardInfo } from './details'

export const main = async function (githubId: string): Promise<ApiResponce> {
	const commitCount = await getCommitCount(githubId)
	const rewardRecord = await getRewordRecordByCommitCount(commitCount)
	const claimUrlRecord = await getClaimUrlRecordByGithubId(githubId)
	return typeof rewardRecord === 'undefined'
		? generateErrorApiResponce('not applicable')
		: typeof claimUrlRecord === 'undefined'
		? await getRewardInfo(rewardRecord)
		: await getAlreadyClaimRewardInfo(rewardRecord, claimUrlRecord)
}
