import httpStatusCodes, {
  IAPIError,
  IAPIErrorResponse,
} from "./interfaces/ErrorInterfaces";

export class APIError {
  public static format(error: IAPIError): IAPIErrorResponse {
    return {
      ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString
          ? error.codeAsString
          : httpStatusCodes.getStatusText(error.code),
      },
      ...(error.description && { description: error.description }),
      ...(error.documentation && { documentation: error.documentation }),
    };
  }
}
