# Mobile Use

This app is packaged as a static PWA. There is no backend, database, login, or server API.

## Build

```bash
npm run build
```

The deployable files are created in `dist/`.

## Best Phone Setup

Deploy `dist/` to any HTTPS static host, then open that URL on the phone.

Good options:

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages

Once opened on the phone:

- Android Chrome: menu -> Add to Home screen
- iPhone Safari: Share -> Add to Home Screen

## Same Wi-Fi Preview

For quick testing from a phone on the same Wi-Fi:

```bash
npm run dev:mobile
```

Open `http://<your-computer-ip>:5173` on the phone.

Note: install/offline PWA behavior usually requires HTTPS on real phones. Same-Wi-Fi HTTP preview is useful for testing the UI, but HTTPS deployment is the reliable way to use it like an app.
