export default async function handler(req, res) {
  try {
    const { path = [] } = req.query;

    const targetUrl = `https://pvz-2-api.vercel.app/api/${path.join("/")}`;

    const fetchOptions = {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
      },
    };
    
    if (!["GET", "HEAD"].includes(req.method)) {
      fetchOptions.body = req.body;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    res.status(response.status);

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
}
