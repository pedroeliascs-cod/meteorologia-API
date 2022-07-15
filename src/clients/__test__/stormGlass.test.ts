import { StormGlass } from '@src/clients/stormGlass';
// import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3hoursFixture from '@test/fixtures/stormGlass_normalized_response_3_hours.json';
import * as HTTPUtil from '@src/util/request';

jest.mock('@src/util/request');
// isso é pra mokar o axios
// o axios é a ferramentas de contato com  a api
// mock é a ferramenta para simulação de obj
// que serve para o teste sem necessidade de conexão real
// com API

describe('StormGlass client', () => {
  // const mockedRequest = axios as jest.Mocked<typeof axios>;
  // jest.Mocked é uma classe que recebe um generico
  // com as infere a typagem da variavel
  // tomar cuidado isso no sistema
  // usar somente no caso de teste

  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<typeof HTTPUtil.Request>

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it(' com os dados corretos sendo enviados está retornando os dados normalizados corretos támbem', async () => {
    const lat = 58.7984;
    const lng = 17.8081;
    // acima informações que vão ser utilizadas para o test

    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixture,
    } as HTTPUtil.Response);
    // define o valor para o axios que está sendo simulado pelo mockedRequest
    // o mockedRequest é uma ferramenta de simução para teste de sistemas
    // com isso a chama de axios.get tem um valor simulado pelo axios para retornar

    const stormGlass = new StormGlass(mockedRequest);
    // faz a criação do OBJ StormGlass passando o Axios(simulado pelo mock)
    const responce = await stormGlass.fetchPoints(lat, lng);
    // faz  a chamada que retorna o resultado simulado
    expect(responce).toEqual(stormGlassNormalized3hoursFixture);
    // caso seja verdeiro
  });

  it('deve excluir os data points incompletos', async () => {
    const lat = 58.7984;
    const lng = 17.8081;
    // acima informações que vão ser utilizadas para o test

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);
    // passa para o get dados incompletos

    const stormGlass = new StormGlass(mockedRequest);
    const responce = await stormGlass.fetchPoints(lat, lng);

    expect(responce).toEqual([]);
  });

  it('deve retornar um erro generico quando a requisição falha antes de alçandar a api externa', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue({ message: 'Network error' });
    // esperando o erro

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      // essa função espera que a fecthPoints seja rejeitada
      // isso causando um erro que é capturado com toThrow
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('deve pegar o StormGlassResponseError quando o serviço StormGlass Retornar com erro', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    MockedRequestClass.isRequestError.mockReturnValue(true);

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error: {"response":{"status":429,"data":{"errors":["Rate Limit reached"]}}}'
    );
  });
});
