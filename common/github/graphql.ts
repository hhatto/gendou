import { graphql } from '@octokit/graphql'
import { getSearchDate } from '../utils'

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
		) -
		Number(
			result.user.contributionsCollection.contributionCalendar
				.restrictedContributionsCount
		)
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
				result.user.contributionsCollection.contributionCalendar
					.totalContributions
			) -
			Number(
				result.user.contributionsCollection.contributionCalendar
					.restrictedContributionsCount
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
