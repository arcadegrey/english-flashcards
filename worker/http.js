export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  });

export const errorJson = (message, status = 400, code = 'BAD_REQUEST') =>
  json(
    {
      error: message,
      code,
    },
    status
  );

export const parseJsonBody = async (request) => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};
