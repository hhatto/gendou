/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import { Context } from '@azure/functions'
import * as details_modules from './details'
import { generateHttpRequest } from '../common/test-utils'
import { UndefinedOr } from '@devprotocol/util-ts'

let getAirdropIfo: sinon.SinonStub<[params: ParamsOfEntryApi], Promise<UndefinedOr<AirdropInfo>>>
let addEntryInfo: sinon.SinonStub<[info: AirdropInfo], Promise<boolean>>

test.before(() => {
	getAirdropIfo = sinon.stub(details_modules, 'getAirdropIfo')
	addEntryInfo = sinon.stub(details_modules, 'addEntryInfo')
})

test('get reward info', async (t) => {
	getAirdropIfo.withArgs({
		code: 'conde1',
		sign: 'sign1',
	}).resolves({
		githubId: 'github1',
		address: 'address1',
		sign: 'sign1',
	})
	addEntryInfo.withArgs({
		githubId: 'github1',
		address: 'address1',
		sign: 'sign1',
	}).resolves(true)
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { code: 'conde1', sign: 'sign1' })
	)
	t.is(res.body.github_id, 'github1')
	t.is(res.body.address, 'address1')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Incorrect parameters information.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, {})
	)
	t.is(res.body.message, 'parameters error')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('git info error', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { code: 'conde3', sign: 'sign3' })
	)
	t.is(res.body.message, 'get info error')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('db error', async (t) => {
	getAirdropIfo.withArgs({
		code: 'conde4',
		sign: 'sign4',
	}).resolves({
		githubId: 'github4',
		address: 'address4',
		sign: 'sign4',
	})
	addEntryInfo.withArgs({
		githubId: 'github4',
		address: 'address4',
		sign: 'sign4',
	}).resolves(false)
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { code: 'conde4', sign: 'sign4' })
	)
	t.is(res.body.message, 'db error')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.after(() => {
	getAirdropIfo.restore()
	addEntryInfo.restore()
})
