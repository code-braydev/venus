/**
 * Standard response structure for all Venus operations.
 * @template T - The expected data shape (e.g., User, News, etc.)
 */
export type VenusResponse<T> = {
  /** The parsed JSON data from the server or null if an error occurred. */
  data: T | null;
  /** A descriptive error message, either from Venus or the server. */
  error: string | null;
  /** Boolean flag indicating if the request was successful (status 200-299). */
  ok: boolean;
  /** The HTTP status code returned by the server. */
  status: number;
};

/**
 * Internal configuration for network requests.
 * Extends the native RequestInit for full compatibility with fetch.
 */
export interface VenusOptions extends RequestInit {
  /** Optional base URL to avoid repeating full paths in every call. */
  baseUrl?: string;
}
