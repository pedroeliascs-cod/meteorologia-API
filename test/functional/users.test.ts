import { User } from '@src/models/user';
import Authservice from '@src/services/auth';

describe('user funcional testes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  describe('Quando criar um novo usuario com a senha cripografada', () => {
    it('deve criar um novo usuario', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      await expect(
        Authservice.comparePasswords(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });

    it('deve retornar um erro 422 quando acontece um erro na validação ', async () => {
      const newUser = {
        email: 'john@mail.com',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('deve retornar 409 quando o email já existir', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };

      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database.',
      });
    });
  });

  describe('Quando o usuario autenticar', () => {
    it.only('deve gerar um token para um usuario valido', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };

      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password });
    
      expect(response.body).toEqual(
        expect.objectContaining({token: expect.any(String)})
      )
      });
  });
});
