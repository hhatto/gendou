/* eslint-disable prettier/prettier */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
//import sinon from 'sinon'
import func from './index'
import { Context } from '@azure/functions'
//import * as main_modules from './main'
import { generateHttpRequest } from '../common/test-utils'

// let main: sinon.SinonStub<[code: string], Promise<ApiResponce>>
// test.before(() => {
// 	main = sinon.stub(main_modules, 'main')
// })

// test('The process ends normally.', async (t) => {
// 	main.withArgs('conde1').resolves({
// 		status: 200,
// 		body: {
// 			key: 'value'
// 		}
// 	})
// 	const res = await func(
// 		undefined as unknown as Context,
// 		generateHttpRequest({}, { code: 'conde1' })
// 	)
// 	t.is(res.body.key, 'value')
// 	t.is(res.status, 200)
// 	t.is(res.headers['Cache-Control'], 'no-store')
// })

// test('The process terminates abnormally.', async (t) => {
// 	const res = await func(
// 		undefined as unknown as Context,
// 		generateHttpRequest({}, {})
// 	)
// 	t.is(res.body.message, 'parameters error')
// 	t.is(res.status, 400)
// 	t.is(res.headers['Cache-Control'], 'no-store')
// })


// test.after(() => {
// 	main.restore()
// })

test('It is definitely an error.', async (t) => {
	const res = await func(
		undefined as unknown as Context,
		generateHttpRequest({}, { code: 'conde1' })
	)
	t.is(res.body.message, 'claim is stopped')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})
