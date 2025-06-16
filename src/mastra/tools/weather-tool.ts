import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface GeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}
interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
}

export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  execute: async ({ context }) => {
    return await getWeather(context.location);
  },
});

const getWeather = async (location: string) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }

  const { latitude, longitude, name } = geocodingData.results[0];

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

  const response = await fetch(weatherUrl);
  const data = (await response.json()) as WeatherResponse;

  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: name,
  };
};

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: '快晴',
    1: 'ほぼ快晴',
    2: '一部曇り',
    3: '曇り',
    45: '霧',
    48: '着氷性霧',
    51: '弱い霧雨',
    53: 'やや強い霧雨',
    55: '濃い霧雨',
    56: '弱い凍結性霧雨',
    57: '濃い凍結性霧雨',
    61: '弱い雨',
    63: 'やや強い雨',
    65: '強い雨',
    66: '弱い凍結性雨',
    67: '強い凍結性雨',
    71: '弱い雪',
    73: 'やや強い雪',
    75: '強い雪',
    77: '雪粒',
    80: '弱いにわか雨',
    81: 'やや強いにわか雨',
    82: '激しいにわか雨',
    85: '弱いにわか雪',
    86: '強いにわか雪',
    95: '雷雨',
    96: '弱いひょうを伴う雷雨',
    99: '激しいひょうを伴う雷雨',
  };
  return conditions[code] || '不明';
}
