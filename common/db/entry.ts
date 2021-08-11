import { PrismaClient, entry } from '@prisma/client'
import { UndefinedOr } from '@devprotocol/util-ts'

export const insertEntry = async function (
	client: PrismaClient,
	githubId: string,
	address: string,
	sign: string,
	rewardId: number,
	contributionCount: number
): Promise<boolean> {
	const time = new Date()
	const createData = await client.entry.create({
		data: {
			github_id: githubId,
			address: address,
			sign: sign,
			reward_id: rewardId,
			contribution_count: contributionCount,
			create_at: time,
			update_at: time,
		},
	})
	return (
		createData.id > 0 &&
		createData.github_id === githubId &&
		createData.address === address &&
		createData.sign === sign &&
		createData.reward_id === rewardId &&
		createData.contribution_count === contributionCount &&
		createData.create_at.getTime() === time.getTime() &&
		createData.update_at.getTime() === time.getTime()
	)
}

export const getEntry = async function (
	client: PrismaClient,
	githubId: string
): Promise<UndefinedOr<entry>> {
	const record = await client.entry.findFirst({
		where: {
			github_id: githubId,
		},
	})
	return record === null ? undefined : record
}

export const getEntryByAddress = async function (
	client: PrismaClient,
	address: string
): Promise<UndefinedOr<entry>> {
	const record = await client.entry.findFirst({
		where: {
			address,
		},
	})
	return record === null ? undefined : record
}

export const updateEntry = async function (
	client: PrismaClient,
	githubId: string,
	address: string,
	sign: string,
	rewardId: number,
	contributionCount: number
): Promise<boolean> {
	const time = new Date()
	const updatedData = await client.entry.update({
		where: { github_id: githubId },
		data: {
			address: address,
			sign: sign,
			reward_id: rewardId,
			contribution_count: contributionCount,
			update_at: time,
		},
	})
	return (
		updatedData.github_id === githubId &&
		updatedData.address === address &&
		updatedData.sign === sign &&
		updatedData.reward_id === rewardId &&
		updatedData.contribution_count === contributionCount &&
		updatedData.create_at.getTime() !== time.getTime() &&
		updatedData.update_at.getTime() === time.getTime()
	)
}
