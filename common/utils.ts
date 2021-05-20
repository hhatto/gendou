import moment from 'moment'

export const generateErrorApiResponce = function (
	errorMessage: string,
	status = 200
): ApiResponce {
	return {
		status: status,
		body: { message: errorMessage },
	}
}

const getTargetDate = function (baseDate: string): TargetDate {
	const to = new Date(baseDate)
	const from = new Date(baseDate)
	// eslint-disable-next-line functional/no-expression-statement
	from.setFullYear(from.getFullYear() - 1)
	return {
		from,
		to,
	}
}

export const getSearchDate = function (baseDate: string): TargetDateStr {
	const searchDate = getTargetDate(baseDate)
	const fromStr = moment(searchDate.from.toString(), 'YYYY-MM-DDThh:mm:ss')
	const toStr = moment(searchDate.to.toString(), 'YYYY-MM-DDThh:mm:ss')
	return {
		from: fromStr.format(),
		to: toStr.format(),
	}
}
