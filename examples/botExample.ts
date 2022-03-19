import { InlineKeyboard, ReplyKeyboard, ForceReply, Row, KeyboardButton, InlineKeyboardButton } from "node-telegram-keyboard-wrapper";
import * as TelegramBot from "node-telegram-bot-api";


if (process.argv.length < 3) {
	throw new Error("To test this bot, please pass a bot-token to the application.");
}

const jws = require('jws');


const token = "5239327825:AAGaU_Qm_Owhc7w0jSdFm62P3iITSxqbQ_Y"
const bot = new TelegramBot(token, { polling: true });



const BotState = {
	isReplyKeyboardOpen: false
};

const replyKeyboard1 = new ReplyKeyboard();
const replyKeyboard2 = new ReplyKeyboard();

const inlineKeyboard = new InlineKeyboard();

const firstReplyKeyboardRowToShowConstructor = new Row(
	new KeyboardButton("👫 play with friends"),
	new KeyboardButton("Trending games")
);

const secondReplyKeyboardRowToShowRowAsArray = new Row<KeyboardButton>();

secondReplyKeyboardRowToShowRowAsArray.push(
	new KeyboardButton("2:1 Button"),
	new KeyboardButton("2:2 Button")
);



const firstReplyKeyboardRowToShowConstructor2 = new Row(
	new KeyboardButton("BlockPuzzle"),
	new KeyboardButton("Car3D")
);

const secondReplyKeyboardRowToShowRowAsArray2 = new Row<KeyboardButton>();

secondReplyKeyboardRowToShowRowAsArray2.push(
	new KeyboardButton("🏀 CrazyDunk"),
	new KeyboardButton("Plus")
);

const threeReplyKeyboardRowToShowConstructor = new Row(
	new KeyboardButton("Game5"),
	new KeyboardButton("Game6")
);


replyKeyboard1
	.push(
		firstReplyKeyboardRowToShowConstructor,
		secondReplyKeyboardRowToShowRowAsArray,
	);

replyKeyboard2
	.push(
		firstReplyKeyboardRowToShowConstructor2,
		secondReplyKeyboardRowToShowRowAsArray2,
		threeReplyKeyboardRowToShowConstructor,
		new Row(
			new KeyboardButton("⬅️ Back"),
		)
	);


inlineKeyboard
	.push(
		new Row(
			new InlineKeyboardButton("DownLoad Game", "url", "https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad&hl=en_US&gl=US"),
			// new InlineKeyboardButton("1:2 Button", "callback_data", "Works 2!"),
		),
		// new Row(
		// 	new InlineKeyboardButton("2:1 Button", "callback_data", "Works 3!"),
		// 	new InlineKeyboardButton("2:2 Button", "callback_data", "Works 4!"),
		// ),
	);


function hasBotCommands(entities: TelegramBot.MessageEntity[]) {
	if (!entities || !(entities instanceof Array)) {
		return false;
	}

	return entities.some(e => e.type === "bot_command");
}

bot.onText(/\/start/i, async (msg) => {
	const messageOptions: TelegramBot.SendMessageOptions = {
		reply_markup: replyKeyboard1.getMarkup(),
	};
	await bot.sendMessage(msg.from.id, "This is a message with a reply keyboard. Click on one of the buttons to close it.", messageOptions);
	BotState.isReplyKeyboardOpen = true;
});

bot.onText(/\/forceReply/i, (msg) => {
	const options: TelegramBot.SendMessageOptions = {
		reply_markup: ForceReply.getMarkup(),
	};

	bot.sendMessage(msg.from.id, "Hey, this is a forced-reply. Reply me. C'mon. I dare you.", options);
});

bot.onText(/\/download/i, (msg) => {
	const options: TelegramBot.SendMessageOptions = {
		reply_markup: inlineKeyboard.getMarkup()
	}

	bot.sendMessage(msg.from.id, `Hi ${msg.from.first_name},we just created your new Mxplayer account\n\nDownload Mxplayer now and start winning cash!`, options);
});

