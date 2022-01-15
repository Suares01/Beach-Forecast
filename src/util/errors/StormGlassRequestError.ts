import { AxiosError } from 'axios';

import { InternalError } from './InternalError';

export class StormGlassRequestError extends InternalError {
  constructor(err: AxiosError) {
    const internalMessage = 'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: Error: ${JSON.stringify(err.response?.data)} Code: ${err.response?.status}`);
  }
}
