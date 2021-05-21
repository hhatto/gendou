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

export const getSearchDate = function (baseDate: string): TargetDateStr {
	return {
		from: moment(baseDate).format('YYYY-MM-DDTHH:mm:ss'),
		to: moment(baseDate).add(1, 'year').format('YYYY-MM-DDTHH:mm:ss'),
	}
}
