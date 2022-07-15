import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForcast {
  time: string;
  forecast: BeachForecast[];
}

export class Forecast {
  // classe para processameto de dados
  constructor(protected stormGlass = new StormGlass()) {}
  // classe pode receber um stormGlass
  // mas caso não seja passado instancia um novo stormGlass

  public async processForecastForBeaches(
    // faz o processamento que retorna da api
    beaches: Beach[]
  ): Promise<TimeForcast[]> {
    
    const pointsWithCorrectSources: BeachForecast[] = [];
    // o array que recebera os valores processados pelo client
    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      // points é a variavel retornada pela 

      const enrichedBeachData = points.map((e) => ({
        // e é um obj de informações daquela praia
        // ...{},{a: b, d: c}, ...e
        // é um jeito de mesclar os objetos
        ...{},
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1, //need to be implemented
        },
        ...e,
      }));
      pointsWithCorrectSources.push(...enrichedBeachData);
    }
    return this.mapForecastByTime(pointsWithCorrectSources);
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForcast[] {
    const mapForecastByTime: TimeForcast[] = [];  

    for (const point of forecast) {
      const timePoint = mapForecastByTime.find((f) => f.time === point.time);

      if(timePoint){
        timePoint.forecast.push(point);
      }else{
        mapForecastByTime.push({
          time: point.time,
          forecast: [point]
        })
      }
    }
    return mapForecastByTime;
  }
}
