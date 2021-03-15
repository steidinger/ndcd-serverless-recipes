import 'source-map-support/register'
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {getUserId} from '../utils';
import {getAllRecipes} from '../../businessLayer/recipes';

const getRecipesHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const recipes = await getAllRecipes(userId);
    return {
        statusCode: 200,
        body: JSON.stringify({recipes}),
    }
}

export const handler = middy(getRecipesHandler);
handler
    .use(httpErrorHandler())
    .use(cors({
        origin: "http://localhost:3000"
    }));
