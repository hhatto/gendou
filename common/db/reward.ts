import { UndefinedOr } from '@devprotocol/util-ts'
import { PrismaClient, reward } from '@prisma/client'

export const getRewordRecordByCommitCount = async function (
	client: PrismaClient,
	commitCount: number
): Promise<UndefinedOr<reward>> {
	const tmp = await client.reward.findFirst({
		where: {
			AND: [
				{
					commit_lower_limit: {
						lte: commitCount,
					},
					commit_upper_limit: {
						gte: commitCount,
					},
				},
			],
		},
	})
	const record = tmp === null ? undefined : tmp
	return record
}

// export const getRewordRecordById = async function (
// 	client: PrismaClient,
// 	id: number
// ): Promise<UndefinedOr<reward>> {
// 	const tmp = await client.reward.findFirst({
// 		where: {
// 			id: id,
// 		},
// 	})
// 	const record = tmp === null ? undefined : tmp
// 	return record
// }

// export const getRewordRecordByRank = async function (
// 	client: PrismaClient,
// 	rank: number
// ): Promise<UndefinedOr<reward>> {
// 	const tmp = await client.reward.findFirst({
// 		where: {
// 			rank: rank,
// 		},
// 	})
// 	const record = tmp === null ? undefined : tmp
// 	return record
// }
