import { createTool } from '@mastra/core/tools';
import { z } from "zod";
import { getDiscordApiRequest } from './discordApiRequest';

/**
 * スケジュールイベントのスキーマ
 */
const outputSchema = z.object({
    id: z.string().describe('サーバーのID'),
    name: z.string().describe('サーバーの名前'),
    icon: z.string().describe('サーバーのアイコン'),
    banner: z.string().describe('サーバーのバナー'),
    owner: z.boolean().describe('サーバーのオーナーかどうか'),
    permissions: z.string().describe('サーバーの権限'),
    features: z.array(z.string()).describe('サーバーの機能'),
    approximate_member_count: z.number().describe('サーバーのメンバー数の推定値'),
    approximate_presence_count: z.number().describe('サーバーのプレゼンス数の推定値')
  });

/**
 * Discord API を使用して、指定のサーバーのスケジュールイベントを取得するツール
 */
export const getDiscordGuildsTool = createTool({
  id: 'get-discord-guilds',
  description: 'Discord API を使用して、参加しているサーバーを取得するツール',
  inputSchema: z.object({}),
  outputSchema,
  execute: async () => {
    const postData = await getDiscordGuilds();
    return postData;
  },
});

const getDiscordGuilds = async () => {
  const data = await getDiscordApiRequest('users/@me/guilds');

  return data;
};