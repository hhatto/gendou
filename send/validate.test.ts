/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { validate } from './validate'
import { send_info } from '@prisma/client'
import * as twitter_modules from './twitter'
import { UndefinedOr } from '@devprotocol/util-ts'

let checkIncludingUrl: sinon.SinonStub<
	[twitterId: string],
	Promise<UndefinedOr<boolean>>
>
const params1 = {
	message: 'git-id1',
	signature:
		'0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c',
	address: '0x3CbDbAfE2585F4991CEf5A5D2870F68D661b3943',
	tweetStatus: 'status1',
} as ParamsOfSendApi

const params2 = {
	message: 'git-id2',
	signature:
		'0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c',
	address: '0x3CbDbAfE2585F4991CEf5A5D2870F68D661b3943',
	tweetStatus: 'status2',
} as ParamsOfSendApi

const params3 = {
	message: 'git-id3',
	signature:
		'0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c',
	address: '0x10Ee98C38e65ADB9821C2C88c23AFBBbD3783034',
	tweetStatus: 'status3',
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

test.before(() => {
	checkIncludingUrl = sinon.stub(twitter_modules, 'checkIncludingUrl')

	checkIncludingUrl.withArgs(params1.tweetStatus).resolves(true)
	checkIncludingUrl.withArgs(params3.tweetStatus).resolves(false)
})

test('successful processing.', async (t) => {
	const res = await validate(params1, record1)
	t.is(res, true)
})

test('checkSameAddress function fails.', async (t) => {
	const res = await validate(params2, record2)
	t.is(typeof res, 'undefined')
})

test('checkIncludingUrl function fails.', async (t) => {
	const res = await validate(params3, record3)
	t.is(res, false)
})

test.after(() => {
	checkIncludingUrl.restore()
})
