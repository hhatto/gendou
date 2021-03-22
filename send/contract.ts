import { ethers, Wallet, Contract } from 'ethers'
import { whenDefinedAll, UndefinedOr } from '@devprotocol/util-ts'

export const getDevContract = function (
	network: string | undefined,
	alchemyId: string | undefined,
	mnemonic: string | undefined,
	tokenAddress: string | undefined
): UndefinedOr<Contract> {
	const provider = whenDefinedAll([network, alchemyId], ([network, apikey]) =>
		ethers.getDefaultProvider(network === 'mainnet' ? 'homestead' : network, {
			alchemy: apikey,
		})
	)
	const wallet = whenDefinedAll([provider, mnemonic], ([prov, mnemonic]) =>
		Wallet.fromMnemonic(mnemonic).connect(prov)
	)
	const devToken = whenDefinedAll(
		[tokenAddress, wallet],
		([address, w]) =>
			new Contract(
				address,
				['function transfer(address to, uint amount) returns (boolean)'],
				w
			)
	)
	return devToken
}
