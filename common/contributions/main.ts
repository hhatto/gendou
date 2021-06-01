import { bignumber, BigNumber } from 'mathjs'
import { caluculateContriburionsCountDetail } from './details'
import { getContributionsCount5Year } from '../github'

export const caluculateContriburionsCount = async function (
	githubId: string
): Promise<readonly BigNumber[]> {
	const contributionsInfo = await getContributionsCount5Year(githubId)
	return contributionsInfo.contributions.map((contribution) => {
		return bignumber(
			caluculateContriburionsCountDetail(
				contributionsInfo.crearedAt,
				contribution
			)
		)
	})
}
