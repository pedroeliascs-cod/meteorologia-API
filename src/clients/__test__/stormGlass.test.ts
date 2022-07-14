import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3hoursFixture from '@test/fixtures/stormGlass_normalized_response_3_hours.json';

jest.mock('axios');
// isso é pra mokar o axios
// o axios é a ferramentas de contato com  a api
// mock é a ferramenta para simulação de obj
// que serve para o teste sem necessidade de conexão real
// com API

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  // jest.Mocked é uma classe que recebe um generico
  // com as infere a typagem da variavel
  // tomar cuidado isso no sistema
  // usar somente no caso de teste
  it('should return the normalized forecast fromt the stromGlass service', async () => {
    const lat = 58.7984;
    const lng = 17.8081;
    // acima informações que vão ser utilizadas para o test

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });
    // define o valor para o axios que está sendo simulado pelo mockedAxios
    // o mockedAxios é uma ferramenta de simução para teste de sistemas
    // com isso a chama de axios.get tem um valor simulado pelo axios para retornar

    const stormGlass = new StormGlass(axios);
    // faz a criação do OBJ StormGlass passando o Axios(simulado pelo mock)
    const responce = await stormGlass.fetchPoints(lat, lng);
    // faz  a chamada que retorna o resultado simulado
    expect(responce).toEqual(stormGlassNormalized3hoursFixture);
    // caso seja verdeiro
  });
});
