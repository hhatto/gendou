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
import { getDbClient, close } from './db'

test.before(() => {
	setEnv()
})

//getClaimUrlRecordByGithubId
test.serial('get by github id.', async (t) => {
	const client = getDbClient()
	await createClaimUrlTestData(client)
	const record = await getClaimUrlRecordByGithubId(client, 'github-id1')
	await close(client)
	t.is(record?.uuid, 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(record?.claim_url, 'http://hogehoge/hurahura1')
	t.is(record?.reward_id, 1)
	t.is(record?.github_id, 'github-id1')
	t.not(record?.find_at, null)
})

test.serial('if data is no exist, return undefind.', async (t) => {
	const client = getDbClient()
	await createClaimUrlTestData(client)
	const record = await getClaimUrlRecordByGithubId(client, 'github-id10')
	await close(client)
	t.is(typeof record, 'undefined')
})

//getClaimUrlRecordByRewardId
test.serial('get by reward id.', async (t) => {
	const client = getDbClient()
	await createClaimUrlTestData(client)
	const record = await getClaimUrlRecordByRewardId(client, 1)
	await close(client)
	t.is(record?.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(record?.claim_url, 'http://hogehoge/hurahura2')
	t.is(record?.reward_id, 1)
	t.is(record?.github_id, null)
	t.is(record?.find_at, null)
})

test.serial('get by reward id.(not found)', async (t) => {
	const client = getDbClient()
	await createClaimUrlTestData(client)
	const record = await getClaimUrlRecordByRewardId(client, 2)
	await close(client)
	t.is(typeof record, 'undefined')
})

//updateGitHubIdAndFindAt
test.serial('update reward set github id and find at.', async (t) => {
	const client = getDbClient()
	await createClaimUrlTestData(client)
	const record = await getClaimUrlRecordByRewardId(client, 1)
	const result = await updateGitHubIdAndFindAt(
		client,
		record?.id!,
		'github-id99'
	)
	t.is(result, true)
	const afterRecord = await getClaimUrlRecordByGithubId(client, 'github-id99')
	await close(client)
	t.is(afterRecord?.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(afterRecord?.claim_url, 'http://hogehoge/hurahura2')
	t.is(afterRecord?.reward_id, 1)
	t.is(afterRecord?.github_id, 'github-id99')
	t.not(afterRecord?.find_at, null)
})
