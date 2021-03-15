import { HttpRequest } from '@azure/functions'

export const generateHttpRequest = (
	params: Record<string, string>
): HttpRequest => {
	return {
		method: 'POST',
		url: 'https://hogehoge',
		headers: {},
		query: {},
		params: params,
		body: '',
		rawBody: '',
	} as HttpRequest
}
