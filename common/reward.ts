import BigNumber from 'bignumber.js'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getReward = async function (
	githubId: string
): Promise<UndefinedOr<BigNumber>> {
	// TODO 実装方法固まったら作り直す
	// 0だったときはundef返す
	const result = new BigNumber(123)
	return result
}
