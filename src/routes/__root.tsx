import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import AuthSync from '../components/AuthSync'
import FloatingWhatsAppButton from '../components/FloatingWhatsAppButton'
import Footer from '../components/Footer'
import Header from '../components/Header'
import GoogleAnalyticsPageView from '../components/GoogleAnalyticsPageView'
import MetaPixelPageView from '../components/MetaPixelPageView'
import { getGtagInitScript, getGtagJsSrc } from '../lib/google-analytics'
import {
  getMetaPixelBootstrapScript,
  getMetaPixelNoscriptUrl,
} from '../lib/meta-pixel'
import { CartProvider } from '../lib/cart'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Fast-Agros | Industrial Agriculture Wholesale',
      },
      {
        name: 'facebook-domain-verification',
        content: 'xujpegsmto2fdj4om9xvf154g4rljb',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: RootNotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const gtagJsSrc = getGtagJsSrc()
  const gtagInit = getGtagInitScript()
  const metaPixelBootstrap = getMetaPixelBootstrapScript()
  const metaPixelNoscript = getMetaPixelNoscriptUrl()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
        {gtagJsSrc ? <script async={true} src={gtagJsSrc} /> : null}
        {gtagInit ? <script dangerouslySetInnerHTML={{ __html: gtagInit }} /> : null}
        {metaPixelBootstrap ? (
          <script dangerouslySetInnerHTML={{ __html: metaPixelBootstrap }} />
        ) : null}
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <CartProvider>
          <MetaPixelPageView />
          <GoogleAnalyticsPageView />
          <AuthSync />
          <Header />
          {children}
          <Footer />
          <FloatingWhatsAppButton />
        </CartProvider>
        {metaPixelNoscript ? (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={metaPixelNoscript}
              alt=""
            />
          </noscript>
        ) : null}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function RootNotFound() {
  return (
    <main className="min-h-[50vh] bg-(--surface) px-6 py-20 sm:px-8">
      <section className="mx-auto max-w-[1360px] rounded-3xl bg-(--surface-container-low) px-8 py-12 text-center">
        <p className="text-secondary m-0 text-xs font-bold tracking-[0.2em] uppercase">
          Page introuvable
        </p>
        <h1 className="font-headline m-0 mt-4 text-4xl font-black tracking-tight text-(--on-surface)">
          Cette page n&apos;existe pas.
        </h1>
        <p className="text-(--on-surface-variant) mx-auto mt-4 max-w-xl text-sm leading-7">
          Le lien est peut-etre invalide, ou bien le serveur de dev doit etre
          recharge apres l&apos;ajout d&apos;une nouvelle route.
        </p>
      </section>
    </main>
  )
}
