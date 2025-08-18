

export async function fetchOrLoadDebug<T>(url: string, debug = false, debugData?: T): Promise<T> {
  if (debug) {
    if (debugData === undefined) {
      throw new Error("A debug JSON must be provided when debug is true");
    }

    return debugData;
  }
  console.log('>>> URL: ' + url);
  const now = new Date();
  const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
  console.log(timeString);
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch error ${res.status} at ${url}`);
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
    throw new Error(`Fetch error ${res.status} at ${url}`);
  }

  return res.json();
}
