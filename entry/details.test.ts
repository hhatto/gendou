/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { getAirdropIfo, addEntryInfo } from './details'
import * as github_graphql_modules from '../common/github/graphql'
import * as entry_modules from '../common/db/entry'
import * as reward_modules from '../common/reward'
import * as already_claimed_modules from '../common/db/already_claimed'
import { UndefinedOr } from '@devprotocol/util-ts'
import { PrismaClient, Prisma, reward } from '.prisma/client'

let getIdFromGraphQL: sinon.SinonStub<[token: string], Promise<string>>
let insertEntry: sinon.SinonStub<
	[
		client: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>,
		githubId: string,
		address: string,
		sign: string,
		rewardId: number
	],
	Promise<boolean>
>
let updateEntry: sinon.SinonStub<
	[
		client: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>,
		githubId: string,
		address: string,
		sign: string,
		rewardId: number
	],
	Promise<boolean>
>
let getEntry: sinon.SinonStub<
	[
		client: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>,
		githubId: string
	],
	Promise<any>
>
let getRewardFromGithubId: sinon.SinonStub<
	[
		dbClient: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>,
		githubId: string
	],
	Promise<readonly [UndefinedOr<reward>, number]>
>
let isAlreadyClaimed: sinon.SinonStub<
	[
		client: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>,
		githubId: string
	],
	Promise<boolean>
>

test.before(() => {
	getIdFromGraphQL = sinon.stub(github_graphql_modules, 'getIdFromGraphQL')
	insertEntry = sinon.stub(entry_modules, 'insertEntry')
	updateEntry = sinon.stub(entry_modules, 'updateEntry')
	getEntry = sinon.stub(entry_modules, 'getEntry')
	getRewardFromGithubId = sinon.stub(reward_modules, 'getRewardFromGithubId')
	isAlreadyClaimed = sinon.stub(already_claimed_modules, 'isAlreadyClaimed')
})

// getAirdropIfo
test('get airdrop info', async (t) => {
	const sign =
		'0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c'
	getIdFromGraphQL.withArgs('access_token1').resolves('git-id1')
	isAlreadyClaimed.withArgs({ db: true } as any, 'git-id1').resolves(false)
	getRewardFromGithubId
		.withArgs({ db: true } as any, 'git-id1')
		.resolves({ id: 1 } as any)
	const res = await getAirdropIfo({ db: true } as any, {
		accessToken: 'access_token1',
		sign: sign,
	})
	t.is(res!.githubId, 'git-id1')
	t.is(res!.address, '0x3CbDbAfE2585F4991CEf5A5D2870F68D661b3943')
	t.is(res!.sign, sign)
	t.is(res!.rewardId, 1)
})

test('not get access token', async (t) => {
	const res = await getAirdropIfo({ db: true } as any, {
		accessToken: 'conde2',
		sign: 'sign2',
	})
	t.is(typeof res, 'undefined')
})

test('not get github id', async (t) => {
	const res = await getAirdropIfo({ db: true } as any, {
		accessToken: 'conde3',
		sign: 'sign3',
	})
	t.is(typeof res, 'undefined')
})

test('already claimed', async (t) => {
	getIdFromGraphQL.withArgs('access_token4').resolves('git-id4')
	isAlreadyClaimed.withArgs({ db: true } as any, 'git-id4').resolves(true)
	const res = await getAirdropIfo({ db: true } as any, {
		accessToken: 'access_token4',
		sign: 'sign4',
	})
	t.is(typeof res, 'undefined')
})

test('not get reward record', async (t) => {
	const sign =
		'0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c'
	getIdFromGraphQL.withArgs('access_token5').resolves('git-id5')
	isAlreadyClaimed.withArgs({ db: true } as any, 'git-id5').resolves(false)
	const res = await getAirdropIfo({ db: true } as any, {
		accessToken: 'access_token5',
		sign: sign,
	})
	t.is(typeof res, 'undefined')
})

test('get different address', async (t) => {
	const sign =
		'0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c'
	getIdFromGraphQL.withArgs('access_token6').resolves('git-id6')
	isAlreadyClaimed.withArgs({ db: true } as any, 'git-id6').resolves(false)
	getRewardFromGithubId
		.withArgs({ db: true } as any, 'git-id6')
		.resolves({ id: 6 } as any)
	const res = await getAirdropIfo({ db: true } as any, {
		accessToken: 'access_token6',
		sign: sign,
	})
	t.is(res!.githubId, 'git-id6')
	t.is(res!.address, '0x3068654E119C6DE06bdc0b9a1742ba3211feC7D0')
	t.is(res!.sign, sign)
	t.is(res!.rewardId, 6)
})

// addEntryInfo
test('insert entry data', async (t) => {
	getEntry.withArgs({ db: true } as any, 'githubid5').resolves(undefined)
	insertEntry
		.withArgs({ db: true } as any, 'githubid5', 'address5', 'sign5', 5)
		.resolves(true)
	const res = await addEntryInfo({ db: true } as any, {
		githubId: 'githubid5',
		address: 'address5',
		sign: 'sign5',
		rewardId: 5,
	})
	t.is(res, true)
})

test('failed insert entry data', async (t) => {
	getEntry.withArgs({ db: true } as any, 'githubid6').resolves(undefined)
	insertEntry
		.withArgs({ db: true } as any, 'githubid6', 'address6', 'sign6', 6)
		.resolves(false)
	const res = await addEntryInfo({ db: true } as any, {
		githubId: 'githubid6',
		address: 'address6',
		sign: 'sign6',
		rewardId: 6,
	})
	t.is(res, false)
})

test('update entry data', async (t) => {
	getEntry.withArgs({ db: true } as any, 'githubid7').resolves({})
	updateEntry
		.withArgs({ db: true } as any, 'githubid7', 'address7', 'sign7', 7)
		.resolves(true)
	const res = await addEntryInfo({ db: true } as any, {
		githubId: 'githubid7',
		address: 'address7',
		sign: 'sign7',
		rewardId: 7,
	})
	t.is(res, true)
})

test('failed update entry data', async (t) => {
	getEntry.withArgs({ db: true } as any, 'githubid8').resolves({})
	updateEntry
		.withArgs({ db: true } as any, 'githubid8', 'address8', 'sign8', 8)
		.resolves(false)
	const res = await addEntryInfo({ db: true } as any, {
		githubId: 'githubid8',
		address: 'address8',
		sign: 'sign8',
		rewardId: 8,
	})
	t.is(res, false)
})

test.after(() => {
	getIdFromGraphQL.restore()
	getEntry.restore()
	insertEntry.restore()
	updateEntry.restore()
	getRewardFromGithubId.restore()
	isAlreadyClaimed.restore()
})
