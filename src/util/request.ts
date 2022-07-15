import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface RequestConfig extends AxiosRequestConfig {}
// extende e mascara o axiosRequestConfig
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Response<T = any> extends AxiosResponse<T> {}
// extende e marcara o axiosRespose<T>
// T sendo generico

export class Request {
  constructor(private request = axios) {}
  // sendo que esse obj é invocado
  // instancia o axios

  public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    // essa função publica de nome Get
    // sendo ela generico
    // recebe url e config
    // e retornando o tipo promisse que deve conter a promessa de resposta de tipo generico
    return this.request.get<T, Response<T>>(url, config);
    // retorna chamando o get axios e esperando o retorno de um generico e de uma resposta que pode ser generica
    // passando o parametro url e config para a chamada
  }

  public static isRequestError(error: Error): boolean {
    // usado para validar se o erro veio de requisição
    return !!(  
      // !! força o retorno boolean
      ((error as AxiosError).response && (error as AxiosError).response?.status)
      // error é atribuido a AxiosErros
      // pois o unico lugar aonde o axios é encontrato é nesse OBJ
    );
  }

  public static extractErrorData(
    // faz a estração do erro
    error: unknown
  ): Pick<AxiosResponse, 'data' | 'status'> {
    // pick é usado para (T, união de K)
    // aonde T é o AxiosResponse
    // o K é a união de 'data' e 'status'
    const axiosError = error as AxiosError;
    // aponta um tipo para error
    if (axiosError.response && axiosError.response.status) {
      // caso exista response e o status
      // é um erro de request
      return {
        // retorna os status dele
        data: axiosError.response.data,
        status: axiosError.response.status,
      };
    }
    // caso não
    // retorna um novo erro
    throw Error(`The error ${error} is not a Request Error`);
  }
}
