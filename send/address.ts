import { ethers } from 'ethers'

export const checkSameAddress = function (
	address1: string,
	address2: string
): boolean {
	const checkedAddress1 = ethers.utils.getAddress(address1)
	const checkedAddress2 = ethers.utils.getAddress(address2)
	return checkedAddress1 === checkedAddress2
}
