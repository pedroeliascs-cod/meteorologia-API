import { Beach } from '@src/models/beach';

describe('beaches testes funcionais', () => {
  beforeAll(async () => await Beach.deleteMany({}));
  describe('quando criar a praia', () => {
    it('deve criar a praia com sucesso', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };
      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('deve retornar um erro 422 quando há um erro de validação', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
        'Beach validation failed: lat: Cast to Number failed for value \"invalid_string\" (type string) at path \"lat\"',
      })
    });

    it.skip("deve retornar um erro 500 quando acontece um erro interno", async () => {
        //TODO
    })
  });
});
