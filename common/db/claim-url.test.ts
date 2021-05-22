/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import test from 'ava'
import { createClaimUrlTestData } from './test-data'
import { setEnv } from '../test-utils'
import {
	getClaimUrlRecordByGithubId,
	getClaimUrlRecordByRewardId,
	updateGitHubIdAndFindAt,
} from './claim-url'

test.before(() => {
	setEnv()
})

//getClaimUrlRecordByGithubId
test.serial('get by github id.', async (t) => {
	await createClaimUrlTestData()
	const record = await getClaimUrlRecordByGithubId('github-id1')
	t.is(record?.uuid, 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(record?.claim_url, 'http://hogehoge/hurahura1')
	t.is(record?.reward_id, 1)
	t.is(record?.github_id, 'github-id1')
	t.not(record?.find_at, null)
})

test.serial('if data is no exist, return undefind.', async (t) => {
	await createClaimUrlTestData()
	const record = await getClaimUrlRecordByGithubId('github-id10')
	t.is(typeof record, 'undefined')
})

//getClaimUrlRecordByRewardId
test.serial('get by reward id.', async (t) => {
	await createClaimUrlTestData()
	const record = await getClaimUrlRecordByRewardId(1)
	t.is(record?.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(record?.claim_url, 'http://hogehoge/hurahura2')
	t.is(record?.reward_id, 1)
	t.is(record?.github_id, null)
	t.is(record?.find_at, null)
})

test.serial('get by reward id.(not found)', async (t) => {
	await createClaimUrlTestData()
	const record = await getClaimUrlRecordByRewardId(2)
	t.is(typeof record, 'undefined')
})

//updateGitHubIdAndFindAt
test.serial('update reward set github id and find at.', async (t) => {
	await createClaimUrlTestData()
	const record = await getClaimUrlRecordByRewardId(1)
	const result = await updateGitHubIdAndFindAt(record?.id!, 'github-id99')
	t.is(result, true)
	const afterRecord = await getClaimUrlRecordByGithubId('github-id99')
	t.is(afterRecord?.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(afterRecord?.claim_url, 'http://hogehoge/hurahura2')
	t.is(afterRecord?.reward_id, 1)
	t.is(afterRecord?.github_id, 'github-id99')
	t.not(afterRecord?.find_at, null)
})
