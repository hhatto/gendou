import test from 'ava'
import { MockProvider } from 'ethereum-waffle'
import { checkSameAddress } from './address'

test('Specify the same address.', async (t) => {
	const provider = new MockProvider()
	const wallet1 = provider.createEmptyWallet()
	const wallet2 = provider.createEmptyWallet()
	const res = await checkSameAddress(wallet1.address, wallet2.address)
	t.is(res, false)
})

test('Specify a different address.', async (t) => {
	const provider = new MockProvider()
	const wallet1 = provider.createEmptyWallet()
	const res = await checkSameAddress(wallet1.address, wallet1.address)
	t.is(res, true)
})
