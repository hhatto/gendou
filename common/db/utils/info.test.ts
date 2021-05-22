/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import test from 'ava'
import { getDbClient, close } from './../db'
import { setEnv } from '../../test-utils'
import { createClaimUrlInfo, getClaimUrlInfo } from './info'
import { createRewardTestData, createClaimUrlTestData } from '../test-data'

test.before(() => {
	setEnv()
})

const createTestData = async function (): Promise<void> {
	await createRewardTestData()
	await createClaimUrlTestData()
}

// getClaimUrlInfo
test.serial('get claim url info.', async (t) => {
	await createTestData()
	const result = await getClaimUrlInfo({
		id: 1,
		reward: '10000000000000000000',
	} as any)
	t.is(result!.reward, '10000000000000000000')
	t.is(result!.isRankDown, false)
	t.is(result!.claimUrl.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(result!.claimUrl.claim_url, 'http://hogehoge/hurahura2')
	t.is(result!.claimUrl.reward_id, 1)
	t.is(result!.claimUrl.github_id, null)
	t.is(result!.claimUrl.find_at, null)
})

test.serial(
	'not get claim url info(can not unassigned claim url).',
	async (t) => {
		await createTestData()
		const result = await getClaimUrlInfo({
			id: 0,
			reward: '10000000000000000000',
			rank: 0,
		} as any)
		t.is(result, undefined)
	}
)

//getUnassignedClaimUrl
test.serial('create claim url info(same rank).', async (t) => {
	await createTestData()
	const result = await createClaimUrlInfo(
		{
			id: 1,
			reward: '100000000000',
		} as any,
		{
			reward_id: 1,
			claim_url: 'http://hogehoge',
		} as any
	)
	t.is(result!.reward, '100000000000')
	t.is(result!.isRankDown, false)
	t.is(result!.claimUrl.reward_id, 1)
	t.is(result!.claimUrl.claim_url, 'http://hogehoge')
})

test.serial('create claim url info(different rank).', async (t) => {
	await createTestData()
	const result = await createClaimUrlInfo(
		{
			id: 2,
			reward: '200000000000',
		} as any,
		{
			reward_id: 1,
			claim_url: 'http://hogehoge2',
		} as any
	)
	t.is(result!.reward, '10000000000000000000')
	t.is(result!.isRankDown, true)
	t.is(result!.claimUrl.reward_id, 1)
	t.is(result!.claimUrl.claim_url, 'http://hogehoge2')
})

test.serial('not create claim url info(rank data is not exist).', async (t) => {
	await createTestData()
	const result = await createClaimUrlInfo(
		{
			id: 10,
			reward: '200000000000',
		} as any,
		{
			reward_id: 9,
			claim_url: 'http://hogehoge2',
		} as any
	)
	t.is(typeof result, 'undefined')
})
