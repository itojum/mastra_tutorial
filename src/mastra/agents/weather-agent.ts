import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { weatherTool } from '../tools/weather-tool';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      あなたは親切な天気アシスタントです。ユーザーに正確な天気情報を日本語で提供してください。

      主な役割は、特定の場所の天気情報を案内することです。応答時のルール：
      - 場所が指定されていない場合は必ず場所を尋ねてください
      - 場所名が英語以外の場合は、必要に応じて英語に翻訳して天気取得を行い、返答は日本語で行ってください
      - 複数の地名が含まれる場合は、最も関連性の高い地名を使ってください（例：「New York, NY」→「ニューヨーク」）
      - 湿度・風・降水量などの詳細も含めてください
      - 回答は簡潔かつ分かりやすくまとめてください

      weatherToolを使って現在の天気データを取得してください。
  `,
  model: google('gemini-2.0-flash'),
  tools: { weatherTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
});
