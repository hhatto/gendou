// import {
// 	getClaimUrlRecordByGithubId,
// 	getClaimUrlRecordByRewardId,
// 	updateGitHubIdAndFindAt,
// } from './claim-url'
import { isAlreadyClaimed } from './already_claimed'

import {
	getRewordRecordByCommitCount,
	getRewordRecordById,
	// getRewordRecordByRank,
} from './reward'

//import { getClaimUrlInfo, createClaimUrlInfo } from './utils'

import { getDbClient, close } from './db'

import { insertEntry, updateEntry, getEntry, getEntryByAddress } from './entry'
import { getAirdrop } from './airdrop'

export {
	getDbClient,
	close,
	// getClaimUrlRecordByGithubId,
	// getClaimUrlRecordByRewardId,
	// updateGitHubIdAndFindAt,
	getRewordRecordByCommitCount,
	getRewordRecordById,
	// getRewordRecordByRank,
	// getClaimUrlInfo,
	// createClaimUrlInfo,
	isAlreadyClaimed,
	insertEntry,
	updateEntry,
	getEntry,
	getEntryByAddress,
	getAirdrop,
}
