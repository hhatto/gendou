// import { generateErrorApiResponce } from '../common/utils'
// import {
// 	getClaimUrlRecordByGithubId,
// 	getRewordRecordByCommitCount,
// 	getDbClient,
// 	close,
// } from '../common/db'
// import { getCommitCount } from '../common/github'
// import { getAlreadyClaimRewardInfo, getRewardInfo } from './details'

// export const main = async function (githubId: string): Promise<ApiResponce> {
// 	const commitCount = await getCommitCount(githubId)
// 	const dbClient = getDbClient()
// 	const rewardRecord = await getRewordRecordByCommitCount(dbClient, commitCount)
// 	const claimUrlRecord = await getClaimUrlRecordByGithubId(dbClient, githubId)
// 	const res =
// 		typeof rewardRecord === 'undefined'
// 			? generateErrorApiResponce('not applicable')
// 			: typeof claimUrlRecord === 'undefined'
// 			? await getRewardInfo(dbClient, rewardRecord)
// 			: await getAlreadyClaimRewardInfo(dbClient, rewardRecord, claimUrlRecord)
// 	const isClosed = await close(dbClient)
// 	return isClosed ? res : generateErrorApiResponce('db error')
// }
