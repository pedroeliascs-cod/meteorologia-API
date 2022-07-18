import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/internal-error';

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

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
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
    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        // points é a variavel retornada pela
        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichedBeachData);  
      }

      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error) {
      throw new ForecastProcessingInternalError((error as Error).message);
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
   return points.map((e) => ({
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
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForcast[] {
    const mapForecastByTime: TimeForcast[] = [];
    // array que recebera as informações processadas

    for (const point of forecast) {
      const timePoint = mapForecastByTime.find((f) => f.time === point.time);
      //  passa por todos os obj dentro de mapForecastByTime
      // em busca de um time que bata como point.time
      if (timePoint) {
        // caso já exista
        timePoint.forecast.push(point);
      } else {
        // caso não exista
        mapForecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return mapForecastByTime;
  }
}
