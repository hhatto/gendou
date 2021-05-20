import { graphql } from '@octokit/graphql'
import { getSearchDate } from '../utils'

const COMMIT_COUNT_QUERY = `
{
  user(login: $githubid) {
    login contributionsCollection(from: $from, to: $to) {
	  contributionCalendar {
	    totalContributions
	  }
	}
  }
}
`

const getCommitCountFromGraphQL = async function (
	githubId: string,
	fromStr: string,
	toStr: string
): Promise<number> {
	const graphqlWithAuth = graphql.defaults({
		headers: {
			authorization: `token ${process.env.GITHUB_API_TOKEN}`,
		},
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = await graphqlWithAuth(COMMIT_COUNT_QUERY, {
		githubid: githubId,
		from: fromStr,
		to: toStr,
	})
	return Number(
		result.data.user.contributionsCollection.contributionCalendar
			.totalContributions
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
{
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

const getCommitCountAndIdFromGraphQL = async function (
	token: string,
	fromStr: string,
	toStr: string
): Promise<GithubIdAndCommitCount> {
	const graphqlWithAuth = graphql.defaults({
		headers: {
			authorization: `token ${token}`,
		},
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = await graphqlWithAuth(COMMIT_COUNT_AND_ID_QUERY, {
		from: fromStr,
		to: toStr,
	})
	return {
		githubId: result.data.viewer.login,
		commitCount:
			result.data.viewer.contributionsCollection.contributionCalendar
				.totalContributions,
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
