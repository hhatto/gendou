// import { UndefinedOr, whenDefined } from '@devprotocol/util-ts'
// import { PrismaClient, claim_url, reward } from '@prisma/client'
// import { getUnassignedClaimUrl } from './unassigned'
// import { getRewordRecordById } from '../reward'

// export const getClaimUrlInfo = async function (
// 	client: PrismaClient,
// 	rewardRecord: reward
// ): Promise<UndefinedOr<ClaimUrlInfo>> {
// 	const claimUrl = await getUnassignedClaimUrl(client, rewardRecord)
// 	return await whenDefined(claimUrl, (c) =>
// 		createClaimUrlInfo(client, rewardRecord, c)
// 	)
// }

// export const createClaimUrlInfo = async function (
// 	client: PrismaClient,
// 	rewardRecord: reward,
// 	claimUrlRecord: claim_url
// ): Promise<UndefinedOr<ClaimUrlInfo>> {
// 	const isRankDown = rewardRecord.id !== claimUrlRecord.reward_id
// 	const claimUrlReward = isRankDown
// 		? await getRewordRecordById(client, claimUrlRecord.reward_id)
// 		: rewardRecord
// 	return typeof claimUrlReward === 'undefined'
// 		? undefined
// 		: {
// 				reward: claimUrlReward.reward,
// 				isRankDown: isRankDown,
// 				claimUrl: claimUrlRecord,
// 		  }
// }
