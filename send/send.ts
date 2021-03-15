import { whenDefined, whenDefinedAll, UndefinedOr } from '@devprotocol/util-ts'
import { getReward } from '../common/reward'
import { saveReword } from './db'
import { sendToken } from './token'

export const send = async function (
	params: ParamsOfSendApi
): Promise<UndefinedOr<boolean>> {
	const reward = await whenDefined(
		params,
		async (p) => await getReward(p.message)
	)

	const isSend = await whenDefinedAll(
		[params, reward],
		async ([p, r]) => await sendToken(p.address, r)
	)

	const isSaved =
		isSend === true
			? await whenDefinedAll(
					[params, reward],
					async ([p, r]) => await saveReword(p.message, r)
			  )
			: undefined
	return isSaved
}
