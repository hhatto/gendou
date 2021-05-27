import { whenDefined } from '@devprotocol/util-ts'
import { reward } from '@prisma/client'
import { generateErrorApiResponce } from '../common/utils'
import {
	getClaimUrlInfo,
	getClaimUrlRecordByGithubId,
	getRewordRecordById,
} from '../common/db'
import { updateGitHubIdAndFindAt, createClaimUrlInfo } from '../common/db'
import { PrismaClient, claim_url } from '@prisma/client'

export const claimUrl = async function (
	client: PrismaClient,
	githubId: string,
	rewardRecord: reward
): Promise<ApiResponce> {
	const claimUrl = await getClaimUrlRecordByGithubId(client, githubId)

	return typeof claimUrl === 'undefined'
		? await generateClaimUrlResponceWithUpdate(client, githubId, rewardRecord)
		: await generateClaimUrlResponce(client, githubId, claimUrl)
}

const generateClaimUrlResponceWithUpdate = async function (
	client: PrismaClient,
	githubId: string,
	rewardRecord: reward
): Promise<ApiResponce> {
	const claimUrlInfo = await getClaimUrlInfo(client, rewardRecord)
	const isUpdated = await whenDefined(claimUrlInfo, (c) =>
		updateGitHubIdAndFindAt(client, c.claimUrl.id, githubId)
	)

	return typeof claimUrlInfo === 'undefined'
		? generateErrorApiResponce('there are no more rewards to distribute')
		: isUpdated === false
		? generateErrorApiResponce('not updated')
		: {
				status: 200,
				body: {
					reward: claimUrlInfo.reward,
					is_rank_down: claimUrlInfo.isRankDown,
					claim_url: claimUrlInfo?.claimUrl.claim_ul,
					github_id: githubId,
				},
		  }
}

const generateClaimUrlResponce = async function (
	client: PrismaClient,
	githubId: string,
	claimUrl: claim_url
): Promise<ApiResponce> {
	const reward = await getRewordRecordById(client, claimUrl.reward_id)
	const claimUrlInfo = await whenDefined(reward, (r) =>
		createClaimUrlInfo(client, r, claimUrl)
	)
	return typeof claimUrlInfo === 'undefined'
		? generateErrorApiResponce('illegal reward id')
		: {
				status: 200,
				body: {
					reward: claimUrlInfo.reward,
					is_rank_down: claimUrlInfo.isRankDown,
					claim_url: claimUrlInfo.claimUrl.claim_url,
					github_id: githubId,
				},
		  }
}
