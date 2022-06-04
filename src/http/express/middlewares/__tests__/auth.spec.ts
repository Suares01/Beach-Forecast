import { AuthService } from "@services/Auth";

import { authMiddleware } from "../auth";

describe("AuthMiddleware", () => {
  it("should verify a JWT and call the next middleware", () => {
    const token = AuthService.generateToken({ data: "fake" });

    const fakeRequest = {
      headers: {
        "x-access-token": token,
      },
    };

    const fakeResponse = {};

    const fakeNext = jest.fn();

    authMiddleware(fakeRequest, fakeResponse, fakeNext);

    expect(fakeNext).toHaveBeenCalled();
  });

  it("should return unauthorized if there is a problem on the token verification", () => {
    const fakeInvalidRequest = {
      headers: {
        "x-access-token": "invalid token",
      },
    };

    const jsonMock = jest.fn();

    const fakeResponse = {
      status: jest.fn(() => ({
        json: jsonMock,
      })),
    };

    const fakeNext = jest.fn();

    authMiddleware(fakeInvalidRequest, fakeResponse as object, fakeNext);

    expect(fakeResponse.status).toHaveBeenCalledWith(401);

    expect(jsonMock).toHaveBeenCalledWith({
      code: 401,
      error: "Unauthorized",
      message: "jwt malformed",
    });
  });

  it("should return unauthorized middleware if theres no token", () => {
    const fakeInvalidRequest = {
      headers: {},
    };

    const jsonMock = jest.fn();

    const fakeResponse = {
      status: jest.fn(() => ({
        json: jsonMock,
      })),
    };

    const fakeNext = jest.fn();

    authMiddleware(fakeInvalidRequest, fakeResponse as object, fakeNext);

    expect(fakeResponse.status).toHaveBeenCalledWith(401);

    expect(jsonMock).toHaveBeenCalledWith({
      code: 401,
      error: "Unauthorized",
      message: "jwt must be provided",
    });
  });
});
