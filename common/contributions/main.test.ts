/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import equal from 'deep-equal'
import { bignumber } from 'mathjs'
import { caluculateContriburionsCount } from './main'
import * as graphql_modules from '../github/graphql'

let getContributionsCount3Year: sinon.SinonStub<
	[githubId: string],
	Promise<CrearedAtAndContributions>
>

test.before(() => {
	getContributionsCount3Year = sinon.stub(
		graphql_modules,
		'getContributionsCount3Year'
	)
})

// caluculateContriburionsCount
test('All tribute numbers will be covered..', async (t) => {
	getContributionsCount3Year.withArgs('github_id1').resolves({
		crearedAt: new Date('2015-04-01'),
		contributions: [
			{
				from: new Date('2016-04-01'),
				to: new Date('2017-04-01'),
				contribution: 100,
			},
			{
				from: new Date('2017-04-01'),
				to: new Date('2018-04-01'),
				contribution: 200,
			},
			{
				from: new Date('2018-04-01'),
				to: new Date('2019-04-01'),
				contribution: 300,
			},
			{
				from: new Date('2019-04-01'),
				to: new Date('2020-04-01'),
				contribution: 400,
			},
			{
				from: new Date('2020-04-01'),
				to: new Date('2021-04-01'),
				contribution: 500,
			},
		],
	})
	const counts = await caluculateContriburionsCount('github_id1')
	t.is(
		equal(counts, [
			bignumber(100),
			bignumber(200),
			bignumber(300),
			bignumber(400),
			bignumber(500),
		]),
		true
	)
})

test('If the end date is before the account creation date, the data will be excluded.', async (t) => {
	getContributionsCount3Year.withArgs('github_id2').resolves({
		crearedAt: new Date('2018-10-01'),
		contributions: [
			{
				from: new Date('2016-04-01'),
				to: new Date('2017-04-01'),
				contribution: 100,
			},
			{
				from: new Date('2017-04-01'),
				to: new Date('2018-04-01'),
				contribution: 200,
			},
			{
				from: new Date('2018-04-01'),
				to: new Date('2019-04-01'),
				contribution: 300,
			},
			{
				from: new Date('2019-04-01'),
				to: new Date('2020-04-01'),
				contribution: 400,
			},
			{
				from: new Date('2020-04-01'),
				to: new Date('2021-04-01'),
				contribution: 500,
			},
		],
	})
	const counts = await caluculateContriburionsCount('github_id2')
	t.is(equal(counts, [bignumber(601), bignumber(400), bignumber(500)]), true)
})

test.after(() => {
	getContributionsCount3Year.restore()
})
