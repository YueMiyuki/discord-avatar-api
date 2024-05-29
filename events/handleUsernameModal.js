// Username presence handler

const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const client = interaction.client;
    const db = client.db;
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === "usernameChangeModal") {
      const customUsername =
        await interaction.fields.getTextInputValue("usernameInput");
      const globalUsername =
        await interaction.fields.getTextInputValue("usernameInput");

      if (customUsername === "" && globalUsername === "") {
        await db.delete("username_" + interaction.user.id);
        await db.delete("globalName_" + interaction.user.id);
        await interaction.reply(
          "Username and global username reset to default",
        );
        return;
      }

      if (customUsername === "") {
        await db.delete("username_" + interaction.user.id);
        await db.set("globalName_" + interaction.user.id, globalUsername);
        await interaction.reply(
          "Username reset to default",
          "Global username set to " + globalUsername,
        );
        return;
      }

      if (globalUsername === "") {
        await db.set("globalName_" + interaction.user.id, null);
        await db.set("username_" + interaction.user.id, customUsername);
        await interaction.reply(
          "Global username reset to default",
          "Username set to " + customUsername,
        );
        return;
      }

      await db.set("username_" + interaction.user.id, customUsername);
      await db.set("globalName_" + interaction.user.id, globalUsername);

      interaction.reply(
        `Username set to ${customUsername}, Global username set to ${globalUsername}`,
      );
    }
  },
};
