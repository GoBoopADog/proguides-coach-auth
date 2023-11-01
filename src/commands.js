export const reply = (response) =>
  new Response(JSON.stringify(response), {
    headers: { "content-type": "application/json" },
  });

export const coach = (interaction, env) =>
  reply({
    type: 4,
    data: {
      content: "Click the link below to verify you're a ProGuides coach! (Requires being in the coaching Discord server).\nIf you are confused or need help, please create a modmail ticket at <#1107714633046949999>.",
      flags: 64,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Click me!",
              style: 5,
              url:
                `https://discord.com/api/v10/oauth2/authorize?` +
                `client_id=${env.discordClientID}` +
                `&redirect_uri=${encodeURIComponent(
                  "https://proguides-coach-auth.boopdog.workers.dev/callback"
                )}` +
                `&response_type=code` +
                `&scope=identify%20guilds%20role_connections.write` +
                `&state=${encodeURIComponent(interaction.token)}` +
                `&prompt=none`,
            },
          ],
        },
      ],
    },
  });

export const embedtest = (interaction, env) => {
  const now = new Date();
  const timestamp = now.toISOString();
  let avatarFormat = "png"

  if (interaction.member.user.avatar.startsWith('a_')) avatarFormat = "gif";

  return reply({
    type: 4,
    data:
    {
      "content": null,
      "embeds": [
        {
          "title": "Coach Role Add",
          "description": `<@${interaction.member.user.id}> (${interaction.member.user.id})`,
          "color": 4437378,
          "timestamp": `${timestamp}`,
          "thumbnail": {
            "url": `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.${avatarFormat}?size=4096`
          }
        },
        {
          "title": "Coach Role Fail",
          "description": `<@${interaction.member.user.id}> (${interaction.member.user.id})`,
          "color": 16729871,
          "timestamp": `${timestamp}`,
          "thumbnail": {
            "url": `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.${avatarFormat}?size=4096`
          }
        }
      ],
      "flags": 64,
    },
  })
}

export const unknown = (interaction, env) =>
  reply({
    type: 4,
    data: {
      content: "Unknown command",
      flags: 64,
    }
  });