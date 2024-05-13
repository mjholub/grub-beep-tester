import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { renderToStringAsync } from 'react-async-ssr';
import BeepSimulator from './src/components/simulator';

const app = new Elysia().
  use(html())

const PORT = process.env.PORT || 4200;

app.get("/", async () => {
  return new Promise(async (resolve, reject) => {
    const appBody = await renderToStringAsync(await BeepSimulator());

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>GRUB Beep Simulator</title>
        </head>
        <body>
          <div id="root">${appBody}</div>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `;

    resolve(content);
  });
});

app.listen(PORT);
