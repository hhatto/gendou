/* eslint-disable @typescript-eslint/no-non-null-assertion */
import test from 'ava'
import { getSendInfoRecord } from './send-info'
import { setEnv, generateTestData } from './test-utils'

test.before(async () => {
	setEnv()
	await generateTestData()
})

test.serial('get the test data.', async (t) => {
	const record = await getSendInfoRecord('github-id1')
	t.is(record!.github_id, 'github-id1')
	t.is(record!.reward, '100000000000000000000')
	t.is(record!.is_already_send, false)
	t.is(record!.tx_hash, null)
	t.is(record!.send_at, null)
})

test.serial('ca not get the test data.', async (t) => {
	const record = await getSendInfoRecord('hoobaa')
	t.is(typeof record, 'undefined')
})
