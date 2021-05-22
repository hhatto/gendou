export const generateErrorApiResponce = function (
	errorMessage: string,
	status = 200
): ApiResponce {
	return {
		status: status,
		body: { message: errorMessage },
	}
}

export const getSearchDate = function (baseDate: string): TargetDateStr {
	const tmp = new Date(baseDate)
	// eslint-disable-next-line functional/no-expression-statement
	tmp.setFullYear(tmp.getFullYear() + 1)
	return {
		from: new Date(baseDate),
		to: tmp,
	}
}
