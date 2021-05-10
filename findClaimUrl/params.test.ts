/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import equal from 'deep-equal'
import { getParams } from './params'
import { generateHttpRequest } from '../common/test-utils'

test('The parameter does not exist.', async (t) => {
	const res = await getParams(generateHttpRequest({}, {}))
	t.is(res, undefined)
})

test('Only the github_id parameter is present.', async (t) => {
	const res = await getParams(generateHttpRequest({}, { github_id: 'hoge' }))
	t.is(res, undefined)
})

test('There are only github_id and signature parameters.', async (t) => {
	const res = await getParams(
		generateHttpRequest({}, { github_id: 'hoge', signature: 'huga' })
	)
	t.is(res, undefined)
})

test('All parameters are present.', async (t) => {
	const res = await getParams(
		generateHttpRequest(
			{},
			{
				github_id: 'hoge',
				signature: 'huga',
				address: 'hoho',
			}
		)
	)
	t.is(
		equal(res, {
			message: 'hoge',
			signature: 'huga',
			address: 'hoho',
		}),
		true
	)
})
