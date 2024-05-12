import { Elysia } from 'elysia';
import { staticPlugin } from "@elysiajs/static";
import { renderToString } from 'react-dom/server';
import React from 'react';
const BeepSimulator = require('./src/components/simulator').default;

const app = new Elysia().
  use(staticPlugin())

const PORT = process.env.PORT || 4200;

app.get("/", () => {
  // FIXME: use Bun's native JSX support features
  const content = renderToString(<BeepSimulator />);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>GRUB Beep Simulator</title>
      </head>
      <body>
        <div id="root">${app}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;

  return new Response(
    null
  )
}
)

app.listen(PORT);
