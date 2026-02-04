# 🪐 Venus

### Networking, without the friction.

Venus is a modern, lightweight networking library for JavaScript and TypeScript that makes working with APIs feel effortless.

No bloated configs.  
No fragile patterns.  
No surprises.

Venus turns network requests into a **calm, predictable experience** by refining `fetch` into a clean, type-safe, and resilient API. You focus on your app — Venus handles the edge cases.

## ✨ Why Venus?

- **Clean syntax** that stays out of your way
- **Type-safe by default**, from request to response
- **Built-in resilience** (timeouts, predictable errors)
- **Consistent results**, no matter how a request fails
- **Zero dependencies**, powered by native Web APIs

Venus doesn’t try to do everything.  
It does one thing **exceptionally well**:  
making network requests simple, elegant, and reliable.

---

## 🚀 Quick Start

### 1. Configuration

Set your base URL once at the entry point of your application (e.g., `main.ts` or `index.ts`).

```typescript
import { venusConfig } from "@code-braydev/venus";

venusConfig.setBaseURL("https://api.yourdomain.com");
```

### 2. Basic Usage

Venus returns a consistent object. You don't need to wrap calls in `try/catch`.

```typescript
import { get, send } from "@code-braydev/venus";

// Fetching data
const { data, ok, error } = await get<User>("/profile");

if (ok) {
  console.log(data.name);
} else {
  console.error(error);
}

// Sending data
const newUser = { name: "Brayan", role: "Developer" };
const result = await send("/users", newUser);
```

## 📦 API Methods

| Method       | Function                              | Description                                   |
| :----------- | :------------------------------------ | :-------------------------------------------- |
| `get`        | `get<T>(path, headers?, timeout?)`    | Fetch resources with auto-timeout.            |
| `send`       | `send<T>(path, body, headers?)`       | Create resources (POST) with body validation. |
| `update`     | `update<T>(path, body, headers?)`     | Full resource replacement (PUT).              |
| `updateOnly` | `updateOnly<T>(path, body, headers?)` | Partial modification (PATCH).                 |
| `remove`     | `remove<T>(path, headers?)`           | Delete resources with 204 status handling.    |

### 🧪 Testing

Venus is fully tested using Vitest. To run the suite:

```bash
npm test
```

## 📄 License

MIT © [code-braydev](https://github.com/code-braydev)
