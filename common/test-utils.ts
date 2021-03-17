/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import { HttpRequest } from '@azure/functions'
import { PrismaClient } from '@prisma/client'

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

export const setEnv = (): void => {
	process.env.DATABASE_URL =
		'postgresql://testuser:testpassword@localhost:5432/testdb?schema=public'
}

export const generateTestData = async (): Promise<void> => {
	const prisma = new PrismaClient()
	await prisma.send_info.deleteMany()
	prisma.send_info.create({
		data: {
			github_id: 'github-id1',
			reward: '100000000000000000000',
			is_already_send: false,
		},
	})
	await prisma.$disconnect()
}
