/* eslint-disable @next/next/next-script-for-ga */
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render () {
    return (
      <Html lang='en'>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: 'history.scrollRestoration = "manual"'
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.GTM_ID}');`
            }}
          />
          <script data-cfasync="false" type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
                var freestar = freestar || {};
                freestar.queue = freestar.queue || [];
                freestar.config = freestar.config || {};
                freestar.config.enabled_slots = [];
                freestar.queue.push(function() {
                  googletag.pubads().set('page_url', 'houseofheat.co');
                });
              `
          }}
          />

          <script async src='https://www.googletagservices.com/tag/js/gpt.js' />
          <link rel='preconnect' href='https://a.pub.network/' crossOrigin='' />
          <link rel='preconnect' href='https://b.pub.network/' crossOrigin='' />
          <link rel='preconnect' href='https://c.pub.network/' crossOrigin='' />
          <link rel='preconnect' href='https://d.pub.network/' crossOrigin='' />
          <link rel='preconnect' href='https://secure.quantserve.com/' crossOrigin='' />
          <link rel='preconnect' href='https://rules.quantcount.com/' crossOrigin='' />
          <link rel='preconnect' href='https://pixel.quantserve.com/' crossOrigin='' />
          <link rel='preconnect' href='https://cmp.quantcast.com/' crossOrigin='' />
          <link rel='preconnect' href='https://btloader.com/' crossOrigin='' />
          <link rel='preconnect' href='https://api.btloader.com/' crossOrigin='' />
          <link rel='preconnect' href='https://confiant-integrations.global.ssl.fastly.net' crossOrigin='' />
          <link
            rel='preload'
            href='/fonts/ABCWhyte-Regular.woff2'
            type='font/woff2'
            as='font'
            crossOrigin=''
          />
          <link
            rel='preload'
            href='/fonts/ABCWhyte-Bold.woff2'
            type='font/woff2'
            as='font'
            crossOrigin=''
          />
          <link
            rel='preload'
            href='/fonts/ABCWhyteInktrap-Bold.woff2'
            type='font/woff2'
            as='font'
            crossOrigin=''
          />
          <link
            rel='preload'
            href='/fonts/ABCWhyteInktrap-Regular.woff2'
            type='font/woff2'
            as='font'
            crossOrigin=''
          />
          <link
            rel='preload'
            href='/fonts/ABCWhyteMono-Regular.woff2'
            type='font/woff2'
            as='font'
            crossOrigin=''
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon-16x16.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='120x120'
            href='/favicon/apple-touch-icon.png'
          />
          <link rel='manifest' href='/favicon/site.webmanifest' />
          <link
            rel='mask-icon'
            href='/favicon/safari-pinned-tab.svg'
            color='#5bbad5'
          />
          <meta name='msapplication-TileColor' content='#ffc40d' />
          <meta name='theme-color' content='#ffffff' />
        </Head>
        <body>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.GTM_ID}`}
              height='0'
              width='0'
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          <Main />
          <div id='modal' />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
