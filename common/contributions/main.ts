import { caluculateContriburionsCountDetail } from './details'
import { getContributionsCount5Year } from '../github'

export const caluculateContriburionsCount = async function (
	githubId: string
): Promise<readonly number[]> {
	const contributionsInfo = await getContributionsCount5Year(githubId)
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
