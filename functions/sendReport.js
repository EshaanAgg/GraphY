const TG = require("telegram-bot-api");
const { createImage } = require("./utils/createImage");
const { createClient } = require("@supabase/supabase-js");
const nanoid = require("nanoid");

// Create a single supabase client for interacting with your database
const supabase = createClient(
	"https://gomhtyyltrqyoflqrgvy.supabase.co",
	process.env.DATABASE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	}
);

const api = new TG({
	token: process.env.TELEGRAM_BOT_TOKEN,
});

async function sendImage(chat_id, bufferData, caption = "Here is your generated report!") {
	const fileName = `${chat_id}-${nanoid()}.png`;
	await supabase.storage.from("reports").upload(fileName, bufferData, {
		cacheControl: "0",
		upsert: true,
		contentType: "image/png",
	});

	const { data } = await supabase.storage.from("reports").getPublicUrl(fileName);
	const photo = data.publicUrl;
	try {
		await api.sendPhoto({
			chat_id,
			caption,
			photo,
		});
	} catch (_err) {
		console.log("Timeout");
	}

	await supabase.storage.from("reports").remove(fileName);
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
