import { webhookCallback } from "grammy";
import { bot } from "../src/bot.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const callback = webhookCallback(bot, "http");
      return await callback(req, res);
    } catch (err) {
      console.error("Webhook processing error:", err);
      res.statusCode = 500;
      return res.end("Error processing webhook update");
    }
  }

  // GET request - healthcheck
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  return res.end(
    JSON.stringify({
      status: "online",
      bot: "@goosean_bot",
      message: "Telegram Webhook endpoint is active. Updates must be sent as POST requests from Telegram.",
    })
  );
}
