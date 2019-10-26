import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
            name="viewport"
          />
          <link
            rel="shortcut icon"
            href="/favicon/favicon.ico"
            type="image/x-icon"
          />
          <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
          <link rel="stylesheet" type="text/css" href="/css/nprogress.css" />
        </Head>
        <body className="antialiased bg-gray-100">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
