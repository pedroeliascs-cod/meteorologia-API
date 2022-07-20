import { Beach, BeachPosition } from '@src/models/beach';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import apiForecastResponse1BeachFixture from '@test/fixtures/api_forecast_response_1_beache.json';
import supertest from 'supertest';
import nock from 'nock';
// importa a ferramenta de teste para dentro da aplicação

describe('Beah forecast functional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({});
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
    };

    const beach = new Beach(defaultBeach);
    await beach.save();
  });
  // função maior para teste
  it('should return a forecast with a few times', async () => {
    // it = isto
    // nock.recorder.rec()
    // mostra as requisições feitas

    nock('https://api.stormglass.io:443', {
      // intercepta o requisição e seta outro retorno para a mesma
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'acess-control-allow-origin': '*' })
      // controle dos cores
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
      })
      .reply(200, stormGlassWeather3HoursFixture);

    // chama a funcition de teste
    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    // esperava( status ) ser 200
    expect(body).toEqual(apiForecastResponse1BeachFixture);
  });
});
