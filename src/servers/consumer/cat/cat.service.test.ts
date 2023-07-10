import { BadRequestException } from '@exceptions/http-exception';
import { repositories } from '@repositories/index.repository';
import { CatAlreadyExists, CatNotFound } from '@servers/consumer/cat/cat.exception';
import { CatService } from '@servers/consumer/cat/cat.service';

describe('Cat Service', () => {
  const service = new CatService();

  beforeAll(async () => {
    await repositories.cat.deleteMany({});
  });

  afterAll(async () => {
    await repositories.cat.deleteMany({});
  });

  describe('Create', () => {
    it('Should Throw Error When Name Is Empty', async () => {
      try {
        await service.create({
          name: '',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('Should Successfully Create A Cat Record', async () => {
      const cat = await service.create({
        name: 'Kitty',
      });

      expect(cat.ID).toBeDefined();
      expect(cat.name).toBe('Kitty');
      expect(cat.createdAt).toBeDefined();
    });

    it('Should Prevent Duplicate Cat Record', async () => {
      try {
        const cat = await service.create({
          name: 'Kitty',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CatAlreadyExists);
      }
    });
  });

  describe('List', () => {
    it('Should Return A List Of Paginated Cat Record', async () => {
      const cats = await service.list({
        page: 1,
        limit: 10,
      });

      expect(cats.items).toBeDefined();
      expect(cats.pagination).toBeDefined();
      expect(cats.pagination.page).toEqual(1);
      expect(cats.pagination.limit).toEqual(10);
      expect(cats.pagination.totalPages).toBeDefined();
      expect(cats.pagination.totalResults).toBeDefined();
    });
  });

  describe('Find One', () => {
    it('Should Throw Error When Invalid ID Is Given', async () => {
      try {
        const cat = await service.findOne({
          ID: 'INVALID-ID-1234567890',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CatNotFound);
      }
    });

    it('Should Return A Cat Record by Given ID', async () => {
      const newCat = await service.create({
        name: 'Catz',
      });

      const cat = await service.findOne({
        ID: newCat.ID,
      });

      expect(cat.ID).toBe(newCat.ID);
      expect(cat.name).toBe(newCat.name);
      expect(cat.createdAt).toBeDefined();
    });
  });

  describe('Update', () => {
    it('Should Throw Error When Invalid ID Is Given', async () => {
      try {
        const cat = await service.update({
          ID: 'INVALID-ID-1234567890',
          name: 'New Cat',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CatNotFound);
      }
    });

    it('Should Prevent Update When Name Is Taken', async () => {
      const firstCat = await service.create({
        name: 'First Cat',
      });

      const secondCat = await service.create({
        name: 'Second Cat',
      });

      try {
        await service.update({
          ID: secondCat.ID,
          name: 'First Cat',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CatAlreadyExists);
      }
    });

    it('Should Update Existing Cat Record', async () => {
      const newCat = await service.create({
        name: 'Awesome Cat',
      });

      const updatedCat = await service.update({
        ID: newCat.ID,
        name: 'Awesome Cat Edited',
      });

      expect(updatedCat.ID).toBeDefined();
      expect(updatedCat.name).toBe('Awesome Cat Edited');
      expect(updatedCat.createdAt).toBeDefined();
    });
  });

  describe('Delete', () => {
    it('Should Throw Error When Invalid ID Is Given', async () => {
      try {
        await service.delete({
          ID: 'CAT_1234',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CatNotFound);
      }
    });

    it('Should Successfully Remove The Cat', async () => {
      const cat = await service.create({
        name: 'Misai',
      });

      await service.delete({
        ID: cat.ID,
      });

      const existing = await repositories.cat.findFirst({
        where: {
          ID: cat.ID,
        },
      });

      expect(existing).toBeNull();
    });
  });
});
