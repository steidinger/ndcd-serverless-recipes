import 'source-map-support/register'
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import {getUserId} from '../utils';
import {getRecipe} from '../../businessLayer/recipes';

const logger = createLogger("update-recipes");

export const updateRecipeHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const recipeId = event.pathParameters.recipeId
    const userId = getUserId(event);
    const updated = await getRecipe(recipeId, userId);
    logger.info('Update complete');
    return {
        statusCode: 200,
        body: JSON.stringify(updated)
    }
}

export const handler = middy(updateRecipeHandler);
handler
    .use(httpErrorHandler())
    .use(cors({
        origin: "http://localhost:3000"
    }));
