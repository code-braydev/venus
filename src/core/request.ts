// src/core/request.ts
import { VenusResponse } from "./types";
import { venusConfig } from "../utils/config";

/**
 * Core request engine for Venus.
 * Handles URL assembly, header injection, and safe JSON parsing.
 */
export async function request<T>(
  path: string,
  options: RequestInit,
): Promise<VenusResponse<T>> {
  const baseUrl = venusConfig.getBaseURL();

  // Intelligence: Handle path concatenation gracefully
  // Ensures 'https://api.com' + 'users' becomes 'https://api.com/users'
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${baseUrl}${cleanPath}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // Content-Type validation to avoid parsing errors on non-JSON responses
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");

    const data = isJson ? await response.json() : null;

    return {
      data,
      ok: response.ok,
      status: response.status,
      error: response.ok
        ? null
        : `Error ${response.status}: ${response.statusText}`,
    };
  } catch (err) {
    // Catch network-level failures (DNS, Offline, CORS)
    return {
      data: null,
      ok: false,
      status: 500,
      error:
        err instanceof Error ? err.message : "Venus: Internal Execution Error",
    };
  }
}
