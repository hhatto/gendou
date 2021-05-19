import { UndefinedOr } from '@devprotocol/util-ts'
import { claim_url, reward } from '@prisma/client'
import { getClaimUrlRecordByRewardId } from './db/claim-url'
import { getCommitCountFromGraphQL } from './github-graphql'
import { getRewordRecordByRank, getRewordRecordById } from './db/reward'

export const getCommitCount = async function (
	githubId: string
): Promise<number> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const searchDate = getTargetDate(process.env.BASE_DATE!)
	const commitCount = await getCommitCountFromGraphQL(
		githubId,
		searchDate.from,
		searchDate.to
	)
	return commitCount
}

const getTargetDate = function (baseDate: string): TargetDate {
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

export const getClaimUrlInfo = async function (
	rewardRecord: reward
): Promise<ClaimUrlInfo> {
	const claimUrl = await getUnassignedClaimUrl(rewardRecord)
	const claimUrlRewardId =
		typeof claimUrl === 'undefined' ? -1 : claimUrl.reward_id
	const isReduction = rewardRecord.id !== claimUrlRewardId
	const claimUrlReward = await getRewordRecordById(claimUrlRewardId)
	const reward =
		typeof claimUrlReward === 'undefined' ? '-1' : claimUrlReward.reward
	return {
		reward,
		isReduction,
		claimUrl,
	}
}

type ClaimUrlInfo = {
	readonly reward: string
	readonly isReduction: boolean
	readonly claimUrl: UndefinedOr<claim_url>
}
