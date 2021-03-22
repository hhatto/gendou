/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { checkIncludingUrl } from './twitter'
import * as utils_ts from '@devprotocol/util-ts'

let getTextUrls: sinon.SinonStub<
	[twitterId: string],
	Promise<readonly [boolean, readonly string[]]>
>
test.before(() => {
	process.env.CHECK_URL = 'https://aaa'
	getTextUrls = sinon.stub(utils_ts, 'getTextUrls')
	getTextUrls.withArgs('00000').resolves([true, ['https://aaa?b=777']])
	getTextUrls.withArgs('1111').resolves([false, []])
	getTextUrls.withArgs('2222').resolves([true, ['https://bbb?b=777']])
})

test('If the URL is included.', async (t) => {
	const result = await checkIncludingUrl('00000')
	t.is(result, true)
})

test('If the API encounters an error.', async (t) => {
	const result = await checkIncludingUrl('1111')
	t.is(typeof result, 'undefined')
})

test('If the URL is not included.', async (t) => {
	const result = await checkIncludingUrl('2222')
	t.is(result, false)
})

test.after(() => {
	getTextUrls.restore()
})
