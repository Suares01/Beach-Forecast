import { StormGlass } from '@src/clients/StormGlass';
import stormGlassNormalizedWeatherFixtures from '@tests/fixtures/stormGlassNormalizedWeather15hoursFixtues.json';
import stormGlassWeatherFixtures from '@tests/fixtures/stormGlassWeather15hoursFixtures.json';
import axios from 'axios';

jest.mock('axios');

describe('Storm Glass client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -22.9461;
    const lng = -43.1811;

    axios.get = jest.fn().mockResolvedValue({ data: stormGlassWeatherFixtures });

    const stormGlass = new StormGlass(axios);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalizedWeatherFixtures);
  });
});
