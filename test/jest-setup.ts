import { SetupServer } from "@src/server";
import supertest from "supertest";

beforeAll(() => {
  // a chamada antes de tudo acontecer
  const server = new SetupServer();
  // cria um novo OBJ setupServer
  // que é a configuração do servidor
  server.init();
  // inicia o servidor
  global.testRequest = supertest(server.getApp());
  // coloca valor no testRequest
  // sendo ele o app() do servidor
});
