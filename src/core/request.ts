import { VenusResponse } from "./types";
import { venusConfig } from "../utils/config";

/**
 * Possible response formats for the Venus engine.
 */
export type VenusResponseType =
  | "json"
  | "text"
  | "blob"
  | "formData"
  | "arrayBuffer"
  | "auto";

interface VenusOptions extends RequestInit {
  /** Desired format for the response data. 'auto' detects JSON or falls back to text. */
  responseType?: VenusResponseType;
  /** Request execution limit in milliseconds. */
  timeout?: number;
}

/**
 * Core request engine for Venus.
 * Handles URL assembly, header injection, and multi-format response parsing.
 */
export async function request<T>(
  path: string,
  options: VenusOptions = {},
): Promise<VenusResponse<T>> {
  const { responseType = "auto", ...fetchOptions } = options;
  const baseUrl = venusConfig.getBaseURL();

  // URL Intelligence: Gracefully handle slashes and absolute vs relative paths
  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers({
    "Content-Type": "application/json", // Default to JSON for modern APIs
    ...fetchOptions.headers,
  });

  try {
    const response = await fetch(url, { ...fetchOptions, headers });

    let data: any;
    const contentType = response.headers.get("content-type") || "";

    /**
     * Parsing Logic:
     * If 'auto' is selected, we perform a silent check on the Content-Type header.
     * This allows the library to handle both JSON APIs and raw formats like RSS/XML seamlessly.
     */
    if (
      responseType === "json" ||
      (responseType === "auto" && contentType.includes("application/json"))
    ) {
      data = await response.json();
    } else if (responseType === "blob") {
      data = await response.blob();
    } else if (responseType === "formData") {
      data = await response.formData();
    } else if (responseType === "arrayBuffer") {
      data = await response.arrayBuffer();
    } else {
      // Standard fallback for RSS, XML, HTML or plain text
      data = await response.text();
    }

    return {
      data: data as T,
      ok: response.ok,
      status: response.status,
      error: response.ok
        ? null
        : `Error ${response.status}: ${response.statusText}`,
    };
  } catch (err) {
    // Handle network-level failures such as DNS issues or CORS blocks
    return {
      data: null as any,
      ok: false,
      status: 500,
      error:
        err instanceof Error ? err.message : "Venus: Internal Execution Error",
    };
  }
}
