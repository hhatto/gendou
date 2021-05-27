import { getRewordRecordById, getClaimUrlInfo } from '../common/db'
import { generateErrorApiResponce } from '../common/utils'
import { PrismaClient, claim_url, reward } from '@prisma/client'

export const getRewardInfo = async function (
	client: PrismaClient,
	rewardRecord: reward
): Promise<ApiResponce> {
	const claimUrlInfo = await getClaimUrlInfo(client, rewardRecord)
	const result =
		typeof claimUrlInfo === 'undefined'
			? generateErrorApiResponce('there are no more rewards to distribute')
			: {
					status: 200,
					body: {
						reward: claimUrlInfo.reward,
						is_rank_down: claimUrlInfo.isRankDown,
						find_at: claimUrlInfo.claimUrl.find_at,
					},
			  }
	return result
}

export const getAlreadyClaimRewardInfo = async function (
	client: PrismaClient,
	rewardRecord: reward,
	findClaimUrlRecord: claim_url
): Promise<ApiResponce> {
	const rewardRecordById = await getRewordRecordById(
		client,
		findClaimUrlRecord.reward_id
	)
	const result =
		typeof rewardRecordById === 'undefined'
			? generateErrorApiResponce('illegal reward id')
			: getAlreadyClaimRewardInfoInner(
					rewardRecord,
					findClaimUrlRecord,
					rewardRecordById
			  )
	return result
}

const getAlreadyClaimRewardInfoInner = function (
	rewardRecord: reward,
	findClaimUrlRecord: claim_url,
	rewardRecordById: reward
): ApiResponce {
	const isRankDown = rewardRecord.id !== findClaimUrlRecord.reward_id
	const reward = isRankDown ? rewardRecordById.reward : rewardRecord.reward
	const result = {
		status: 200,
		body: {
			reward: reward,
			is_rank_down: isRankDown,
			find_at: findClaimUrlRecord.find_at,
		},
	}
	return result
}
