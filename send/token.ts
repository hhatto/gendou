import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { whenDefined, UndefinedOr } from '@devprotocol/util-ts'
import { getGasSetting } from './gas-setting'
import { getDevContract } from './contract'

export const sendToken = async function (
	toAddress: string,
	reward: BigNumber
): Promise<UndefinedOr<string>> {
	const devToken = getDevContract(
		process.env.NETWORK,
		process.env.ALCHEMY_ID,
		process.env.MNEMONIC,
		process.env.TOKEN_ADDRESS
	)
	const overrides = await getGasSetting(
		process.env.EGS_TOKEN,
		process.env.GAS_LIMIT
	)
	const tx = (await whenDefined(
		devToken,
		async (dev) => await dev.transfer(toAddress, reward.toString(), overrides)
	)) as UndefinedOr<ethers.Transaction>
	const hash = await whenDefined(tx, (tx) => tx.hash)
	return hash
}
