import { generateErrorApiResponce } from '../common/utils'
import { getCommitCountAndId, getApiTokenFromCode } from '../common/github'
import { getRewordRecordByCommitCount } from '../common/db/reward'
import { claimUrl } from './detail'

export const main = async function (
	params: ParamsOfFindClaimUrlApi
): Promise<ApiResponce> {
	const token = await getApiTokenFromCode(params.code)
	const githubInfo = await getCommitCountAndId(token)

	const rewardRecord = await getRewordRecordByCommitCount(
		githubInfo.commitCount
	)
	return typeof rewardRecord === 'undefined'
		? generateErrorApiResponce('not applicable')
		: await claimUrl(githubInfo.githubId, rewardRecord)
}
