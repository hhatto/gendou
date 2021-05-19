import { ethers } from 'ethers'
import { checkSameAddress } from './address'
import { getClaimUrlRecordByGithubId } from '../common/db/claim-url'

export const validate = async function (
	params: ParamsOfFindClaimUrlApi
): Promise<boolean> {
	const claimUrlRecord = await getClaimUrlRecordByGithubId(params.message)
	const verifiedAddresss = ethers.utils.verifyMessage(
		params.message,
		params.signature
	)
	return (
		checkSameAddress(verifiedAddresss, params.address) ||
		typeof claimUrlRecord === 'undefined'
	)
}
