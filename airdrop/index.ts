import { ethers } from 'ethers'
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { generateErrorApiResponce } from '../common/utils'
import { getDbClient, close, getEntryByAddress, getAirdrop } from '../common/db'

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> {
	const { sign, address } = req.body
	// eslint-disable-next-line functional/no-let
	let verifyAddress
	// eslint-disable-next-line functional/no-try-statement
	try {
		// eslint-disable-next-line functional/no-expression-statement
		verifyAddress =
			address === undefined || sign === undefined
				? undefined
				: ethers.utils.verifyMessage(`verify account: ${address}`, sign)
	} catch (err: unknown) {
		// eslint-disable-next-line functional/no-expression-statement
		context.log('fail verifyMessage. err: ' + err)
	}
	const db = getDbClient()
	const entry =
		verifyAddress !== undefined
			? await getEntryByAddress(db, verifyAddress)
			: undefined
	const airdrop =
		verifyAddress !== undefined
			? await getAirdrop(db, verifyAddress)
			: undefined
	const result =
		sign === undefined || address === undefined
			? generateErrorApiResponce('invalid request', 400)
			: verifyAddress !== address
			? generateErrorApiResponce('invalid request', 400)
			: entry === undefined
			? { status: 200, body: { reward: '0', message: 'not entry' } }
			: airdrop === undefined
			? { status: 200, body: { reward: '0', message: 'entry but no reward' } }
			: entry.address === airdrop.address && airdrop.address === verifyAddress
			? { status: 200, body: { reward: airdrop.reward } }
			: generateErrorApiResponce('invalid request', 400)

	// eslint-disable-next-line functional/no-expression-statement
	await close(db)
	return {
		status: result.status,
		body: result.body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
