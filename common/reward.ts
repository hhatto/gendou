import { PrismaClient, reward } from '@prisma/client'
import { UndefinedOr } from '@devprotocol/util-ts'
import { caluculateContriburionsCount } from '../common/contributions'
import { getRewordRecordByCommitCount } from '../common/db'
import { calculateGeometricMean } from '../common/utils'

export const getRewardFromGithubId = async function (
	dbClient: PrismaClient,
	githubId: string
): Promise<UndefinedOr<reward>> {
	const contriburions = await caluculateContriburionsCount(githubId)
	const calculateMean = calculateGeometricMean(contriburions)
	const rewardRecord = await getRewordRecordByCommitCount(
		dbClient,
		Math.floor(calculateMean.toNumber())
	)
	return rewardRecord
}
