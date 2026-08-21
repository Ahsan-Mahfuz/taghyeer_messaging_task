export const ORIGIN =
  process.env.NEXT_PUBLIC_CHAT_ORIGIN ?? "https://frontend-task-chatapp.onrender.com";

const BASE = `${ORIGIN}/api`;

export const OBJECT_ID = /^[0-9a-f]{24}$/i;

export class ApiError extends Error {
  status: number;
  code: string;
  sessionExpired: boolean;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.sessionExpired = status === 401 || code === "NO_TOKEN";
  }
}

type ErrorBody = {
  error?: { message?: string; code?: string; details?: { path: string; message: string }[] };
};

function readError(status: number, body: unknown): ApiError {
  const error = (body as ErrorBody)?.error;
  const detail = error?.details?.[0]?.message;
  const message = detail ?? error?.message ?? "Something went wrong. Nothing you wrote was lost.";
  return new ApiError(status, error?.code ?? "UNKNOWN", message);
}

export async function request<T>(
  path: string,
  token: string | null,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, "NETWORK", "Could not reach the server. Check your connection.");
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) throw readError(response.status, body);
  return body as T;
}
