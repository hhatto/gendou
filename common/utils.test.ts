import test from 'ava'
import { generateErrorApiResponce, getSearchDate } from './utils'

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

test('Get the search date', async (t) => {
	const result = await getSearchDate('2020-04-30')
	t.true(result.from.getTime() === new Date('2020-04-30').getTime())
	t.true(result.to.getTime() === new Date('2021-04-30').getTime())
})
