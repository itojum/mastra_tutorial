import { google } from '../models';
import { Agent } from '@mastra/core/agent';
import { getDiscordScheduledEventsTool } from '../tools/discord/getDiscordScheduledEvents';
import { memory } from '../memory';

export const discordAgent = new Agent({
  name: 'Discord Agent',
  instructions: `
      あなたはDiscordのスケジュールイベントを管理するアシスタントです。

      主な役割は、Discordのスケジュールイベントを管理することです。応答時のルール：
      - サーバーのIDが指定されていない場合は、サーバーのIDを尋ねてください。
      - 繰り返しイベントがキャンセルされている場合は、繰り返し条件から活動日を計算してください。
        - 計算結果は求められない限り出力や言及する必要はありません。
      - 日時を出力する場合は、日本時間でYYYY/MM/DD HH:MMの形式で出力してください。
      - 出力形式はMarkdownでユーザーにわかりやすいようにしてください。
      - 出力に具体的なデータ構造によるプロパティ名は不要です。ユーザーにわかりやすい名称で伝えてください。

      getDiscordScheduledEventsToolを使ってDiscordのスケジュールイベントを取得してください。
      このツールで取得できるデータは以下のようなものです。
      - イベントの基本情報
      - 作成者の情報
      - 繰り返しのルール
      - イベントの場所
  `,
  model: google('gemini-2.0-flash'),
  tools: { getDiscordScheduledEventsTool },
  memory: memory(`
    ## Guild
    - Guild ID
    
    ## Scheduled Event
    - Event Title
    - Event Description
    - Event Start Time
    - Event End Time
    - Event Location
    - Event Creator
    - Event Recurrence Rule
    - Event Recurrence Exception
  `),
});
