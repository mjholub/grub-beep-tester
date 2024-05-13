import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { html } from '@elysiajs/html';
import { renderToString } from 'react-dom/server';
// @ts-ignore
import { renderToStringAsync } from 'react-async-ssr';
import { BeepSimulator } from './src/components/simulator';

const app = new Elysia().
  use(staticPlugin({ assets: './src' })).
  use(html());

const PORT = process.env.PORT || 4200;

const rendered = renderToStringAsync(BeepSimulator());
const component = await Bun.file('./src/components/simulator.jsx').text().then((data) => renderToString(data))

const htmlData = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="static/style.css">
  </head>
  <body>
    <div id="root">
      ${rendered}
</div>
  </body>
</html>
`

app.get("/", () => {
  return htmlData;
})
  .get("/static/style.css", () => Bun.file('./src/static/style.css'));

app.listen(PORT);
