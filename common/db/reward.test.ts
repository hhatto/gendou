/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import test from 'ava'
import { getDbClient, close } from './db'
import { setEnv } from '../test-utils'
import {
	getRewordRecordByCommitCount,
	getRewordRecordById,
	getRewordRecordByRank,
} from './reward'
import { createRewardTestData } from './test-data'

test.before(() => {
	setEnv()
})

//getRewordRecordByCommitCount
test.serial('If out of range, data cannot be acquired.', async (t) => {
	const client = getDbClient()
	await createRewardTestData(client)
	const record = await getRewordRecordByCommitCount(client, 499)
	await close(client)
	t.is(typeof record, 'undefined')
})

test.serial(
	'The lowest rank data can be obtained (lower limit).',
	async (t) => {
		const client = getDbClient()
		await createRewardTestData(client)
		const record = await getRewordRecordByCommitCount(client, 500)
		await close(client)
		t.is(record!.commit_lower_limit, 500)
		t.is(record!.commit_upper_limit, 2000)
		t.is(record!.reward, '10000000000000000000')
		t.is(record!.rank, 0)
	}
)

test.serial(
	'The lowest rank data can be obtained (intermediate data).',
	async (t) => {
		const client = getDbClient()
		await createRewardTestData(client)
		const record = await getRewordRecordByCommitCount(client, 1100)
		await close(client)
		t.is(record!.commit_lower_limit, 500)
		t.is(record!.commit_upper_limit, 2000)
		t.is(record!.reward, '10000000000000000000')
		t.is(record!.rank, 0)
	}
)

test.serial(
	'The lowest rank data can be obtained (upper limit).',
	async (t) => {
		const client = getDbClient()
		await createRewardTestData(client)
		const record = await getRewordRecordByCommitCount(client, 2000)
		await close(client)
		t.is(record!.commit_lower_limit, 500)
		t.is(record!.commit_upper_limit, 2000)
		t.is(record!.reward, '10000000000000000000')
		t.is(record!.rank, 0)
	}
)

test.serial(
	'The middle rank data can be obtained (intermediate data).',
	async (t) => {
		const client = getDbClient()
		await createRewardTestData(client)
		const record = await getRewordRecordByCommitCount(client, 4400)
		await close(client)
		t.is(record!.commit_lower_limit, 2001)
		t.is(record!.commit_upper_limit, 5000)
		t.is(record!.reward, '40000000000000000000')
		t.is(record!.rank, 1)
	}
)

//getRewordRecordById
test.serial('get by id.', async (t) => {
	const client = getDbClient()
	await createRewardTestData(client)
	const records = await client.reward.findMany()
	const target = records[1]
	const record = await getRewordRecordById(client, target.id)
	await close(client)
	t.is(record!.commit_lower_limit, target.commit_lower_limit)
	t.is(record!.commit_upper_limit, target.commit_upper_limit)
	t.is(record!.reward, target.reward)
	t.is(record!.rank, target.rank)
	t.is(record!.id, target.id)
})

test.serial('get by id(However, there is no id).', async (t) => {
	const client = getDbClient()
	await createRewardTestData(client)
	const record = await getRewordRecordById(client, -1)
	await close(client)
	t.is(typeof record, 'undefined')
})

//getRewordRecordByRank
test.serial('get by rank.', async (t) => {
	const client = getDbClient()
	await createRewardTestData(client)
	const record = await getRewordRecordByRank(client, 2)
	await close(client)
	t.is(record!.commit_lower_limit, 5001)
	t.is(record!.commit_upper_limit, 2147483647)
	t.is(record!.reward, '40000000000000000000')
	t.is(record!.rank, 2)
})

test.serial('get by rank(However, there is no rank).', async (t) => {
	const client = getDbClient()
	await createRewardTestData(client)
	const record = await getRewordRecordByRank(client, -1)
	await close(client)
	t.is(typeof record, 'undefined')
})
