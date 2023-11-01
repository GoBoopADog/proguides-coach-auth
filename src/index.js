/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { verify } from "./verify.js"
import { getOAuthTokens, getUserData, getUserGuilds } from "./auth.js"
import { giveUserRole, interactionFollowup, logMessageViaBot, logMessageViaWebhook } from "./util.js"
import * as command from "./commands.js"

import config from "./config.js"

const activeCheckedServerID = config.coachingServerID;

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/interactions") {
      // Redirect if not worker for the funny
      if (
        !request.headers.get("X-Signature-Ed25519") ||
        !request.headers.get("X-Signature-Timestamp")
      )
        return Response.redirect("https://bop.dog");

      if (!(await verify(request)))
        return new Response(
          "nuh uh https://tenor.com/view/nuh-uh-beocord-no-lol-gif-24435520",
          { status: 401 }
        );

      const interaction = await request.json();
      // logMessageViaBot(JSON.stringify(interaction), env)

      // Check if ping from Discord
      if (interaction.type === 1) return command.reply({ type: 1 });

      if (interaction.data.name) {
        if (interaction.data.name === "coach") {
          return command.coach(interaction, env)
        } else if (interaction.data.name === "embedtest") {
          return command.embedtest(interaction, env)
        } else {
          return command.unknown(interaction, env)
        }
      }
    } else if (pathname === "/callback") {
      const { searchParams } = new URL(request.url);
      let callbackCode = searchParams.get("code");
      let state = searchParams.get("state");

      const interactionToken = state

      const tokens = await getOAuthTokens(callbackCode, env);
      const { user } = await getUserData(tokens);
      const guilds = await getUserGuilds(tokens);

      let isInGuild = false;
      guilds.forEach(element => {
        if (element.id === activeCheckedServerID)
          isInGuild = true;
      });

      if (isInGuild) {
        await giveUserRole(user.id, tokens, env)
        await logMessageViaBot(`${user.id} (<@${user.id}>) successfully gave themselves the coach role`, env)
        await interactionFollowup("You have been verified as a coach! You now have access to <#1120890380972466266>. If you have any other questions or concerns, you may ask a moderator via <#1107714633046949999>", interactionToken, env)
        return new Response("You may now return to Discord.")
      } else {
        await logMessageViaBot(`${user.id} (<@${user.id}>) tried getting the coach role`, env)
        await interactionFollowup("https://tenor.com/view/nuh-uh-beocord-no-lol-gif-24435520", interactionToken, env)
        return new Response("You may now close this tab.")
      }
    } else {
      return new Response(
        "nuh uh https://tenor.com/view/nuh-uh-beocord-no-lol-gif-24435520",
        { status: 404 }
      );
    }
  },
};