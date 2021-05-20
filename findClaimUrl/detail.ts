import { whenDefined } from '@devprotocol/util-ts'
import { reward } from '@prisma/client'
import { generateErrorApiResponce } from '../common/utils'
import { getClaimUrlInfo } from '../common/db'
import { updateGitHubIdAndFindAt } from '../common/db/claim-url'

export const claimUrl = async function (
	githubId: string,
	rewardRecord: reward
): Promise<ApiResponce> {
	const claimUrlInfo = await getClaimUrlInfo(rewardRecord)

	const isUpdated = await whenDefined(claimUrlInfo.claimUrl, (u) =>
		updateGitHubIdAndFindAt(u.id, githubId)
	)

	const errorMessage =
		typeof claimUrlInfo === 'undefined'
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
						is_rank_down: whenDefined(claimUrlInfo, (c) => c.isRankDown),
						claim_url: whenDefined(claimUrlInfo?.claimUrl, (u) => u.claim_url),
						github_id: githubId,
					},
			  }
	return result
}
