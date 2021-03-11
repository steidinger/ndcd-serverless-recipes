import { setupWorker, rest } from 'msw'
import { recipes } from './recipes';

const worker = setupWorker(
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
    const id = req.params.id;
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) {
      return res(ctx.status(404));
    }
    return res(ctx.status(200));
  })
)

worker.start()