import { BigNumber, bignumber } from 'mathjs'

export const caluculateContriburionsCountDetail = function (
	createdAt: Date,
	contribution: Contribution
): BigNumber {
	const isFullfil = createdAt.getTime() <= contribution.from.getTime()
	const result = isFullfil
		? contribution.contribution
		: caluculateApportionment(createdAt, contribution)
	return result === 0 ? bignumber(1) : bignumber(result)
}

const caluculateApportionment = function (
	createdAt: Date,
	contribution: Contribution
): number {
	const dayCount = (contribution.to.getTime() - createdAt.getTime()) / 86400000
	const perDay = contribution.contribution / dayCount
	return Math.floor(perDay * 365)
}
