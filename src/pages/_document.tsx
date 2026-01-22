import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheets } from '@mui/styles';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <style dangerouslySetInnerHTML={{
            __html: `
              .hero-cover-image {
                object-fit: cover;
                object-position: center;
              }
              .cover-image-container {
                aspect-ratio: 16 / 9;
              }
              .score-badge-responsive {
                width: 120px;
                height: 120px;
                font-size: 36px;
                border: 4px solid white;
              }
              .cover-sidebar-desktop {
                display: block;
              }
              .content-container-responsive {
                padding-top: 24px;
                padding-bottom: 24px;
              }
              .content-title-responsive {
                font-size: 2rem;
              }
              .review-paper-responsive {
                padding: 24px;
              }
              .review-title-responsive {
                font-size: 1.5rem;
              }
              .video-paper-responsive {
                padding: 24px;
              }
              .video-title-responsive {
                font-size: 1.5rem;
              }
              @media (min-width: 900px) {
                .content-container-responsive {
                  padding-top: 40px;
                  padding-bottom: 40px;
                }
                .content-title-responsive {
                  font-size: 2.75rem;
                }
                .review-paper-responsive {
                  padding: 32px;
                }
                .review-title-responsive {
                  font-size: 1.75rem;
                }
                .video-paper-responsive {
                  padding: 32px;
                }
                .video-title-responsive {
                  font-size: 1.75rem;
                }
              }
              @media (max-width: 600px) {
                .hero-cover-image {
                  object-fit: contain !important;
                  width: 100% !important;
                  height: auto !important;
                }
                .hero-section-mobile {
                  height: auto !important;
                  min-height: auto !important;
                  max-height: none !important;
                  background-color: transparent !important;
                  display: block !important;
                  position: relative !important;
                }
                .hero-section-mobile > span {
                  position: relative !important;
                  width: 100% !important;
                  display: block !important;
                }
                .hero-section-mobile img {
                  object-fit: contain !important;
                  position: relative !important;
                }
                .cover-image-container {
                  aspect-ratio: 3 / 4;
                }
                .score-badge-responsive {
                  width: 80px;
                  height: 80px;
                  font-size: 28px;
                  border: 3px solid white;
                }
                .cover-sidebar-desktop {
                  display: none !important;
                }
              }
            `
          }} />
        </Head>
        <body suppressHydrationWarning>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;