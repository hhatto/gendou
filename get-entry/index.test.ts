/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import { Context } from '@azure/functions'
import { generateHttpRequest } from '../common/test-utils'
import * as details_modules from './details'
import { UndefinedOr } from '@devprotocol/util-ts'
import { entry, reward } from '.prisma/client'

let getEntryInfo: sinon.SinonStub<[accessToken: string], Promise<UndefinedOr<readonly [entry, reward]>>>

test.before(() => {
	getEntryInfo = sinon.stub(details_modules, 'getEntryInfo')
})

// success
test('get entry info ', async (t) => {
	getEntryInfo.withArgs('token1').resolves([{id: 1, github_id: 'github-id1', address: 'address1', sign: 'sign1', contribution_count: 100, create_at: '2010-12-12', update_at: '2011-12-12'} as any, {reward: 1000000000} as any])
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { access_token: 'token1' })
	)
	t.is(res.body.id, 1)
	t.is(res.body.github_id, 'github-id1')
	t.is(res.body.address, 'address1')
	t.is(res.body.sign, 'sign1')
	t.is(res.body.reward, 1000000000)
	t.is(res.body.contribution_count, 100)
	t.is(res.body.create_at, '2010-12-12')
	t.is(res.body.update_at, '2011-12-12')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

// error
test('Incorrect parameters information.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, {})
	)
	t.is(res.body.message, 'parameters error')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Incorrect code.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { access_token: 'token3' })
	)
	t.is(res.body.message, 'not found')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.after(() => {
	getEntryInfo.restore()
})
