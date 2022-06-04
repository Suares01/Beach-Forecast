import { IBeach, Position } from "@modules/beaches/models/mongoose/Beach";
import { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";

import { CreateBeachUseCase } from "../CreateBeachUseCase";

describe("CreateBeachUseCase", () => {
  const beachesRepository: jest.Mocked<IBeachesRepository> = {
    save: jest.fn(),
  };

  const createBeachUseCase = new CreateBeachUseCase(beachesRepository);

  const defaultBeach: IBeach = {
    id: "1v89df1g6f5g1",
    lat: 123456,
    lng: 654321,
    name: "Test Beach",
    position: Position.south,
    user: "123456789",
  };

  it("should return a beach with success", async () => {
    beachesRepository.save.mockResolvedValue(defaultBeach);

    const { lat, lng, name, position, user } = defaultBeach;

    const beach = await createBeachUseCase.execute({
      lat,
      lng,
      name,
      position,
      user,
    });

    expect(beach).toEqual(defaultBeach);
  });
});
