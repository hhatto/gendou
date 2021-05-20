/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import * as claim_url_modules from '../common/db/utils'
import * as reward_modules from '../common/db/reward'
import { getRewardInfo, getAlreadyClaimRewardInfo } from './detail'
import { reward, claim_url } from '.prisma/client'
import { UndefinedOr } from '@devprotocol/util-ts'

let getClaimUrlInfo: sinon.SinonStub<[rewardRecord: reward], Promise<{ readonly reward: string; readonly isRankDown: boolean; readonly claimUrl: UndefinedOr<claim_url> }>>
let getRewordRecordById: sinon.SinonStub<[id: number], Promise<UndefinedOr<reward>>>
test.before(() => {
	getClaimUrlInfo = sinon.stub(claim_url_modules, 'getClaimUrlInfo')
	getRewordRecordById = sinon.stub(reward_modules, 'getRewordRecordById')
})

//getRewardInfo
test('Get the assigned claim url.', async (t) => {
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
		github_id: null,
		find_at: null,
	}
	getClaimUrlInfo.withArgs(dummyRewward).resolves({
		reward: '30000000000000000000',
		isRankDown: false,
		claimUrl: dummyClaimUrl
	})
	const res = await getRewardInfo(
		dummyRewward
	)
	t.is(res.body.reward, '30000000000000000000')
	t.is(res.body.is_rank_down, false)
	t.is(res.body.find_at, null)
	t.is(res.status, 200)
})

test('The claim url was not assigned.', async (t) => {
	const dummyRewward = {
		id: 1,
		commit_lower_limit: 20,
		commit_upper_limit: 400,
		reward: '20000000000000000000',
		rank: 2,
	}
	getClaimUrlInfo.withArgs(dummyRewward).resolves({
		reward: '40000000000000000000',
		isRankDown: true,
		claimUrl: undefined
	})
	const res = await getRewardInfo(
		dummyRewward
	)
	t.is(res.body.message, 'there are no more rewards to distribute')
	t.is(res.status, 200)
})

//getAlreadyClaimRewardInfo
test('The reward id was incorrect.', async (t) => {
	const dummyRewward = {
		id: 2,
		commit_lower_limit: 20,
		commit_upper_limit: 400,
		reward: '20000000000000000000',
		rank: 2,
	}
	const dummyClaimUrl = {
		id: 2,
		uuid: '2xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
		claim_url: 'http://hogehoge1',
		reward_id: 1,
		github_id: 'github-1',
		find_at: new Date(2020, 8, 21, 17, 10, 5),
	}
	const res = await getAlreadyClaimRewardInfo(
		dummyRewward,
		dummyClaimUrl
	)
	t.is(res.body.message, 'illegal reward id')
	t.is(res.status, 200)
})

test('After the claim url has already been distributed.(Distribution rewards have not been cut)', async (t) => {
	const dummyRewward = {
		id: 2,
		commit_lower_limit: 20,
		commit_upper_limit: 400,
		reward: '20000000000000000000',
		rank: 2,
	}
	const dummyClaimUrl = {
		id: 2,
		uuid: '2xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
		claim_url: 'http://hogehoge1',
		reward_id: 2,
		github_id: 'github-1',
		find_at: new Date(2020, 8, 21, 17, 10, 6),
	}
	getRewordRecordById.withArgs(2).resolves({
		id: 2,
		commit_lower_limit: 20,
		commit_upper_limit: 400,
		reward: '20000000000000000000',
		rank: 2,
	})
	const res = await getAlreadyClaimRewardInfo(
		dummyRewward,
		dummyClaimUrl
	)
	t.is(res.body.reward, '20000000000000000000')
	t.is(res.body.is_rank_down, false)
	t.is((res.body.find_at as Date).getTime(), new Date(2020, 8, 21, 17, 10, 6).getTime())
	t.is(res.status, 200)
})
test('After the claim url has already been distributed.(Distribution rewards have been cut)', async (t) => {
	const dummyRewward = {
		id: 4,
		commit_lower_limit: 20,
		commit_upper_limit: 400,
		reward: '40000000000000000000',
		rank: 2,
	}
	const dummyClaimUrl = {
		id: 3,
		uuid: '2xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
		claim_url: 'http://hogehoge1',
		reward_id: 3,
		github_id: 'github-1',
		find_at: new Date(2020, 8, 21, 17, 10, 7),
	}
	getRewordRecordById.withArgs(3).resolves({
		id: 3,
		commit_lower_limit: 20,
		commit_upper_limit: 400,
		reward: '30000000000000000000',
		rank: 2,
	})
	const res = await getAlreadyClaimRewardInfo(
		dummyRewward,
		dummyClaimUrl
	)
	t.is(res.body.reward, '30000000000000000000')
	t.is(res.body.is_rank_down, true)
	t.is((res.body.find_at as Date).getTime(), new Date(2020, 8, 21, 17, 10, 7).getTime())
	t.is(res.status, 200)
})
test.after(() => {
	getClaimUrlInfo.restore()
	getRewordRecordById.restore()
})
