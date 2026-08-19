export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function readErrorMessage(response: Response) {
  try {
    const body: unknown = await response.json();

    if (typeof body === 'object' && body !== null && 'message' in body) {
      const message = (body as { message?: unknown }).message;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.filter((item): item is string => typeof item === 'string').join(', ');
      }
    }
  } catch {
    // JSON 형식이 아닌 오류 응답
  }

  return `API 요청에 실패했습니다. (${response.status})`;
}

type ApiRequestOptions = RequestInit & {
  query?: Record<string, string | undefined>;
};

function createApiUrl(path: string, query?: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `${path}?${queryString}` : path;
}

export async function apiClient<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  const { query, ...requestInit } = options ?? {};

  const response = await fetch(createApiUrl(path, query), {
    ...requestInit,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(requestInit.body ? { 'Content-Type': 'application/json' } : {}),
      ...requestInit.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  return (await response.json()) as T;
}
