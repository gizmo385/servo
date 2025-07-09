const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const ResponseTypes = require('../../lib/response-types.js')

const data = new SlashCommandBuilder()
	.setName("search")
	.setDescription("Search for Magic cards using Scryfall syntax")
	.addStringOption(option =>
		option
			.setName("query")
			.setDescription("Search query using Scryfall syntax (e.g., 'c:red cmc:3', 'type:dragon', 'set:neo')")
			.setRequired(true))
	.addIntegerOption(option =>
		option
			.setName("limit")
			.setDescription("Maximum number of results to show (1-10, default: 5)")
			.setRequired(false)
			.setMinValue(1)
			.setMaxValue(10))

async function execute(interaction) {
	const query = interaction.options.getString("query");
	const limit = interaction.options.getInteger("limit") ?? 5;
	const response = new ResponseTypes.SearchResponse(query, limit)

	try {
		const embeds = await response.embeds()
		await interaction.reply({ embeds: embeds})
	} catch (error) {
		console.error(error)
		await interaction.reply("Error running the search")
	}
}

module.exports = {data, execute}