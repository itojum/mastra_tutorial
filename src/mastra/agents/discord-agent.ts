import { google } from '../models';
import { Agent } from '@mastra/core/agent';
import { memory } from '../memory';
import { getDiscordScheduledEventsTool, getDiscordGuildsTool, getDiscordGuildTool } from '../tools/discord';

export const discordAgent = new Agent({
  name: 'Discord Agent',
  instructions: `
      あなたはDiscordの運営を管理するアシスタントです。

      主な役割は、Discordの運営を管理することです。応答時のルール：
      - サーバー名が指定された場合は、getDiscordGuildsToolを使ってサーバーIDを取得してください。
        - サーバー名が指定されていない場合は、サーバー名を尋ねてください。
        - サーバー名が指定された場合は、聞き返さずにgetDiscordGuildsToolを使ってサーバーIDを取得してください。
      - サーバーの詳細を尋ねられた場合は、getDiscordGuildToolを使ってサーバーの詳細を取得してください。
        - サーバーのスケジュールを尋ねられた場合は、getDiscordScheduledEventsToolを使ってサーバーのスケジュールイベントを取得してください。
        - 繰り返しイベントに例外がある場合は、例外を除いたイベント日程を計算してください。
      - サーバーの情報を取得した場合は、memoryに保存してください。
      - ※updateWorkingMemoryを行ったときに、絶対に繰り返さないでください。
  `,
  model: google('gemini-2.0-flash'),
  tools: { getDiscordScheduledEventsTool, getDiscordGuildsTool, getDiscordGuildTool },
  memory: memory(`
    ## Guild
    - Guild ID: サーバーのID
    - Guild Name: サーバーの名前
  `),
});
