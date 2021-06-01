/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import test from 'ava'
import { bignumber } from 'mathjs'
import { caluculateContriburionsCountDetail } from './details'

// caluculateContriburionsCountDetail
test('All contributions will be covered.', async (t) => {
	const count = caluculateContriburionsCountDetail(new Date('2010-01-05'), {
		from: new Date('2012-01-05'),
		to: new Date('2013-01-05'),
		contribution: 3650,
	})
	console.log(count)
	t.is(count.toString(), bignumber(3650).toString())
})

test('The number of contributions increases as a percentage of the total number of contributions.', async (t) => {
	const count = caluculateContriburionsCountDetail(new Date('2012-05-05'), {
		from: new Date('2012-01-05'),
		to: new Date('2013-01-05'),
		contribution: 3650,
	})
	t.is(count.toString(), bignumber(5437).toString())
})

test('If the number of contributions is 0, 1 will be returned.', async (t) => {
	const count = caluculateContriburionsCountDetail(new Date('2010-01-05'), {
		from: new Date('2012-01-05'),
		to: new Date('2013-01-05'),
		contribution: 0,
	})
	t.is(count.toString(), bignumber(1).toString())
})
