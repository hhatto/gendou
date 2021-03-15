import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { main } from './main'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const isSend = await main(req)
	const status = typeof isSend === 'undefined' || isSend === false ? 400 : 200
	const message = status === 200 ? 'success' : 'error'

	return {
		status: status,
		body: { message: message },
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
