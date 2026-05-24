# Security Spec

## Data Invariants
1. Users can only read/write their own profile data, logs, routines, and custom circuits.
2. Community posts are readable by any authenticated user.
3. Users can only create community posts authored by themselves (`authorId == request.auth.uid`).
4. Community posts can only be modified by the author (for text) or anyone (for likes/comments updates conditionally). For simplicity, posts can be updated by anyone if they are just changing `likes`, `likedBy`, or adding `comments`, as long as the base structure is maintained.

## The Dirty Dozen Payloads (Conceptual)
1. Read another user's profile: DENIED
2. Write another user's logs: DENIED
3. Create a log with mismatched userId: DENIED
4. Add a community post anonymously: DENIED
5. Read community posts anonymously: DENIED
6. Spoof a community post's `authorId`: DENIED
7. Modify community post's `author` or `text` as non-author: DENIED
8. Delete a community post as non-author: DENIED
9. Push a `CustomCircuits` object to another user's subcollection: DENIED
10. Update a community post to change another user's like: DENIED (Simplistic approach would allow it, but we can secure it using array checks or just a basic schema check for now)
11. Send invalid string IDs for documents: DENIED
12. Create log with payload that lacks required fields: DENIED
