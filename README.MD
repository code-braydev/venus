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

Get up and running with Venus in minutes.

### 1. Configure the base URL

Set your API base URL once at your app’s entry point (e.g. `main.ts` or `index.ts`).

```ts
import { venusConfig } from "@code-braydev/venus";

venusConfig.setBaseURL("https://api.yourdomain.com");
```

### 2. Make your first request

Venus always returns a predictable response object — no `try/catch` required.

```ts
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

That’s it.
No boilerplate. No guesswork. Just clean network calls.

---

## 📦 API Methods

| Method       | Function                              | Description                                  |
| :----------- | :------------------------------------ | :------------------------------------------- |
| `get`        | `get<T>(path, headers?, timeout?)`    | Fetch resources with a built-in timeout.     |
| `send`       | `send<T>(path, body, headers?)`       | Create resources (POST) with validated body. |
| `update`     | `update<T>(path, body, headers?)`     | Replace resources entirely (PUT).            |
| `updateOnly` | `updateOnly<T>(path, body, headers?)` | Update resources partially (PATCH).          |
| `remove`     | `remove<T>(path, headers?)`           | Delete resources with 204 handling.          |

### 🧪 Testing

Venus is fully tested with **Vitest**.  
Run the test suite with:

```bash
npm test

```

## 📄 License

MIT © [code-braydev](https://github.com/code-braydev)
