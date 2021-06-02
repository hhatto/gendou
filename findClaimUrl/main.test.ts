// /* eslint-disable @typescript-eslint/ban-types */
// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// /* eslint-disable functional/no-let */
// /* eslint-disable functional/prefer-readonly-type */

// import test from 'ava'
// import sinon from 'sinon'
// import { main } from './main'
// import { UndefinedOr } from '@devprotocol/util-ts'
// import * as token_modules from '../common/github/token'
// import * as graphql_modules from '../common/github/graphql'
// import * as reward_modules from '../common/db/reward'
// import * as detail_modules from './details'
// import * as db_common_modules from '../common/db/db'
// import { reward } from '.prisma/client'
// import { PrismaClient, Prisma } from '@prisma/client'

// let getApiTokenFromCode: sinon.SinonStub<[code: string], Promise<string>>
// let getCommitCountAndId: sinon.SinonStub<
// 	[token: string],
// 	Promise<GithubIdAndCommitCount>
// >
// let getRewordRecordByCommitCount: sinon.SinonStub<
// 	[client: PrismaClient, commitCount: number],
// 	Promise<UndefinedOr<reward>>
// >
// let claimUrl: sinon.SinonStub<
// 	[client: PrismaClient, githubId: string, rewardRecord: reward],
// 	Promise<ApiResponce>
// >

// let getDbClient: sinon.SinonStub<
// 	[option?: {} | undefined],
// 	PrismaClient<
// 		Prisma.PrismaClientOptions,
// 		never,
// 		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
// 	>
// >
// let close: sinon.SinonStub<
// 	[
// 		client: PrismaClient<
// 			Prisma.PrismaClientOptions,
// 			never,
// 			Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
// 		>
// 	],
// 	Promise<boolean>
// >

// test.before(() => {
// 	getApiTokenFromCode = sinon.stub(token_modules, 'getApiTokenFromCode')
// 	getCommitCountAndId = sinon.stub(graphql_modules, 'getCommitCountAndId')
// 	getRewordRecordByCommitCount = sinon.stub(
// 		reward_modules,
// 		'getRewordRecordByCommitCount'
// 	)
// 	claimUrl = sinon.stub(detail_modules, 'claimUrl')
// 	getDbClient = sinon.stub(db_common_modules, 'getDbClient')
// 	close = sinon.stub(db_common_modules, 'close')
// })

// test('successful processing.', async (t) => {
// 	getDbClient.returns({ db: true } as any)
// 	getApiTokenFromCode.withArgs('code1').resolves('token1')
// 	getCommitCountAndId.withArgs('token1').resolves({
// 		githubId: 'github-id1',
// 		commitCount: 300,
// 	})
// 	getRewordRecordByCommitCount.withArgs({ db: true } as any, 300).resolves({
// 		id: 1,
// 	} as any)
// 	claimUrl
// 		.withArgs({ db: true } as any, 'github-id1', { id: 1 } as any)
// 		.resolves({
// 			status: 200,
// 			body: {
// 				key: 'value',
// 			},
// 		})
// 	close.withArgs({ db: true } as any).resolves(true)
// 	const result = await main('code1')
// 	t.is(result.status, 200)
// 	t.is(result.body.key, 'value')
// })

// test('db error.', async (t) => {
// 	getDbClient.returns({ db: false } as any)
// 	getApiTokenFromCode.withArgs('code3').resolves('token3')
// 	getCommitCountAndId.withArgs('token3').resolves({
// 		githubId: 'github-id3',
// 		commitCount: 2300,
// 	})
// 	getRewordRecordByCommitCount.withArgs({ db: false } as any, 2300).resolves({
// 		id: 3,
// 	} as any)
// 	claimUrl
// 		.withArgs({ db: false } as any, 'github-id3', { id: 3 } as any)
// 		.resolves({
// 			status: 200,
// 			body: {
// 				key: 'value3',
// 			},
// 		})
// 	close.withArgs({ db: false } as any).resolves(false)
// 	const result = await main('code3')
// 	t.is(result.status, 200)
// 	t.is(result.body.message, 'db error')
// })

// test('not applicable.', async (t) => {
// 	getDbClient.returns({ db: true } as any)
// 	getApiTokenFromCode.withArgs('code2').resolves('token2')
// 	getCommitCountAndId.withArgs('token2').resolves({
// 		githubId: 'github-id2',
// 		commitCount: 1300,
// 	})
// 	getRewordRecordByCommitCount
// 		.withArgs({ db: true } as any, 1300)
// 		.resolves(undefined)
// 	close.withArgs({ db: true } as any).resolves(true)
// 	const result = await main('code2')
// 	t.is(result.status, 200)
// 	t.is(result.body.message, 'not applicable')
// })

// test.after(() => {
// 	getApiTokenFromCode.restore()
// 	getCommitCountAndId.restore()
// 	getRewordRecordByCommitCount.restore()
// 	claimUrl.restore()
// 	getDbClient.restore()
// 	close.restore()
// })