bot.on("message", async (msg) => {
	if (!hasBotCommands(msg.entities)) {
		if (BotState.isReplyKeyboardOpen) {
			// const options: TelegramBot.SendMessageOptions = {
			// 	// reply_markup: replyKeyboard.remove()
			// };
			// await bot.sendMessage(msg.from.id, "Message Received. I'm closing the replyKeyboard.", options);
			// BotState.isReplyKeyboardOpen = false;
			if (msg.text === "👫 play with friends") {
				const options2: TelegramBot.SendMessageOptions = {
					reply_markup: replyKeyboard2.getMarkup(),
				};
				await bot.sendMessage(msg.from.id, "Message Received. I'm closing the replyKeyboard.", options2);
			}
			if (msg.text === "⬅️ Back") {
				const messageOptions: TelegramBot.SendMessageOptions = {
					reply_markup: replyKeyboard1.getMarkup(),
				};
				await bot.sendMessage(msg.from.id, "This is a message with a reply keyboard. Click on one of the buttons to close it.", messageOptions);
			}
			if (msg.text === "BlockPuzzle") {
				bot.sendGame(msg.from.id, "duan");
			}
			if (msg.text === "Car3D") {
				bot.sendGame(msg.from.id, "duan_6415");
			}
			if (msg.text === "🏀 CrazyDunk") {
				bot.sendGame(msg.from.id, "game_crazydunk");
			}
			if (msg.text === "Plus") {
				bot.sendGame(msg.from.id, "game_plus");
			}
			if (msg.text === "Game5") {

			}
			// console.log(JSON.stringify(msg), "reply_to_message");
		} else if (!!msg.reply_to_message) {
			await bot.sendMessage(msg.from.id, "HOW DARE YOU! But force reply worked.");
		}
	}
});


process.env.SIGN_SECRET = "process.env.SIGN_SECRET";
bot.on("callback_query", async (query) => {
	const token = jws.sign({
		header: { alg: 'HS512' },
		payload: {
			game: query.game_short_name,
			user: query.message.from.id,
			imessage: query.inline_message_id,
			message: (query.message || {}).message_id,
			chat_id: query.message.chat.id
		},
		secret: process.env.SIGN_SECRET
	})


	if (query.game_short_name === "duan") {
		bot.answerCallbackQuery(query.id, { url: 'https://mxshorts.akamaized.net/game/prod/takblockpuzzle/index.html', cache_time: 3 })
	} else if (query.game_short_name === "duan_6415") {
		// bot.answerCallbackQuery(query.id, { url: `https://duan003387.github.io/Car3D/index.html?token=${token}`, cache_time: 3 })
		bot.answerCallbackQuery(query.id, { url: `http://192.168.3.207:7458/web-mobile/web-mobile/index.html?token=${token}`, cache_time: 3 });
	} else if (query.game_short_name === "game_crazydunk") {
		bot.answerCallbackQuery(query.id, { url: 'https://mxgames.akamaized.net/game/prod/takccrazydunk/index.html', cache_time: 3 });
	} else if (query.game_short_name === "game_plus") {
		bot.answerCallbackQuery(query.id, { url: 'https://mxgames.akamaized.net/game/prod/takplus/index.html', cache_time: 3 });
	}
});

bot.on("polling_error", (err) => console.log(err));




/***********************************APP***********************************/
const express = require('express');
var cors = require('cors');
const port = process.env.PORT || 8080;
// const url = require('url');

const app = express();
// // const Router = require('router');
// // const serveStatic = require('serve-static');
app.use(express.json());
app.use(cors());
//设置跨域访问
app.all('*', function (request: any, response: any, next: any) {
	// const token = url.parse(request.headers.referer).query.slice(6)
	const token = request.headers.token;
	if (!jws.verify(token, 'HS512', process.env.SIGN_SECRET)) {
		response.statusCode = 403;
		return response.end();
	}
	request.microGame = JSON.parse(jws.decode(token).payload);
	next();

	// console.log(url.parse(request.headers.referer), "url.parse(request.headers.referer).query");
	// console.log(response.statusCode, "response.statusCode");
	// next();



	// console.log(request, response, next);
	// response.header("Access-Control-Allow-Origin", "http://192.168.3.207:7458");
	// response.header("Access-Control-Allow-Headers", "Content-Type,Access-Token");
	// response.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	// response.header("X-Powered-By", ' 3.2.1');
	// response.header("Content-Type", "application/json;charset=utf-8");
	// response.end(JSON.stringify({
	// 	data: 'hello world!'
	// }))
});


