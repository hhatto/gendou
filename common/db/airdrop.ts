import { PrismaClient, airdrop } from '@prisma/client'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getAirdrop = async function (
	client: PrismaClient,
	address: string
): Promise<UndefinedOr<airdrop>> {
	const record = await client.airdrop.findFirst({
		where: {
			address,
		},
	})
	return record === null ? undefined : record
}
