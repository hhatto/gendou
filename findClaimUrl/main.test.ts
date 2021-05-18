/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
//import { main } from './main'
import { UndefinedOr } from '@devprotocol/util-ts'
import { generateHttpRequest } from '../common/test-utils'
//import { send_info } from '@prisma/client'
//import * as send_info_modules from '../common/send-info'
import * as validate_modules from './validate'
import { getParams } from './params'
import * as db_modules from './db'

// let getSendInfoRecord: sinon.SinonStub<
// 	[githubId: string],
// 	Promise<UndefinedOr<send_info>>
// >
// let validate: sinon.SinonStub<[params: ParamsOfSendApi], Promise<boolean>>
let updateAt: sinon.SinonStub<[sendInfoId: number], Promise<boolean>>

test.before(() => {
	// getSendInfoRecord = sinon.stub(send_info_modules, 'getSendInfoRecord')
	// validate = sinon.stub(validate_modules, 'validate')
	updateAt = sinon.stub(db_modules, 'updateAt')
})

test('successful processing.', async (t) => {
	const request1 = generateHttpRequest(
		{},
		{
			github_id: 'git-id1',
			signature: 'signature1',
			address: 'address1',
			twitter_status: 'status1',
		}
	)
	const param1 = getParams(request1)
	// const record1 = {
	// 	id: 1,
	// 	github_id: 'git-id1',
	// 	reward: '10000000000000000000',
	// 	uuid: '1xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
	// 	claim_url: 'http://hogehoge1',
	// } as send_info
	// getSendInfoRecord.withArgs(request1.body.github_id!).resolves(record1)
	// validate.withArgs(param1!).resolves(true)
	// updateAt.withArgs(record1.id).resolves(true)

	// const [record, message] = await main(request1)
	// t.is(record!.id, 1)
	// t.is(record!.github_id, 'git-id1')
	// t.is(record!.reward, '10000000000000000000')
	// t.is(record!.uuid, '1xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	// t.is(record!.claim_url, 'http://hogehoge1')
	// t.is(typeof message, 'undefined')
})

test('Request is invalid.', async (t) => {
	const request2 = generateHttpRequest({}, {})
	// const [res, message] = await main(request2)
	// t.is(typeof res, 'undefined')
	// t.is(message, 'parameters error')
})

test('The record does not exist.', async (t) => {
	const request3 = generateHttpRequest(
		{},
		{
			github_id: 'git-id3',
			signature: 'signature3',
			address: 'address3',
			twitter_status: 'status3',
		}
	)
	//getSendInfoRecord.withArgs(request3.body.github_id!).resolves(undefined)
	// const [res, message] = await main(request3)
	// t.is(typeof res, 'undefined')
	// t.is(message, 'not found')
})

test('validate failed.', async (t) => {
	const request4 = generateHttpRequest(
		{},
		{
			github_id: 'git-id4',
			signature: 'signature4',
			address: 'address4',
			twitter_status: 'status4',
		}
	)
	const param4 = getParams(request4)
	// const record4 = {
	// 	id: 4,
	// 	github_id: 'git-id4',
	// 	reward: '40000000000000000000',
	// 	uuid: '4xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
	// 	claim_url: 'http://hogehoge4',
	// } as send_info
	// getSendInfoRecord.withArgs(request4.body.github_id!).resolves(record4)
	// validate.withArgs(param4!).resolves(false)
	// const [record, message] = await main(request4)
	// t.is(record!.id, 4)
	// t.is(record!.github_id, 'git-id4')
	// t.is(record!.reward, '40000000000000000000')
	// t.is(record!.uuid, '4xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	// t.is(record!.claim_url, 'http://hogehoge4')
	// t.is(message, 'illegal address')
})
test('Failed to update db.', async (t) => {
	const request5 = generateHttpRequest(
		{},
		{
			github_id: 'git-id5',
			signature: 'signature5',
			address: 'address5',
			twitter_status: 'status5',
		}
	)
	const param5 = getParams(request5)
	// const record5 = {
	// 	id: 5,
	// 	github_id: 'git-id5',
	// 	reward: '50000000000000000000',
	// 	uuid: '5xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
	// 	claim_url: 'http://hogehoge5',
	// } as send_info
	// getSendInfoRecord.withArgs(request5.body.github_id!).resolves(record5)
	// validate.withArgs(param5!).resolves(true)
	// updateAt.withArgs(record5.id).resolves(false)
	// const [record, message] = await main(request5)
	// t.is(record!.id, 5)
	// t.is(record!.github_id, 'git-id5')
	// t.is(record!.reward, '50000000000000000000')
	// t.is(record!.uuid, '5xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	// t.is(record!.claim_url, 'http://hogehoge5')
	// t.is(message, 'db access error')
})
test.after(() => {
	// getSendInfoRecord.restore()
	// validate.restore()
	updateAt.restore()
})
