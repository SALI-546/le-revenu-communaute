type Authored = { author?: { username: string } | null };
type Sanitized = Record<string, unknown>;

const publicAuthor = ({ author }: Authored) =>
  author ? { username: author.username } : null;

// sanitizeOutput drops User relations unless users.find is granted, which would expose /api/users and its emails.
export const withPublicAuthor = (sanitized: Sanitized, raw: Authored) => ({
  ...sanitized,
  author: publicAuthor(raw),
});

export const withPublicAuthors = (
  sanitized: Sanitized,
  raw: Authored & { replies?: unknown },
) => {
  const rawReplies = raw.replies;
  const replies =
    Array.isArray(rawReplies) && Array.isArray(sanitized.replies)
      ? sanitized.replies.map((reply: Sanitized, index) =>
          withPublicAuthor(reply, rawReplies[index] as Authored),
        )
      : sanitized.replies;
  return { ...withPublicAuthor(sanitized, raw), replies };
};