app.post('/score', async (req: any, res: any) => {
	const scoreValue = parseInt(req.body.score)
	console.log(scoreValue);

	if (scoreValue <= 0) {
		res.statusCode = 400
		return res.end(req.body);
	}

	const { user, chat_id, imessage, message } = req.microGame;
	console.log(user, chat_id, message);

	bot.setGameScore(user, scoreValue, {
		// force: true,
		// disable_edit_message: true,
		inline_message_id: imessage,
		chat_id: chat_id,
		message_id: message
	}).then(() => {
		GetHighScoreList(user, imessage, chat_id, message, res);
	}).catch(() => {
		GetHighScoreList(user, imessage, chat_id, message, res);
	})
})

const GetHighScoreList = async (user: number, imessage: string, chat_id: number, message: number, res: any) => {
	let scores = await bot.getGameHighScores(user, {
		inline_message_id: imessage,
		chat_id: chat_id,
		message_id: message
	})
	res.setHeader('content-type', 'application/json')
	res.statusCode = 200;
	console.log(JSON.stringify(scores), ">>>>>>>>>>");
	res.end(JSON.stringify(scores, null, 0))
}



// Basic configurations
app.set('view engine', 'ejs');
app.get('/setScore', () => {
	console.log(">>>>>>>>>>>");
	// response.end("收到");
	// req+res;
	// bot.setGameScore(req.params.user_id, req.params.score, req.params.iid);
	// res.sendStatus(200);
});

// Bind server to port
app.listen(port, function listen() {
	console.log(`Server is listening at http://localhost:${port}`);
});




// // const router = Router();
// // router.use(serveStatic('public'))
// // const score = router.route('/score')
// score.all((req: any, res: any, next: any) => {
// 	const token = url.parse(req.headers.referer).query.slice(6)
// 	if (!jws.verify(token, 'HS512', process.env.SIGN_SECRET)) {
// 		res.statusCode = 403
// 		return res.end()
// 	}
// 	req.microGame = JSON.parse(jws.decode(token).payload)
// 	next();
// })
// score.all(bodyParser.json())
// score.get((req: any, res: any) => {
// 	console.log(req, res);
// 	// const { user, imessage, chat, message } = req.microGame
// 	// bot.getGameHighScores(user, imessage, chat, message)
// 	// 	.then((scores) => {
// 	// 		res.setHeader('content-type', 'application/json')
// 	// 		res.statusCode = 200
// 	// 		res.end(JSON.stringify(scores, null, 0))
// 	// 	})
// 	// 	.catch((err) => {
// 	// 		console.log(err)
// 	// 		res.statusCode = 500
// 	// 		res.end()
// 	// 	})
// })
// score.post((req: any, res: any) => {
// 	const scoreValue = parseInt(req.body.score)
// 	if (scoreValue <= 0) {
// 		res.statusCode = 400
// 		return res.end();
// 	}
// 	console.log(scoreValue, ">>>>>>>");

// 	// const { user, imessage, chat, message } = req.microGame
// 	// telegram.setGameScore(user, scoreValue, imessage, chat, message, true)
// 	// 	.then(() => {
// 	// 		res.statusCode = 200
// 	// 		res.end()
// 	// 	})
// 	// 	.catch((err) => {
// 	// 		res.statusCode = err.code || 500
// 	// 		res.end(err.description)
// 	// 	})
// })

// score.listen(8080, function listen() {
// 	console.log(`Server is listening at http://localhost:${8080}`);
// });









//npm run example -- 5239327825:AAGaU_Qm_Owhc7w0jSdFm62P3iITSxqbQ_Y

