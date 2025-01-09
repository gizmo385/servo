const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');


const commands = [
	{
		name: "card",
		description: "Get information about a magic card",
	},
]


class Servo {
	constructor(token) {
		this.token = token
		this.client = this.makeClient();
	}

	makeClient() {
		console.log('servo client init');
		const options = {
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
			]
		}

		const client = new Client(options);
		client.once(Events.ClientReady, readyClient => {
			console.log("Bot started")
		})
		client.login(this.token)
		return client;
	}
}

module.exports = Servo;
