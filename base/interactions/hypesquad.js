const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
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

    const isEnabled = db.get("hypesquad_" + interaction.user.id);
    let userEnable
    if (isEnabled) {
      userEnable = "Yes"
    } else if (!isEnabled) {
      userEnable = "No"
    }

    let hypesquadA
    let hypesquad;
    if (user.flags.toArray()) {
      hypesquadA = user.flags.toArray()[0];
      if (hypesquadA === "HypeSquadOnlineHouse2") {
        hypesquad = "Brilliance";
      } else if (hypesquadA === "HypeSquadOnlineHouse3") {
        hypesquad = "Balance";
      } else if (hypesquadA === "HypeSquadOnlineHouse1") {
        hypesquad === "Bravery";
      }
    }

    
    const replyEmbed = new EmbedBuilder()
      .setColor(acolor)
      .setTitle("Hypesquad configuration")
      .setDescription("\u200B")
      .addFields(
        { name: "Enabled?", value: `${userEnable}`, inline: true },
        { name: "Hypesquad", value: `${hypesquad}`, inline: true },
        { name: "\u200B", value: "\u200B" },
      )
      .setTimestamp()
      .setFooter({
        text: "Executed by " + user.username,
        iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`,
      });

    let enableButton = new ButtonBuilder()
      .setCustomId("hypesquadEnable")
      .setLabel("Enable")
      .setStyle(ButtonStyle.Success);

    let disableButton = new ButtonBuilder()
      .setCustomId("hypesquadDisable")
      .setLabel("Disable")
      .setStyle(ButtonStyle.Danger);

    if (!isEnabled) {
      disableButton.setDisabled(true);
    } else if (isEnabled) {
      enableButton.setDisabled(true);
    }

    const cancelAction = new ButtonBuilder()
      .setCustomId("hypesquadCancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(
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
      if (confirmation.customId === "hypesquadEnable") {
        db.set("hypesquad_" + interaction.user.id, true);
        await confirmation.update({
          content: "Hypesquad enabled",
          embeds: [],
          components: [],
        });
      } else if (confirmation.customId === "hypesquadDisable") {
        db.set("hypesquad_" + interaction.user.id, false);
        await confirmation.update({
          content: "Hypesquad disabled",
          embeds: [],
          components: [],
        });
      } else if (confirmation.customId === "hypesquadCancel") {
        await confirmation.update({
          content: "Action cancelled",
          embeds: [],
          components: [],
        });
      }
    } catch (e) {
      await interaction.editReply({
        content: "Confirmation not received within 1 minute, cancelling",
        embeds: [],
        components: [],
      });
    }
  },
};
