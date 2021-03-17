import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import {
	whenDefined,
	whenDefinedAll,
	ethGasStationFetcher,
	UndefinedOr,
} from '@devprotocol/util-ts'

export const sendToken = async function (
	toAddress: string,
	reward: BigNumber
): Promise<UndefinedOr<string>> {
	const provider = whenDefinedAll(
		[process.env.INFURA_ID, process.env.NETWORK],
		([infura, network]) =>
			new ethers.providers.InfuraProvider(
				network === 'mainnet' ? 'homestead' : network,
				infura
			)
	)
	const wallet = whenDefinedAll(
		[provider, process.env.MNEMONIC],
		([prov, mnemonic]) => ethers.Wallet.fromMnemonic(mnemonic).connect(prov)
	)
	const devToken = whenDefinedAll(
		[process.env.TOKEN_ADDRESS, wallet],
		([address, w]) =>
			new ethers.Contract(
				address,
				['function transfer(address to, uint amount) returns (boolean)'],
				w
			)
	)
	const gasPrice = await whenDefined(
		process.env.EGS_TOKEN,
		async (egsToken) => await ethGasStationFetcher(egsToken)
	)
	const gas = Number(process.env.GAS_LIMIT || 1000000)
	const overrides = {
		gasLimit: gas,
		gasPrice: gasPrice,
	}
	const tx = (await whenDefined(
		devToken,
		async (dev) => await dev.transfer(toAddress, reward, overrides)
	)) as ethers.Transaction

	return tx.hash
}
