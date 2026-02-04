import { request } from "../core/request";
import { VenusResponse } from "../core/types";

/**
 * Performs a POST request with payload validation and detailed error feedback.
 */
export const send = async <T>(
  path: string,
  body: any,
  headers?: HeadersInit,
): Promise<VenusResponse<T>> => {
  // Pre-fetch validation: Avoid unnecessary network usage for empty payloads
  if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
    return {
      data: null,
      ok: false,
      status: 400,
      error: "Venus: Cannot send an empty body.",
    };
  }

  try {
    // Execute request with automatic JSON serialization
    const response = await request<T>(path, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    // Detailed feedback: Extract server-side validation messages (e.g., from NestJS?)
    if (!response.ok) {
      const serverMessage = (response.data as any)?.message || response.error;
      return {
        ...response,
        error: `Venus: ${serverMessage}`,
      };
    }

    return response;
  } catch (err: any) {
    return {
      data: null,
      ok: false,
      status: 500,
      error: `Venus: Payload processing failed. ${err.message}`,
    };
  }
};
