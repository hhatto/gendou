// import { AzureFunction, Context, HttpRequest } from '@azure/functions'
// import { generateErrorApiResponce } from '../common/utils'
// // import { getParams } from './params'
// // import { main } from './main'

// const httpTrigger: AzureFunction = async (
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	context: Context,
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	req: HttpRequest
// ): Promise<ReturnTypeOfAzureFunctions> => {
// 	// const params = getParams(req)
// 	// const result =
// 	// 	typeof params === 'undefined'
// 	// 		? generateErrorApiResponce('parameters error', 400)
// 	// 		: await main(params.githubId)
// 	// return {
// 	// 	status: result.status,
// 	// 	body: result.body,
// 	// 	headers: {
// 	// 		'Cache-Control': 'no-store',
// 	// 	},
// 	// }
// 	const result = generateErrorApiResponce('info is stopped', 400)
// 	return {
// 		status: result.status,
// 		body: result.body,
// 		headers: {
// 			'Cache-Control': 'no-store',
// 		},
// 	}
// }

// export default httpTrigger
