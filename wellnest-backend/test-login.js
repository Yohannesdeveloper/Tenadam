const base = 'http://localhost:3000';
const email = process.env.TEST_EMAIL;
const password = process.env.TEST_PW;

(async () => {
  const csrfRes = await fetch(base + '/api/auth/csrf');
  const rawCookies = csrfRes.headers.getSetCookie().map((c) => c.split(';')[0]);
  const cookie = rawCookies.join('; ');
  const { csrfToken } = await csrfRes.json();
  console.log('CSRF fetched:', Boolean(csrfToken));

  const res = await fetch(base + '/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookie,
    },
    body: new URLSearchParams({
      csrfToken,
      email,
      password,
      json: 'true',
    }),
    redirect: 'manual',
  });
  console.log('Login response status:', res.status);
  const setCookie = res.headers.getSetCookie();
  console.log('Session cookie set:', setCookie.some((c) => c.startsWith('next-auth.session-token')));
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
