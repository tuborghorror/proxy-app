import express from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(async (req, res) => {
    try {
      console.log(process.env)
        const targetUrl = new URL(req.originalUrl, process.env.TARGET_URL).href;
        console.log('Проксируем:', targetUrl);

        const targetRes = await fetch(targetUrl);
        const contentType = targetRes.headers.get('content-type');

        if (contentType && contentType.includes('text/html')) {
            let html = await targetRes.text();

            const metaTag = '<meta name="algolia-site-verification"  content="F95FC1FE3D9D3B49" />';
            html = html.replace('<head>', `<head>${metaTag}`);

            res.set('Content-Type', 'text/html');
            res.send(html);
        } else {
            res.set('Content-Type', contentType);
            targetRes.body.pipe(res);
        }
    } catch (err) {
        console.error('Ошибка проксирования:', err);
        res.status(500).send('Прокси-сервер упал 🧨');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
