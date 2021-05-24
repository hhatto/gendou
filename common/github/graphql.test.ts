/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
import test from 'ava'
import sinon from 'sinon'
import { getSearchDate } from '../utils'
import * as octokit_modules from '@octokit/graphql'
import { getCommitCount, getCommitCountAndId } from './graphql'
import { GraphQlResponse } from '@octokit/graphql/dist-types/types'
import { RequestParameters } from '@octokit/types'

let graphql: sinon.SinonStub<
	[query: string, parameters?: RequestParameters | undefined],
	GraphQlResponse<unknown>
>

test.before(() => {
	graphql = sinon.stub(octokit_modules, 'graphql')
})

// getCommitCount
test('get commit count.', async (t) => {
	const COMMIT_COUNT_QUERY = `
query getCommitCount($githubid: String!, $from: DateTime, $to: DateTime) {
  user(login: $githubid) {
    contributionsCollection(from: $from, to: $to) {
	  contributionCalendar {
	    totalContributions
	  }
	}
  }
}
`
	process.env.BASE_DATE = '2020-04-01'
	process.env.GITHUB_API_TOKEN = 'dummy-token'
	const searchDate = getSearchDate(process.env.BASE_DATE)
	const params = {
		githubid: 'hhatto',
		from: searchDate.from,
		to: searchDate.to,
		headers: {
			authorization: `token ${process.env.GITHUB_API_TOKEN}`,
		},
	}

	graphql.withArgs(COMMIT_COUNT_QUERY, params).resolves({
		user: {
			contributionsCollection: {
				contributionCalendar: {
					totalContributions: 2929,
				},
			},
		},
	})

	const result = await getCommitCount('hhatto')
	t.is(result, 2929)
})

// getCommitCountAndId
test('git commit count and id.', async (t) => {
	const COMMIT_COUNT_AND_ID_QUERY = `
query getUser($from: DateTime, $to: DateTime) {
	viewer {
    login
	contributionsCollection(from: $from, to: $to) {
	  contributionCalendar {
	    totalContributions
	  }
	}
  }
}
`
	process.env.BASE_DATE = '2020-04-01'
	const searchDate = getSearchDate(process.env.BASE_DATE)
	//public data only token
	const token = 'dummy-token'
	const params = {
		from: searchDate.from,
		to: searchDate.to,
		headers: {
			authorization: `token ${token}`,
		},
	}
	graphql.withArgs(COMMIT_COUNT_AND_ID_QUERY, params).resolves({
		viewer: {
			login: 'dummy-user-id',
			contributionsCollection: {
				contributionCalendar: {
					totalContributions: 1234,
				},
			},
		},
	})
	const result = await getCommitCountAndId(token)
	t.is(result.githubId, 'dummy-user-id')
	t.is(result.commitCount, 1234)
})

test.after(() => {
	graphql.restore()
})

// use token test
// getCommitCount
// test('get commit count.', async (t) => {
// 	process.env.BASE_DATE = '2020-04-01'
// 	//No authority token
// 	process.env.GITHUB_API_TOKEN = '!!!set token!!!'
// 	const result = await getCommitCount('hhatto')
// 	t.is(result, 2379)
// })

// // // // getCommitCountAndId
// test('git commit count and id.', async (t) => {
// 	process.env.BASE_DATE = '2020-04-01'
// 	//public data only token
// 	const token = '!!!set token!!!'
// 	const result = await getCommitCountAndId(token)
// 	t.is(result.githubId, 'Akira-Taniguchi')
// 	t.is(result.commitCount, 1944)
// })
