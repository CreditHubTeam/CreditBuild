export const api = {
  base: process.env.NEXT_PUBLIC_API_BASE ?? "",
  async get<T>(path: string) {
    const r = await fetch(`${api.base}${path}`, { cache: "no-store" });
    if (!r.ok) throw new Error(await r.text());
    return r.json() as Promise<T>;
  },
  async post<T>(path: string, body: unknown) {
    const r = await fetch(`${api.base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json() as Promise<T>;
  },
};
