const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
    TextInputBuilder,
    TextInputStyle,

} = require("discord.js");

module.exports = {
  handler: async function (interaction) {
    const client = interaction.client;
    const db = client.db;

    let acolor;
    const user_ff = await client.users.fetch(interaction.member.id, {
      force: true,
    });

    const configColor = await db.fetch("banner_" + interaction.user.id);
    const isEnable = await db.fetch("banner_enable_" + interaction.user.id);

    if (configColor) {
      acolor = configColor;
    } else if (!configColor) {
      acolor = await client.b2h(user_ff.accentColor);
    }

    const isEnabled = isEnable ? "Yes" : "No";

    const replyEmbed = new EmbedBuilder()
      .setColor(acolor)
      .setTitle("Banner configuration")
      .setDescription("\u200B")
      .addFields(
        { name: "Enabled?", value: `${isEnabled}`, inline: true },
        { name: "Color", value: `${acolor}`, inline: true },
        { name: "\u200B", value: "\u200B" }
      )
      .setTimestamp()
      .setFooter({
        text: "Executed by " + interaction.user.username,
        iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp`,
      });

    const editConfig = new ButtonBuilder()
      .setCustomId("bannerEdit")
      .setLabel("Edit Color")
      .setStyle(ButtonStyle.Primary);

    const enableButton = new ButtonBuilder()
      .setCustomId("bannerEnable")
      .setLabel("Enable")
      .setStyle(ButtonStyle.Success);

    const disableButton = new ButtonBuilder()
      .setCustomId("bannerDisable")
      .setLabel("Disable")
      .setStyle(ButtonStyle.Danger);

    const cancelAction = new ButtonBuilder()
      .setCustomId("cancelAction")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    if (isEnable) {
      enableButton.setDisabled(true);
    } else if (!isEnable) {
      disableButton.setDisabled(true);
    }

    const row = new ActionRowBuilder().addComponents(
      enableButton,
      disableButton,
      editConfig,
      cancelAction
    );

    const response = await interaction.reply({
      embeds: [replyEmbed],
      components: [row],
      fetchReply: true,
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });

      if (confirmation.customId === "bannerEnable") {
        db.set("banner_enable_" + interaction.user.id, true);
        await confirmation.update({
          content: "Banner border has been enabled",
          embeds: [],
          components: [],
          fetchReply: true,
        });
      } else if (confirmation.customId === "bannerDisable") {
        db.set("banner_enable_" + interaction.user.id, false);
        await confirmation.update({
          content: "Banner border has been disabled",
          embeds: [],
          components: [],
          fetchReply: true,
        });
      } else if (confirmation.customId === "cancelAction") {
        await confirmation.update({
          content: "Action canceled",
          embeds: [],
          components: [],
          fetchReply: true,
        });
      } else if (confirmation.customId === "bannerEdit") {

        const modal = new ModalBuilder()
          .setCustomId("bannerBorderModal")
          .setTitle("Banner Modal settings");

        const bannerBorderInputModal = new TextInputBuilder()
          .setMinLength(0)
          .setMaxLength(7)
          .setCustomId("bannerBorderInput")
          .setLabel("Set your custom banner color on the banner!")
          .setPlaceholder("Enter HEX color code, e.g. #FF0000")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);

        const ActionRow = new ActionRowBuilder().addComponents(
            bannerBorderInputModal,
        );

        modal.addComponents(ActionRow);
        await confirmation.showModal(modal);
      }
    } catch (e) {
      console.error(e);
    }
  },
};
