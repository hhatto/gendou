import moment from 'moment'
import { graphql } from '@octokit/graphql'
import { getTargetDate } from './utils'

const graphqlWithAuth = graphql.defaults({
	headers: {
		authorization: `token ${process.env.GITHUB_API_TOKEN}`,
	},
})

const QUERY = `
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
	from: Date,
	to: Date
): Promise<number> {
	const fromStr = moment(from.toString(), 'YYYY-MM-DDThh:mm:ss')
	const toStr = moment(to.toString(), 'YYYY-MM-DDThh:mm:ss')
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any = await graphqlWithAuth(QUERY, {
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
	const searchDate = getTargetDate(process.env.BASE_DATE!)
	const commitCount = await getCommitCountFromGraphQL(
		githubId,
		searchDate.from,
		searchDate.to
	)
	return commitCount
}
