import test from 'ava'
import { createAirdropTestData } from './test-data'
import { setEnv } from '../test-utils'
import { getAirdrop } from './airdrop'
import { getDbClient, close } from './db'

test.before(() => {
	setEnv()
})

test.serial('getAirdrop: address is exist.', async (t) => {
	const client = getDbClient()
	await createAirdropTestData(client)
	const result = await getAirdrop(
		client,
		'0xD3e5D9c622D536cC07d085a72A825c323d8BEDBa'
	)
	await close(client)
	t.is(result?.reward, '100')
})

test.serial('getAirdrop: address is not exist.', async (t) => {
	const client = getDbClient()
	await createAirdropTestData(client)
	const result = await getAirdrop(
		client,
		'0xD3e5D9c622D536cC07d085a72A825c323d8BEDBb'
	)
	await close(client)
	t.is(result, undefined)
})
