/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
import test from 'ava'
import sinon from 'sinon'
import axios, { AxiosRequestConfig } from 'axios'
import { getApiTokenFromCode } from './token'

let post: sinon.SinonStub<
	[url: string, data?: any, config?: AxiosRequestConfig | undefined],
	Promise<unknown>
>

test.before(() => {
	post = sinon.stub(axios, 'post')
	process.env.GITHUB_CLIENT_ID = 'dummy-client-id'
	process.env.GITHUB_CLIENT_SECRETS = 'dummy-client-secret'
})

test('get api token.', async (t) => {
	const code = 'dummy-code'
	post
		.withArgs(
			'https://github.com/login/oauth/access_token',
			{
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRETS,
				code,
			},
			{
				responseType: 'json',
				headers: { Accept: 'application/json' },
			}
		)
		.resolves({
			status: 200,
			data: {
				access_token: 'dummy-access-token',
			},
		})

	const result = await getApiTokenFromCode(code)
	t.is(result, 'dummy-access-token')
})

test('fail.', async (t) => {
	const code = 'dummy-fail-code'
	post
		.withArgs(
			'https://github.com/login/oauth/access_token',
			{
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRETS,
				code,
			},
			{
				responseType: 'json',
				headers: { Accept: 'application/json' },
			}
		)
		.resolves({
			status: 401,
		})

	const result = await getApiTokenFromCode(code)
	t.is(typeof result, 'undefined')
})

test.after(() => {
	post.restore()
})

// use token
// getCommitCount
// test('get commit count.', async (t) => {
// 	process.env.GITHUB_CLIENT_ID = '6d3ef2327afe876bd74e'
// 	process.env.GITHUB_CLIENT_SECRETS = '2dc453360be21b3782045a966ac88985a62dfc54'
// 	const result = await getApiTokenFromCode('3047bcd560892aa96dd9')
// 	t.is(result, '')
// })
