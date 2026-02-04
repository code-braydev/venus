import { request } from "../core/request";
import { VenusResponse } from "../core/types";

/**
 * Common logic for update operations to ensure body consistency and error capturing.
 */
async function performUpdate<T>(
  path: string,
  method: "PUT" | "PATCH",
  body: any,
  headers?: HeadersInit,
): Promise<VenusResponse<T>> {
  // Prevent empty updates to save bandwidth
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

    // Extract detailed feedback if the server rejects the data
    // Useful for validation errors (e.g., "invalid date format" or "missing required field")
    if (!response.ok) {
      const serverMessage = (response.data as any)?.message || response.error;
      return {
        ...response,
        error: `Venus: Update failed. ${serverMessage}`,
      };
    }

    return response;
  } catch (err: any) {
    return {
      data: null,
      ok: false,
      status: 500,
      error: `Venus: Update processing error. ${err.message}`,
    };
  }
}

/**
 * update: Full resource replacement (PUT).
 * Use this when you want to overwrite the entire object.
 */
export const update = async <T>(
  path: string,
  body: any,
  headers?: HeadersInit,
): Promise<VenusResponse<T>> => {
  return performUpdate<T>(path, "PUT", body, headers);
};

/**
 * updateOnly: Partial resource modification (PATCH).
 * Use this to update specific fields without affecting the rest of the object.
 */
export const updateOnly = async <T>(
  path: string,
  body: any,
  headers?: HeadersInit,
): Promise<VenusResponse<T>> => {
  return performUpdate<T>(path, "PATCH", body, headers);
};
