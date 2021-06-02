/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import test from 'ava'
import { getDbClient, close } from './db'
import { setEnv } from '../test-utils'
import { insertEntry } from './entry'

test.before(() => {
	setEnv()
})

// insertEntry
test.serial('If out of range, data cannot be acquired.', async (t) => {
	const client = getDbClient()
	await client.entry.deleteMany()
	const result = await insertEntry(client, 'github-1', 'address-1', 'sign-1')
	t.true(result)
	const record = await client.entry.findFirst({
		where: {
			AND: [
				{
					sign: 'sign-1',
					github_id: 'github-1',
					address: 'address-1',
				},
			],
		},
	})
	await close(client)
	t.true(record!.id > 0)
	t.is(record!.github_id, 'github-1')
	t.is(record!.address, 'address-1')
	t.is(record!.sign, 'sign-1')
	t.true(record!.create_at.getTime() > 0)
})
