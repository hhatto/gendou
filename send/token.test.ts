/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-let */
/* eslint-disable functional/prefer-readonly-type */

import test from 'ava'
import sinon from 'sinon'
import BigNumber from 'bignumber.js'
import { sendToken } from './token'
import * as contract_modules from './contract'
import * as setting_modules from './gas-setting'
import { UndefinedOr } from '@devprotocol/util-ts'
import { Contract } from 'ethers'

let getDevContract: sinon.SinonStub<
	[
		network: string | undefined,
		alchemyId: string | undefined,
		mnemonic: string | undefined,
		tokenAddress: string | undefined
	],
	UndefinedOr<Contract>
>
let getGasSetting: sinon.SinonStub<
	[egsToken: string | undefined, gasLimitValue: string | undefined],
	Promise<GasOption>
>
const transferFunc = async function (
	toAddress: string,
	reward: string,
	overrides: any
): Promise<any> {
	return { hash: 'dummy-hash' }
}

const mockDev = {
	transfer: transferFunc,
}
test.before(() => {
	getDevContract = sinon.stub(contract_modules, 'getDevContract')
	getGasSetting = sinon.stub(setting_modules, 'getGasSetting')
	getDevContract
		.withArgs('ropsten', 'alchemy-id', 'mnemonic', 'address')
		.returns(mockDev as any)
})

test('successful processing.', async (t) => {
	process.env.NETWORK = 'ropsten'
	process.env.ALCHEMY_ID = 'alchemy-id'
	process.env.MNEMONIC = 'mnemonic'
	process.env.TOKEN_ADDRESS = 'address'
	const res = await sendToken('dummy-address', new BigNumber(10))
	t.is(res, 'dummy-hash')
})

test('Failed to create a contract instance.', async (t) => {
	process.env.NETWORK = 'dummy'
	process.env.ALCHEMY_ID = 'alchemy-id'
	process.env.MNEMONIC = 'mnemonic'
	process.env.TOKEN_ADDRESS = 'address'
	const res = await sendToken('dummy-address', new BigNumber(10))
	t.is(res, undefined)
})

test.after(() => {
	getDevContract.restore()
	getGasSetting.restore()
})
