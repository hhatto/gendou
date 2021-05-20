import test from 'ava'
import { generateErrorApiResponce } from './utils'

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
