import { pow, bignumber, BigNumber } from 'mathjs'

export const generateErrorApiResponce = function (
	errorMessage: string,
	status = 200
): ApiResponce {
	return {
		status: status,
		body: { message: errorMessage },
	}
}

export const calculateGeometricMean = (
	values: readonly BigNumber[]
): BigNumber => {
	const result = values.reduce((data1, data2) => {
		return data1.mul(data2)
	}, bignumber(0))
	const tmp = bignumber(1).div(values.length)
	const calculationResults = pow(result, tmp)
	return bignumber(calculationResults.toString())
}

export const getSearchDate = function (baseDate: string): TargetDate {
	const tmp = new Date(baseDate)
	// eslint-disable-next-line functional/no-expression-statement
	tmp.setFullYear(tmp.getFullYear() + 1)
	return {
		from: new Date(baseDate),
		to: tmp,
	}
}

export const getSearchDates = function (
	_baseDate: string,
	yearCount: number
): readonly TargetDate[] {
	const index = [...Array(yearCount).keys()]
	return index.map((i) => {
		const toDate = new Date(_baseDate)
		const fromDate = new Date(_baseDate)
		// eslint-disable-next-line functional/no-expression-statement
		toDate.setFullYear(toDate.getFullYear() - i)
		// eslint-disable-next-line functional/no-expression-statement
		fromDate.setFullYear(fromDate.getFullYear() - i - 1)

		return {
			from: fromDate,
			to: toDate,
		}
	})
}

export const convertCrearedAtAndContributions = function (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	result: any,
	yearCount: number
): CrearedAtAndContributions {
	const index = [...Array(yearCount).keys()]
	const counts = index.map((i) => {
		return (
			result.user[`key${i}`].contributionCalendar.totalContributions -
			result.user[`key${i}`].restrictedContributionsCount
		)
	})
	const startedAtList = index.map((i) => {
		return new Date(result.user[`key${i}`].startedAt)
	})
	const endedAtList = index.map((i) => {
		return new Date(result.user[`key${i}`].endedAt)
	})
	const contributions = index.map((i) => {
		return {
			from: startedAtList[i],
			to: endedAtList[i],
			contribution: counts[i],
		}
	})

	return {
		crearedAt: new Date(result.user.createdAt),
		contributions: contributions,
	}
}
