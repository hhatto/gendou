/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import test from 'ava'
import { getDbClient, close } from './db'
import { setEnv } from '../test-utils'
import { insertEntry, getEntry, getEntryByAddress, updateEntry } from './entry'

test.before(() => {
	setEnv()
})

// insertEntry
test.serial('insert.', async (t) => {
	const client = getDbClient()
	await client.entry.deleteMany()
	const result = await insertEntry(
		client,
		'github-1',
		'address-1',
		'sign-1',
		1,
		100
	)
	t.true(result)
	const record = await client.entry.findFirst({
		where: {
			AND: [
				{
					sign: 'sign-1',
					github_id: 'github-1',
					address: 'address-1',
					reward_id: 1,
					contribution_count: 100,
				},
			],
		},
	})
	await close(client)
	t.true(record!.id > 0)
	t.is(record!.github_id, 'github-1')
	t.is(record!.address, 'address-1')
	t.is(record!.sign, 'sign-1')
	t.is(record!.reward_id, 1)
	t.is(record!.contribution_count, 100)
	t.true(record!.create_at.getTime() > 0)
	t.true(record!.update_at.getTime() > 0)
})

// getEntry
test.serial('get.', async (t) => {
	const client = getDbClient()
	await client.entry.deleteMany()
	await insertEntry(client, 'github-2', 'address-2', 'sign-2', 2, 200)
	const record = await getEntry(client, 'github-2')
	await close(client)
	t.true(record!.id > 0)
	t.is(record!.github_id, 'github-2')
	t.is(record!.address, 'address-2')
	t.is(record!.sign, 'sign-2')
	t.is(record!.reward_id, 2)
	t.is(record!.contribution_count, 200)
	t.true(record!.create_at.getTime() > 0)
	t.true(record!.update_at.getTime() > 0)
})

// getEntryByAddress
test.serial.only('get by address.', async (t) => {
	const client = getDbClient()
	await client.entry.deleteMany()
	await insertEntry(client, 'github-2', 'address-2', 'sign-2', 2, 200)
	const record = await getEntryByAddress(client, 'address-2')
	await close(client)
	t.true(record!.id > 0)
	t.is(record!.github_id, 'github-2')
	t.is(record!.address, 'address-2')
	t.is(record!.sign, 'sign-2')
	t.is(record!.reward_id, 2)
	t.is(record!.contribution_count, 200)
	t.true(record!.create_at.getTime() > 0)
	t.true(record!.update_at.getTime() > 0)
})

// updateEntry
test.serial.only('update.', async (t) => {
	const client = getDbClient()
	await client.entry.deleteMany()
	await insertEntry(client, 'github-3', 'address-3', 'sign-3', 3, 300)
	const result = await updateEntry(
		client,
		'github-3',
		'address-3-1',
		'sign-3-1',
		4,
		400
	)
	await close(client)
	t.true(result)
	const record = await getEntry(client, 'github-3')
	t.true(record!.id > 0)
	t.is(record!.github_id, 'github-3')
	t.is(record!.address, 'address-3-1')
	t.is(record!.sign, 'sign-3-1')
	t.is(record!.reward_id, 4)
	t.is(record!.contribution_count, 400)
	t.true(record!.create_at.getTime() > 0)
	t.true(record!.update_at.getTime() > 0)
	t.true(record!.create_at.getTime() < record!.update_at.getTime())
})
