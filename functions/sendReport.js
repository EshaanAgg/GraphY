const TG = require("telegram-bot-api");
const fs = require("fs");
const { createImage } = require("./utils/createImage");

const api = new TG({
	token: process.env.TELEGRAM_BOT_TOKEN,
});

async function sendImage(chat_id, fileName, caption = "Here is your report!") {
	await api.sendPhoto({
		chat_id,
		caption,
		photo: fs.createReadStream(`${fileName}.png`),
	});
}

exports.handler = async (event) => {
	const { data, chatId } = JSON.parse(event.body);

	await createImage(data, chatId);
	await sendImage(chatId, chatId);
	fs.unlinkSync(`${chatId}.png`);

	return {
		statusCode: 200,
		body: "The report was sent successfully!",
	};
};
