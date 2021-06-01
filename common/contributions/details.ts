export const caluculateContriburionsCountDetail = function (
	createdAt: Date,
	contribution: Contribution
): number {
	const isFullfil = createdAt.getTime() <= contribution.from.getTime()
	return (
		(isFullfil
			? contribution.contribution
			: (contribution.contribution /
					((contribution.to.getTime() - createdAt.getTime()) / 86400000)) *
			  365) || 1
	)
}
