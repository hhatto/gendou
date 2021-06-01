/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import test from 'ava'
import { createAlreadyClaimedTestData } from './test-data'
import { setEnv } from '../test-utils'
import { isAlreadyClaimed } from './already_claimed'
import { getDbClient, close } from './db'

test.before(() => {
	setEnv()
})

// isAlreadyClaimed
test.serial('github id is exist.', async (t) => {
	const client = getDbClient()
	await createAlreadyClaimedTestData(client)
	const result = await isAlreadyClaimed(client, 'github-id1')
	await close(client)
	t.is(result, true)
})

test.serial('github id is not exist.', async (t) => {
	const client = getDbClient()
	await createAlreadyClaimedTestData(client)
	const result = await isAlreadyClaimed(client, 'github-id99')
	await close(client)
	t.is(result, false)
})
