import path from 'path';
import { rest } from 'msw'
import { recipes } from './recipes';
import * as uuid from 'uuid';

function findRecipe(id) {
    return recipes.find(r => r.id === id);
}

const mocks = [
    rest.get('/api/recipes', (req, res, ctx) => {
        return res(
            ctx.json({
                recipes
            }),
        )
    }),
    rest.get('/api/recipes/:id', (req, res, ctx) => {
        const id = req.params.id;
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) {
            return res(ctx.status(404));
        }
        return res(ctx.json(recipe));
    }),
    rest.delete('/api/recipes/:id', (req, res, ctx) => {
        if (!findRecipe(req.params.id)) {
            return res(ctx.status(404));
        }
        return res(ctx.status(200));
    }),
    rest.post('/api/recipes', (req, res, ctx) => {
        return res(ctx.status(201));
    }),
    rest.put('/api/recipes/:id', (req, res, ctx) => {
        if (!findRecipe(req.params.id)) {
            return res(ctx.status(404));
        }
        return res(ctx.status(200));
    }),
    rest.post('/api/recipes/:id/image', (req, res, ctx) => {
        if (!req.body || !req.body['filename']) {
            return res(ctx.status(400, 'Missing filename'));
        }
        if (!findRecipe(req.params.id)) {
            return res(ctx.status(404));
        }
        const extension = path.extname(req.body['filename']);
        return res(
            ctx.status(200),
            ctx.delay(1000),
            ctx.json({ uploadUrl: '/api/upload/' + uuid.v4() + extension })
        );
    }),
    rest.put('/api/upload/:id', (req, res, ctx) => {
        return res(
            ctx.delay(1000),
            ctx.status(200),
            );
    }),
];

export default mocks;