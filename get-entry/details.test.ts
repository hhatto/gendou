/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import { getEntryInfo } from './details'
import * as db_modules from '../common/db/db'
import * as entry_modules from '../common/db/entry'
import * as reward_modules from '../common/db/reward'
import * as github_graphql_modules from '../common/github/graphql'
import { UndefinedOr } from '@devprotocol/util-ts'
import { PrismaClient, Prisma, entry, reward } from '.prisma/client'

let getIdFromGraphQL: sinon.SinonStub<[token: string], Promise<string>>
let getDbClient: sinon.SinonStub<[option?: {} | undefined], PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>>
let getEntry: sinon.SinonStub<[client: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, githubId: string], Promise<UndefinedOr<entry>>>
let getRewordRecordById: sinon.SinonStub<[client: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, id: number], Promise<UndefinedOr<reward>>>
let close: sinon.SinonStub<[client: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>], Promise<boolean>>

test.before(() => {
	getIdFromGraphQL = sinon.stub(github_graphql_modules, 'getIdFromGraphQL')
	getDbClient = sinon.stub(db_modules, 'getDbClient')
	close = sinon.stub(db_modules, 'close')
	getEntry = sinon.stub(entry_modules, 'getEntry')
	getRewordRecordById = sinon.stub(reward_modules, 'getRewordRecordById')
})

// success
test('get entry info ', async (t) => {
	getIdFromGraphQL.withArgs('token1').resolves('github-id1')
	getDbClient.returns({db: true} as any)
	getEntry.withArgs({db: true} as any, 'github-id1').resolves({id: 1, reward_id: 10} as any)
	getRewordRecordById.withArgs({db: true} as any, 10).resolves({id: 10} as any)
	const result = await getEntryInfo('token1')
	t.is(result![0].id, 1)
	t.is(result![0].reward_id, 10)
	t.is(result![1].id, 10)
})

// error
test('not found entry data.', async (t) => {
	getIdFromGraphQL.withArgs('token2').resolves('github-id2')
	getDbClient.returns({db: true} as any)
	const result = await getEntryInfo('token2')
	t.true(typeof result === 'undefined')
})

test('not found reward data.', async (t) => {
	getIdFromGraphQL.withArgs('token3').resolves('github-id3')
	getDbClient.returns({db: true} as any)
	getEntry.withArgs({db: true} as any, 'github-id3').resolves({id: 3, reward_id: 30} as any)
	const result = await getEntryInfo('token3')
	t.true(typeof result === 'undefined')
})

test.after(() => {
	getIdFromGraphQL.restore()
	getDbClient.restore()
	getEntry.restore()
	getRewordRecordById.restore()
	close.restore()
})
