export type ApiError = {
  error: string;
  statusCode: number;
}

export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    typeof (err as { statusCode: unknown }).statusCode === "number"
  );
}

export async function fetchOrLoadDebug<T>(url: string, debug = false, debugData?: T): Promise<T> {
  if (debug) {
    if (debugData === undefined) {
      throw new Error("A debug JSON must be provided when debug is true");
    }

    return debugData;
  }
  console.log('>>> URL: ' + url);

  const res = await fetch(url, { headers: { 'User-Agent': 'MyNewsApp/1.0' } });
  if (!res.ok) {
    throw { error: `Fetch error ${res.statusText} at ${url}`, statusCode: res.status}
  }
  
  return res.json();
}

export async function fetchBatchOrLoadDebug<T>(
  url: string,
  apiKey: string,
  payload: object,
  debug = false,
  debugData?: T
): Promise<T> {
  if (debug) {
    if (debugData === undefined) {
      throw new Error("A debug JSON must be provided when debug is true");
    }
    return debugData;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `apikey ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw { error: `Fetch error ${res.statusText} at ${url}`, statusCode: res.status}
  }

  return res.json();
}
