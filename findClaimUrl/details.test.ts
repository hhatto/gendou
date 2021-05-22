/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { claimUrl } from './details'
import * as db_utils_info_modules from '../common/db/utils/info'
import * as claim_url_modules from '../common/db/claim-url'
import * as rewaed_modules from '../common/db/reward'
import { claim_url, reward } from '.prisma/client'
import { UndefinedOr } from '@devprotocol/util-ts'

let getClaimUrlInfo: sinon.SinonStub<[rewardRecord: reward], Promise<UndefinedOr<ClaimUrlInfo>>>
let updateGitHubIdAndFindAt: sinon.SinonStub<[claimUrlId: number, githubId: string], Promise<boolean>>
let getRewordRecordById: sinon.SinonStub<[id: number], Promise<UndefinedOr<reward>>>
let createClaimUrlInfo: sinon.SinonStub<[rewardRecord: reward, claimUrlRecord: claim_url], Promise<UndefinedOr<ClaimUrlInfo>>>
let getClaimUrlRecordByGithubId: sinon.SinonStub<[githubId: string], Promise<UndefinedOr<claim_url>>>

test.before(() => {
	getClaimUrlInfo = sinon.stub(db_utils_info_modules, 'getClaimUrlInfo')
	updateGitHubIdAndFindAt = sinon.stub(claim_url_modules, 'updateGitHubIdAndFindAt')
	getRewordRecordById = sinon.stub(rewaed_modules, 'getRewordRecordById')
	createClaimUrlInfo = sinon.stub(db_utils_info_modules, 'createClaimUrlInfo')
	getClaimUrlRecordByGithubId = sinon.stub(claim_url_modules, 'getClaimUrlRecordByGithubId')
})

test('get claim url and update record.', async (t) => {
	getClaimUrlInfo.withArgs({id: 1} as any).resolves({
		claimUrl: {
			id: 1,
			claim_ul: 'http://hogehoge1'
		},
		reward: '5000000',
		isRankDown: false
	} as ClaimUrlInfo)
	updateGitHubIdAndFindAt.withArgs(1, 'github-id1').resolves(true)
	const res = await claimUrl(
		'github-id1',
		{id: 1} as any
	)
	t.is(res.body.reward, '5000000')
	t.is(res.body.is_rank_down, false)
	t.is(res.body.claim_url, 'http://hogehoge1')
	t.is(res.body.github_id, 'github-id1')
	t.is(res.status, 200)
})

test('can not get claim url.', async (t) => {
	const res = await claimUrl(
		'github-id2',
		{id: 2} as any
	)
	t.is(res.body.message, 'there are no more rewards to distribute')
	t.is(res.status, 200)
})

test('get claim url, but can not update record.', async (t) => {
	getClaimUrlInfo.withArgs({id: 3} as any).resolves({
		claimUrl: {
			id: 3,
			claim_ul: 'http://hogehoge1'
		},
		reward: '3000000',
		isRankDown: true
	} as ClaimUrlInfo)
	updateGitHubIdAndFindAt.withArgs(3, 'github-id3').resolves(false)
	const res = await claimUrl(
		'github-id3',
		{id: 3} as any
	)
	t.is(res.body.message, 'not updated')
	t.is(res.status, 200)
})

test('already claim', async (t) => {
	getClaimUrlRecordByGithubId.withArgs('github-id4').resolves({
		reward_id: 4
	} as any)
	getRewordRecordById.withArgs(4).resolves({
		id: 4
	} as any)
	createClaimUrlInfo.withArgs({id: 4} as any, {reward_id: 4} as any).resolves({
		reward: '400000000000000000',
		isRankDown: true,
		claimUrl: {
			claim_url: 'http://hogehoge4'
		}
	} as any)
	const res = await claimUrl(
		'github-id4',
		{id: 4} as any
	)
	t.is(res.body.reward, '400000000000000000')
	t.is(res.body.is_rank_down, true)
	t.is(res.body.claim_url, 'http://hogehoge4')
	t.is(res.body.github_id, 'github-id4')
	t.is(res.status, 200)
})

test('already claim(illegal reward id)', async (t) => {
	getClaimUrlRecordByGithubId.withArgs('github-id5').resolves({
		reward_id: 5
	} as any)
	const res = await claimUrl(
		'github-id5',
		{id: 5} as any
	)
	t.is(res.body.message, 'illegal reward id')
	t.is(res.status, 200)
})

test.after(() => {
	getClaimUrlInfo.restore()
	updateGitHubIdAndFindAt.restore()
	getRewordRecordById.restore()
	createClaimUrlInfo.restore()
	getClaimUrlRecordByGithubId.restore()
})
