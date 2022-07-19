import './util/module-alias';
// importa o alias
// que mais nada mais é que um
// encurtador de dir
// utilizando @src ou @test

import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';

import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beaches';
import { Application } from 'express';

import * as database from '@src/database';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    // constructor do setup de configuração do Server
    super();
  }

  public async init(): Promise<void> {
    // function de iniciação
    // iniciando os metodos necessarios para
    // o funcionando do sistema
    this.setupExpress();
    this.setupControllers();
    await this.dataBaseSetup();
  }

  private setupExpress(): void {
    // é feito a configuração do sistema
    this.app.use(bodyParser.json());
    // com o uso do bodyParser instancia o metodo de
    // "conversação" com o e respostas do sistema como json
  }

  private setupControllers(): void {
    // é feito a chamada dos controllers
    // e a adição deles no this
    // para assim ser feito as chamadas
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    this.addControllers([forecastController, beachesController]);
  }
 
  private async dataBaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    // retornando o app
    return this.app;
  }
}
