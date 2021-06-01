import { bignumber, BigNumber } from 'mathjs'
import { caluculateContriburionsCountDetail } from './details'

export const caluculateContriburionsCount = function (
	data: CrearedAtAndContributions
): readonly BigNumber[] {
	return data.contributions.map((contribution) => {
		return bignumber(
			caluculateContriburionsCountDetail(data.crearedAt, contribution)
		)
	})
}
