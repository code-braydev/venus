import { describe, it, expect, beforeAll } from "vitest";
import { get, venusConfig } from "../src/index";

describe("Venus GET Method", () => {
  beforeAll(() => {
    // Using a reliable public API for testing
    venusConfig.setBaseURL("https://jsonplaceholder.typicode.com");
  });

  it("should fetch a post successfully", async () => {
    const { ok, data, status } = await get<any>("/posts/1");
    expect(ok).toBe(true);
    expect(status).toBe(200);
    expect(data.id).toBe(1);
  });

  it("should handle 404 errors gracefully", async () => {
    const { ok, status } = await get("/invalid-endpoint-braydev");
    expect(ok).toBe(false);
    expect(status).toBe(404);
  });

  it("should trigger timeout when server is too slow", async () => {
    // 50ms es el estándar de oro para probar timeouts ultra-rápidos en tests
    const { ok, status, error } = await get("/posts/1", {}, 50);

    expect(ok).toBe(false);
    expect(status).toBe(408);
    expect(error).toContain("timed out");
  });
});
