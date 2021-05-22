/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
// import test from 'ava'
// import sinon from 'sinon'
// import bent from 'bent'
// import { getApiTokenFromCode } from './token'

// let bentFunc: sinon.SinonStub<[baseUrl: string, ...args: bent.Options[]], Promise<any>>

// test.before(() => {
// 	bentFunc = sinon.stub(bent, 'bent')
// })

// // getApiTokenFromCode
// test('If out of range, data cannot be acquired.', async (t) => {
// 	bentFunc.withArgs(1, 'github-id1').resolves(true)

// 	process.env.GITHUB_CLIENT_ID = '6d3ef2327afe876bd74e'
// 	process.env.GITHUB_CLIENT_SECRETS = '2dc453360be21b3782045a966ac88985a62dfc54'
// 	//public data only token
// 	const token = '663205d307ce24088b6d'
// 	const result = await getApiTokenFromCode(token)
// 	t.is(result, 'Akira-Taniguchi')
// })

// test.after(() => {
// 	bentFunc.restore()
// })
