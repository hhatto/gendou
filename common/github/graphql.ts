import { graphql } from '@octokit/graphql'
import {
	getSearchDate,
	getSearchDates,
	convertCrearedAtAndContributions,
} from '../utils'

const COMMIT_COUNT_QUERY = `
query getCommitCount($githubid: String!, $from: DateTime, $to: DateTime) {
  user(login: $githubid) {
    contributionsCollection(from: $from, to: $to) {
	  restrictedContributionsCount
	  contributionCalendar {
	    totalContributions
	  }
	}
  }
}
`

const getCommitCountFromGraphQL = async function (
	githubId: string,
	from: Date,
	to: Date
): Promise<number> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = await graphql(COMMIT_COUNT_QUERY, {
		githubid: githubId,
		from: from,
		to: to,
		headers: {
			authorization: `token ${process.env.GITHUB_API_TOKEN}`,
		},
	})
	return (
		Number(
			result.user.contributionsCollection.contributionCalendar
				.totalContributions
		) - Number(result.user.contributionsCollection.restrictedContributionsCount)
	)
}

export const getCommitCount = async function (
	githubId: string
): Promise<number> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const searchDate = getSearchDate(process.env.BASE_DATE!)
	const commitCount = await getCommitCountFromGraphQL(
		githubId,
		searchDate.from,
		searchDate.to
	)
	return commitCount
}

const COMMIT_COUNT_AND_ID_QUERY = `
query getUser($from: DateTime, $to: DateTime) {
	viewer {
    login
	contributionsCollection(from: $from, to: $to) {
	  restrictedContributionsCount
	  contributionCalendar {
	    totalContributions
	  }
	}
  }
}
`

const getCommitCountAndIdFromGraphQL = async function (
	token: string,
	from: Date,
	to: Date
): Promise<GithubIdAndCommitCount> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = await graphql(COMMIT_COUNT_AND_ID_QUERY, {
		from: from,
		to: to,
		headers: {
			authorization: `token ${token}`,
		},
	})
	return {
		githubId: result.viewer.login,
		commitCount:
			Number(
				result.viewer.contributionsCollection.contributionCalendar
					.totalContributions
			) -
			Number(
				result.viewer.contributionsCollection.restrictedContributionsCount
			),
	}
}

export const getCommitCountAndId = async function (
	token: string
): Promise<GithubIdAndCommitCount> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const searchDate = getSearchDate(process.env.BASE_DATE!)
	const result = await getCommitCountAndIdFromGraphQL(
		token,
		searchDate.from,
		searchDate.to
	)
	return result
}

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

const getContributionsCountFromGraphQL5Year = async function (
	githubId: string,
	targets: readonly TargetDate[]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
	const index = [...Array(targets.length).keys()]
	const dateParams = index.map((i) => {
		return {
			[`from${i}`]: targets[i].from,
			[`to${i}`]: targets[i].to,
		}
	})
	const convertedDataParams = Object.assign({}, ...dateParams)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = await graphql(THREE_YEAR_CONTRIBUTION_COUNT_QUERY, {
		githubid: githubId,
		...convertedDataParams,
		headers: {
			authorization: `token ${process.env.GITHUB_API_TOKEN}`,
		},
	})

	return result
}

export const getContributionsCount3Year = async function (
	githubId: string
): Promise<CrearedAtAndContributions> {
	const TARGET_PERIOD = 3
	const searchDates = getSearchDates(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		process.env.BASE_DATE_3_YEAR!,
		TARGET_PERIOD
	)
	const result = await getContributionsCountFromGraphQL5Year(
		githubId,
		searchDates
	)
	return convertCrearedAtAndContributions(result, TARGET_PERIOD)
}

const GITHUB_ID_QUERY = `
{
	viewer {
		login
	}
}
`

export const getIdFromGraphQL = async function (
	token: string
): Promise<string> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = await graphql(GITHUB_ID_QUERY, {
		headers: {
			authorization: `token ${token}`,
		},
	})
	return result.viewer.login
}
