type Json = Record<string, unknown>;

export const getDiscordApiRequest = async (endpoint: string) => {
  const url = `https://discord.com/api/v10/${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
    method: 'GET',
  });
  return await response.json();
};

export const postDiscordApiRequest = async (endpoint: string, body: Json = {}) => {
  const url = `https://discord.com/api/v10/${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
    method: 'POST',
    body: JSON.stringify(body),
  });
  return await response.json();
};