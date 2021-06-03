// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import test from 'ava'
// import { getDbClient, close } from './../db'
// import { setEnv } from '../../test-utils'
// import { getUnassignedClaimUrl } from './unassigned'
// import { createRewardTestData, createClaimUrlTestData } from '../test-data'
// import { PrismaClient } from '@prisma/client'

// test.before(() => {
// 	setEnv()
// })

// const createTestData = async function (client: PrismaClient): Promise<void> {
// 	await createRewardTestData(client)
// 	await createClaimUrlTestData(client)
// }

// //createClaimUrlInfo
// test.serial('Get information on unassigned url.', async (t) => {
// 	const client = getDbClient()
// 	await createTestData(client)
// 	const result = await getUnassignedClaimUrl(client, {
// 		id: 1,
// 	} as any)
// 	await close(client)
// 	t.is(result!.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
// 	t.is(result!.claim_url, 'http://hogehoge/hurahura2')
// 	t.is(result!.reward_id, 1)
// 	t.is(result!.github_id, null)
// 	t.is(result!.find_at, null)
// })
// test.serial('Get information on unassigned url(rank down).', async (t) => {
// 	const client = getDbClient()
// 	await createTestData(client)
// 	const result = await getUnassignedClaimUrl(client, {
// 		id: 2,
// 		rank: 1,
// 	} as any)
// 	await close(client)
// 	t.is(result!.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
// 	t.is(result!.claim_url, 'http://hogehoge/hurahura2')
// 	t.is(result!.reward_id, 1)
// 	t.is(result!.github_id, null)
// 	t.is(result!.find_at, null)
// })
// test.serial('Unable to get information on unassigned url.', async (t) => {
// 	const client = getDbClient()
// 	await createTestData(client)
// 	await client.claim_url.deleteMany({
// 		where: {
// 			github_id: null,
// 		},
// 	})
// 	const result = await getUnassignedClaimUrl(client, {
// 		id: 2,
// 		rank: 1,
// 	} as any)
// 	await close(client)
// 	t.is(typeof result, 'undefined')
// })
