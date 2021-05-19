import { getRewordRecordById, getClaimUrlInfo } from '../common/db'
import { generateErrorApiResponce } from '../common/utils'
import { claim_url, reward } from '@prisma/client'

export const getRewardInfo = async function (
	rewardRecord: reward
): Promise<ApiResponce> {
	const claimUrlInfo = await getClaimUrlInfo(rewardRecord)
	const result =
		typeof claimUrlInfo.claimUrl === 'undefined'
			? generateErrorApiResponce('there are no more rewards to distribute')
			: {
					status: 200,
					body: {
						reward: claimUrlInfo.reward,
						is_reduction: claimUrlInfo.isReduction,
						find_at: claimUrlInfo.claimUrl.find_at,
					},
			  }
	return result
}

export const getAlreadyClaimRewardInfo = async function (
	rewardRecord: reward,
	findClaimUrlRecord: claim_url
): Promise<ApiResponce> {
	const rewardRecordById = await getRewordRecordById(
		findClaimUrlRecord.reward_id
	)
	const isReduction = rewardRecord.id !== findClaimUrlRecord.reward_id
	const reward = isReduction
		? typeof rewardRecordById === 'undefined'
			? '-1'
			: rewardRecordById.reward
		: rewardRecord.reward
	const result =
		typeof rewardRecordById === 'undefined'
			? generateErrorApiResponce('illegal reward id')
			: {
					status: 200,
					body: {
						reward: reward,
						is_reduction: isReduction,
						find_at: findClaimUrlRecord.find_at,
					},
			  }
	return result
}
