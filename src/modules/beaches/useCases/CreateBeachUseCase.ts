import { inject, injectable } from "tsyringe";

import { SaveBeachData } from "../dtos";
import { IBeach } from "../models/mongoose/Beach";
import { IBeachesRepository } from "../repositories/IBeachesRepository";

@injectable()
export class CreateBeachUseCase {
  constructor(
    @inject("BeachesRepository") private beachesRepository: IBeachesRepository
  ) {}

  public async execute(data: SaveBeachData): Promise<IBeach> {
    const beach = await this.beachesRepository.save(data);

    return beach;
  }
}
