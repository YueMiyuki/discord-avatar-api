// Command: Init

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("init").setDescription("initiate"),
  category: "main",
  async execute(interaction) {
    const client = interaction.client;
    await interaction.deferReply();
    try {
      // const user = await interaction.guild.members.fetch({ user: interaction.user.id, withPresences: true })

      // const guild = await interaction.guild.fetch()
      // const user = await guild.members.fetch(interaction.member.id)
      // console.log(user)

      const user_ff = await client.users.fetch(interaction.member.id, {
        force: true,
      });
      const user = interaction.member.user;
      const acolor = await client.b2h(user_ff.accentColor);

      const replyEmbed = new EmbedBuilder()
        .setColor(acolor)
        .setTitle("Setting up your banner API")
        .setDescription(
          "Are you sure you want to continue?\nThis will set your guild to the current guild you are in.",
        )
        .setTimestamp()
        .setFooter({
          text: "Executed by " + user.username,
          iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`,
        });

      const cancel = new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Cancel Setup")
        .setStyle(ButtonStyle.Danger);

      const confirm = new ButtonBuilder()
        .setCustomId("continue")
        .setLabel("Continue")
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(confirm, cancel);

      const db = client.db;
      const dbKey = interaction.member.id;
      const dbValue = interaction.guild.id;

      const userResponse = await interaction.editReply({
        embeds: [replyEmbed],
        components: [row],
      });

      const collectorFilter = (i) => i.user.id === interaction.user.id;
      try {
        const confirmation = await userResponse.awaitMessageComponent({
          filter: collectorFilter,
          time: 60000,
        });
        if (confirmation.customId === "continue") {
          await confirmation.update({
            content: `${user.globalName}(${user.username}) has setted up banner API on guild: ${interaction.guild.name}`,
            embeds: [],
            components: [],
            fetchReply: true,
          });

          db.set(dbKey, dbValue);
          db.set("hypesquad_" + interaction.user.id, true);
          db.set("font_" + interaction.user.id, "Seto");

          db.set("presence_" + interaction.user.id, "Default");
          db.set("presence_enable_" + interaction.user.id, true);

          db.set("username_" + interaction.user.id, "Default");
          db.set("username_enable_" + interaction.user.id, true);

          db.set("banner_" + interaction.user.id, true);

          db.set("online_" + interaction.user.id, true);
          db.set("online_enable_" + interaction.user.id, true);
        } else if (confirmation.customId === "cancel") {
          await confirmation.update({
            content: "Action cancelled",
            embeds: [],
            components: [],
            fetchReply: true,
          });
        }
      } catch (e) {
        console.log(e);
        await interaction.editReply({
          content: "Confirmation not received within 1 minute, cancelling",
          embeds: [],
          components: [],
          fetchReply: true,
        });
      }
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
