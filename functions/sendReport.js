const TG = require("telegram-bot-api");
const { createImage } = require("./utils/createImage");
const { createClient } = require("@supabase/supabase-js");

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
	await supabase.storage.from("reports").upload(`${chat_id}.png`, bufferData, {
		cacheControl: "0",
		upsert: true,
		contentType: "image/png",
	});

	const { data } = supabase.storage.from("reports").getPublicUrl(`${chat_id}.png`);
	const publicURL = data.publicUrl;

	await api.sendPhoto({
		chat_id,
		caption,
		photo: publicURL,
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
