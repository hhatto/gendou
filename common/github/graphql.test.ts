/* eslint-disable functional/immutable-data */
import test from 'ava'
import { getCommitCount, getCommitCountAndId } from './graphql'

// getCommitCount
test('get commit count.', async (t) => {
	process.env.BASE_DATE = '2020-04-01'
	//No authority token
	process.env.GITHUB_API_TOKEN = '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'
	const result = await getCommitCount('hhatto')
	t.is(result, 2379)
})

// getCommitCountAndId
test('git commit count and id.', async (t) => {
	process.env.BASE_DATE = '2020-04-01'
	//public data only token
	const token = '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'
	const result = await getCommitCountAndId(token)
	t.is(result.githubId, 'Akira-Taniguchi')
	t.is(result.commitCount, 1944)
})
