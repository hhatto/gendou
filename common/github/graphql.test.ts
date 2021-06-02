/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */
import test from 'ava'
import sinon from 'sinon'
import equal from 'deep-equal'
import {
	//getSearchDate,
	getSearchDates,
} from '../utils'
import * as octokit_modules from '@octokit/graphql'
import {
	// getCommitCount,
	// getCommitCountAndId,
	getContributionsCount3Year,
	getIdFromGraphQL,
} from './graphql'
import { GraphQlResponse } from '@octokit/graphql/dist-types/types'
import { RequestParameters } from '@octokit/types'

let graphql: sinon.SinonStub<
	[query: string, parameters?: RequestParameters | undefined],
	GraphQlResponse<unknown>
>

test.before(() => {
	graphql = sinon.stub(octokit_modules, 'graphql')
})

// // getCommitCount
// test('get commit count.', async (t) => {
// 	const COMMIT_COUNT_QUERY = `
// query getCommitCount($githubid: String!, $from: DateTime, $to: DateTime) {
//   user(login: $githubid) {
//     contributionsCollection(from: $from, to: $to) {
// 	  restrictedContributionsCount
// 	  contributionCalendar {
// 	    totalContributions
// 	  }
// 	}
//   }
// }
// `
// 	process.env.BASE_DATE = '2020-04-01'
// 	process.env.GITHUB_API_TOKEN = 'dummy-token'
// 	const searchDate = getSearchDate(process.env.BASE_DATE)
// 	const params = {
// 		githubid: 'hhatto',
// 		from: searchDate.from,
// 		to: searchDate.to,
// 		headers: {
// 			authorization: `token ${process.env.GITHUB_API_TOKEN}`,
// 		},
// 	}

// 	graphql.withArgs(COMMIT_COUNT_QUERY, params).resolves({
// 		user: {
// 			contributionsCollection: {
// 				restrictedContributionsCount: 29,
// 				contributionCalendar: {
// 					totalContributions: 2929,
// 				},
// 			},
// 		},
// 	})

// 	const result = await getCommitCount('hhatto')
// 	t.is(result, 2900)
// })

// // getCommitCountAndId
// test('git commit count and id.', async (t) => {
// 	const COMMIT_COUNT_AND_ID_QUERY = `
// query getUser($from: DateTime, $to: DateTime) {
// 	viewer {
//     login
// 	contributionsCollection(from: $from, to: $to) {
// 	  restrictedContributionsCount
// 	  contributionCalendar {
// 	    totalContributions
// 	  }
// 	}
//   }
// }
// `
// 	process.env.BASE_DATE = '2020-04-01'
// 	const searchDate = getSearchDate(process.env.BASE_DATE)
// 	//public data only token
// 	const token = 'dummy-token'
// 	const params = {
// 		from: searchDate.from,
// 		to: searchDate.to,
// 		headers: {
// 			authorization: `token ${token}`,
// 		},
// 	}
// 	graphql.withArgs(COMMIT_COUNT_AND_ID_QUERY, params).resolves({
// 		viewer: {
// 			login: 'dummy-user-id',
// 			contributionsCollection: {
// 				restrictedContributionsCount: 34,
// 				contributionCalendar: {
// 					totalContributions: 1234,
// 				},
// 			},
// 		},
// 	})
// 	const result = await getCommitCountAndId(token)
// 	t.is(result.githubId, 'dummy-user-id')
// 	t.is(result.commitCount, 1200)
// })

test('git contributions info.', async (t) => {
	const THREE_YEAR_CONTRIBUTION_COUNT_QUERY = `
query getCount(
	$githubid: String!,
	$from0: DateTime, $to0: DateTime,
	$from1: DateTime, $to1: DateTime,
	$from2: DateTime, $to2: DateTime) {
  user(login: $githubid) {
	createdAt
    key0: contributionsCollection(from: $from0, to: $to0) {
		startedAt
		endedAt
	  	restrictedContributionsCount
	  	contributionCalendar {
	    	totalContributions
	  	}
	}
    key1: contributionsCollection(from: $from1, to: $to1) {
		startedAt
		endedAt
		restrictedContributionsCount
		contributionCalendar {
		  totalContributions
		}
	}
    key2: contributionsCollection(from: $from2, to: $to2) {
		startedAt
		endedAt
		restrictedContributionsCount
		contributionCalendar {
		  totalContributions
		}
	}
  }
}
`
	process.env.BASE_DATE_3_YEAR = '2020-04-01'
	const searchDates = getSearchDates(process.env.BASE_DATE_3_YEAR, 3)
	process.env.GITHUB_API_TOKEN = 'dummy-token'
	const index = [...Array(searchDates.length).keys()]
	const dateParams = index.map((i) => {
		return {
			[`from${i}`]: searchDates[i].from,
			[`to${i}`]: searchDates[i].to,
		}
	})
	const convertedDataParams = Object.assign({}, ...dateParams)
	const params = {
		githubid: 'github-id-1',
		...convertedDataParams,
		headers: {
			authorization: `token ${process.env.GITHUB_API_TOKEN}`,
		},
	}
	graphql.withArgs(THREE_YEAR_CONTRIBUTION_COUNT_QUERY, params).resolves({
		user: {
			createdAt: '2016-04-30T10:00:00Z',
			key0: {
				endedAt: '2021-05-02T00:00:00Z',
				startedAt: '2020-05-02T00:00:00Z',
				restrictedContributionsCount: 43,
				contributionCalendar: {
					totalContributions: 100,
				},
			},
			key1: {
				endedAt: '2020-05-02T00:00:00Z',
				startedAt: '2019-05-02T00:00:00Z',
				restrictedContributionsCount: 3,
				contributionCalendar: {
					totalContributions: 180,
				},
			},
			key2: {
				endedAt: '2019-05-02T00:00:00Z',
				startedAt: '2018-05-02T00:00:00Z',
				restrictedContributionsCount: 3,
				contributionCalendar: {
					totalContributions: 10,
				},
			},
		},
	})
	const result = await getContributionsCount3Year('github-id-1')
	t.true(
		equal(result, {
			crearedAt: new Date('2016-04-30T10:00:00Z'),
			contributions: [
				{
					from: new Date('2020-05-02T00:00:00Z'),
					to: new Date('2021-05-02T00:00:00Z'),
					contribution: 57,
				},
				{
					from: new Date('2019-05-02T00:00:00Z'),
					to: new Date('2020-05-02T00:00:00Z'),
					contribution: 177,
				},
				{
					from: new Date('2018-05-02T00:00:00Z'),
					to: new Date('2019-05-02T00:00:00Z'),
					contribution: 7,
				},
			],
		})
	)
})

// getIdFromGraphQL
test('git id.', async (t) => {
	const GITHUB_ID_QUERY = `
{
	viewer {
		login
	}
}
`
	const token = 'dummy-token'
	const params = {
		headers: {
			authorization: `token ${token}`,
		},
	}
	graphql.withArgs(GITHUB_ID_QUERY, params).resolves({
		viewer: {
			login: 'dummy-user-id',
		},
	})
	const result = await getIdFromGraphQL(token)
	t.is(result, 'dummy-user-id')
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

// test('git commit count and id.', async (t) => {
// 	process.env.BASE_DATE_3_YEAR = '2020-04-01'
// 	process.env.GITHUB_API_TOKEN = ''
// 	const result = await getContributionsCount3Year('Akira-Taniguchi')
// })
