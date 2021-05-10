/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import { Context, HttpRequest } from '@azure/functions'
import * as main from './main'
import { UndefinedOr } from '@devprotocol/util-ts'
import { generateHttpRequest } from '../common/test-utils'
import { send_info } from '@prisma/client'

let mainFunc: sinon.SinonStub<
	[req: HttpRequest],
	Promise<readonly [UndefinedOr<send_info>, UndefinedOr<string>]>
>
test.before(() => {
	mainFunc = sinon.stub(main, 'main')
	mainFunc
		.withArgs(generateHttpRequest({}, { github_id: '0' }))
		.resolves([{
			reward: '100000000000000000',
			claim_url: 'http://hogehoge',
		} as any, undefined])
	mainFunc
		.withArgs(generateHttpRequest({}, { github_id: '1' }))
		.resolves([undefined, 'error message1'])
})

test('The process ends normally.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { github_id: '0' })
	)
	t.is(res.body.reward, '100000000000000000')
	t.is(res.body.claim_url, 'http://hogehoge')
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


test.after(() => {
	mainFunc.restore()
})
