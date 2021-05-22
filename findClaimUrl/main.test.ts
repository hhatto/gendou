/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { main } from './main'
import { UndefinedOr } from '@devprotocol/util-ts'
import * as token_modules from '../common/github/token'
import * as graphql_modules from '../common/github/graphql'
import * as reward_modules from '../common/db/reward'
import * as detail_modules from './details'
import { reward } from '.prisma/client'

let getApiTokenFromCode: sinon.SinonStub<[code: string], Promise<string>>
let getCommitCountAndId: sinon.SinonStub<
	[token: string],
	Promise<GithubIdAndCommitCount>
>
let getRewordRecordByCommitCount: sinon.SinonStub<
	[commitCount: number],
	Promise<UndefinedOr<reward>>
>
let claimUrl: sinon.SinonStub<
	[githubId: string, rewardRecord: reward],
	Promise<ApiResponce>
>
test.before(() => {
	getApiTokenFromCode = sinon.stub(token_modules, 'getApiTokenFromCode')
	getCommitCountAndId = sinon.stub(graphql_modules, 'getCommitCountAndId')
	getRewordRecordByCommitCount = sinon.stub(
		reward_modules,
		'getRewordRecordByCommitCount'
	)
	claimUrl = sinon.stub(detail_modules, 'claimUrl')
})

test('successful processing.', async (t) => {
	getApiTokenFromCode.withArgs('code1').resolves('token1')
	getCommitCountAndId.withArgs('token1').resolves({
		githubId: 'github-id1',
		commitCount: 300,
	})
	getRewordRecordByCommitCount.withArgs(300).resolves({
		id: 1,
	} as any)
	claimUrl.withArgs('github-id1', { id: 1 } as any).resolves({
		status: 200,
		body: {
			key: 'value',
		},
	})
	const result = await main('code1')
	t.is(result.status, 200)
	t.is(result.body.key, 'value')
})

test('not applicable.', async (t) => {
	getApiTokenFromCode.withArgs('code2').resolves('token2')
	getCommitCountAndId.withArgs('token2').resolves({
		githubId: 'github-id2',
		commitCount: 1300,
	})
	getRewordRecordByCommitCount.withArgs(1300).resolves(undefined)
	const result = await main('code2')
	t.is(result.status, 200)
	t.is(result.body.message, 'not applicable')
})

test.after(() => {
	getApiTokenFromCode.restore()
	getCommitCountAndId.restore()
	getRewordRecordByCommitCount.restore()
	claimUrl.restore()
})
