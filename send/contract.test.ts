import test from 'ava'
import { getDevContract } from './contract'

const dummyMnemonic =
	'maze noodle finish dinosaur flight demise double whisper cycle token curve erosion'
test('All not set.', async (t) => {
	const res = getDevContract(undefined, undefined, undefined, undefined)
	t.true(typeof res === 'undefined')
})
test('When only the network name is set.', async (t) => {
	const res = getDevContract('ropsten', undefined, undefined, undefined)
	t.true(typeof res === 'undefined')
})
test('When the contract address is not set.', async (t) => {
	const res = getDevContract('ropsten', 'apikey', dummyMnemonic, undefined)
	t.true(typeof res === 'undefined')
})
test('When all settings are made.', async (t) => {
	const res = getDevContract(
		'ropsten',
		'apikey',
		dummyMnemonic,
		'0x5312f4968901Ec9d4fc43d2b0e437041614B14A2'
	)
	t.is(res?.address, '0x5312f4968901Ec9d4fc43d2b0e437041614B14A2')
})
