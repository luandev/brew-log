import type { ReactNode } from "react";

const css = `
  html, body, #root { height: auto !important; min-height: 100%; }
  body { overflow: auto !important; }
  body {
    margin: 0;
    background-color: #0E0F10;
    background-image: radial-gradient(ellipse 90% 60% at 50% -10%, rgba(108, 124, 68, 0.12), transparent);
    color: #F2EBD9;
    font-family: "Source Sans 3", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  a { color: #AD9753; }
  a.lto-link, a.lto-nav-link, a.lto-footer-link, a.lto-brand {
    color: #AD9753;
    text-decoration: none;
  }
  a.lto-nav-link {
    color: #c4bba8;
    font-size: 15px;
    font-weight: 600;
  }
  a.lto-nav-link.is-active { color: #AD9753; }
  a.lto-footer-link { color: #c4bba8; font-size: 14px; display: block; }
  a.lto-brand { color: #F2EBD9; }
  img.lto-icon { display: block; object-fit: contain; flex-shrink: 0; }
  .lto-hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.42;
    pointer-events: none;
  }
  .lto-batch-table {
    width: 100%;
    border-collapse: collapse;
  }
  .lto-batch-table th, .lto-batch-table td {
    border-bottom: 1px solid rgba(173, 151, 83, 0.2);
    padding: 0.6rem 0.5rem;
    text-align: left;
    vertical-align: middle;
    color: #c4bba8;
  }
  .lto-batch-table th {
    color: #8f8779;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  time.lto-date {
    color: inherit;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .md-body { color: #c4bba8; line-height: 1.65; }
  .md-body h1, .md-body h2, .md-body h3, .md-body h4 { color: #F2EBD9; }
  .md-body table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
  .md-body th, .md-body td {
    border: 1px solid rgba(173, 151, 83, 0.35);
    padding: 0.45rem 0.6rem;
    text-align: left;
  }
  .md-body th { color: #AD9753; }
  .md-body code { font-size: 0.9em; }
  .lto-shell { min-height: 100vh; height: auto !important; flex: none !important; }
`;

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#0E0F10" />
        <title>The Lone Tree Orchard</title>
        <meta
          name="description"
          content="Small batches. Seasonal ingredients. Thoughtful experiments."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
