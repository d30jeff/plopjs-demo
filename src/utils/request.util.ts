import { ExpressRequest } from '@interfaces/express.interface';

export const getFormattedPath = (request: ExpressRequest) => {
  return [request.baseUrl, request.path]
    .filter((path) => {
      return Boolean(path);
    })
    .join('');
};
