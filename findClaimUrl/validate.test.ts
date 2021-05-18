/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import { validate } from './validate'

const params1 = {
	message: 'git-id1',
	signature:
		'0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c',
	address: '0x3CbDbAfE2585F4991CEf5A5D2870F68D661b3943',
} as ParamsOfFindClaimUrlApi

const params2 = {
	message: 'git-id2',
	signature:
		'0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c',
	address: '0x3CbDbAfE2585F4991CEf5A5D2870F68D661b3943',
} as ParamsOfFindClaimUrlApi

test('successful processing.', async (t) => {
	const res = await validate(params1)
	t.is(res, true)
})

test('checkSameAddress function fails.', async (t) => {
	const res = await validate(params2)
	t.is(res, false)
})
