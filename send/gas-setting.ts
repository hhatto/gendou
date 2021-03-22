import { whenDefined, ethGasStationFetcher } from '@devprotocol/util-ts'

export const getGasSetting = async function (
	egsToken: string | undefined,
	gasLimitValue: string | undefined
): Promise<GasOption> {
	const gasPriceValue = await whenDefined(egsToken, async (token) => {
		const fetcher = await ethGasStationFetcher(token)
		return await fetcher()
	})
	const limit = gasLimitValue || '1000000'
	return typeof gasPriceValue === 'undefined'
		? {
				gasLimit: limit,
		  }
		: {
				gasLimit: limit,
				gasPrice: gasPriceValue,
		  }
}
