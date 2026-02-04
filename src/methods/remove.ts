import { request } from "../core/request";
import { VenusResponse } from "../core/types";

/**
 * Performs a DELETE request to remove a resource.
 * Handles No-Content responses and server-side rejection messages.
 */
export const remove = async <T>(
  path: string,
  headers?: HeadersInit,
): Promise<VenusResponse<T>> => {
  const response = await request<T>(path, {
    method: "DELETE",
    headers,
  });

  // Handle HTTP 204 (No Content)
  // Common in successful DELETE operations where no data is returned.
  if (response.status === 204) {
    return {
      ...response,
      ok: true,
      error: null,
    };
  }

  // Handle Server-Side Rejection (4xx or 5xx)
  // Captures specific error messages from the backend (e.g., "Access Denied" or "Resource in use")
  if (!response.ok) {
    const serverMessage = (response.data as any)?.message || response.error;

    return {
      ...response,
      error: `Venus: Delete failed. ${serverMessage}`,
    };
  }

  return response;
};
