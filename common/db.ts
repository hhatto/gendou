import { PrismaClient } from '@prisma/client'

export const getDbClient = (option = {}): PrismaClient => {
	const prisma = new PrismaClient(option)
	return prisma
}

export const close = async (client: PrismaClient): Promise<boolean> => {
	// eslint-disable-next-line functional/no-expression-statement
	await client.$disconnect()
	return true
}
