import { request } from "../core/request";
import { VenusResponse } from "../core/types";

/**
 * Shared logic for update operations to ensure body consistency and detailed error capturing.
 * This helper unifies the processing for both PUT and PATCH methods.
 */
async function performUpdate<T>(
  path: string,
  method: "PUT" | "PATCH",
  body: any,
  headers?: HeadersInit,
): Promise<VenusResponse<T>> {
  /**
   * Pre-flight Check:
   * Ensures the payload is not empty to save bandwidth and prevent the server
   * from processing invalid update requests.
   */
  if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
    return {
      data: null,
      ok: false,
      status: 400,
      error: `Venus: ${method} requires a non-empty body.`,
    };
  }

  try {
    const response = await request<T>(path, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    /**
     * Server Feedback Extraction:
     * Captures specific validation messages (e.g., "invalid email format")
     * commonly sent by modern backends like NestJS or Express.
     */
    if (!response.ok) {
      const serverMessage = (response.data as any)?.message || response.error;
      return {
        ...response,
        error: `Venus: Update failed. ${serverMessage}`,
      };
    }

    return response;
  } catch (err: any) {
    // Handle unexpected serialization or network-level interruptions
    return {
      data: null,
      ok: false,
      status: 500,
      error: `Venus: Update processing error. ${err.message}`,
    };
  }
}

/**
 * Performs a full resource replacement using HTTP PUT.
 * Use this when you want to overwrite an entire object with a complete new data set.
 * * @param path - The endpoint or absolute URL of the resource.
 * @param body - The complete data object to replace the resource.
 * @param headers - Optional custom headers (e.g., Auth tokens).
 * @returns A promise with the standardized VenusResponse.
 */
export const update = async <T>(
  path: string,
  body: any,
  headers?: HeadersInit,
): Promise<VenusResponse<T>> => {
  return performUpdate<T>(path, "PUT", body, headers);
};

/**
 * Performs a partial resource modification using HTTP PATCH.
 * Use this to update specific fields without affecting the rest of the object.
 * * @param path - The endpoint or absolute URL of the resource.
 * @param body - An object containing only the fields you wish to change.
 * @param headers - Optional custom headers (e.g., Auth tokens).
 * @returns A promise with the standardized VenusResponse.
 */
export const updateOnly = async <T>(
  path: string,
  body: any,
  headers?: HeadersInit,
): Promise<VenusResponse<T>> => {
  return performUpdate<T>(path, "PATCH", body, headers);
};
