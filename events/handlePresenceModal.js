// Presence Modal Handler

const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const client = interaction.client;
    const db = client.db;
    if (!interaction.isModalSubmit()) return;
    const customPresence = await interaction.fields.getTextInputValue(
      "presenceSettingsInput",
    );
    db.set("presence_" + interaction.user.id, customPresence);

    interaction.reply("ok");
  },
};
