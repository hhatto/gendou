/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import { Context } from '@azure/functions'
import * as responce_modules from '../common/responce'
import { generateHttpRequest } from '../common/test-utils'
import * as github_token_modules from '../common/github/token'
import * as github_graphql_modules from '../common/github/graphql'
import { UndefinedOr } from '@devprotocol/util-ts'

let getRewardApiResponce: sinon.SinonStub<[githubId: string], Promise<ApiResponce>>
let getApiTokenFromCode: sinon.SinonStub<[code: string], Promise<UndefinedOr<string>>>
let getIdFromGraphQL: sinon.SinonStub<[token: string], Promise<string>>

test.before(() => {
	getRewardApiResponce = sinon.stub(responce_modules, 'getRewardApiResponce')
	getApiTokenFromCode = sinon.stub(github_token_modules, 'getApiTokenFromCode')
	getIdFromGraphQL = sinon.stub(github_graphql_modules, 'getIdFromGraphQL')
})

// success
test('get reward info ', async (t) => {
	getApiTokenFromCode.withArgs('conde1').resolves('token1')
	getIdFromGraphQL.withArgs('token1').resolves('github-id1')
	getRewardApiResponce.withArgs('github-id1').resolves({
		status: 200,
		body: {
			dummy_key: 'dummy_value'
		}
	})
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { code: 'conde1' })
	)
	t.is(res.body.dummy_key, 'dummy_value')
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
		generateHttpRequest({}, { code: 'conde3' })
	)
	t.is(res.body.message, 'illegal oauth token')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Incorrect access token.', async (t) => {
	getApiTokenFromCode.withArgs('code4').resolves('token4')
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { code: 'conde3' })
	)
	t.is(res.body.message, 'illegal oauth token')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.after(() => {
	getRewardApiResponce.restore()
	getApiTokenFromCode.restore()
	getIdFromGraphQL.restore()
})
