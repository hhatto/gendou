/* eslint-disable functional/no-loop-statement */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statement */
import { getDbClient, close } from '../common/db'
import { getRewardFromGithubId } from '../common/reward'


// eslint-disable-next-line functional/functional-parameters
const main = async function (): Promise<void> {
	console.log('start')
	process.env.DATABASE_URL = 'set db url'
	process.env.BASE_DATE_3_YEAR = 'set base date'
	process.env.GITHUB_API_TOKEN = 'set api token'

	const client = getDbClient()
	const records = await client.entry.findMany({
		orderBy: [
			{
				id: 'asc'
			}
		],
	})
	for await (const record of records) {
		const [rewardRecord, contirubutionCount] = await getRewardFromGithubId(client, record.github_id)
		const tmp = typeof rewardRecord === 'undefined' ? 0: record.reward_id !== rewardRecord.id ? 0: contirubutionCount
		console.log(`${record.github_id}:${contirubutionCount}`)
		const time = new Date()
		const updatedData = await client.entry.update({
			where: { github_id: record.github_id },
			data: {
				contribution_count: tmp,
				update_at: time,
			},
		})
	  }
	await close(client)
	console.log('end')
}

void main()
