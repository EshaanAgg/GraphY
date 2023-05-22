const TG = require("telegram-bot-api");
const { createImage } = require("./utils/createImage");
const { Duplex } = require("stream");

function bufferToStream(myBuffer) {
	const tmp = new Duplex();
	tmp.push(myBuffer);
	tmp.push(null);
	return tmp;
}

const api = new TG({
	token: process.env.TELEGRAM_BOT_TOKEN,
});

async function sendImage(chat_id, bufferData, caption = "Here is your generated report!") {
	await api.sendPhoto({
		chat_id,
		caption,
		photo: bufferToStream(bufferData),
	});
}

exports.handler = async (event) => {
	const { data, chatId } = JSON.parse(event.body);

	const bufferData = await createImage(data);
	await sendImage(chatId, bufferData);

	return {
		statusCode: 200,
		body: "The report was sent successfully!",
	};
};
