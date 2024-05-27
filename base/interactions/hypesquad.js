const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  handler: async function (interaction) {
    const client = interaction.client;
    const user_ff = await client.users.fetch(interaction.member.id, {
      force: true,
    });
    const acolor = await client.b2h(user_ff.accentColor);
    const replyEmbed = new EmbedBuilder().setColor(acolor);
  },
};
