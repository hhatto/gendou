/* eslint-disable functional/no-try-statement */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import test from 'ava'
import { setEnv, generateTestData } from '../common/test-utils'
import { getSendInfoRecord } from '../common/send-info'
import { updateAt } from './db'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

test.beforeEach(async () => {
	setEnv()
	await generateTestData()
})

test.serial('find_at can be updated.', async (t) => {
	const before = await getSendInfoRecord('github-id1')
	t.is(before?.github_id, 'github-id1')
	t.is(before?.reward, '100000000000000000000')
	t.is(before?.uuid, 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(before?.claim_url, 'http://hogehoge/hurahura')
	t.is(before?.find_at, null)
	const result = await updateAt(before!.id)
	t.is(result, true)
	const after = await getSendInfoRecord('github-id1')
	t.is(after?.github_id, 'github-id1')
	t.is(after?.reward, '100000000000000000000')
	t.is(after?.uuid, 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(after?.claim_url, 'http://hogehoge/hurahura')
	t.true(after?.find_at !== null)
})

test.serial(
	'If the record does not exist, an error occurs. Of course it wont be updated.',
	async (t) => {
		await t.throwsAsync(updateAt(-1), {
			instanceOf: PrismaClientKnownRequestError,
		})
	}
)
