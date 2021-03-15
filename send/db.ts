import BigNumber from 'bignumber.js'
import { UndefinedOr } from '@devprotocol/util-ts'

export const checkAlreadySendReword = async function (
	githubId: string
): Promise<UndefinedOr<boolean>> {
	// TODO DBに何を使うか決まったら修正する
	return false
}

export const saveReword = async function (
	githubId: string,
	reward: BigNumber
): Promise<UndefinedOr<boolean>> {
	// TODO DBに何を使うか決まったら修正する
	return true
}
