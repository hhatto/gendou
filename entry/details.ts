import { ethers } from 'ethers'
import { PrismaClient } from '@prisma/client'
import { whenDefined, UndefinedOr } from '@devprotocol/util-ts'
import { getIdFromGraphQL } from '../common/github'
import { getRewardFromGithubId } from '../common/reward'
import {
	insertEntry,
	isAlreadyClaimed,
	updateEntry,
	getEntry,
} from '../common/db'

export const getAirdropIfo = async function (
	client: PrismaClient,
	params: ParamsOfEntryApi
): Promise<UndefinedOr<AirdropInfo>> {
	const { accessToken } = params
	const githubId =
		typeof accessToken === 'undefined'
			? undefined
			: await getIdFromGraphQL(accessToken)
	const isClaimed = await whenDefined(githubId, (id) =>
		isAlreadyClaimed(client, id)
	)
	const result =
		typeof isClaimed === 'undefined' ||
		isClaimed ||
		typeof githubId === 'undefined'
			? undefined
			: await createAirDropInfo(client, githubId, params.sign)
	return result
}

const createAirDropInfo = async function (
	client: PrismaClient,
	githubId: string,
	sign: string
): Promise<UndefinedOr<AirdropInfo>> {
	const address = ethers.utils.verifyMessage(githubId, sign)
	const rewardRecord = await getRewardFromGithubId(client, githubId)
	return typeof rewardRecord === 'undefined'
		? undefined
		: {
				githubId: githubId,
				address: address,
				sign: sign,
				rewardId: rewardRecord.id,
		  }
}

export const addEntryInfo = async function (
	client: PrismaClient,
	info: AirdropInfo
): Promise<boolean> {
	const currentData = await getEntry(client, info.githubId)
	const result =
		typeof currentData === 'undefined'
			? await insertEntry(
					client,
					info.githubId,
					info.address,
					info.sign,
					info.rewardId
			  )
			: await updateEntry(
					client,
					info.githubId,
					info.address,
					info.sign,
					info.rewardId
			  )
	return result
}
