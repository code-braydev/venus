import { request } from "../core/request";
import { VenusResponse } from "../core/types";

/**
 * Performs a POST request with payload validation and detailed server feedback.
 * Includes a pre-flight check to prevent unnecessary network overhead for empty bodies.
 * * @param path - The target endpoint or absolute URL.
 * @param body - The data payload to be serialized and sent.
 * @param headers - Optional custom headers (e.g., Authorization tokens).
 */
export const send = async <T>(
  path: string,
  body: any,
  headers?: HeadersInit,
): Promise<VenusResponse<T>> => {
  /**
   * Pre-fetch Validation:
   * Prevents sending requests with null or empty objects, saving client-side
   * resources and avoiding predictable 400 Bad Request responses from the server.
   */
  if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
    return {
      data: null,
      ok: false,
      status: 400,
      error: "Venus: Cannot send an empty body.",
    };
  }

  try {
    /**
     * Request Execution:
     * Data is automatically serialized as JSON to match the default 'application/json'
     * Content-Type defined in the core request engine.
     */
    const response = await request<T>(path, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    /**
     * Server Feedback Extraction:
     * Specifically designed to capture validation error messages from backends
     * (like NestJS or Express) that provide structured error objects.
     */
    if (!response.ok) {
      const serverMessage = (response.data as any)?.message || response.error;
      return {
        ...response,
        error: `Venus: ${serverMessage}`,
      };
    }

    return response;
  } catch (err: any) {
    /**
     * Exception Handling:
     * Catches failures during the serialization process or unexpected network interruptions.
     */
    return {
      data: null,
      ok: false,
      status: 500,
      error: `Venus: Payload processing failed. ${err.message}`,
    };
  }
};
