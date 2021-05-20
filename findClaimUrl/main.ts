import { generateErrorApiResponce } from '../common/utils'
import { getCommitCountAndId } from '../common/github-graphql'
import { getRewordRecordByCommitCount } from '../common/db/reward'
import { claimUrl } from './detail'

export const main = async function (
	params: ParamsOfFindClaimUrlApi
): Promise<ApiResponce> {
	const githubInfo = await getCommitCountAndId(params.code)

	const rewardRecord = await getRewordRecordByCommitCount(
		githubInfo.commitCount
	)
	return typeof rewardRecord === 'undefined'
		? generateErrorApiResponce('not applicable')
		: await claimUrl(githubInfo.githubId, rewardRecord)
}
