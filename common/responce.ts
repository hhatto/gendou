import { generateErrorApiResponce } from '../common/utils'
import { caluculateContriburionsCount } from '../common/contributions'
import {
	getRewordRecordByCommitCount,
	getDbClient,
	close,
	isAlreadyClaimed,
} from '../common/db'
import { calculateGeometricMean } from '../common/utils'
import { PrismaClient } from '@prisma/client'

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
	const contriburions = await caluculateContriburionsCount(githubId)
	const calculateMean = calculateGeometricMean(contriburions)
	const rewardRecord = await getRewordRecordByCommitCount(
		dbClient,
		Math.floor(calculateMean.toNumber())
	)
	return typeof rewardRecord === 'undefined'
		? generateErrorApiResponce('not applicable')
		: {
				status: 200,
				body: {
					reward: rewardRecord.reward,
				},
		  }
}
