/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import { Context } from '@azure/functions'
import * as details_modules from './details'
import * as db_modules from '../common/db/db'
import { generateHttpRequest } from '../common/test-utils'
import { UndefinedOr } from '@devprotocol/util-ts'
import { PrismaClient, Prisma } from '.prisma/client'

let getAirdropIfo: sinon.SinonStub<
	[
		client: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>,
		params: ParamsOfEntryApi
	],
	Promise<UndefinedOr<AirdropInfo>>
>
let addEntryInfo: sinon.SinonStub<
	[
		client: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>,
		info: AirdropInfo
	],
	Promise<boolean>
>
let getDbClient: sinon.SinonStub<
	[option?: {} | undefined],
	PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
	>
>
let close: sinon.SinonStub<
	[
		client: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>
	],
	Promise<boolean>
>

test.before(() => {
	getAirdropIfo = sinon.stub(details_modules, 'getAirdropIfo')
	addEntryInfo = sinon.stub(details_modules, 'addEntryInfo')
	getDbClient = sinon.stub(db_modules, 'getDbClient')
	close = sinon.stub(db_modules, 'close')
	getDbClient.returns({ db: true } as any)
})

test('get reward info', async (t) => {
	getAirdropIfo
		.withArgs({ db: true } as any, {
			accessToken: 'conde1',
			sign: 'sign1',
		})
		.resolves({
			githubId: 'github1',
			address: 'address1',
			sign: 'sign1',
			rewardId: 1,
			contributionCount: 100
		})
	addEntryInfo
		.withArgs({ db: true } as any, {
			githubId: 'github1',
			address: 'address1',
			sign: 'sign1',
			rewardId: 1,
			contributionCount: 100
		})
		.resolves(true)
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { access_token: 'conde1', sign: 'sign1' })
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

test('get info error', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { access_token: 'conde3', sign: 'sign3' })
	)
	t.is(res.body.message, 'get info error')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('db error', async (t) => {
	getAirdropIfo
		.withArgs({ db: true } as any, {
			accessToken: 'conde4',
			sign: 'sign4',
		})
		.resolves({
			githubId: 'github4',
			address: 'address4',
			sign: 'sign4',
			rewardId: 4,
			contributionCount: 400
		})
	addEntryInfo
		.withArgs({ db: true } as any, {
			githubId: 'github4',
			address: 'address4',
			sign: 'sign4',
			rewardId: 4,
			contributionCount: 400
		})
		.resolves(false)
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { access_token: 'conde4', sign: 'sign4' })
	)
	t.is(res.body.message, 'db error')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.after(() => {
	getAirdropIfo.restore()
	addEntryInfo.restore()
	getDbClient.restore()
	close.restore()
})
