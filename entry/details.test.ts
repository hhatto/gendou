/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { getAirdropIfo, addEntryInfo } from './details'
import * as github_token_modules from '../common/github/token'
import * as github_graphql_modules from '../common/github/graphql'
import * as db_modules from '../common/db/db'
import * as entry_modules from '../common/db/entry'
import { UndefinedOr } from '@devprotocol/util-ts'
import { PrismaClient, Prisma } from '.prisma/client'

let getApiTokenFromCode: sinon.SinonStub<[code: string], Promise<UndefinedOr<string>>>
let getIdFromGraphQL: sinon.SinonStub<[token: string], Promise<string>>
let getDbClient: sinon.SinonStub<[option?: {} | undefined], PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>>
let insertEntry: sinon.SinonStub<[client: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, githubId: string, address: string, sign: string], Promise<boolean>>
let close: sinon.SinonStub<[client: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>], Promise<boolean>>

test.before(() => {
	getApiTokenFromCode = sinon.stub(github_token_modules, 'getApiTokenFromCode')
	getIdFromGraphQL = sinon.stub(github_graphql_modules, 'getIdFromGraphQL')
	getDbClient = sinon.stub(db_modules, 'getDbClient')
	insertEntry = sinon.stub(entry_modules, 'insertEntry')
	close = sinon.stub(db_modules, 'close')
})

// getAirdropIfo
test('get airdrop info', async (t) => {
	const sign = '0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c'
	getApiTokenFromCode.withArgs('conde1').resolves('access_token1')
	getIdFromGraphQL.withArgs('access_token1').resolves('git-id1')
	const res = await getAirdropIfo({ code: 'conde1', sign: sign })
	t.is(res!.githubId, 'git-id1')
	t.is(res!.address, '0x3CbDbAfE2585F4991CEf5A5D2870F68D661b3943')
	t.is(res!.sign, sign)
})

test('not get access token', async (t) => {
	const res = await getAirdropIfo({ code: 'conde2', sign: 'sign2' })
	t.is(typeof res, 'undefined')
})

test('not get github id', async (t) => {
	getApiTokenFromCode.withArgs('conde3').resolves('access_token3')
	const res = await getAirdropIfo({ code: 'conde3', sign: 'sign3' })
	t.is(typeof res, 'undefined')
})

test('Return a different address', async (t) => {
	const sign = '0x4224782729b91ce60933779327701beed6f5a60f5b3ef38bcfc4698aa693af4a5899fc1e6fc6b4066f90b155a9926b08c0b78498bfe61020e018a7d071a1d1e81c'
	getApiTokenFromCode.withArgs('conde4').resolves('access_token4')
	getIdFromGraphQL.withArgs('access_token4').resolves('git-id4')
	const res = await getAirdropIfo({ code: 'conde4', sign: sign })
	t.is(res!.githubId, 'git-id4')
	t.is(res!.address, '0xbbd7072f2383cE37472B3921a959b6F479cf5Ab7')
	t.is(res!.sign, sign)
})

test('insert entry data', async (t) => {
	getDbClient.returns({db:true} as any)
	insertEntry.withArgs({db:true} as any, 'githubid5', 'address5', 'sign5').resolves(true)
	close.withArgs({db:true} as any).resolves(undefined)
	const res = await addEntryInfo({ githubId: 'githubid5', address: 'address5', sign: 'sign5' })
	t.is(res, true)
})

test('failed to insert entry data', async (t) => {
	getDbClient.returns({db:true} as any)
	insertEntry.withArgs({db:true} as any, 'githubid6', 'address6', 'sign6').resolves(false)
	close.withArgs({db:true} as any).resolves(undefined)
	const res = await addEntryInfo({ githubId: 'githubid6', address: 'address6', sign: 'sign6' })
	t.is(res, false)
})

test.after(() => {
	getApiTokenFromCode.restore()
	getIdFromGraphQL.restore()
	getDbClient.restore()
	insertEntry.restore()
	close.restore()
})
