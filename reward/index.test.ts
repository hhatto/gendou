/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import { Context } from '@azure/functions'
import * as record from '../common/send-info'
import { UndefinedOr } from '@devprotocol/util-ts'
import { generateHttpRequest } from '../common/test-utils'
import { send_info } from '@prisma/client'

let getSendInfoRecord: sinon.SinonStub<
	[githubId: string],
	Promise<UndefinedOr<send_info>>
>
test.before(() => {
	getSendInfoRecord = sinon.stub(record, 'getSendInfoRecord')
	getSendInfoRecord.withArgs('test1').resolves({
		id: 0,
		github_id: 'test1',
		reward: '10',
		is_already_send: false,
		tx_hash: null,
		send_at: null,
	})
	getSendInfoRecord.withArgs('test2').resolves({
		id: 0,
		github_id: 'test2',
		reward: '0',
		is_already_send: false,
		tx_hash: null,
		send_at: null,
	})
	getSendInfoRecord.withArgs('test3').resolves(undefined)
})

test('There is a reward.', async (t) => {
	const res = await func(
		(undefined as unknown) as Context,
		generateHttpRequest({ github_id: 'test1' }, {})
	)
	t.is(res.body.reward, '10')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Zero reward.', async (t) => {
	const res = await func(
		(undefined as unknown) as Context,
		generateHttpRequest({ github_id: 'test2' }, {})
	)
	t.is(res.body.reward, '0')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Error when getting reward.', async (t) => {
	const res = await func(
		(undefined as unknown) as Context,
		generateHttpRequest({ github_id: 'test3' }, {})
	)
	t.is(res.body.reward, '-1')
	t.is(res.body.message, 'not found')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Illegal parameter.', async (t) => {
	const res = await func(
		(undefined as unknown) as Context,
		generateHttpRequest({}, {})
	)
	t.is(res.body.reward, '-1')
	t.is(res.body.message, 'parameters error')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.after(() => {
	getSendInfoRecord.restore()
})
