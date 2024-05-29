// Presence selection handler

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
    const user_ff = await client.users.fetch(interaction.member.id, {
      force: true,
    });
    const db = client.db;
    const user = interaction.member.user;
    const acolor = await client.b2h(user_ff.accentColor);

    const presenceSettings = await db.get("presence_" + interaction.user.id);
    let currentSettings;
    if (presenceSettings === null) {
      currentSettings =
        "Default (Your presnece will be shown as it is on Discord)";
    } else if (presenceSettings !== null) {
      currentSettings = presenceSettings;
    }

    const isEnabled = db.get("presence_enable_" + interaction.user.id);
    let userEnable;
    if (isEnabled) {
      userEnable = "Yes";
    } else if (!isEnabled) {
      userEnable = "No";
    }

    const replyEmbed = new EmbedBuilder()
      .setColor(acolor)
      .setTitle("Presence configuration")
      .setDescription("\u200B")
      .addFields(
        { name: "Enabled?", value: `${userEnable}`, inline: true },
        { name: "\u200B", value: "\u200B" },
        { name: "Content", value: `${currentSettings}`, inline: true },
        { name: "\u200B", value: "\u200B" },
      )
      .setTimestamp()
      .setFooter({
        text: "Executed by " + user.username,
        iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`,
      });

    const settingsButton = new ButtonBuilder()
      .setCustomId("changePresenceSettings")
      .setLabel("Change presence settings")
      .setStyle(ButtonStyle.Primary);

    let enableButton = new ButtonBuilder()
      .setCustomId("presenceEnable")
      .setLabel("Enable")
      .setStyle(ButtonStyle.Success);

    let disableButton = new ButtonBuilder()
      .setCustomId("presenceDisable")
      .setLabel("Disable")
      .setStyle(ButtonStyle.Danger);

    const cancelAction = new ButtonBuilder()
      .setCustomId("presenceCancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    if (!isEnabled) {
      disableButton.setDisabled(true);
    } else if (isEnabled) {
      enableButton.setDisabled(true);
    }

    const row = new ActionRowBuilder().addComponents(
      settingsButton,
      enableButton,
      disableButton,
      cancelAction,
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
      if (confirmation.customId === "presenceEnable") {
        db.set("presence_enable_" + interaction.user.id, true);
        await confirmation.update({
          content: "Presence enabled",
          embeds: [],
          components: [],
        });
      } else if (confirmation.customId === "presenceDisable") {
        db.set("presence_enable_" + interaction.user.id, false);
        await confirmation.update({
          content: "Presence disabled",
          embeds: [],
          components: [],
        });
      } else if (confirmation.customId === "presenceCancel") {
        await confirmation.update({
          content: "Action cancelled",
          embeds: [],
          components: [],
        });
      } else if (confirmation.customId === "changePresenceSettings") {
        const modal = new ModalBuilder()
          .setCustomId("presenceSettingsModal")
          .setTitle("Presence settings");

        const presenceSettingsInput = new TextInputBuilder()
          .setMinLength(10)
          .setCustomId("presenceSettingsInput")
          .setLabel("Set your custom presence on the banner!")
          .setPlaceholder("Enter some text!")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);

        const ActionRow = new ActionRowBuilder().addComponents(
          presenceSettingsInput,
        );

        modal.addComponents(ActionRow);
        await confirmation.showModal(modal);
      }
    } catch (e) {
      console.log(e);
    }
  },
};
