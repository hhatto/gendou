import { ethers } from 'ethers'
import { whenDefined, UndefinedOr } from '@devprotocol/util-ts'
import { getApiTokenFromCode, getIdFromGraphQL } from '../common/github'
import { insertEntry, getDbClient, close, isAlreadyClaimed } from '../common/db'

export const getAirdropIfo = async function (
	params: ParamsOfEntryApi
): Promise<UndefinedOr<AirdropInfo>> {
	const accessToken = await getApiTokenFromCode(params.code)
	const githubId =
		typeof accessToken === 'undefined'
			? undefined
			: await getIdFromGraphQL(accessToken)
	const dbClient = getDbClient()
	const isClaimed = await whenDefined(githubId, (id) =>
		isAlreadyClaimed(dbClient, id)
	)
	// eslint-disable-next-line functional/no-expression-statement
	await close(dbClient)

	return typeof isClaimed === 'undefined' ||
		isClaimed ||
		typeof githubId === 'undefined'
		? undefined
		: createAirDropInfo(githubId, params.sign)
}

const createAirDropInfo = function (
	githubId: string,
	sign: string
): AirdropInfo {
	const address = ethers.utils.verifyMessage(githubId, sign)
	return {
		githubId: githubId,
		address: address,
		sign: sign,
	}
}

export const addEntryInfo = async function (
	info: AirdropInfo
): Promise<boolean> {
	const dbClient = getDbClient()
	const isInserted = await insertEntry(
		dbClient,
		info.githubId,
		info.address,
		info.sign
	)
	// eslint-disable-next-line functional/no-expression-statement
	await close(dbClient)
	return isInserted
}
