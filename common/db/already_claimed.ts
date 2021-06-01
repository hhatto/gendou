import { PrismaClient } from '@prisma/client'

export const isAlreadyClaimed = async function (
	client: PrismaClient,
	githubId: string
): Promise<boolean> {
	const count = await client.already_claimed.aggregate({
		where: {
			github_id: githubId,
		},
		_count: {
			github_id: true,
		},
	})
	return count._count.github_id > 0
}
