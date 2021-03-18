/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { main } from './main'
import { UndefinedOr } from '@devprotocol/util-ts'
import { generateHttpRequest } from '../common/test-utils'
import { send_info } from '@prisma/client'
import * as send_info_modules from './../common/send-info'
import * as validate_modules from './validate'
import { getParams } from './params'
import * as send_modules from './send'

let getSendInfoRecord: sinon.SinonStub<
	[githubId: string],
	Promise<UndefinedOr<send_info>>
>
let validate: sinon.SinonStub<
	[params: ParamsOfSendApi, sendInfo: send_info],
	Promise<UndefinedOr<boolean>>
>
let send: sinon.SinonStub<
	[params: ParamsOfSendApi, sendInfo: send_info],
	Promise<UndefinedOr<boolean>>
>
const request1 = generateHttpRequest({
	github_id: 'git-id1',
	signature: 'signature1',
	address: 'address1',
	twitter_status: 'status1',
})
const request2 = generateHttpRequest({})
const request3 = generateHttpRequest({
	github_id: 'git-id3',
	signature: 'signature3',
	address: 'address3',
	twitter_status: 'status3',
})
const request4 = generateHttpRequest({
	github_id: 'git-id4',
	signature: 'signature4',
	address: 'address4',
	twitter_status: 'status4',
})
const request5 = generateHttpRequest({
	github_id: 'git-id5',
	signature: 'signature5',
	address: 'address5',
	twitter_status: 'status5',
})
const param1 = getParams(request1)
const param4 = getParams(request4)
const param5 = getParams(request5)
const record1 = {
	id: 1,
	github_id: 'git-id1',
	reward: '10000000000000000000',
	is_already_send: false,
	tx_hash: null,
	send_at: null,
} as send_info
const record4 = {
	id: 4,
	github_id: 'git-id4',
	reward: '40000000000000000000',
	is_already_send: false,
	tx_hash: null,
	send_at: null,
} as send_info
const record5 = {
	id: 5,
	github_id: 'git-id5',
	reward: '50000000000000000000',
	is_already_send: false,
	tx_hash: null,
	send_at: null,
} as send_info
test.before(() => {
	getSendInfoRecord = sinon.stub(send_info_modules, 'getSendInfoRecord')
	validate = sinon.stub(validate_modules, 'validate')
	send = sinon.stub(send_modules, 'send')

	getSendInfoRecord.withArgs(request1.params.github_id!).resolves(record1)
	validate.withArgs(param1!, record1).resolves(true)
	send.withArgs(param1!, record1).resolves(true)

	getSendInfoRecord.withArgs(request3.params.github_id!).resolves(undefined)

	getSendInfoRecord.withArgs(request4.params.github_id!).resolves(record4)
	validate.withArgs(param4!, record4).resolves(false)

	getSendInfoRecord.withArgs(request5.params.github_id!).resolves(record5)
	validate.withArgs(param5!, record5).resolves(true)
	send.withArgs(param5!, record5).resolves(undefined)
})

test('successful processing.', async (t) => {
	const res = await main(request1)
	t.is(res, true)
})

test('Request is invalid.', async (t) => {
	const res = await main(request2)
	t.true(typeof res === 'undefined')
})

test('The record does not exist..', async (t) => {
	const res = await main(request3)
	t.true(typeof res === 'undefined')
})

test('validate failed.', async (t) => {
	const res = await main(request4)
	t.true(typeof res === 'undefined')
})
test('Failed to send token.', async (t) => {
	const res = await main(request5)
	t.true(typeof res === 'undefined')
})
test.after(() => {
	getSendInfoRecord.restore()
	validate.restore()
	send.restore()
})
