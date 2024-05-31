// Banner color Modal Handler

const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const client = interaction.client;
    const db = client.db;
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "bannerBorderModal") return;
    const customBanner =
      await interaction.fields.getTextInputValue("bannerBorderInput");

    if (customBanner === "") {
      await db.delete("banner_" + interaction.user.id);
      await interaction.reply("Custom border color reset to default");
      return;
    }
    db.set("banner_" + interaction.user.id, customBanner);

    interaction.reply("Custom border color set to " + customBanner + "!");
  },
};
