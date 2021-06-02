/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { bignumber, BigNumber } from 'mathjs'
import { getRewardApiResponce, getRewardFromGithubId } from './reward'
import * as reward_modules from './db/reward'
import * as db_common_modules from './db/db'
import * as already_claimed_modules from './db/already_claimed'
import * as contributions_modules from './contributions/main'
import * as utils_modules from './utils'

import { UndefinedOr } from '@devprotocol/util-ts'
import { PrismaClient, reward, Prisma } from '.prisma/client'

let getDbClient: sinon.SinonStub<[option?: {} | undefined], PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>>
let isAlreadyClaimed: sinon.SinonStub<[client: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, githubId: string], Promise<boolean>>
let close: sinon.SinonStub<[client: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>], Promise<boolean>>
let caluculateContriburionsCount: sinon.SinonStub<[githubId: string], Promise<readonly BigNumber[]>>
let calculateGeometricMean: sinon.SinonStub<[readonly BigNumber[]], BigNumber>
let getRewordRecordByCommitCount: sinon.SinonStub<[client: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, commitCount: number], Promise<UndefinedOr<reward>>>


test.before(() => {
	getDbClient = sinon.stub(db_common_modules, 'getDbClient')
	close = sinon.stub(db_common_modules, 'close')
	isAlreadyClaimed = sinon.stub(already_claimed_modules, 'isAlreadyClaimed')
	caluculateContriburionsCount = sinon.stub(contributions_modules, 'caluculateContriburionsCount')
	calculateGeometricMean = sinon.stub(utils_modules, 'calculateGeometricMean')
	getRewordRecordByCommitCount = sinon.stub(reward_modules, 'getRewordRecordByCommitCount')
})

// error
test('reward is already claimed.', async (t) => {
	getDbClient.returns({db: true} as any)
	isAlreadyClaimed.withArgs({db: true} as any, 'github-1').resolves(true)
	close.withArgs({db: true} as any).resolves(true)
	const res = await getRewardApiResponce('github-1')
	t.is(res.body.message, 'already claimed')
	t.is(res.status, 400)
})

test('db close error.', async (t) => {
	getDbClient.returns({db: false} as any)
	isAlreadyClaimed.withArgs({db: false} as any, 'github-2').resolves(true)
	close.withArgs({db: false} as any).resolves(false)
	const res = await getRewardApiResponce('github-2')
	t.is(res.body.message, 'db error')
	t.is(res.status, 400)
})

test('reward is not found.', async (t) => {
	getDbClient.returns({db: true} as any)
	isAlreadyClaimed.withArgs({db: true} as any, 'github-3').resolves(false)
	close.withArgs({db: true} as any).resolves(true)
	caluculateContriburionsCount.withArgs('github-3').resolves([bignumber(0), bignumber(1)])
	calculateGeometricMean.withArgs([bignumber(0), bignumber(1)]).returns(bignumber('1.5'))
	getRewordRecordByCommitCount.withArgs({db: true} as any, 1).resolves(undefined)
	const res = await getRewardApiResponce('github-3')
	t.is(res.body.message, 'not applicable')
	t.is(res.status, 200)
})

// success
test('get reward.', async (t) => {
	const dummyRewward = {
		id: 4,
		commit_lower_limit: 10,
		commit_upper_limit: 200,
		reward: '10000000000000000000',
		rank: 4,
	}
	getDbClient.returns({db: true} as any)
	isAlreadyClaimed.withArgs({db: true} as any, 'github-4').resolves(false)
	close.withArgs({db: true} as any).resolves(true)
	caluculateContriburionsCount.withArgs('github-4').resolves([bignumber(1), bignumber(2)])
	calculateGeometricMean.withArgs([bignumber(1), bignumber(2)]).returns(bignumber('2.5'))
	getRewordRecordByCommitCount.withArgs({db: true} as any, 2).resolves(dummyRewward)
	const res = await getRewardApiResponce('github-4')
	t.is(res.body.reward, '10000000000000000000')
	t.is(res.status, 200)
})

// success
test('get reward record.', async (t) => {
	const dummyRewward = {
		id: 5,
		commit_lower_limit: 10,
		commit_upper_limit: 200,
		reward: '10000000000000000000',
		rank: 5,
	}
	caluculateContriburionsCount.withArgs('github-5').resolves([bignumber(2), bignumber(3)])
	calculateGeometricMean.withArgs([bignumber(2), bignumber(3)]).returns(bignumber('3.5'))
	getRewordRecordByCommitCount.withArgs({db: true} as any, 3).resolves(dummyRewward)
	const res = await getRewardFromGithubId({db: true} as any, 'github-5')
	t.is(res!.id, 5)
	t.is(res!.commit_lower_limit, 10)
	t.is(res!.commit_upper_limit, 200)
	t.is(res!.reward, '10000000000000000000')
	t.is(res!.rank, 5)
})

test.after(() => {
	getDbClient.restore()
	close.restore()
	isAlreadyClaimed.restore()
	caluculateContriburionsCount.restore()
	calculateGeometricMean.restore()
	getRewordRecordByCommitCount.restore()
})
