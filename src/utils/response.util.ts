import { ExpressRequest, ExpressResponse } from '@interfaces/express.interface';
import { SignaleLogger } from '@providers/logger.provider';
import { dayjs } from '@utils/dayjs.util';
import { getFormattedPath } from '@utils/request.util';

export const responseInterceptor = async (
  data: any,
  request: ExpressRequest,
  response: ExpressResponse
) => {
  const timestamp = dayjs().utc().format();

  if (data && data.pagination) {
    response.setHeader('X-Page', data.pagination.page);
    response.setHeader('X-Total-Pages', data.pagination.totalPages);
    response.setHeader('X-Total-Results', data.pagination.totalResults);
  }

  return {
    data,
    metadata: {
      statusCode: response.statusCode,
      resource: getFormattedPath(request),
      timestamp,
      requestID: request.id,
    },
  };
};
