import { UndefinedOr } from '@devprotocol/util-ts'
import { PrismaClient, claim_url, reward } from '@prisma/client'
import { getClaimUrlRecordByRewardId } from '../claim-url'
import { getRewordRecordByRank } from '../reward'

export const getUnassignedClaimUrl = async function (
	client: PrismaClient,
	rewardRecord: reward
): Promise<UndefinedOr<claim_url>> {
	const record = await getClaimUrlRecordByRewardId(client, rewardRecord.id)
	return typeof record !== 'undefined'
		? record
		: getUnassignedClaimUrlRankDown(client, rewardRecord)
}

const getRewardRankDown = async function (
	client: PrismaClient,
	rewardRecord: reward
): Promise<UndefinedOr<reward>> {
	const targetRank = rewardRecord.rank - 1
	return targetRank < 0
		? undefined
		: await getRewordRecordByRank(client, targetRank)
}

const getUnassignedClaimUrlRankDown = async function (
	client: PrismaClient,
	rewardRecord: reward
): Promise<UndefinedOr<claim_url>> {
	const rewardRankDown = await getRewardRankDown(client, rewardRecord)
	return typeof rewardRankDown === 'undefined'
		? undefined
		: await getUnassignedClaimUrl(client, rewardRankDown)
}
