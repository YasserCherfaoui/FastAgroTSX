# Frontoffice

`frontoffice` is a TanStack Start storefront app.

## Local development

```bash
npm install
npm run dev
```

The frontend expects the backend API base URL through `VITE_API_URL`. If it is not set, the app falls back to `http://localhost:8180`.

Create a local env file if needed:

```bash
cp .env.example .env
```

## Production build

```bash
npm run build
```

## Tests

```bash
npm run test
```

## Vercel deployment

This app uses TanStack Start SSR, so it should be deployed to Vercel as a TanStack Start app with Nitro enabled in `vite.config.ts`.

Set the project root to `frontoffice` in Vercel and configure:

1. Install command: `npm install`
2. Build command: `npm run build`
3. Output setting: leave the framework defaults enabled
4. Environment variable: `VITE_API_URL=https://your-api-domain`

If the backend enforces CORS, make sure the Vercel domain is allowed by the API before going live.
