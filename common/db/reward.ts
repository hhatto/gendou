/* eslint-disable functional/no-expression-statement */
import { UndefinedOr } from '@devprotocol/util-ts'
import { getDbClient, close } from './db'
import { reward } from '@prisma/client'

export const getRewordRecordByCommitCount = async function (
	commitCount: number
): Promise<UndefinedOr<reward>> {
	const client = getDbClient()
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
	const result = await close(client)
	const record = tmp === null || result === false ? undefined : tmp
	return record
}

export const getRewordRecordById = async function (
	id: number
): Promise<UndefinedOr<reward>> {
	const client = getDbClient()
	const tmp = await client.reward.findFirst({
		where: {
			id: id,
		},
	})
	const result = await close(client)
	const record = tmp === null || result === false ? undefined : tmp
	return record
}

export const getRewordRecordByRank = async function (
	rank: number
): Promise<UndefinedOr<reward>> {
	const client = getDbClient()
	const tmp = await client.reward.findFirst({
		where: {
			rank: rank,
		},
	})
	const result = await close(client)
	const record = tmp === null || result === false ? undefined : tmp
	return record
}
