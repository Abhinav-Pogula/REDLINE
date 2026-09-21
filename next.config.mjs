// REDLINE has no server-only features anywhere (no API routes, no
// middleware, no cookies()/headers(), no server actions) -- everything runs
// client-side against localStorage per the PRD's "on-device by default"
// design. That makes it a clean fit for `output: "export"`: `next build`
// emits a plain static site into `out/`, deployable to any static host --
// no Node server required at runtime.
//
// GitHub Pages serves a repo (without a custom domain) from
// https://<user>.github.io/<repo>/, not the domain root, so every asset/link
// needs that `/repo` prefix baked in via basePath/assetPrefix. Only do that
// for the GitHub Actions build (see .github/workflows/deploy-pages.yml) --
// local `npm run dev`/`npm run build` should keep serving at "/" like
// normal, and the CI env only knows GITHUB_REPOSITORY as "owner/repo".
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  // Directory URLs (out/desktop/index.html, not out/desktop.html) so
  // GitHub Pages' static file server resolves /desktop/ without needing
  // any server-side rewrite rules.
  trailingSlash: true,
  ...(isGithubActions && repoName
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;
