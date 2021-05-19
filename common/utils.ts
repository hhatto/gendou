export const generateErrorApiResponce = function (
	errorMessage: string,
	status = 200
): ApiResponce {
	return {
		status: status,
		body: { message: errorMessage },
	}
}

export const getTargetDate = function (baseDate: string): TargetDate {
	const to = new Date(baseDate)
	const from = new Date(baseDate)
	// eslint-disable-next-line functional/no-expression-statement
	from.setFullYear(from.getFullYear() - 1)
	return {
		from,
		to,
	}
}
