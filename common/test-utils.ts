/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */
import { HttpRequest } from '@azure/functions'

export const generateHttpRequest = (
	params: Record<string, string>,
	body: Record<string, string>
): HttpRequest => {
	return {
		method: 'POST',
		url: 'https://hogehoge',
		headers: {},
		query: {},
		params: params,
		body: body,
		rawBody: '',
	} as HttpRequest
}

export const setEnv = (): void => {
	process.env.DATABASE_URL =
		'postgresql://testuser:testpassword@localhost:5432/testdb?schema=public'
}
