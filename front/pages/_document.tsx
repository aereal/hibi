import React from "react";
import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

class HibiDocument extends NextDocument {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await NextDocument.getInitialProps(ctx);
    const css = new ServerStyleSheet();
    try {
      const page = ctx.renderPage(App => props =>
        css.collectStyles(<App {...props} />)
      );

      return {
        ...initialProps,
        ...page,
        styles: (
          <>
            {initialProps.styles}
            {css.getStyleElement()}
          </>
        ),
      };
    } finally {
      css.seal();
    }
  }
}
export default HibiDocument;
