/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import test from 'ava'
import { getDbClient, close } from './db'
import { setEnv } from '../test-utils'
import {
	getClaimUrlRecordByGithubId,
	getClaimUrlRecordByRewardId,
	updateGitHubIdAndFindAt,
} from './claim-url'

test.before(() => {
	setEnv()
})

const createTestData = async function (): Promise<void> {
	const prisma = getDbClient()
	await prisma.claim_url.deleteMany()
	await prisma.claim_url.create({
		data: {
			uuid: 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
			claim_url: 'http://hogehoge/hurahura1',
			reward_id: 1,
			github_id: 'github-id1',
			find_at: new Date(),
		},
	})
	await prisma.claim_url.create({
		data: {
			uuid: 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
			claim_url: 'http://hogehoge/hurahura2',
			reward_id: 1,
			github_id: null,
			find_at: null,
		},
	})
	await prisma.claim_url.create({
		data: {
			uuid: 'zzzzzzzz-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
			claim_url: 'http://hogehoge/hurahura3',
			reward_id: 2,
			github_id: 'github-id2',
			find_at: new Date(),
		},
	})
	await prisma.claim_url.create({
		data: {
			uuid: 'aaaaaaaaa-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx',
			claim_url: 'http://hogehoge/hurahura4',
			reward_id: 3,
			github_id: null,
			find_at: null,
		},
	})
	await close(prisma)
}

//getClaimUrlRecordByGithubId
test.serial('get by github id.', async (t) => {
	await createTestData()
	const record = await getClaimUrlRecordByGithubId('github-id1')
	t.is(record?.uuid, 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(record?.claim_url, 'http://hogehoge/hurahura1')
	t.is(record?.reward_id, 1)
	t.is(record?.github_id, 'github-id1')
	t.not(record?.find_at, null)
})

test.serial('if data is no exist, return undefind.', async (t) => {
	await createTestData()
	const record = await getClaimUrlRecordByGithubId('github-id10')
	t.is(typeof record, 'undefined')
})

//getClaimUrlRecordByRewardId
test.serial('get by reward id.', async (t) => {
	await createTestData()
	const record = await getClaimUrlRecordByRewardId(1)
	t.is(record?.uuid, 'yyyyyyyy-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx')
	t.is(record?.claim_url, 'http://hogehoge/hurahura2')
	t.is(record?.reward_id, 1)
	t.is(record?.github_id, null)
	t.is(record?.find_at, null)
})

test.serial('get by reward id.(not found)', async (t) => {
	await createTestData()
	const record = await getClaimUrlRecordByRewardId(2)
	t.is(typeof record, 'undefined')
})

//updateGitHubIdAndFindAt
test.serial('update reward set github id and find at.', async (t) => {
	await createTestData()
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
