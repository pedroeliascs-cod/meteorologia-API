import {StormGlass} from "@src/clients/stormGlass";
import axios from "axios";
import stormGlassWeather3HoursFixture from "@test/fixtures/stormglass_weather_3_hours.json";
import stormGlassNormalized3hoursFixture from "@test/fixtures/stormGlass_normalized_response_3_hours.json";

jest.mock('axios');
// isso é pra mokar o axios
// o axios é a ferramentas de contato com  a api
// mock é a ferramenta para simulação de obj
// que serve para o teste sem necessidade de conexão real 
// com API

describe("StormGlass client", () => {
    it('should return the normalized forecast fromt the stromGlass service', async() => {
        const lat  = 58.7984;
        const lng = 17.8081;
        // acima informações que vão ser utilizadas para o test

        axios.get = jest.fn().mockResolvedValue(stormGlassWeather3HoursFixture);
        // define um valor padrão para o retorno da chama do axios.get
        // isso sendo simulado pelo mock

        const stormGlass = new StormGlass(axios);
        // faz a criação do OBJ StormGlass passando o Axios(simulado pelo mock)
        const responce = await stormGlass.fetchPoints(lat, lng);
        // faz  a chamada que retorna o resultado simulado 
        expect(responce).toEqual(stormGlassNormalized3hoursFixture);
        // caso seja verdeiro
        

    });
});