/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import BigNumber from 'bignumber.js'
import { send } from './send'
import { send_info } from '@prisma/client'
import * as db_modules from './db'
import * as token_modules from './token'
import { UndefinedOr } from '@devprotocol/util-ts'

let updateAlreadySend: sinon.SinonStub<[sendInfoId: number], Promise<boolean>>
let sendToken: sinon.SinonStub<
	[toAddress: string, reward: BigNumber],
	Promise<UndefinedOr<string>>
>
let updateTxHash: sinon.SinonStub<
	[sendInfoId: number, txHash: string],
	Promise<boolean>
>
const params1 = {
	message: 'git-id1',
	signature: 'signature1',
	address: 'address1',
	tweetStatus: 'status1',
} as ParamsOfSendApi
const params2 = {
	message: 'git-id2',
	signature: 'signature2',
	address: 'address2',
	tweetStatus: 'status2',
} as ParamsOfSendApi
const params3 = {
	message: 'git-id3',
	signature: 'signature3',
	address: 'address3',
	tweetStatus: 'status3',
} as ParamsOfSendApi
const params4 = {
	message: 'git-id4',
	signature: 'signature4',
	address: 'address4',
	tweetStatus: 'status4',
} as ParamsOfSendApi

const record1 = {
	id: 1,
	github_id: 'git-id1',
	reward: '10000000000000000000',
	is_already_send: false,
	tx_hash: null,
	send_at: null,
} as send_info
const record2 = {
	id: 2,
	github_id: 'git-id2',
	reward: '20000000000000000000',
	is_already_send: false,
	tx_hash: null,
	send_at: null,
} as send_info
const record3 = {
	id: 3,
	github_id: 'git-id3',
	reward: '30000000000000000000',
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
test.before(() => {
	updateAlreadySend = sinon.stub(db_modules, 'updateAlreadySend')
	sendToken = sinon.stub(token_modules, 'sendToken')
	updateTxHash = sinon.stub(db_modules, 'updateTxHash')

	updateAlreadySend.withArgs(record1.id).resolves(true)
	sendToken
		.withArgs(params1.address, new BigNumber(record1.reward))
		.resolves('tx-hash1')
	updateTxHash.withArgs(record1.id, 'tx-hash1').resolves(true)

	updateAlreadySend.withArgs(record2.id).resolves(false)

	updateAlreadySend.withArgs(record3.id).resolves(true)
	sendToken
		.withArgs(params3.address, new BigNumber(record3.reward))
		.resolves(undefined)

	updateAlreadySend.withArgs(record4.id).resolves(true)
	sendToken
		.withArgs(params4.address, new BigNumber(record4.reward))
		.resolves('tx-hash4')
	updateTxHash.withArgs(record4.id, 'tx-hash4').resolves(false)
})

test('successful processing.', async (t) => {
	const res = await send(params1, record1)
	t.is(res, true)
})

test('updateAlreadySend function fails.', async (t) => {
	const res = await send(params2, record2)
	t.is(typeof res, 'undefined')
})

test('sendToken function fails.', async (t) => {
	const res = await send(params3, record3)
	t.is(typeof res, 'undefined')
})

test('updateTxHash function fails.', async (t) => {
	const res = await send(params4, record4)
	t.is(res, false)
})

test.after(() => {
	updateAlreadySend.restore()
	sendToken.restore()
	updateTxHash.restore()
})
