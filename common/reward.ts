import { PrismaClient, reward } from '@prisma/client'
import { UndefinedOr } from '@devprotocol/util-ts'
import { caluculateContriburionsCount } from '../common/contributions'
import { getRewordRecordByCommitCount } from '../common/db'
import { calculateGeometricMean } from '../common/utils'
import { generateErrorApiResponce } from '../common/utils'
import { getDbClient, close, isAlreadyClaimed } from '../common/db'

export const getRewardApiResponce = async function (
	githubId: string
): Promise<ApiResponce> {
	const dbClient = getDbClient()
	const isClaimed = await isAlreadyClaimed(dbClient, githubId)
	const res = isClaimed
		? generateErrorApiResponce('already claimed', 400)
		: await innerMain(dbClient, githubId)
	const isClosed = await close(dbClient)
	return isClosed ? res : generateErrorApiResponce('db error', 400)
}

const innerMain = async function (
	dbClient: PrismaClient,
	githubId: string
): Promise<ApiResponce> {
	const [rewardRecord, contributions] = await getRewardFromGithubId(
		dbClient,
		githubId
	)
	return typeof rewardRecord === 'undefined'
		? generateErrorApiResponce('not applicable')
		: {
				status: 200,
				body: {
					reward: rewardRecord.reward,
					contributions,
					github_id: githubId,
				},
		  }
}

export const getRewardFromGithubId = async function (
	dbClient: PrismaClient,
	githubId: string
): Promise<readonly [UndefinedOr<reward>, number]> {
	const contriburions = await caluculateContriburionsCount(githubId)
	const calculateMean = calculateGeometricMean(contriburions)
	const totalContributions = Math.floor(calculateMean.toNumber())
	const rewardRecord = await getRewordRecordByCommitCount(
		dbClient,
		totalContributions
	)
	return [rewardRecord, totalContributions]
}
