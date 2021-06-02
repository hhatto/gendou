// /* eslint-disable @typescript-eslint/ban-types */
// /* eslint-disable prettier/prettier */
// /* eslint-disable functional/no-let */
// /* eslint-disable functional/prefer-readonly-type */

// import test from 'ava'
// import sinon from 'sinon'
// import { main } from './main'
// import * as reward_modules from '../common/db/reward'
// import * as db_common_modules from '../common/db/db'
// import * as claim_url_modules from '../common/db/claim-url'
// import * as graph_ql_modules from '../common/github/graphql'
// import * as detail_modules from './details'
// import { UndefinedOr } from '@devprotocol/util-ts'
// import { PrismaClient, claim_url, reward, Prisma } from '.prisma/client'

// let getCommitCount: sinon.SinonStub<[githubId: string], Promise<number>>
// let getClaimUrlRecordByGithubId: sinon.SinonStub<[client: PrismaClient, githubId: string], Promise<UndefinedOr<claim_url>>>
// let getRewordRecordByCommitCount: sinon.SinonStub<[client: PrismaClient, commitCount: number], Promise<UndefinedOr<reward>>>
// let getRewardInfo: sinon.SinonStub<[client: PrismaClient, rewardRecord: reward], Promise<ApiResponce>>
// let getAlreadyClaimRewardInfo: sinon.SinonStub<[client: PrismaClient, rewardRecord: reward, findClaimUrlRecord: claim_url], Promise<ApiResponce>>
// let getDbClient: sinon.SinonStub<[option?: {} | undefined], PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>>
// let close: sinon.SinonStub<[client: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>], Promise<boolean>>

// test.before(() => {
// 	getCommitCount = sinon.stub(graph_ql_modules, 'getCommitCount')
// 	getRewordRecordByCommitCount = sinon.stub(reward_modules, 'getRewordRecordByCommitCount')
// 	getClaimUrlRecordByGithubId = sinon.stub(claim_url_modules, 'getClaimUrlRecordByGithubId')
// 	getRewardInfo = sinon.stub(detail_modules, 'getRewardInfo')
// 	getAlreadyClaimRewardInfo = sinon.stub(detail_modules, 'getAlreadyClaimRewardInfo')
// 	getDbClient = sinon.stub(db_common_modules, 'getDbClient')
// 	close = sinon.stub(db_common_modules, 'close')
// })

// test('The url is already assigned.', async (t) => {
// 	const dummyRewward = {
// 		id: 0,
// 		commit_lower_limit: 10,
// 		commit_upper_limit: 200,
// 		reward: '10000000000000000000',
// 		rank: 1,
// 	}
// 	const dummyClaimUrl = {
// 		id: 0,
// 		uuid: '2xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
// 		claim_url: 'http://hogehoge1',
// 		reward_id: 1,
// 		github_id: 'github-1',
// 		find_at: new Date(2020, 8, 21, 17, 10, 5),
// 	}
// 	getDbClient.returns({db: true} as any)
// 	getCommitCount.withArgs('github-1').resolves(100)
// 	getRewordRecordByCommitCount.withArgs({db: true} as any, 100).resolves(dummyRewward)
// 	getClaimUrlRecordByGithubId.withArgs({db: true} as any, 'github-1').resolves(dummyClaimUrl)
// 	getAlreadyClaimRewardInfo.withArgs({db: true} as any, dummyRewward, dummyClaimUrl).resolves({
// 		status: 200,
// 		body: {
// 			dummy_key: 'dummy_value'
// 		}
// 	})
// 	close.withArgs({db: true} as any).resolves(true)
// 	const res = await main('github-1')
// 	t.is(res.body.dummy_key, 'dummy_value')

// 	t.is(res.status, 200)
// })

// test('Distribution information can be obtained.', async (t) => {
// 	const dummyRewward = {
// 		id: 1,
// 		commit_lower_limit: 10,
// 		commit_upper_limit: 200,
// 		reward: '10000000000000000000',
// 		rank: 2,
// 	}
// 	getDbClient.returns({db: true} as any)
// 	getCommitCount.withArgs('github-2').resolves(200)
// 	getRewordRecordByCommitCount.withArgs({db: true} as any, 200).resolves(dummyRewward)
// 	getRewardInfo.withArgs({db: true} as any, dummyRewward).resolves({
// 		status: 200,
// 		body: {
// 			dummy_key: 'dummy_value2'
// 		}
// 	})
// 	close.withArgs({db: true} as any).resolves(true)
// 	const res = await main('github-2')
// 	t.is(res.body.dummy_key, 'dummy_value2')
// 	t.is(res.status, 200)
// })

// test('db close error.', async (t) => {
// 	const dummyRewward = {
// 		id: 4,
// 		commit_lower_limit: 10,
// 		commit_upper_limit: 200,
// 		reward: '10000000000000000000',
// 		rank: 2,
// 	}
// 	getDbClient.returns({db: false} as any)
// 	getCommitCount.withArgs('github-4').resolves(400)
// 	getRewordRecordByCommitCount.withArgs({db: false} as any, 400).resolves(dummyRewward)
// 	getRewardInfo.withArgs({db: false} as any, dummyRewward).resolves({
// 		status: 200,
// 		body: {
// 			dummy_key: 'dummy_value4'
// 		}
// 	})
// 	close.withArgs({db: false} as any).resolves(false)
// 	const res = await main('github-2')
// 	t.is(res.body.message, 'db error')
// 	t.is(res.status, 200)
// })

// test('Incorrect reward information.', async (t) => {
// 	getDbClient.returns({db: true} as any)
// 	getCommitCount.withArgs('github-3').resolves(300)
// 	close.withArgs({db: true} as any).resolves(true)
// 	const res = await main('github-3')
// 	t.is(res.body.message, 'not applicable')
// 	t.is(res.status, 200)
// })

// test.after(() => {
// 	getCommitCount.restore()
// 	getClaimUrlRecordByGithubId.restore()
// 	getRewordRecordByCommitCount.restore()
// 	getRewardInfo.restore()
// 	getAlreadyClaimRewardInfo.restore()
// 	getDbClient.restore()
// 	close.restore()
// })
