export function stringifyError(err: unknown): string {
  const anyErr = err as any;
  const detail = anyErr?.data?.detail ?? anyErr?.error ?? anyErr?.message ?? anyErr;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const msgs = detail
      .map((d) => (typeof d?.msg === "string" ? d.msg : JSON.stringify(d)))
      .join("; ");
    return msgs || "Unknown error";
  }

  try {
    return JSON.stringify(detail);
  } catch {
    try {
      return String(detail);
    } catch {
      return "Unknown error";
    }
  }
}
