const discord = require("discord.js")

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('init')
        .setDescription('initiate'),
    category: 'main',
    async execute(interaction) {
        const client = interaction.client
        await interaction.reply("Please wait")
        try {
            const uid = await interaction.member.id
            const user = await client.users.fetch(uid)
            console.log(user)
        }
        catch (e) {
            client.log(e, 'error')
            await interaction.editReply({
                content: 'An error occur!',
                embeds: [],
                components: [],
                fetchReply: true
            })
        }
    }
}