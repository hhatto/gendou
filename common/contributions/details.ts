/* eslint-disable functional/no-expression-statement */
export const caluculateContriburionsCountDetail = function (
	createdAt: Date,
	contribution: Contribution
): number {
	const isFullfil = createdAt.getTime() <= contribution.from.getTime()
	const result = isFullfil
		? contribution.contribution
		: caluculateApportionment(createdAt, contribution)
	return result === 0 ? 1 : result
}

const caluculateApportionment = function (
	createdAt: Date,
	contribution: Contribution
): number {
	const dayCount = (contribution.to.getTime() - createdAt.getTime()) / 86400000
	const perDay = contribution.contribution / dayCount
	return Math.floor(perDay * 365)
}
