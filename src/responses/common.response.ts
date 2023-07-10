import { dayjs } from '@utils/dayjs.util';

type CommonResponseParams = {
  ID?: string;
  createdAt?: Date;
  updatedAt?: Date;
  pictureURL?: string;
};

export class CommonResponse {
  ID?: string;
  createdAt?: string;
  updatedAt?: string;
  pictureURL?: string;

  constructor(params: CommonResponseParams) {
    if (params?.ID) {
      this.ID = params.ID;
    }

    if (params?.createdAt) {
      this.createdAt = dayjs(params.createdAt).utc().format();
    }

    if (params?.updatedAt) {
      this.updatedAt = dayjs(params.updatedAt).utc().format();
    }

    if (params?.pictureURL) {
      this.pictureURL = params.pictureURL;
    }
  }
}
