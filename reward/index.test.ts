/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import func from './index'
import BigNumber from 'bignumber.js'
import { Context } from '@azure/functions'
import * as reward from './../common/reward'
import { UndefinedOr } from '@devprotocol/util-ts'
import { generateHttpRequest } from '../common/test-utils'

let getReward: sinon.SinonStub<
	[githubId: string],
	Promise<UndefinedOr<BigNumber>>
>
test.before(() => {
	getReward = sinon.stub(reward, 'getReward')
	getReward.withArgs('test1').resolves(new BigNumber(10))
	getReward.withArgs('test2').resolves(new BigNumber(0))
	getReward.withArgs('test3').resolves(undefined)
})

test('There is a reward.', async (t) => {
	const res = await func(
		(undefined as unknown) as Context,
		generateHttpRequest({ github_id: 'test1' })
	)
	t.is(res.body.reward, '10')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Zero reward.', async (t) => {
	const res = await func(
		(undefined as unknown) as Context,
		generateHttpRequest({ github_id: 'test2' })
	)
	t.is(res.body.reward, '0')
	t.is(res.status, 200)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Error when getting reward.', async (t) => {
	const res = await func(
		(undefined as unknown) as Context,
		generateHttpRequest({ github_id: 'test3' })
	)
	t.is(res.body.reward, '-1')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test('Illegal parameter.', async (t) => {
	const res = await func(
		(undefined as unknown) as Context,
		generateHttpRequest({})
	)
	t.is(res.body.reward, '-1')
	t.is(res.status, 400)
	t.is(res.headers['Cache-Control'], 'no-store')
})

test.after(() => {
	getReward.restore()
})
