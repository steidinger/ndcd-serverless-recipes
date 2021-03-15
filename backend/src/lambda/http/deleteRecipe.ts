import 'source-map-support/register'
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils';
import { deleteRecipe } from '../../businessLayer/recipes';

const logger = createLogger("delete-recipe");


export const deleteRecipeHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const recipeId = event.pathParameters.recipeId

    logger.info(`Processing delete event for ID ${recipeId}`);
    const userId = getUserId(event);

    await deleteRecipe(recipeId, userId);

    return {
        statusCode: 204,
        body: '',
    }
}

export const handler = middy(deleteRecipeHandler);
handler
    .use(httpErrorHandler())
    .use(cors({
        origin: "http://localhost:3000"
    }));
