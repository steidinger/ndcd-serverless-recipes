import { setupWorker } from 'msw'
import apiMocks from './api-mocks';

const worker = setupWorker(
  ...apiMocks,
)

worker.start()