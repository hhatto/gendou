/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { main } from './main'
import * as reward_modules from '../common/db/reward'
import * as claim_url_modules from '../common/db/claim-url'
import * as graph_ql_modules from '../common/github/graphql'
import * as detail_modules from './detail'
import { UndefinedOr } from '@devprotocol/util-ts'
import { claim_url, reward } from '.prisma/client'


let getCommitCount: sinon.SinonStub<[githubId: string], Promise<number>>
let getClaimUrlRecordByGithubId: sinon.SinonStub<[githubId: string], Promise<UndefinedOr<claim_url>>>
let getRewordRecordByCommitCount: sinon.SinonStub<[commitCount: number], Promise<UndefinedOr<reward>>>
let getRewardInfo: sinon.SinonStub<[rewardRecord: reward], Promise<ApiResponce>>
let getAlreadyClaimRewardInfo: sinon.SinonStub<[rewardRecord: reward, findClaimUrlRecord: claim_url], Promise<ApiResponce>>


test.before(() => {
	getCommitCount = sinon.stub(graph_ql_modules, 'getCommitCount')
	getRewordRecordByCommitCount = sinon.stub(reward_modules, 'getRewordRecordByCommitCount')
	getClaimUrlRecordByGithubId = sinon.stub(claim_url_modules, 'getClaimUrlRecordByGithubId')
	getRewardInfo = sinon.stub(detail_modules, 'getRewardInfo')
	getAlreadyClaimRewardInfo = sinon.stub(detail_modules, 'getAlreadyClaimRewardInfo')
})

test.only('The url is already assigned..', async (t) => {
	const dummyRewward = {
		id: 0,
		commit_lower_limit: 10,
		commit_upper_limit: 200,
		reward: '10000000000000000000',
		rank: 1,
	}
	const dummyClaimUrl = {
		id: 0,
		uuid: '2xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
		claim_url: 'http://hogehoge1',
		reward_id: 1,
		github_id: 'github-1',
		find_at: new Date(2020, 8, 21, 17, 10, 5),
	}
	getCommitCount.withArgs('github-1').resolves(100)
	getRewordRecordByCommitCount.withArgs(100).resolves(dummyRewward)
	getClaimUrlRecordByGithubId.withArgs('github-1').resolves(dummyClaimUrl)
	getAlreadyClaimRewardInfo.withArgs(dummyRewward, dummyClaimUrl).resolves({
		status: 200,
		body: {
			dummy_key: 'dummy_value'
		}
	})
	const res = await main('github-1')
	t.is(res.body.dummy_key, 'dummy_value')

	t.is(res.status, 200)
})

test.only('Distribution information can be obtained..', async (t) => {
	const dummyRewward = {
		id: 1,
		commit_lower_limit: 10,
		commit_upper_limit: 200,
		reward: '10000000000000000000',
		rank: 2,
	}
	getCommitCount.withArgs('github-2').resolves(200)
	getRewordRecordByCommitCount.withArgs(200).resolves(dummyRewward)
	getRewardInfo.withArgs(dummyRewward).resolves({
		status: 200,
		body: {
			dummy_key: 'dummy_value2'
		}
	})
	const res = await main('github-2')
	t.is(res.body.dummy_key, 'dummy_value2')
	t.is(res.status, 200)
})

test.only('Incorrect reward information.', async (t) => {
	getCommitCount.withArgs('github-3').resolves(300)
	const res = await main('github-3')
	t.is(res.body.message, 'not applicable')
	t.is(res.status, 200)
})

test.after(() => {
	getCommitCount.restore()
	getClaimUrlRecordByGithubId.restore()
	getRewordRecordByCommitCount.restore()
	getRewardInfo.restore()
	getAlreadyClaimRewardInfo.restore()
})
