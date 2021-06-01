import { BigNumber } from 'mathjs'
import { caluculateContriburionsCountDetail } from './details'
import { getContributionsCount3Year } from '../github'

export const caluculateContriburionsCount = async function (
	githubId: string
): Promise<readonly BigNumber[]> {
	const contributionsInfo = await getContributionsCount3Year(githubId)
	const targets = contributionsInfo.contributions.filter((contribution) => {
		return contribution.to.getTime() >= contributionsInfo.crearedAt.getTime()
	})
	return targets.map((contribution) => {
		return caluculateContriburionsCountDetail(
			contributionsInfo.crearedAt,
			contribution
		)
	})
}
