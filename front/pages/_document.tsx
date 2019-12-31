import React from "react";
import Document, {
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { ServerStyleSheets } from "@material-ui/core/styles";
import { Enhancer, AppType } from "next/dist/next-server/lib/utils";

class CustomDocument extends Document {
  static getInitialProps = async (
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    const enhanceApp: Enhancer<AppType> = App => props =>
      sheets.collect(<App {...props} />);
    ctx.renderPage = () => originalRenderPage({ enhanceApp });
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  };

  render = () => (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </html>
  );
}
export default CustomDocument;
