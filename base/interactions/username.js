// Username selection handler

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

    const isEnabled = db.get("username_enable_" + interaction.user.id);
    let userEnable;
    if (isEnabled) {
      userEnable = "Yes";
    } else if (!isEnabled) {
      userEnable = "No";
    }

    const username = db.get("username_" + interaction.user.id);
    let realUsername;
    if (username === null) {
      realUsername =
        "Default (Your username will be shown as it is on Discord)";
    } else if (username !== null) {
      realUsername = username;
    }

    const globalUsername = db.get("globalName_" + interaction.user.id);
    let realGlobalUsername;
    if (globalUsername === null) {
      realGlobalUsername =
        "Default (Your username will be shown as it is on Discord)";
    } else if (globalUsername !== null) {
      realGlobalUsername = globalUsername;
    }

    const replyEmbed = new EmbedBuilder()
      .setColor(acolor)
      .setTitle("Username configuration")
      .setDescription("\u200B")
      .addFields(
        { name: "Enabled?", value: `${userEnable}`, inline: true },
        { name: "Username", value: `${realUsername}` },
        { name: "Global username", value: `${realGlobalUsername}` },
        { name: "\u200B", value: "\u200B" },
      )
      .setTimestamp()
      .setFooter({
        text: "Executed by " + user.username,
        iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`,
      });

    const settingsButton = new ButtonBuilder()
      .setCustomId("changeUsernameSettings")
      .setLabel("Change username settings")
      .setStyle(ButtonStyle.Primary);

    const enableButton = new ButtonBuilder()
      .setCustomId("usernameEnable")
      .setLabel("Enable")
      .setStyle(ButtonStyle.Success);

    const disableButton = new ButtonBuilder()
      .setCustomId("usernameDisable")
      .setLabel("Disable")
      .setStyle(ButtonStyle.Danger);

    if (!isEnabled) {
      disableButton.setDisabled(true);
    } else if (isEnabled) {
      enableButton.setDisabled(true);
    }

    const row = new ActionRowBuilder().addComponents(
      settingsButton,
      enableButton,
      disableButton,
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
      if (confirmation.customId === "usernameEnable") {
        db.set("username_enable_" + interaction.user.id, true);
        await interaction.editReply({
          content: "Username has been enabled!",
          embeds: [],
          components: [],
          fetchReply: true,
        });
      } else if (confirmation.customId === "usernameDisable") {
        db.set("username_enable_" + interaction.user.id, false);
        await interaction.editReply({
          content: "Username has been disabled!",
          embeds: [],
          components: [],
          fetchReply: true,
        });
      } else if (confirmation.customId === "changeUsernameSettings") {
        const modal = new ModalBuilder()
          .setCustomId("usernameChangeModal")
          .setTitle("Username settings");

        const usernameSettingsModal = new TextInputBuilder()
          .setMinLength(1)
          .setMaxLength(32)
          .setCustomId("usernameInput")
          .setLabel("Set your custom username!")
          .setPlaceholder("Leave empty to reset to default")
          .setStyle(TextInputStyle.Short)
          .setRequired(false);

        const globalUsernameSettingsModal = new TextInputBuilder()
          .setMinLength(1)
          .setMaxLength(32)
          .setCustomId("globalUsernameInput")
          .setLabel("Set your global username!")
          .setPlaceholder("Leave empty to reset to default")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);

        const firstActionRow = new ActionRowBuilder().addComponents(
          globalUsernameSettingsModal,
        );
        const secondActionRow = new ActionRowBuilder().addComponents(
          usernameSettingsModal,
        );
        modal.addComponents(firstActionRow, secondActionRow);
        await confirmation.showModal(modal);
      }
    } catch (e) {
      console.log(e);
      await interaction.editReply({
        content: "An error occur!",
        embeds: [],
        components: [],
        fetchReply: true,
      });
    }
  },
};
