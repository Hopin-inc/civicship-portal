export async function createSession(idToken: string) {
  const res = await fetch("/api/sessionLogin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("createSession failed", res.status, errText);
    throw new Error(`Failed to create session cookie (${res.status})`);
  }

  console.info("✅ Session cookie successfully created (via proxy)");
  return true;
}
