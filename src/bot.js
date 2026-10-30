import { Bot, InlineKeyboard } from "grammy";
import { recordUserMessage, getStats } from "./db.js";

const token = process.env.BOT_TOKEN;
if (!token) {
  console.warn("BOT_TOKEN is not defined in environment variables!");
}

export const bot = new Bot(token || "dummy-token");

// Middleware: log every message and user into Turso DB
bot.use(async (ctx, next) => {
  if (ctx.from) {
    await recordUserMessage(ctx.from, ctx.message?.text || "");
  }
  await next();
});

// /start command
bot.command("start", async (ctx) => {
  const name = ctx.from.first_name || "друг";
  const keyboard = new InlineKeyboard()
    .text("📊 Статистика базы", "stats")
    .text("ℹ️ О боте", "about")
    .row()
    .url("🌐 Turso Cloud", "https://turso.tech")
    .url("▲ Vercel", "https://vercel.com");

  await ctx.reply(
    `👋 Привет, <b>${name}</b>!\n\n` +
    `🤖 Бот <b>${ctx.me?.first_name || "lil gus"}</b> (@${ctx.me?.username || "goosean_bot"}) работает на <b>Vercel Serverless</b> и подключен к облачной базе данных <b>Turso DB (libSQL)</b>!\n\n` +
    `📌 Доступные команды:\n` +
    `• /start — перезапустить бота\n` +
    `• /stats — статистика пользователей и сообщений в Turso DB\n` +
    `• /help — информация о работе бота`,
    { parse_mode: "HTML", reply_markup: keyboard }
  );
});

// /help command
bot.command("help", async (ctx) => {
  await ctx.reply(
    `📖 <b>Справка:</b>\n\n` +
    `• <b>Хостинг:</b> Vercel (Serverless Functions)\n` +
    `• <b>База данных:</b> Turso (облачный SQLite / libSQL)\n` +
    `• Все входящие сообщения и профили пользователей автоматически фиксируются в БД Turso.\n\n` +
    `Напишите любое текстовое сообщение, и бот подтвердит запись в базу данных!`,
    { parse_mode: "HTML" }
  );
});

// /stats command
bot.command("stats", async (ctx) => {
  const stats = await getStats();
  if (!stats) {
    await ctx.reply("⚠️ Не удалось получить статистику из Turso DB. Проверьте переменные TURSO_DATABASE_URL и TURSO_AUTH_TOKEN в Vercel.");
    return;
  }

  await ctx.reply(
    `📊 <b>Статистика из Turso DB:</b>\n\n` +
    `👥 Всего пользователей: <b>${stats.totalUsers}</b>\n` +
    `💬 Всего сообщений: <b>${stats.totalMessages}</b>\n\n` +
    `⚡ <i>Синхронизировано в реальном времени с облаком Turso</i>`,
    { parse_mode: "HTML" }
  );
});

// Inline keyboard handlers
bot.callbackQuery("stats", async (ctx) => {
  await ctx.answerCallbackQuery();
  const stats = await getStats();
  if (!stats) {
    await ctx.reply("⚠️ База данных Turso пока не подключена или вернула ошибку.");
    return;
  }
  await ctx.reply(
    `📊 <b>Текущие показатели Turso:</b>\n` +
    `• Зарегистрировано пользователей: <b>${stats.totalUsers}</b>\n` +
    `• Зафиксировано обращений: <b>${stats.totalMessages}</b>`,
    { parse_mode: "HTML" }
  );
});

bot.callbackQuery("about", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    `ℹ️ <b>О проекте:</b>\n\n` +
    `Бот работает без выделенного сервера на базе Vercel Webhook.\n` +
    `Благодаря Turso DB данные не теряются между вызовами функций.`
  );
});

// Text message handler
bot.on("message:text", async (ctx) => {
  await ctx.reply(
    `💬 Ваше сообщение: <i>«${ctx.message.text}»</i>\n\n` +
    `✅ Успешно зафиксировано в базе данных <b>Turso</b>!`,
    { parse_mode: "HTML" }
  );
});
