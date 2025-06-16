import { createTool } from '@mastra/core/tools';
import { z } from "zod";
import { getDiscordApiRequest } from './discordApiRequest';

/**
 * スケジュールイベントのスキーマ
 */

const RoleColors = z.object({
  primary_color: z.number().describe('ロールのメインカラー'),
  secondary_color: z.number().describe('ロールのセカンダリカラー'),
  tertiary_color: z.number().describe('ロールのサブカラー'),
});

const RoleTags = z.record(z.string(), z.any()).optional().describe('ロールのタグ');

const Role = z.object({
  id: z.string().describe('ロールのID'),
  name: z.string().describe('ロールの名前'),
  description: z.string().nullable().describe('ロールの説明'),
  permissions: z.string().describe('ロールの権限'),
  position: z.number().describe('ロールの位置'),
  color: z.number().describe('ロールのカラー'),
  colors: RoleColors.describe('ロールのカラー'),
  hoist: z.boolean().describe('ロールのホイスト'),
  managed: z.boolean().describe('ロールの管理'),
  mentionable: z.boolean().describe('ロールのメンション可能'),
  icon: z.string().nullable().describe('ロールのアイコン'),
  unicode_emoji: z.string().nullable().describe('ロールのユニコード絵文字'),
  flags: z.number().describe('ロールのフラグ'),
  tags: RoleTags.describe('ロールのタグ'),
});

const Emoji = z.object({
  id: z.string().describe('絵文字のID'),
  name: z.string().describe('絵文字の名前'),
  roles: z.array(z.string()).describe('絵文字のロール'),
  require_colons: z.boolean().describe('絵文字のコロン必須'),
  managed: z.boolean().describe('絵文字の管理'),
  animated: z.boolean().describe('絵文字のアニメーション'),
  available: z.boolean().describe('絵文字の利用可能'),
});

const outputSchema = z.object({
  id: z.string().describe('サーバーのID'),
  name: z.string().describe('サーバーの名前'),
  icon: z.string().nullable().describe('サーバーのアイコン'),
  description: z.string().nullable().describe('サーバーの説明'),
  features: z.array(z.string()).describe('サーバーの機能'),
  owner_id: z.string().describe('サーバーのオーナーのID'),
  region: z.string().describe('サーバーのリージョン'),
  afk_timeout: z.number().describe('サーバーのAFKタイムアウト'),
  system_channel_id: z.string().describe('サーバーのシステムチャンネルのID'),
  system_channel_flags: z.number().describe('サーバーのシステムチャンネルのフラグ'),
  widget_enabled: z.boolean().describe('サーバーのウィジェットの有効'),
  verification_level: z.number().describe('サーバーの認証レベル'),
  roles: z.array(Role).describe('サーバーのロール'),
  default_message_notifications: z.number().describe('サーバーのデフォルトメッセージ通知'),
  mfa_level: z.number().describe('サーバーのMFAレベル'),
  explicit_content_filter: z.number().describe('サーバーの明示的コンテンツフィルタ'),
  max_members: z.number().describe('サーバーの最大メンバー数'),
  max_stage_video_channel_users: z.number().describe('サーバーの最大ステージビデオチャンネルユーザー数'),
  max_video_channel_users: z.number().describe('サーバーの最大ビデオチャンネルユーザー数'),
  premium_tier: z.number().describe('サーバーのプレミアムレベル'),
  premium_subscription_count: z.number().describe('サーバーのプレミアムサブスクリプション数'),
  preferred_locale: z.string().describe('サーバーの優先言語'),
  rules_channel_id: z.string().describe('サーバーのルールチャンネルのID'),
  public_updates_channel_id: z.string().describe('サーバーの公開更新チャンネルのID'),
  premium_progress_bar_enabled: z.boolean().describe('サーバーのプレミアム進捗バーの有効'),
  latest_onboarding_question_id: z.string().describe('サーバーの最新オンボーディング質問のID'),
  nsfw: z.boolean().describe('サーバーのNSFW'),
  nsfw_level: z.number().describe('サーバーのNSFWレベル'),
  emojis: z.array(Emoji).describe('サーバーの絵文字'),
  stickers: z.array(z.any()).describe('サーバーのステッカー'),
  embed_enabled: z.boolean().describe('サーバーの埋め込みの有効'),
});


/**
 * Discord API を使用して、指定のサーバーのスケジュールイベントを取得するツール
 */
export const getDiscordGuildTool = createTool({
  id: 'get-discord-guild',
  description: 'Discord API を使用して、指定のサーバーの情報を取得するツール',
  inputSchema: z.object({
    guildId: z.string().describe('サーバーのID'),
  }),
  outputSchema,
  execute: async ({ context }) => {
    const postData = await getDiscordGuild(context.guildId);
    return postData;
  },
});

  const getDiscordGuild = async (guildId: string) => {
  const data = await getDiscordApiRequest(`guilds/${guildId}`);

  return data;
};