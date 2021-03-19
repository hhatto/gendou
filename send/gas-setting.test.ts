/* eslint-disable @typescript-eslint/no-non-null-assertion */
import test from 'ava'
import BigNumber from 'bignumber.js'
import equal from 'deep-equal'
import { getGasSetting } from './gas-setting'

test('If there is no setting, the default value will be returned.', async (t) => {
	const res = await getGasSetting(undefined, undefined)
	t.is(
		equal(res, {
			gasLimit: '1000000',
		}),
		true
	)
})
test('If you set gaslimit, it will come back to you.', async (t) => {
	const res = await getGasSetting(undefined, '100')
	t.is(
		equal(res, {
			gasLimit: '100',
		}),
		true
	)
})
test('If you set up an egs token, you can get the gasPrice.', async (t) => {
	const res = await getGasSetting('', undefined)
	t.is(res.gasLimit, '1000000')
	t.is(new BigNumber(res.gasPrice!).gt(0), true)
})
