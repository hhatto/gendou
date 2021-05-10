/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import { Context, HttpRequest } from '@azure/functions'
import * as main from './main'
import { UndefinedOr } from '@devprotocol/util-ts'
import { generateHttpRequest } from '../common/test-utils'

let mainFunc: sinon.SinonStub<
	[req: HttpRequest],
	Promise<readonly [UndefinedOr<boolean>, UndefinedOr<string>]>
>
test.before(() => {
	mainFunc = sinon.stub(main, 'main')
	mainFunc
		.withArgs(generateHttpRequest({}, { github_id: '0' }))
		.resolves([true, undefined])
	mainFunc
		.withArgs(generateHttpRequest({}, { github_id: '1' }))
		.resolves([false, 'error message1'])
	mainFunc
		.withArgs(generateHttpRequest({}, { github_id: '2' }))
		.resolves([false, 'error message2'])
})

test('The process ends normally.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { github_id: '0' })
	)
	t.is(res.body.message, 'success')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('The process terminates abnormally.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { github_id: '1' })
	)
	t.is(res.body.message, 'error message1')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('The process does not terminate normally.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { github_id: '2' })
	)
	t.is(res.body.message, 'error message2')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.after(() => {
	mainFunc.restore()
})
