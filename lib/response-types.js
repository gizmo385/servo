const axios = require('axios')
const Discord = require('discord.js');
const Url = require('urijs');

SCRYFALL_URL = 'https://api.scryfall.com/cards/named';

class TextResponse {
	constructor(cardName) {
		this.cardName = cardName;
	}

	async makeRequest() {
		const queryArgs = {
			fuzzy: this.cardName,
			format: 'text',
			utm_source: "discord",
		};
		const url = Url(SCRYFALL_URL).query(queryArgs).toString();
		const validateStatus = status => (status >= 200 && status < 300 || status == 404)
		return await axios.get(url, { validateStatus })
	}

	makeEmbed(response) {
		let parts = response.data.split('\n');
		const embedTitle = parts.shift();
		return {
			title: `${embedTitle}`,
			description: parts.join('\n'),
			url: response.headers['x-scryfall-card'],
			thumbnail: {
				url: response.headers['x-scryfall-card-image']
			}
		};
	}

	async embed() {
		const response = await this.makeRequest()
		if (response.status == 404) {
			return {
				title: "Ambiguous Request",
				description: "Too many cards match that search. Please refine it!"
			}
		} else {
			return this.makeEmbed(response);
		}
	}
}


class ImageResponse extends TextResponse {
	makeEmbed(response) {
		let parts = response.data.split('\n');
		return {
			title: parts[0].match(/^([^{]+)/)[0].trim(),
			url: response.headers['x-scryfall-card'],
			image: {
				url: response.headers['x-scryfall-card-image']
			}
		};
	}
}


module.exports = { TextResponse, ImageResponse };
