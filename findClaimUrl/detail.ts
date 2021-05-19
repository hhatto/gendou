import { whenDefined } from '@devprotocol/util-ts'
import { generateErrorApiResponce } from '../common/utils'
import { getCommitCount, getClaimUrlInfo } from '../common/utils'
import { getRewordRecordByCommitCount } from '../common/db/reward'
import { updateGitHubIdAndFindAt } from '../common/db/claim-url'

export const getFindClaimUrlResponce = async function (
	params: ParamsOfFindClaimUrlApi
): Promise<ApiResponce> {
	const commitCount = await getCommitCount(params.message)

	const rewardRecord = await getRewordRecordByCommitCount(commitCount)
	const claimUrlInfo =
		typeof rewardRecord === 'undefined'
			? undefined
			: await getClaimUrlInfo(rewardRecord)

	const isUpdated = await whenDefined(claimUrlInfo?.claimUrl, (u) =>
		updateGitHubIdAndFindAt(u.id, params.message)
	)

	const errorMessage =
		typeof rewardRecord === 'undefined'
			? 'not applicable'
			: typeof claimUrlInfo === 'undefined'
			? 'server side error'
			: typeof claimUrlInfo.claimUrl === 'undefined'
			? 'there are no more rewards to distribute'
			: isUpdated === false
			? 'not updated'
			: undefined

	const result =
		typeof errorMessage !== 'undefined'
			? generateErrorApiResponce(errorMessage)
			: {
					status: 200,
					body: {
						reward: whenDefined(claimUrlInfo, (c) => c.reward),
						is_reduction: whenDefined(claimUrlInfo, (c) => c.isReduction),
						claim_url: whenDefined(claimUrlInfo?.claimUrl, (u) => u.claim_url),
					},
			  }
	return result
}
