import { AxiosStatic } from 'axios';
export interface StormGlassPointSource {
  // [key: string]
  // permite qualquer String sendo o "nome"
  // do apontamento do obj
  // "idade": 20,
  //  o idade é a Key string
  [key: string]: number;
}

export interface StormGlassPoint {
  // esse é o padrão de dados que a API deve retornar
  // será esse modelo será usado como lista
  time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  // a interface nada mais é que o formato do OBJ
  // sendo o stormGlassForescastResponse
  // uma lista de StormGlassPoint
  // sendo setado a lista com o []
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  // essa interface vai ser utilizado
  // para a listagem dos dados já tratados
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed';
  // são os parametros passados para a api

  readonly stormGlassAPISource = 'noaa';
  // source passo para a api

  constructor(protected request: AxiosStatic) {}
  // contructor desse obj é passado o axiosStatic

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const response = await this.request.get<StormGlassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`
    );
    // contato com a API
    return this.normalizeResponse(response.data)
  }

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      // faz a validação do point.hours passando o insValidPoint com o bind(this)
      // e mapeando os valores
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }


  private isValidPoint(point: Partial<StormGlassPoint>): Boolean {
    // o parcial deixa todas as chaves {} como opcionais
    // sendo assim nós forçando a validar todas elas abaixo
    return !!(
      // o !! força o retorno de boolean
      point.time &&
      // caso o point.time exista retorna true
      point.swellDirection?.[this.stormGlassAPISource] &&
      // caso o swellDireciton[this.stormGlassAPISource]exista retorna true
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
