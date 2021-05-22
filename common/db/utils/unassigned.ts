import { UndefinedOr } from '@devprotocol/util-ts'
import { claim_url, reward } from '@prisma/client'
import { getClaimUrlRecordByRewardId } from '../claim-url'
import { getRewordRecordByRank } from '../reward'

export const getUnassignedClaimUrl = async function (
	rewardRecord: reward
): Promise<UndefinedOr<claim_url>> {
	const record = await getClaimUrlRecordByRewardId(rewardRecord.id)
	return typeof record !== 'undefined'
		? record
		: getUnassignedClaimUrlRankDown(rewardRecord)
}

const getRewardRankDown = async function (
	rewardRecord: reward
): Promise<UndefinedOr<reward>> {
	const targetRank = rewardRecord.rank - 1
	return targetRank < 0 ? undefined : await getRewordRecordByRank(targetRank)
}

const getUnassignedClaimUrlRankDown = async function (
	rewardRecord: reward
): Promise<UndefinedOr<claim_url>> {
	const rewardRankDown = await getRewardRankDown(rewardRecord)
	return typeof rewardRankDown === 'undefined'
		? undefined
		: await getUnassignedClaimUrl(rewardRankDown)
}
