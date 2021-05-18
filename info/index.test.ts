/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import { Context } from '@azure/functions'
//import * as record from '../common/send-info'
import { UndefinedOr } from '@devprotocol/util-ts'
import { generateHttpRequest } from '../common/test-utils'
//import { send_info } from '@prisma/client'

// let getSendInfoRecord: sinon.SinonStub<
// 	[githubId: string],
// 	Promise<UndefinedOr<send_info>>
// >
test.before(() => {
	//getSendInfoRecord = sinon.stub(record, 'getSendInfoRecord')
})

test('get info before send reward.', async (t) => {
	// getSendInfoRecord.withArgs('test1').resolves({
	// 	id: 0,
	// 	github_id: 'test1',
	// 	reward: '10',
	// 	uuid: '1xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
	// 	claim_url: 'http://hogehoge1',
	// 	find_at: null,
	// })
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({ github_id: 'test1' }, {})
	)
	t.is(res.body.reward, '10')
	t.is(typeof res.body.find_at, 'undefined')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.only('get info after send reward.', async (t) => {
	// getSendInfoRecord.withArgs('test2').resolves({
	// 	id: 0,
	// 	github_id: 'test2',
	// 	reward: '20',
	// 	uuid: '2xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
	// 	claim_url: 'http://hogehoge2',
	// 	find_at: new Date(2020, 8, 21, 17, 10, 5),
	// })
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({ github_id: 'test2' }, {})
	)
	t.is(res.body.reward, '20')
	console.log(res.body)
	t.is(res.body.find_at.getFullYear(), 2020)
	t.is(res.body.find_at.getMonth(), 8)
	t.is(res.body.find_at.getDate(), 21)
	t.is(res.body.find_at.getHours(), 17)
	t.is(res.body.find_at.getMinutes(), 10)
	t.is(res.body.find_at.getSeconds(), 5)
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Error when getting reward.', async (t) => {
	//getSendInfoRecord.withArgs('test3').resolves(undefined)
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({ github_id: 'test3' }, {})
	)
	t.is(res.body.message, 'not found')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Illegal parameter.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, {})
	)
	t.is(res.body.message, 'parameters error')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.after(() => {
	//getSendInfoRecord.restore()
})
