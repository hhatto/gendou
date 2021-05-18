import { UndefinedOr } from '@devprotocol/util-ts'
import { claim_url, reward } from '@prisma/client'
import { getClaimUrlRecordByRewardId } from './db/claim-url'
import { getRewordRecordByRank } from './db/reward'

export const getTargetDate = function (baseDate: string): TargetDate {
	const to = new Date(baseDate)
	const from = new Date(baseDate)
	// eslint-disable-next-line functional/no-expression-statement
	from.setFullYear(from.getFullYear() - 1)
	return {
		from,
		to,
	}
}

export const generateErrorApiResponce = function (
	errorMessage: string,
	status = 200
): ApiResponce {
	return {
		status: status,
		body: { message: errorMessage },
	}
}

export const getUnassignedClaimUrl = async function (
	rewardRecord: reward
): Promise<UndefinedOr<claim_url>> {
	const record = await getClaimUrlRecordByRewardId(rewardRecord.id)
	const subordinateReward = await getSubordinateReward(rewardRecord)
	return typeof record !== 'undefined'
		? record
		: typeof subordinateReward !== 'undefined'
		? await getUnassignedClaimUrl(subordinateReward)
		: undefined
}

const getSubordinateReward = async function (
	rewardRecord: reward
): Promise<UndefinedOr<reward>> {
	const targetRank = rewardRecord.rank - 1
	return targetRank < 0 ? undefined : await getRewordRecordByRank(targetRank)
}
