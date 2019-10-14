import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const props = await Document.getInitialProps(ctx);
    return { ...props };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <link rel="stylesheet" type="text/css" href="/styles.css" />
          <link rel="stylesheet" type="text/css" href="/nprogress.css" />
        </Head>
        <body className="antialiased bg-gray-200 text-gray-800">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
