import { describe, it, expect, beforeAll } from "vitest";
import { remove, venusConfig } from "../src/index";

describe("Venus REMOVE Method", () => {
  beforeAll(() => {
    venusConfig.setBaseURL("https://jsonplaceholder.typicode.com");
  });

  it("should delete a resource successfully", async () => {
    // JSONPlaceholder simula el borrado devolviendo un 200 o 204
    const { ok, status } = await remove("/posts/1");
    expect(ok).toBe(true);
    expect([200, 204]).toContain(status);
  });

  it("should handle deletion of non-existent resource", async () => {
    // Algunos servidores devuelven 404 si intentas borrar algo que no existe
    const { ok, status } = await remove("/posts/999999");
    // JSONPlaceholder siempre devuelve 200 en DELETE aunque no exista,
    // pero en una API real como la tuya de NestJS, esto daría error.
    console.log(`Status on non-existent delete: ${status}`);
  });
});
