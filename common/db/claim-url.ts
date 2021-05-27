import { UndefinedOr } from '@devprotocol/util-ts'
import { claim_url } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

export const getClaimUrlRecordByGithubId = async function (
	client: PrismaClient,
	githubId: string
): Promise<UndefinedOr<claim_url>> {
	const tmp = await client.claim_url.findFirst({
		where: {
			github_id: githubId,
		},
	})
	const record = tmp === null ? undefined : tmp
	return record
}

export const getClaimUrlRecordByRewardId = async function (
	client: PrismaClient,
	rewardId: number
): Promise<UndefinedOr<claim_url>> {
	const tmp = await client.claim_url.findFirst({
		where: {
			AND: [
				{
					reward_id: rewardId,
					github_id: null,
					find_at: null,
				},
			],
		},
	})
	const record = tmp === null ? undefined : tmp
	return record
}

export const updateGitHubIdAndFindAt = async function (
	client: PrismaClient,
	claimUrlId: number,
	githubId: string
): Promise<boolean> {
	const afterData = await client.claim_url.update({
		where: { id: claimUrlId },
		data: { find_at: new Date(), github_id: githubId },
	})
	const isUpdated = afterData.find_at !== null && afterData.github_id !== null
	return isUpdated
}
