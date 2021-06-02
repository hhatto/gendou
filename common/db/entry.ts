import { PrismaClient } from '@prisma/client'

export const insertEntry = async function (
	client: PrismaClient,
	githubId: string,
	address: string,
	sign: string
): Promise<boolean> {
	const time = new Date()
	const createData = await client.entry.create({
		data: {
			github_id: githubId,
			address: address,
			sign: sign,
			create_at: time,
		},
	})
	return (
		createData.id > 0 &&
		createData.github_id === githubId &&
		createData.address === address &&
		createData.sign === sign &&
		createData.create_at.getTime() === time.getTime()
	)
}
