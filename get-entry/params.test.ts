/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import { getParams } from './params'
import { generateHttpRequest } from '../common/test-utils'

test('The parameter does not exist.', async (t) => {
	const res = await getParams(generateHttpRequest({}, {}))
	t.is(res, undefined)
})

test('access_token parameter is present.', async (t) => {
	const res = await getParams(
		generateHttpRequest({}, { access_token: 'hoge-token' })
	)
	t.is(res?.accessToken, 'hoge-token')
})
