import { request } from "../core/request";
import { VenusResponse } from "../core/types";

/**
 * Performs a GET request with a built-in timeout mechanism.
 * Standardizes timeout errors to a 408 status even if the network layer fails abruptly.
 */
export const get = async <T>(
  path: string,
  headers?: HeadersInit,
  timeoutMs: number = 8000,
): Promise<VenusResponse<T>> => {
  // Initialize request cancellation logic
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await request<T>(path, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    // Clear timeout as soon as the request settles to free memory
    clearTimeout(timeoutId);

    /**
     * Edge case handling: If the core request returns a failure but the
     * signal was aborted, it means the timeout won the race against the network.
     */
    if (!response.ok && controller.signal.aborted) {
      return {
        data: null,
        ok: false,
        status: 408,
        error: "Venus: Request timed out.",
      };
    }

    // Developer feedback for successful requests with no data body
    if (response.ok && !response.data) {
      console.warn(`Venus: Resource at ${path} returned no content.`);
    }

    return response;
  } catch (err: any) {
    // Ensure the timer is stopped even on fatal errors
    clearTimeout(timeoutId);

    /**
     * Error Normalization:
     * We check the signal state and error name to unify different environment
     * responses (Node, Browser, etc.) into a consistent Venus 408 status.
     */
    const isTimeout =
      err.name === "AbortError" ||
      controller.signal.aborted ||
      err.message?.toLowerCase().includes("timeout") ||
      err.message?.toLowerCase().includes("aborted");

    if (isTimeout) {
      return {
        data: null,
        ok: false,
        status: 408,
        error: "Venus: Request timed out.",
      };
    }

    // Default handler for unexpected system or network failures
    return {
      data: null,
      ok: false,
      status: 500,
      error: `Venus: ${err.message || "Internal network error."}`,
    };
  }
};
