import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { main } from './main'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const isSend = await main(req)
	const status = isSend instanceof Error ? 400 : 200
	const message = status === 200 ? 'success' : (isSend as Error).message

	return {
		status: status,
		body: { message: message },
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
