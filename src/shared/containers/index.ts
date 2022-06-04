import { container } from "tsyringe";

import { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";
import { MongooseBeachesRepository } from "@modules/beaches/repositories/mongoose/MongooseBeachesRepository";
import { StormGlass } from "@modules/forecasts/clients/StormGlass";
import { Rating } from "@modules/forecasts/services/Rating";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { MongooseUsersRepository } from "@modules/users/repositories/mongoose/MongooseUsersRepository";
import { AuthService } from "@services/Auth";
import { ICacheService } from "@services/cacheService/ICacheService";
import { CacheRedisService } from "@services/cacheService/redis/CacheRedisService";
import { Request } from "@shared/util/Request";

container.registerSingleton<ICacheService>("CacheService", CacheRedisService);
container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  MongooseUsersRepository
);
container.registerSingleton<IBeachesRepository>(
  "BeachesRepository",
  MongooseBeachesRepository
);
container.registerSingleton<StormGlass>("StormGlassClient", StormGlass);

container.register<typeof AuthService>("AuthService", {
  useValue: AuthService,
});
container.register<typeof Rating>("ForecastRating", { useValue: Rating });
container.register<Request>("Request", Request);
