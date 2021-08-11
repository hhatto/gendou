import { ethers } from 'ethers'
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { generateErrorApiResponce } from '../common/utils'
import { getDbClient, close, getEntryByAddress, getAirdrop } from '../common/db'

const httpTrigger: AzureFunction = async function (
	_context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> {
	const { sign, address } = req.body
	const verifyAddress = ethers.utils.verifyMessage(address, sign)
	const db = getDbClient()
	const entry =
		address !== undefined ? await getEntryByAddress(db, address) : undefined
	const airdrop =
		address !== undefined ? await getAirdrop(db, address) : undefined
	const result =
		sign === undefined || address === undefined
			? generateErrorApiResponce('invalid request', 400)
			: verifyAddress !== address
			? generateErrorApiResponce('invalid request', 400)
			: entry === undefined || airdrop === undefined
			? { status: 200, body: { reward: '0' } }
			: { status: 200, body: { reward: airdrop.reward } }

	// eslint-disable-next-line functional/no-expression-statement
	await close(db)
	return {
		status: result.status,
		body: result.body,
	}
}

export default httpTrigger
