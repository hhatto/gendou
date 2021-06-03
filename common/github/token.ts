import axios from 'axios'
import { UndefinedOr } from '@devprotocol/util-ts'

export const getApiTokenFromCode = async function (
	code: string
): Promise<UndefinedOr<string>> {
	const res = await axios.post(
		'https://github.com/login/oauth/access_token',
		{
			client_id: process.env.GITHUB_CLIENT_ID,
			client_secret: process.env.GITHUB_CLIENT_SECRETS,
			code,
		},
		{
			responseType: 'json',
			headers: { Accept: 'application/json' },
		}
	)
	return res.status === 200 ? res.data.access_token : undefined
}
