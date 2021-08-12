/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */
import { PrismaClient } from '@prisma/client'

export const createRewardTestData = async function (
	client: PrismaClient
): Promise<void> {
	await client.reward.deleteMany()
	await client.reward.create({
		data: {
			id: 1,
			commit_lower_limit: 500,
			commit_upper_limit: 2000,
			reward: '10000000000000000000',
			rank: 0,
		},
	})
	await client.reward.create({
		data: {
			id: 2,
			commit_lower_limit: 2001,
			commit_upper_limit: 5000,
			reward: '40000000000000000000',
			rank: 1,
		},
	})
	await client.reward.create({
		data: {
			id: 3,
			commit_lower_limit: 5001,
			commit_upper_limit: 2147483647,
			reward: '40000000000000000000',
			rank: 2,
		},
	})
}

// export const createClaimUrlTestData = async function (
// 	client: PrismaClient
// ): Promise<void> {
// 	await client.claim_url.deleteMany()
// 	await client.claim_url.create({
// 		data: {
// 			uuid: 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
// 			claim_url: 'http://hogehoge/hurahura1',
// 			reward_id: 1,
// 			github_id: 'github-id1',
// 			find_at: new Date(),
// 		},
// 	})
// 	await client.claim_url.create({
// 		data: {
// 			uuid: 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
// 			claim_url: 'http://hogehoge/hurahura2',
// 			reward_id: 1,
// 			github_id: null,
// 			find_at: null,
// 		},
// 	})
// 	await client.claim_url.create({
// 		data: {
// 			uuid: 'zzzzzzzz-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
// 			claim_url: 'http://hogehoge/hurahura3',
// 			reward_id: 2,
// 			github_id: 'github-id2',
// 			find_at: new Date(),
// 		},
// 	})
// 	await client.claim_url.create({
// 		data: {
// 			uuid: 'aaaaaaaaa-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
// 			claim_url: 'http://hogehoge/hurahura4',
// 			reward_id: 3,
// 			github_id: null,
// 			find_at: null,
// 		},
// 	})
// }

export const createAlreadyClaimedTestData = async function (
	client: PrismaClient
): Promise<void> {
	await client.already_claimed.deleteMany()
	await client.already_claimed.create({
		data: {
			github_id: 'github-id1',
		},
	})
	await client.already_claimed.create({
		data: {
			github_id: 'github-id2',
		},
	})
}

export const createAirdropTestData = async function (
	client: PrismaClient
): Promise<void> {
	const create_at = new Date()
	await client.airdrop.deleteMany()
	await client.airdrop.create({
		data: {
			address: '0xD3e5D9c622D536cC07d085a72A825c323d8BEDBa',
			reward: '100',
			create_at,
		},
	})
}
