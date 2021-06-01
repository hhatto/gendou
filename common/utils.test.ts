import test from 'ava'
import { bignumber } from 'mathjs'
import equal from 'deep-equal'
import {
	generateErrorApiResponce,
	getSearchDate,
	calculateGeometricMean,
	getSearchDate5Year,
	convertCrearedAtAndContributions,
} from './utils'

//generateErrorApiResponce
test('get eror api responce.', async (t) => {
	const result = await generateErrorApiResponce('error message')
	t.is(result.status, 200)
	t.is(result.body.message, 'error message')
})

test('get eror api responce(change status code).', async (t) => {
	const result = await generateErrorApiResponce('error message', 400)
	t.is(result.status, 400)
	t.is(result.body.message, 'error message')
})

//calculateGeometricMean
test('get geometric mean', async (t) => {
	const result = await calculateGeometricMean([
		bignumber(100),
		bignumber(200),
		bignumber(300),
	])
	console.log(result.toString())
	t.true(
		result.eq(
			bignumber(
				'181.7120592832139658891211756327260502428210463141219671481334297'
			)
		)
	)
})

//getSearchDate
test('Get the search date', async (t) => {
	const result = await getSearchDate('2020-04-30')
	t.true(result.from.getTime() === new Date('2020-04-30').getTime())
	t.true(result.to.getTime() === new Date('2021-04-30').getTime())
})

// getSearchDate5Year
test('Get the search date(5 years)', async (t) => {
	const result = await getSearchDate5Year('2020-04-30', 5)
	t.true(
		equal(result, [
			{
				from: new Date('2019-04-30'),
				to: new Date('2020-04-30'),
			},
			{
				from: new Date('2018-04-30'),
				to: new Date('2019-04-30'),
			},
			{
				from: new Date('2017-04-30'),
				to: new Date('2018-04-30'),
			},
			{
				from: new Date('2016-04-30'),
				to: new Date('2017-04-30'),
			},
			{
				from: new Date('2015-04-30'),
				to: new Date('2016-04-30'),
			},
		])
	)
})

test('convert', async (t) => {
	const result = await getSearchDate5Year('2020-04-30', 5)
	t.true(
		equal(result, [
			{
				from: new Date('2019-04-30'),
				to: new Date('2020-04-30'),
			},
			{
				from: new Date('2018-04-30'),
				to: new Date('2019-04-30'),
			},
			{
				from: new Date('2017-04-30'),
				to: new Date('2018-04-30'),
			},
			{
				from: new Date('2016-04-30'),
				to: new Date('2017-04-30'),
			},
			{
				from: new Date('2015-04-30'),
				to: new Date('2016-04-30'),
			},
		])
	)
})

test('create CrearedAtAndContributions object', async (t) => {
	const data = {
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
			key3: {
				endedAt: '2018-05-02T00:00:00Z',
				startedAt: '2017-05-02T00:00:00Z',
				restrictedContributionsCount: 300,
				contributionCalendar: {
					totalContributions: 1089,
				},
			},
			key4: {
				endedAt: '2017-05-02T00:00:00Z',
				startedAt: '2016-05-02T00:00:00Z',
				restrictedContributionsCount: 0,
				contributionCalendar: {
					totalContributions: 9,
				},
			},
		},
	}
	const result = convertCrearedAtAndContributions(data, 5)
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
				{
					from: new Date('2017-05-02T00:00:00Z'),
					to: new Date('2018-05-02T00:00:00Z'),
					contribution: 789,
				},
				{
					from: new Date('2016-05-02T00:00:00Z'),
					to: new Date('2017-05-02T00:00:00Z'),
					contribution: 9,
				},
			],
		})
	)
})
