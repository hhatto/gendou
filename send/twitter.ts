import { UndefinedOr, getTextUrls } from '@devprotocol/util-ts'

export const checkIncludingUrl = async function (
	twitterId: string
): Promise<UndefinedOr<boolean>> {
	const [, urls] = await getTextUrls(twitterId)
	// TODO URL決まったら修正する
	const targetUrls = urls.filter(
		(url) => url.indexOf('https://hogehoge') !== -1
	)

	return targetUrls.length > 0
}
