/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { PrismaClient, Prisma } from '.prisma/client'
import { Context } from '@azure/functions'
import { generateHttpRequest } from '../common/test-utils'
import * as db_modules from '../common/db/db'
import * as entry_modules from '../common/db/entry'
import * as airdrop_modules from '../common/db/airdrop'
import httpTrigger from './index'

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
let getEntryByAddress: sinon.SinonStub<
	[
		client: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>,
		address: string
	],
	Promise<any>
>
let getAirdrop: sinon.SinonStub<
	[
		client: PrismaClient<
			Prisma.PrismaClientOptions,
			never,
			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
		>,
		address: string
	],
	Promise<any>
>

test.before(() => {
	getDbClient = sinon.stub(db_modules, 'getDbClient')
	close = sinon.stub(db_modules, 'close')
	getEntryByAddress = sinon.stub(entry_modules, 'getEntryByAddress')
	getAirdrop = sinon.stub(airdrop_modules, 'getAirdrop')
	getDbClient.returns({ db: true } as any)
})

test.after(() => {
	getDbClient.restore()
	close.restore()
	getEntryByAddress.restore()
	getAirdrop.restore()
})

const ctx = {
	log: (msg: any) => msg,
}

test('success', async (t) => {
	const address = '0xD3e5D9c622D536cC07d085a72A825c323d8BEDBa'
	const sign =
		'0x4cd4e0e013519918406d5059e9a0eaa3122ead8d5e02009e1787a36a623b864554e9ccb4a70b2954a67942c83180c92055c844fb22657614adf518a9c42d493e1c'

	getEntryByAddress.withArgs({ db: true } as any, address).resolves({ address })
	getAirdrop
		.withArgs({ db: true } as any, address)
		.resolves({ reward: '100', address })

	const res = await httpTrigger(
		ctx as unknown as Context,
		generateHttpRequest({}, { address, sign })
	)
	t.is(res.body.reward, '100')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('params is not found', async (t) => {
	const res = await httpTrigger(
		ctx as unknown as Context,
		generateHttpRequest({}, {})
	)
	t.is(res.body.message, 'invalid request')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('incorrect params', async (t) => {
	const address = '0x000'
	const sign = 'dummy sign message'
	const res = await httpTrigger(
		ctx as unknown as Context,
		generateHttpRequest({}, { address, sign })
	)
	t.is(res.body.message, 'invalid request')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('entry is not found', async (t) => {
	const address = '0xD3e5D9c622D536cC07d085a72A825c323d8BEDBa'
	const sign =
		'0x4cd4e0e013519918406d5059e9a0eaa3122ead8d5e02009e1787a36a623b864554e9ccb4a70b2954a67942c83180c92055c844fb22657614adf518a9c42d493e1c'

	getEntryByAddress.withArgs({ db: true } as any, address).resolves(undefined)
	getAirdrop
		.withArgs({ db: true } as any, address)
		.resolves({ reward: '100', address })

	const res = await httpTrigger(
		ctx as unknown as Context,
		generateHttpRequest({}, { address, sign })
	)
	t.is(res.body.reward, '0')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('airdrop is not found', async (t) => {
	const address = '0xD3e5D9c622D536cC07d085a72A825c323d8BEDBa'
	const sign =
		'0x4cd4e0e013519918406d5059e9a0eaa3122ead8d5e02009e1787a36a623b864554e9ccb4a70b2954a67942c83180c92055c844fb22657614adf518a9c42d493e1c'

	getEntryByAddress.withArgs({ db: true } as any, address).resolves({ address })
	getAirdrop.withArgs({ db: true } as any, address).resolves(undefined)

	const res = await httpTrigger(
		ctx as unknown as Context,
		generateHttpRequest({}, { address, sign })
	)
	t.is(res.body.reward, '0')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})
