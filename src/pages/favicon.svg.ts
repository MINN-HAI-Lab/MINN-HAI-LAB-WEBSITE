import type { APIRoute } from 'astro';

/** The canvas's red dot on its field. */
export const GET: APIRoute = () =>
  new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#06080A"/><circle cx="16" cy="16" r="5" fill="#D61A4A"/></svg>`,
    { headers: { 'Content-Type': 'image/svg+xml' } },
  );
