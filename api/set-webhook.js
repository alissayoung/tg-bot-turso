export default async function handler(req, res) {
  const token = process.env.BOT_TOKEN;
  if (!token) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: false, error: "BOT_TOKEN not configured in Vercel environment variables" }));
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const webhookUrl = `${proto}://${host}/api/webhook`;

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
    );
    const data = await tgRes.json();

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify(
        {
          ok: data.ok,
          webhook_url: webhookUrl,
          telegram_response: data,
        },
        null,
        2
      )
    );
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: false, error: err.message }));
  }
}
