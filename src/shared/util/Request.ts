import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export type RequestConfig = AxiosRequestConfig;

export type Response<T> = AxiosResponse<T>;

export type RequestError<T> = AxiosError<T>;

export class Request {
  constructor(private request = axios) {}

  public get<T = any, R = Response<T>>(
    url: string,
    config: RequestConfig = {}
  ): Promise<R> {
    return this.request.get<T, R>(url, config);
  }

  public isRequestError<T = any>(error: RequestError<T>): boolean {
    return !!(error.response && error.response.status);
  }
}
