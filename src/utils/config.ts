let globalBaseURL = "";

/**
 * Venus Configuration Manager
 * Handles global settings like Base URL for all network requests.
 */
export const venusConfig = {
  /**
   * Sets the global base URL (e.g., https://api.braydev.xyz).
   * It automatically handles trailing slashes for consistency.
   */
  setBaseURL: (url: string) => {
    // Optimization: Ensures the URL is clean to avoid redundant slashes
    globalBaseURL = url.endsWith("/") ? url.slice(0, -1) : url;
  },

  /**
   * Returns the current global base URL.
   * Internal use only.
   */
  getBaseURL: () => globalBaseURL,
};
