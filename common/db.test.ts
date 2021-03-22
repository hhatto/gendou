import test from 'ava'
import { getDbClient, close } from './db'
import { setEnv } from './test-utils'

test.before(() => {
	setEnv()
})

test('connect db and disconnect.', async (t) => {
	const res = getDbClient()
	const result = await close(res)
	t.is(result, true)
})
