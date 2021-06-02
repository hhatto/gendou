import { ethers } from 'ethers'
import { whenDefinedAll, UndefinedOr } from '@devprotocol/util-ts'
import { getApiTokenFromCode, getIdFromGraphQL } from '../common/github'
import { insertEntry, getDbClient, close } from '../common/db'

export const getAirdropIfo = async function (
	params: ParamsOfEntryApi
): Promise<UndefinedOr<AirdropInfo>> {
	const accessToken = await getApiTokenFromCode(params.code)
	const githubId =
		typeof accessToken === 'undefined'
			? undefined
			: await getIdFromGraphQL(accessToken)

	const address = whenDefinedAll([githubId, params], ([id, p]) =>
		ethers.utils.verifyMessage(id, p.sign)
	)
	const result = whenDefinedAll([githubId, address], ([id, a]) => {
		return {
			githubId: id,
			address: a,
			sign: params.sign,
		}
	})
	return result
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
