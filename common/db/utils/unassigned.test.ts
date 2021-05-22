/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import test from 'ava'
import { getDbClient, close } from './../db'
import { setEnv } from '../../test-utils'
import { getUnassignedClaimUrl } from './unassigned'
import { createRewardTestData, createClaimUrlTestData } from '../test-data'

test.before(() => {
	setEnv()
})

const createTestData = async function (): Promise<void> {
	await createRewardTestData()
	await createClaimUrlTestData()
}

//createClaimUrlInfo
test.serial('Get information on unassigned url.', async (t) => {
	await createTestData()
	const result = await getUnassignedClaimUrl({
		id: 1,
	} as any)
	t.is(result!.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(result!.claim_url, 'http://hogehoge/hurahura2')
	t.is(result!.reward_id, 1)
	t.is(result!.github_id, null)
	t.is(result!.find_at, null)
})
test.serial('Get information on unassigned url(rank down).', async (t) => {
	await createTestData()
	const result = await getUnassignedClaimUrl({
		id: 2,
		rank: 1,
	} as any)
	t.is(result!.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(result!.claim_url, 'http://hogehoge/hurahura2')
	t.is(result!.reward_id, 1)
	t.is(result!.github_id, null)
	t.is(result!.find_at, null)
})
test.serial('Unable to get information on unassigned url.', async (t) => {
	await createTestData()
	const prisma = getDbClient()
	await prisma.claim_url.deleteMany({
		where: {
			github_id: null,
		},
	})
	await close(prisma)
	const result = await getUnassignedClaimUrl({
		id: 2,
		rank: 1,
	} as any)
	t.is(typeof result, 'undefined')
})
