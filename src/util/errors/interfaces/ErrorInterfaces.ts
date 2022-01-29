import httpStatusCodes from "http-status-codes";

export interface IAPIError {
  message: string;
  code: number;
  codeAsString?: string;
  description?: string;
  documentation?: string;
}

export interface IAPIErrorResponse extends Omit<IAPIError, "codeAsString"> {
  error: string;
}

export default httpStatusCodes;
