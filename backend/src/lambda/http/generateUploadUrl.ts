import 'source-map-support/register'
import {extname} from 'path';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import {getUserId} from '../utils';
import {addImage} from '../../businessLayer/recipes';


const logger = createLogger("upload");

export const generateUploadUrlHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const recipeId = event.pathParameters.recipeId;
    const {filename} = JSON.parse(event.body);
    const userId = getUserId(event);

    logger.info(`generate upload url for ${recipeId}`)
    const uploadUrl = await addImage(recipeId, extname(filename), userId);

    return {
        statusCode: 201,
        body: JSON.stringify({
            uploadUrl
        })
    }
}

export const handler = middy(generateUploadUrlHandler);
handler
    .use(httpErrorHandler())
    .use(cors({
        origin: "http://localhost:3000"
    }));
