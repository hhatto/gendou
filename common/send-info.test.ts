/* eslint-disable @typescript-eslint/no-non-null-assertion */
import test from 'ava'
import { getSendInfoRecord } from './send-info'
import { setEnv, generateTestData } from './test-utils'

test.before(async () => {
	setEnv()
	await generateTestData()
})

test('hogehoge.', async (t) => {
	const record = await getSendInfoRecord('github-id1')
	console.log(record)
	t.is(record!.github_id, 'github-id1')
})
