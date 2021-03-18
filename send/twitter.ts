import { UndefinedOr, whenDefined, getTextUrls } from '@devprotocol/util-ts'

export const checkIncludingUrl = async function (
	twitterId: string
): Promise<UndefinedOr<boolean>> {
	const [status, urls] = await getTextUrls(twitterId)
	const targetUrls =
		status === true
			? whenDefined(process.env.CHECK_URL, (checkUrl) =>
					urls.filter((url) => url.indexOf(checkUrl) !== -1)
			  )
			: undefined

	return whenDefined(targetUrls, (urls) => urls.length > 0)
}
