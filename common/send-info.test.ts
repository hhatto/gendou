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
	t.is(record!.uuid, 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(record!.claim_url, 'http://hogehoge/hurahura')
	t.is(record!.find_at, null)
})

test.serial('ca not get the test data.', async (t) => {
	const record = await getSendInfoRecord('hoobaa')
	t.is(typeof record, 'undefined')
})
