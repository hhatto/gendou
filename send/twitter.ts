import { getTextUrls } from '@devprotocol/util-ts'

export const checkIncludingUrl = async function (
	twitterId: string
): Promise<boolean | Error> {
	const [isStatusGreen, urls] = await getTextUrls(twitterId)
	// TODO URL決まったら修正する
	const targetUrls = urls.filter(
		(url) => url.indexOf('https://hogehoge') !== -1
	)
	const result = isStatusGreen
		? targetUrls.length > 0
		: new Error('twitter api access error')
	return result
}
