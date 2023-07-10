const {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID_TEST,
  AUTH0_CLIENT_SECRET_TEST,
  AUTH0_AUDIENCE,
  AUTH0_GRANT_TYPE_TEST = 'client_credentials',
} = process.env;

const fetchAccessToken = async () => {
  const tokenUrl = new URL('oauth/token', AUTH0_DOMAIN);

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: AUTH0_CLIENT_ID_TEST,
      client_secret: AUTH0_CLIENT_SECRET_TEST,
      audience: AUTH0_AUDIENCE,
      grant_type: AUTH0_GRANT_TYPE_TEST,
    }),
  });

  const { access_token } = await response.json();

  return access_token;
};

export { fetchAccessToken };
