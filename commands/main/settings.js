// Command: Settings

const {
  ActionRowBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("setings").setDescription("settings"),
  category: "main",
  async execute(interaction) {
    const client = interaction.client;
    await interaction.deferReply();
    try {
      const user_ff = await client.users.fetch(interaction.member.id, {
        force: true,
      });
      const user = interaction.member.user;
      const acolor = await client.b2h(user_ff.accentColor);

      const replyEmbed = new EmbedBuilder()
        .setColor(acolor)
        .setTitle("Banner settings")
        .setDescription("Customize your banner API")
        .setTimestamp()
        .setFooter({
          text: "Executed by " + user.username,
          iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`,
        });

      const select = new StringSelectMenuBuilder()
        .setCustomId("starter")
        .setPlaceholder("Make a selection!")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Hypesquad badge")
            .setDescription("Should we show the Hypesquad badge on the banner?")
            .setValue("hypesquad"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Font settings")
            .setDescription("What font would you like to use?")
            .setValue("font"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Presence Settings")
            .setDescription("Set your Presence in the banner!")
            .setValue("presence"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Username settings")
            .setDescription("Set your username in the banner!")
            .setValue("username"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Banner border settings")
            .setDescription("Should we show a border on the banner?")
            .setValue("banner"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Online status settings")
            .setDescription("Should we show your online status on the banner?")
            .setValue("online"),
        );

      const row = new ActionRowBuilder().addComponents(select);

      await interaction.editReply({
        embeds: [replyEmbed],
        components: [row],
      });
    } catch (e) {
      client.log(e, "error");
      await interaction.editReply({
        content: "An error occur!",
        embeds: [],
        components: [],
        fetchReply: true,
      });
    }
  },
};
