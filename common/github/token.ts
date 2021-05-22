import bent from 'bent'

export const getApiTokenFromCode = async function (
	code: string
): Promise<string> {
	const auth = await bent(
		'https://github.com',
		'POST',
		'json'
	)('/login/oauth/access_token', {
		client_id: process.env.GITHUB_CLIENT_ID,
		client_secret: process.env.GITHUB_CLIENT_SECRETS,
		code,
	}).then((r) => r as unknown as { readonly access_token: string })
	const { access_token } = auth
	return access_token
}
