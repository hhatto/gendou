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
	await createRewardTestData()
	const record = await getRewordRecordByCommitCount(499)
	t.is(typeof record, 'undefined')
})

test.serial(
	'The lowest rank data can be obtained (lower limit).',
	async (t) => {
		await createRewardTestData()
		const record = await getRewordRecordByCommitCount(500)
		t.is(record!.commit_lower_limit, 500)
		t.is(record!.commit_upper_limit, 2000)
		t.is(record!.reward, '10000000000000000000')
		t.is(record!.rank, 0)
	}
)

test.serial(
	'The lowest rank data can be obtained (intermediate data).',
	async (t) => {
		await createRewardTestData()
		const record = await getRewordRecordByCommitCount(1100)
		t.is(record!.commit_lower_limit, 500)
		t.is(record!.commit_upper_limit, 2000)
		t.is(record!.reward, '10000000000000000000')
		t.is(record!.rank, 0)
	}
)

test.serial(
	'The lowest rank data can be obtained (upper limit).',
	async (t) => {
		await createRewardTestData()
		const record = await getRewordRecordByCommitCount(2000)
		t.is(record!.commit_lower_limit, 500)
		t.is(record!.commit_upper_limit, 2000)
		t.is(record!.reward, '10000000000000000000')
		t.is(record!.rank, 0)
	}
)

test.serial(
	'The middle rank data can be obtained (intermediate data).',
	async (t) => {
		await createRewardTestData()
		const record = await getRewordRecordByCommitCount(4400)
		t.is(record!.commit_lower_limit, 2001)
		t.is(record!.commit_upper_limit, 5000)
		t.is(record!.reward, '40000000000000000000')
		t.is(record!.rank, 1)
	}
)

//getRewordRecordById
test.serial('get by id.', async (t) => {
	await createRewardTestData()
	const client = getDbClient()
	const records = await client.reward.findMany()
	await close(client)
	const target = records[1]
	const record = await getRewordRecordById(target.id)
	t.is(record!.commit_lower_limit, target.commit_lower_limit)
	t.is(record!.commit_upper_limit, target.commit_upper_limit)
	t.is(record!.reward, target.reward)
	t.is(record!.rank, target.rank)
	t.is(record!.id, target.id)
})

test.serial('get by id(However, there is no id).', async (t) => {
	await createRewardTestData()
	const record = await getRewordRecordById(-1)
	t.is(typeof record, 'undefined')
})

//getRewordRecordByRank
test.serial('get by rank.', async (t) => {
	await createRewardTestData()
	const record = await getRewordRecordByRank(2)
	t.is(record!.commit_lower_limit, 5001)
	t.is(record!.commit_upper_limit, 2147483647)
	t.is(record!.reward, '40000000000000000000')
	t.is(record!.rank, 2)
})

test.serial('get by rank(However, there is no rank).', async (t) => {
	await createRewardTestData()
	const record = await getRewordRecordByRank(-1)
	t.is(typeof record, 'undefined')
})
