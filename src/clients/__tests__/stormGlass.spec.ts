import { StormGlass } from '@src/clients/StormGlass';
import stormGlassNormalizedWeatherFixtures from '@tests/fixtures/stormGlassNormalizedWeather15hoursFixtues.json';
import stormGlassWeatherFixtures from '@tests/fixtures/stormGlassWeather15hoursFixtures.json';
import axios from 'axios';

jest.mock('axios');

describe('Storm Glass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -22.9461;
    const lng = -43.1811;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeatherFixtures });

    const stormGlass = new StormGlass(mockedAxios);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalizedWeatherFixtures);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -22.9461;
    const lng = -43.1811;
    const incompleteResponse = {
      hours: [
        {
          waveHeight: {
            noaa: 300,
          },
          time: '2022-01-13T00:00:00+00:00',
        },
      ],
    };

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);

    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it(
    'should get a generic error from StormGlass service when the request fail before reaching the service',
    async () => {
      const lat = -22.9461;
      const lng = -43.1811;

      mockedAxios.get.mockRejectedValue({ message: 'Network Error' });

      const stormGlass = new StormGlass(mockedAxios);

      await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
        'Unexpected error when trying to communicate to StormGlass: Network Error',
      );
    },
  );

  it(
    'should get an StormGlassResponseError when the StormGlass service responds with error',
    async () => {
      const lat = -22.9461;
      const lng = -43.1811;

      mockedAxios.get.mockRejectedValue({
        response: {
          status: 429,
          data: { errors: ['Rate Limit reached'] },
        },
      });

      const stormGlass = new StormGlass(mockedAxios);

      await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
        'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429',
      );
    },
  );
});
