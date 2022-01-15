import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export type RequestConfig<D = any> = AxiosRequestConfig<D>

export type Response<T = any, D = any> = AxiosResponse<T, D>

export class Request {
  constructor(private request = axios) {}

  public get
  <T = any, R = Response<T>, D = any>(
    url: string,
    config: RequestConfig<D> = {},
  ): Promise<R> {
    return this.request.get<T, R>(url, config);
  }

  public static isRequestError<T = any, D = any>(error: AxiosError<T, D>): boolean {
    return !!(error.response && error.response.status);
  }
}
