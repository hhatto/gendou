import { getRewordRecordById } from '../common/db/reward'
import {
	generateErrorApiResponce,
	getUnassignedClaimUrl,
} from '../common/utils'
import { findClaimUrl, reward } from '@prisma/client'

export const getRewardInfo = async function (
	rewardRecord: reward
): Promise<ApiResponce> {
	const claimUrl = await getUnassignedClaimUrl(rewardRecord)
	const claimUrlRewardId =
		typeof claimUrl === 'undefined' ? -1 : claimUrl.reward_id
	const isReduction = rewardRecord.id === claimUrlRewardId
	const claimUrlReward = await getRewordRecordById(claimUrlRewardId)
	const result =
		typeof claimUrl === 'undefined'
			? generateErrorApiResponce('there are no more rewards to distribute')
			: {
					status: 200,
					body: {
						reward: claimUrlReward.reward,
						is_reduction: isReduction,
						find_at: null,
					},
			  }
	return result
}

export const getAlreadyClaimRewardInfo = async function (
	rewardRecord: reward,
	findClaimUrlRecord: findClaimUrl
): Promise<ApiResponce> {
	const rewardRecordById = await getRewordRecordById(
		findClaimUrlRecord.reward_id
	)
	const rewardById: number =
		typeof rewardRecordById === 'undefined' ? -1 : rewardRecordById.reward
	const isReduction = rewardRecord.id === findClaimUrlRecord.reward_id
	const reward = isReduction ? rewardRecord.reward : rewardById
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
