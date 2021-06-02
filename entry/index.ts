import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { generateErrorApiResponce } from '../common/utils'
import { getParams } from './params'
import { getAirdropIfo, addEntryInfo } from './details'
import { getDbClient, close } from '../common/db'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const params = getParams(req)
	const dbClient = getDbClient()
	const info =
		typeof params === 'undefined'
			? undefined
			: await getAirdropIfo(dbClient, params)
	const isInserted =
		typeof info === 'undefined' ? undefined : await addEntryInfo(dbClient, info)
	// eslint-disable-next-line functional/no-expression-statement
	await close(dbClient)
	const result =
		typeof params === 'undefined'
			? generateErrorApiResponce('parameters error', 400)
			: typeof info === 'undefined'
			? generateErrorApiResponce('get info error')
			: isInserted === false
			? generateErrorApiResponce('db error')
			: {
					status: 200,
					body: { github_id: info.githubId, address: info.address },
			  }
	return {
		status: result.status,
		body: result.body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger

// TODO
// entryをupdateにする
// reward idを登録する

// getRewardFromGithubIdのテスト
// getRewardApiResponceのテスト
// getAirdropIfoのテスト
// insertEntryのテスト
// addEntryInfo
// entry.index
// getEntry
// updateEntry
