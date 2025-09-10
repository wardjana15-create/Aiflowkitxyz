// _worker.js — Dynamic Menu + Domain Redirect
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // === REDIRECT .pages.dev to aiflowkit.xyz ===
    if (url.hostname.endsWith('.pages.dev')) {
      const newUrl = new URL(url.pathname + url.search, 'https://aiflowkit.xyz');
      return Response.redirect(newUrl.toString(), 301);
    }

    // === INJECT MENU for .html pages ===
    if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
      const response = await fetch(request);
      const html = await response.text();
      
      // Define your menu HTML (edit this once)
      const menuHTML = `
<nav style="background: white; padding: 1rem 0; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100;">
  <ul style="list-style: none; display: flex; justify-content: center; gap: 2rem; margin: 0; padding: 0; flex-wrap: wrap;">
    <li><a href="/" style="text-decoration: none; color: #2563eb; font-weight: 600;">Home</a></li>
    <li><a href="/tools/" style="text-decoration: none; color: #2563eb; font-weight: 600;">Tools</a></li>
    <li><a href="/guides/" style="text-decoration: none; color: #2563eb; font-weight: 600;">Guides</a></li>
    <li><a href="/comparisons/" style="text-decoration: none; color: #2563eb; font-weight: 600;">Comparisons</a></li>
    <li><a href="/resources/free-ai-automation-checklist.html" style="text-decoration: none; color: #2563eb; font-weight: 600;">Resources</a></li>
    <li><a href="/about.html" style="text-decoration: none; color: #2563eb; font-weight: 600;">About</a></li>
    <li><a href="/contact.html" style="text-decoration: none; color: #2563eb; font-weight: 600;">Contact</a></li>
  </ul>
</nav>
`;

      // Inject menu after <header> (if exists) or after <body>
      let modifiedHTML = html;
      if (html.includes('<header>')) {
        modifiedHTML = html.replace('</header>', '</header>' + menuHTML);
      } else if (html.includes('<body>')) {
        modifiedHTML = html.replace('<body>', '<body>' + menuHTML);
      }

      return new Response(modifiedHTML, {
        headers: { "content-type": "text/html;charset=UTF-8" },
      });
    }

    // For non-HTML files (CSS, images, etc.)
    return fetch(request);
  },
};
