/* eslint-disable functional/no-try-statement */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import test from 'ava'
import { setEnv, generateTestData } from './../common/test-utils'
import { getSendInfoRecord } from './../common/send-info'
import { updateAlreadySend, updateTxHash } from './db'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

test.beforeEach(async () => {
	setEnv()
	await generateTestData()
})

test.serial('is_already_send is set to true.', async (t) => {
	const before = await getSendInfoRecord('github-id1')
	t.is(before?.is_already_send, false)
	const result = await updateAlreadySend(before!.id)
	t.is(result, true)
	const after = await getSendInfoRecord('github-id1')
	t.is(after?.is_already_send, true)
})

test.serial('If it is already true, keep it true.', async (t) => {
	const before = await getSendInfoRecord('github-id2')
	t.is(before?.is_already_send, true)
	const result = await updateAlreadySend(before!.id)
	t.is(result, true)
	const after = await getSendInfoRecord('github-id2')
	t.is(after?.is_already_send, true)
})

test.serial('If the record does not exist, an error occurs.', async (t) => {
	await t.throwsAsync(updateAlreadySend(-1), {
		instanceOf: PrismaClientKnownRequestError,
	})
})

test.serial('Transaction hashes and dates can be updated.', async (t) => {
	const before = await getSendInfoRecord('github-id1')
	t.is(before?.send_at, null)
	t.is(before?.tx_hash, null)
	const result = await updateTxHash(before!.id, '0x11111111')
	t.is(result, true)
	const after = await getSendInfoRecord('github-id1')
	t.is(after?.tx_hash, '0x11111111')
	t.true(after?.send_at !== null)
})

test.serial(
	'You can also update the transaction hash and date if they already exist.',
	async (t) => {
		const before = await getSendInfoRecord('github-id2')
		t.true(before?.send_at !== null)
		t.is(before?.tx_hash, '0xhogehoge')
		const result = await updateTxHash(before!.id, '0x11111111')
		t.is(result, true)
		const after = await getSendInfoRecord('github-id2')
		t.is(after?.tx_hash, '0x11111111')
		t.true(after?.send_at !== null)
	}
)

test.serial(
	'If the record does not exist, an error occurs. Of course it wont be updated.',
	async (t) => {
		await t.throwsAsync(updateTxHash(-1, '0xhuhuhu'), {
			instanceOf: PrismaClientKnownRequestError,
		})
	}
)
