import { generateErrorApiResponce } from '../common/utils'
import { caluculateContriburionsCount } from '../common/calucurate'
import {
	getRewordRecordByCommitCount,
	getDbClient,
	close,
	isAlreadyClaimed,
} from '../common/db'
import { calculateGeometricMean } from '../common/utils'
import { PrismaClient } from '@prisma/client'
import { getContributionsCount5Year } from '../common/github'

export const main = async function (githubId: string): Promise<ApiResponce> {
	const dbClient = getDbClient()
	const isClaimed = await isAlreadyClaimed(dbClient, githubId)
	const res = isClaimed
		? generateErrorApiResponce('already claimed')
		: await innerMain(dbClient, githubId)

	const isClosed = await close(dbClient)
	return isClosed ? res : generateErrorApiResponce('db error')
}

export const innerMain = async function (
	dbClient: PrismaClient,
	githubId: string
): Promise<ApiResponce> {
	const contributionsInfo = await getContributionsCount5Year(githubId)
	const contriburions = caluculateContriburionsCount(contributionsInfo)
	const calculateMean = calculateGeometricMean(contriburions)
	const rewardRecord = await getRewordRecordByCommitCount(
		dbClient,
		calculateMean.toNumber()
	)
	return typeof rewardRecord === 'undefined'
		? generateErrorApiResponce('not applicable')
		: {
				status: 200,
				body: {
					reward: rewardRecord.reward,
					is_rank_down: false,
					find_at: null,
				},
		  }
}
