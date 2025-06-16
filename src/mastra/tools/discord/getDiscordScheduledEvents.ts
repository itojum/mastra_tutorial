import { createTool } from '@mastra/core/tools';
import { z } from "zod";

/**
 * スケジュールイベントのスキーマ
 */
const outputSchema = z.array(z.object({
  id: z.string().describe('イベントのID'),
  guild_id: z.string().describe('イベントのサーバーID'),
  name: z.string().describe('イベントの名前'),
  description: z.string().describe('イベントの説明'),
  channel_id: z.string().nullable().describe('イベントのチャンネルID'),
  creator_id: z.string().describe('イベントの作成者ID'),
  creator: z.object({
    id: z.string().describe('イベントの作成者ID'),
    username: z.string().describe('イベントの作成者名'),
    avatar: z.string().describe('イベントの作成者のアバター'),
    discriminator: z.string().describe('イベントの作成者の識別子'),
    public_flags: z.number().describe('イベントの作成者の公開フラグ'),
    flags: z.number().describe('イベントの作成者のフラグ'),
    banner: z.string().nullable().describe('イベントの作成者のバナー'),
    accent_color: z.number().nullable().describe('イベントの作成者のアクセントカラー'),
    global_name: z.string().describe('イベントの作成者のグローバル名'),
    avatar_decoration_data: z.any().nullable().describe('イベントの作成者のアバターのデコレーションデータ'),
    collectibles: z.any().nullable().describe('イベントの作成者のコレクション'),
    banner_color: z.string().nullable().describe('イベントの作成者のバナーのカラー'),
    clan: z.any().nullable().describe('イベントの作成者のクラン'),
    primary_guild: z.any().nullable().describe('イベントの作成者のプライマリーサーバー')
  }),
  image: z.string().nullable().describe('イベントの画像'),
  scheduled_start_time: z.string().describe('イベントの開始時間'),
  scheduled_end_time: z.string().describe('イベントの終了時間'),
  status: z.number().describe('イベントのステータス'),
  entity_type: z.number().describe('イベントのエンティティタイプ'),
  entity_id: z.string().nullable().describe('イベントのエンティティID'),
  recurrence_rule: z.object({
    start: z.string().describe('イベントの開始時間'),
    end: z.string().nullable().describe('イベントの終了時間'),
    frequency: z.number().describe('イベントの頻度'),
    interval: z.number().describe('イベントの間隔'),
    by_weekday: z.array(z.number()).describe('イベントの曜日'),
    by_n_weekday: z.any().nullable().describe('イベントのN曜日'),
    by_month: z.any().nullable().describe('イベントの月'),
    by_month_day: z.any().nullable().describe('イベントの月日'),
    by_year_day: z.any().nullable().describe('イベントの年日'),
    count: z.number().nullable().describe('イベントの回数')
  }),
  privacy_level: z.number().describe('イベントのプライバシーレベル'),
  sku_ids: z.array(z.string()).describe('イベントのSKU ID'),
  entity_metadata: z.object({
    location: z.string().describe('イベントの場所')
  }),
  guild_scheduled_event_exceptions: z.array(z.object({
    event_id: z.string().describe('イベントID'),
    event_exception_id: z.string().describe('イベント例外ID'),
    scheduled_start_time: z.string().nullable().describe('例外の開始時間'),
    scheduled_end_time: z.string().nullable().describe('例外の終了時間'), 
    is_canceled: z.boolean().describe('キャンセルフラグ')
  })).describe('イベントの例外'),
}));

/**
 * Discord API を使用して、指定のサーバーのスケジュールイベントを取得するツール
 */
export const getDiscordScheduledEventsTool = createTool({
  id: 'get-discord-scheduled-events',
  description: 'Discord API を使用して、指定のサーバーのスケジュールイベントを取得するツール',
  inputSchema: z.object({
    guildId: z.string().describe('サーバーのID'),
  }),
  outputSchema,
  execute: async ({ context }) => {
    const postData = await getDiscordScheduledEvents(context.guildId);
    return postData;
  },
});

const getDiscordScheduledEvents = async (guildId: string) => {
  const url = `https://discord.com/api/v10/guilds/${guildId}/scheduled-events`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });
  const data = await response.json();

  return data;
};