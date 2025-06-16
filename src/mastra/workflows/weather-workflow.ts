import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const llm = google('gemini-1.5-pro-latest');

const agent = new Agent({
  name: 'Weather Agent',
  model: llm,
  instructions: `
        あなたは天気に基づいたプランニングを得意とするローカルアクティビティと旅行のエキスパートです。天気データを分析し、実用的なアクティビティの提案を行ってください。

        予報の各日について、以下の形式で正確に回答してください：

        📅 [曜日、月 日付、年]
        ═══════════════════════════

        🌡️ 天気概要
        • 状態: [簡単な説明]
        • 気温: [X°C/Y°F から A°C/B°F]
        • 降水確率: [X%]

        🌅 午前のアクティビティ
        屋外:
        • [アクティビティ名] - [具体的な場所/ルートを含む簡単な説明]
          最適な時間帯: [具体的な時間帯]
          注意点: [関連する天気の考慮事項]

        🌞 午後のアクティビティ
        屋外:
        • [アクティビティ名] - [具体的な場所/ルートを含む簡単な説明]
          最適な時間帯: [具体的な時間帯]
          注意点: [関連する天気の考慮事項]

        🏠 室内の代替案
        • [アクティビティ名] - [具体的な会場を含む簡単な説明]
          適している天気: [この代替案が推奨される天気状況]

        ⚠️ 特別な注意事項
        • [関連する天気警報、UV指数、風の状態など]

        ガイドライン:
        - 1日あたり2-3個の時間指定の屋外アクティビティを提案
        - 1-2個の室内の代替案を含める
        - 降水確率が50%を超える場合は、室内アクティビティを優先
        - すべてのアクティビティはその場所に特化したものであること
        - 具体的な会場、トレイル、場所を含める
        - 気温に基づいてアクティビティの強度を考慮
        - 説明は簡潔かつ有益であること

        一貫性のため、絵文字とセクションヘッダーを含むこの正確な形式を維持してください。
      `,
});

const forecastSchema = z.object({
  date: z.string(),
  maxTemp: z.number(),
  minTemp: z.number(),
  precipitationChance: z.number(),
  condition: z.string(),
  location: z.string(),
});

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    95: 'Thunderstorm',
  };
  return conditions[code] || 'Unknown';
}

const fetchWeather = createStep({
  id: 'fetch-weather',
  description: 'Fetches weather forecast for a given city',
  inputSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
  outputSchema: forecastSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error('Input data not found');
    }

    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputData.city)}&count=1`;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = (await geocodingResponse.json()) as {
      results: { latitude: number; longitude: number; name: string }[];
    };

    if (!geocodingData.results?.[0]) {
      throw new Error(`Location '${inputData.city}' not found`);
    }

    const { latitude, longitude, name } = geocodingData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,weathercode&timezone=auto,&hourly=precipitation_probability,temperature_2m`;
    const response = await fetch(weatherUrl);
    const data = (await response.json()) as {
      current: {
        time: string;
        precipitation: number;
        weathercode: number;
      };
      hourly: {
        precipitation_probability: number[];
        temperature_2m: number[];
      };
    };

    const forecast = {
      date: new Date().toISOString(),
      maxTemp: Math.max(...data.hourly.temperature_2m),
      minTemp: Math.min(...data.hourly.temperature_2m),
      condition: getWeatherCondition(data.current.weathercode),
      precipitationChance: data.hourly.precipitation_probability.reduce(
        (acc, curr) => Math.max(acc, curr),
        0,
      ),
      location: name,
    };

    return forecast;
  },
});

const planActivities = createStep({
  id: 'plan-activities',
  description: 'Suggests activities based on weather conditions',
  inputSchema: forecastSchema,
  outputSchema: z.object({
    activities: z.string(),
  }),
  execute: async ({ inputData }) => {
    const forecast = inputData;

    if (!forecast) {
      throw new Error('Forecast data not found');
    }

    const prompt = `Based on the following weather forecast for ${forecast.location}, suggest appropriate activities:
      ${JSON.stringify(forecast, null, 2)}
      `;

    const response = await agent.stream([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let activitiesText = '';

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      activitiesText += chunk;
    }

    return {
      activities: activitiesText,
    };
  },
});

const weatherWorkflow = createWorkflow({
  id: 'weather-workflow',
  inputSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
  outputSchema: z.object({
    activities: z.string(),
  }),
})
  .then(fetchWeather)
  .then(planActivities);

weatherWorkflow.commit();

export { weatherWorkflow };
