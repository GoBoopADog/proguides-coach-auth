import config from "./config.js"

const activeGivingRoleServerID = config.activeGivingRoleServerID;
const activeRoleID = config.activeRoleID;
const activeLogChannelID = config.activeLogChannelID;

export async function giveUserRole(userID, { access_token }, env) {
  const guildID = activeGivingRoleServerID;
  const roleID = activeRoleID;

  const url = `https://discord.com/api/v10/guilds/${guildID}/members/${userID}/roles/${roleID}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${env.discordBotToken}`,
    },
    method: 'PUT'
  });
  if (!response.ok) {
    throw new Error(`Error applying the role: [${response.status}] ${response.statusText}`);
  }
}

export async function logMessageViaBot(content, env) {
  const channelID = activeLogChannelID;

  const url = `https://discord.com/api/v10/channels/${channelID}/messages`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${env.discordBotToken}`,
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify({
      "content": `${content}`,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Error logging the message via the bot: [${response.status}] ${response.statusText}: ${JSON.stringify(await response.json())}`);
  }
}

export async function logEmbedViaBot(interaction, type, env) {
  const channelID = activeLogChannelID;

  const url = `https://discord.com/api/v10/channels/${channelID}/messages`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${env.discordBotToken}`,
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify({
      "embeds": [{
        "title": "Hello, Embed!",
        "description": "This is an embedded message."
      }],
      "flags": 64,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Error logging the message via the bot: [${response.status}] ${response.statusText}: ${JSON.stringify(await response.json())}`);
  }
}

export const logMessageViaWebhook = async (text) => {
  fetch(
    "https://canary.discord.com/api/webhooks/1120990019298013234/FOiA_VdRb1C3BBNyW1bicCPkj6ltfavQ89xd8fFA4KUc57NjkpLyHuO5cppZvNey2jZq",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ content: text }),
    }
  );
};

export async function interactionFollowup(content, interactionToken, env) {
  const url = `https://discord.com/api/v10/webhooks/${encodeURIComponent(env.discordClientID)}/${encodeURIComponent(interactionToken)}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${env.discordBotToken}`,
      "content-type": "application/json",
    },
    method: 'POST',
    body: JSON.stringify({
      "content": `${content}`,
      "flags": 64,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Error following up with the interaction: [${response.status}] ${response.statusText}: ${JSON.stringify(await response.json())}`);
  }
}

// export async function isUserInGuild(request, env {

// })