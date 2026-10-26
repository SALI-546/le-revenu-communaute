// Dynamic params reach the page still percent-encoded.
export const decodeUsername = (raw: string) => {
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
};
