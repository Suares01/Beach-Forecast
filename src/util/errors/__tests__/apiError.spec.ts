import { APIError } from "../ApiError";

describe("ApiError", () => {
  it("should format error with mandatory fields", () => {
    const error = APIError.format({
      message: "User not found",
      code: 404,
    });

    expect(error).toEqual({
      ...error,
      error: "Not Found",
    });
  });

  it("should format error with mandatory fields and description", () => {
    const error = APIError.format({
      message: "User not found",
      code: 404,
      description: "This error happens when there isn't user created",
    });

    expect(error).toEqual({
      ...error,
      error: "Not Found",
    });
  });

  it("should format error with mandatory fields and documentation", () => {
    const error = APIError.format({
      message: "User not found",
      code: 404,
      documentation: "https://docs.com/#error-404",
    });

    expect(error).toEqual({
      ...error,
      error: "Not Found",
    });
  });

  it("should format error with mandatory fields, documentation and description", () => {
    const error = APIError.format({
      message: "User not found",
      code: 404,
      documentation: "https://docs.com/#error-404",
      description: "This error happens when there isn't user created",
    });

    expect(error).toEqual({
      ...error,
      error: "Not Found",
    });
  });
});
