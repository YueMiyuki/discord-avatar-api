const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  handler: async function (interaction) {
    const client = interaction.client;
    const db = client.db;

    try {
      const user_ff = await client.users.fetch(interaction.member.id, {
        force: true,
      });

      const user = interaction.member.user;
      const acolor = await client.b2h(user_ff.accentColor);

      const isEnabled = db.get("online_enable_" + interaction.user.id);

      let userEnable;
      if (isEnabled) {
        userEnable = "Yes";
      } else if (!isEnabled) {
        userEnable = "No";
      }

      const replyEmbed = new EmbedBuilder()
        .setColor(acolor)
        .setTitle("Online status configuration")
        .setDescription("\u200B")
        .addFields(
          { name: "Enabled?", value: `${userEnable}`, inline: true },
          { name: "\u200B", value: "\u200B" }
        )
        .setTimestamp()
        .setFooter({
          text: "Executed by " + user.username,
          iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`,
        });

      const enableButton = new ButtonBuilder()
        .setCustomId("onlineEnable")
        .setLabel("Enable")
        .setStyle(ButtonStyle.Success);

      const disableButton = new ButtonBuilder()
        .setCustomId("onlineDisable")
        .setLabel("Disable")
        .setStyle(ButtonStyle.Danger);

      const cancelAction = new ButtonBuilder()
        .setCustomId("cancelAction")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary);

        if (!isEnabled) {
            disableButton.setDisabled(true);
          } else if (isEnabled) {
            enableButton.setDisabled(true);
          }

      const row = new ActionRowBuilder().addComponents(
        enableButton,
        disableButton,
        cancelAction
      );

      const response = await interaction.reply({
        embeds: [replyEmbed],
        components: [row],
        fetchReply: true,
      });

      const filter = (i) => i.user.id === interaction.user.id;
      try {
        const confirmation = await response.awaitMessageComponent({
          filter: filter,
          time: 60_000,
        });
        if (confirmation.customId === "onlineEnable") {
          await db.set("online_enable_" + interaction.user.id, true);
          await confirmation.update({
            content: `Online status enabled`,
            embeds: [],
            components: [],
          });
        } else if (confirmation.customId === "onlineDisable") {
          await db.set("online_enable_" + interaction.user.id, false);
          await confirmation.update({
            content: `Online status disabled`,
            embeds: [],
            components: [],
          });
        } else if (confirmation.customId === "cancelAction") {
          await confirmation.update({
            content: `Action cancelled`,
            embeds: [],
            components: [],
          });
        }
      } catch (e) {
        console.log(e);
        client.log(e, "error");
      }
    } catch (e) {
      console.log(e);
      client.log(e, "error");
    }
  },
};
