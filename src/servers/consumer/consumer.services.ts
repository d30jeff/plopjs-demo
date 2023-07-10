import { CatService } from '@servers/consumer/cat/cat.service';
export const services = {
  cat: new CatService(),
};
