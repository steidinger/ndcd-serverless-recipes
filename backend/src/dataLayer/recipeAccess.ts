import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { Recipe, RecipeUpdate } from '../models';

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient();
const RecipesTable = process.env.RECIPES_TABLE;
const RecipesIdIndex = process.env.RECIPES_ID_INDEX;

export async function getAllRecipes(userId: string): Promise<Recipe[]> {
    const result = await docClient.query({
        TableName: RecipesTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
    }).promise();
    return result.Items as Recipe[];
}

export async function createRecipe(Recipe: Recipe): Promise<Recipe> {
    await docClient.put({
        TableName: RecipesTable,
        Item: Recipe,
    }).promise();
    return Recipe;
}

export async function loadRecipe(RecipeId: string): Promise<Recipe> {
    const result = await docClient.query({
        TableName: RecipesTable,
        IndexName: RecipesIdIndex,
        KeyConditionExpression: 'id = :RecipeId',
        ExpressionAttributeValues: {
            ':RecipeId': RecipeId
        }
    }).promise();

    if (result.Count === 0) {
        return null;
    }
    return result.Items[0] as Recipe;
}

export async function deleteRecipe(Recipe: Recipe): Promise<void> {
    await docClient.delete({
        TableName: RecipesTable,
        Key: {
            userId: Recipe.userId,
            createdAt: Recipe.createdAt,
        }
    }).promise();
}

export async function updateRecipe(Recipe: Recipe, update: RecipeUpdate): Promise<Recipe> {
    const updateResult = await docClient.update({
        TableName: RecipesTable,
        Key: {
            userId: Recipe.userId,
            createdAt: Recipe.createdAt,
        },
        UpdateExpression: "SET title = :title, description = :description",
        ExpressionAttributeValues: {
            ":title": update.title,
            ":description": update.description,
        },
        ReturnValues: "ALL_NEW"
    }).promise();
    const updated = updateResult.Attributes;
    return updated as Recipe;
}

export async function addImage(Recipe: Recipe, imageUrl: string, imageId: string): Promise<void> {
    await docClient.update({
        TableName: RecipesTable,
        Key: {
            "userId": Recipe.userId,
            "createdAt": Recipe.createdAt,
        },
        UpdateExpression: "SET imageUrl = :imageUrl, imageId = :imageId",
        ExpressionAttributeValues: {
            ":imageUrl": imageUrl,
            ":imageId": imageId,
        },
        ReturnValues: "NONE"
    }).promise();
}


