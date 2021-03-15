import 'source-map-support/register'
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { SaveRecipeRequest } from '../../requests/SaveRecipeRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils';
import { create } from '../../businessLayer/recipes';

const logger = createLogger("create-recipe");

export const createRecipeHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("processing create recipe request");
    const recipeRequest: SaveRecipeRequest = JSON.parse(event.body)
    const userId = getUserId(event);

    const recipe = await create(recipeRequest, userId);
    logger.info(`added recipe ${recipe}`);
    return {
        statusCode: 201,
        body: JSON.stringify({
            recipe,
        })
    }
}

export const handler = middy(createRecipeHandler);
handler
    .use(httpErrorHandler())
    .use(cors({
        origin: "http://localhost:3000"
    }));
