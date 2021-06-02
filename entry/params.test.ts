/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import { getParams } from './params'
import { generateHttpRequest } from '../common/test-utils'

test('The parameter does not exist.', async (t) => {
	const res = await getParams(generateHttpRequest({}, {}))
	t.is(res, undefined)
})

test('Only the code parameter is present.', async (t) => {
	const res = await getParams(generateHttpRequest({}, { code: 'hoge-code' }))
	t.is(res, undefined)
})

test('all parameter is present.', async (t) => {
	const res = await getParams(
		generateHttpRequest({}, { code: 'hoge-code', sign: 'hoge-sign' })
	)
	t.is(res?.code, 'hoge-code')
	t.is(res?.sign, 'hoge-sign')
})
