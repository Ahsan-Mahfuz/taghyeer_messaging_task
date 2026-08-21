# Chat API

Swagger only documents requests. These are the responses, checked against the live API on
21 Aug 2026.

Bugs and quirks: [API-ISSUES.md](./API-ISSUES.md)

## Basics

- REST: `https://frontend-task-chatapp.onrender.com/api`
- Socket: `https://frontend-task-chatapp.onrender.com` (root origin, not `/api`)
- Auth: `Authorization: Bearer <jwt>` on everything except login and `/health`
- IDs: Mongo ObjectId, 24 hex chars
- Timestamps: ISO over REST, epoch ms over the socket

`/health` is on the root too. `GET /api/health` is a 404.

## Response shapes

Six different envelopes. You can't guess these:

| Endpoint | Returns |
|---|---|
| `POST /auth/login` | `{ token, user }` |
| `GET /auth/me` | bare `User` |
| `GET /users/search` | bare `User[]` |
| `GET /conversations` | `{ data: Conversation[] }` |
| `POST /conversations` | bare, different shape from the list |
| `GET /conversations/:id/messages` | `{ messages, hasMore }` |
| `POST /messages` | bare `Message` |
| group endpoints | bare `GroupConversation` |

I normalize all of them in the API client.

## Errors

```json
{ "error": { "message": "Validation failed", "code": "VALIDATION_ERROR",
             "details": [{ "path": "name", "message": "Required" }] } }
```

`details` only appears on `VALIDATION_ERROR`.

| Code | Status | When |
|---|---|---|
| `NO_TOKEN` | 400 | No auth header. Should be 401. |
| `INVALID_TOKEN` | 401 | Bad or expired token |
| `VALIDATION_ERROR` | 400 | Body failed validation |
| `UNKNOWN_USER` | 400 | User doesn't exist |
| `NOT_FOUND` | 404 | Conversation doesn't exist |
| `FORBIDDEN` | 403 | Not a participant, or not an admin |
| `NOT_A_GROUP` | 400 | Group operation on a direct conversation |
| `NOT_A_MEMBER` | 400 | Promotion target isn't in the group |
| `TOO_FEW_MEMBERS` | 400 | Group would drop below 3 |
| `SERVER_ERROR` | 500 | Unhandled. Leaks raw Mongoose text. |

## Types

```ts
type ID = string;
type PublicUser = { _id: ID; name: string; phone: string };

interface User extends PublicUser {
  createdAt: string;          // search omits this
}

interface Message {
  _id: ID;
  conversation: ID;
  sender: ID;                 // never populated
  text: string;
  createdAt: string;
}

interface DirectConversation {
  _id: ID;
  type: 'direct';
  lastMessage: LastMessage;   // {} when empty, not null
  updatedAt: string;
  participant: PublicUser;    // singular, the other person
}

interface GroupConversation {
  _id: ID;
  type: 'group';
  lastMessage: LastMessage;
  updatedAt: string;
  name: string;
  createdBy: ID;
  admins: ID[];               // ids
  participants: PublicUser[]; // objects
  createdAt?: string;         // write responses only
}

type LastMessage = { text?: string; sender?: ID; createdAt?: string };
type Conversation = DirectConversation | GroupConversation;
```

Discriminate on `type`. `admins` holds ids but `participants` holds objects, so admin checks are
`admins.includes(id)` with ids pulled out of `participants`.

## Auth

### `POST /auth/login`

No auth. New phone registers, existing phone logs in.

```jsonc
// request
{ "phone": "+8801700000001", "name": "Ada Lovelace" }

// 200 response
{ "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "_id": "6a88275de5d6aac97521e37a", "name": "Ada Lovelace",
            "phone": "+8801700000001", "createdAt": "2026-08-21T10:24:29.021Z" } }
```

JWT is `{ sub, iat, exp }`, lasts 7 days, no refresh endpoint. On a 401 I clear the session.

No phone format validation, `"abc"` is accepted. An existing phone with a different `name`
overwrites the stored name.

`400 VALIDATION_ERROR` if either field is missing.

### `GET /auth/me`

Restores a session on page load. Returns a bare `User`, not `{ user }` like login.

```jsonc
// 200 response
{ "_id": "6a88275de5d6aac97521e37a", "name": "Ada Lovelace",
  "phone": "+8801700000001", "createdAt": "2026-08-21T10:24:29.021Z" }
```

`400 NO_TOKEN`, `401 INVALID_TOKEN`

## Users

### `GET /users/search?q=`

Does **not** exclude the caller: searching your own name returns you. No match gives `[]`.
The client filters your own id out of the results so you cannot start a chat with yourself.

```jsonc
// 200 response
[{ "_id": "6a8856fde5d6aac97522501b", "name": "Bob Jones", "phone": "+8801700000003" }]
```

The matching is much narrower than it looks. Measured, not guessed:

| query against `{ name: "Kamrul Hasan", phone: "01980451633" }` | result |
|---|---|
| `Kamrul` | match |
| `kamrul` | no match, it is case sensitive |
| `Hasan` | no match, only the start of the name counts |
| `amrul` | no match |
| `01980451633` | match |
| `01980451` | no match, a phone prefix is not enough |
| `+8801980451633` | 500 |

So **name is a case-sensitive prefix and phone is exact equality**. The behaviour fits a query
like `{ $or: [{ name: /^<q>/ }, { phone: <q> }] }`, and that also explains the 500: `^+880...` is an
invalid regex, which is exactly what the error says.

Two consequences worth spelling out:

- A user stored with a leading `+` **cannot be found by phone at all**. Their exact number 500s on
  the name regex, and an escaped `\+880...` no longer equals the stored string. There is no query
  that reaches them.
- No `q` at all returns every user in the database.

What the client does: registration rewrites `+8801...` to `01...` before it is stored, so people
signing up through this app stay reachable. Search sends several spellings of the term and merges
by `_id`, which covers both phone formats and any capitalization. Nothing is searched below two
characters, so the full-directory dump is never triggered.

## Conversations

### `GET /conversations`

Both types, most recent first, no pagination.

```jsonc
// 200 response
{ "data": [
  { "_id": "6a885727e5d6aac9752250ce", "type": "direct",
    "lastMessage": { "text": "see you tomorrow", "sender": "6a885723...", "createdAt": "2026-08-21T13:48:37.488Z" },
    "updatedAt": "2026-08-21T13:48:37.724Z",
    "participant": { "_id": "6a885724...", "name": "Bob Jones", "phone": "+8801700000003" } },

  { "_id": "6a885761e5d6aac97522528c", "type": "group",
    "lastMessage": {},
    "updatedAt": "2026-08-21T13:49:21.908Z",
    "name": "Project Team",
    "createdBy": "6a88575c...",
    "admins": ["6a88575c..."],
    "participants": [ { "_id": "6a88575c...", "name": "Ada Lovelace", "phone": "+8801700000001" } ] }
] }
```

`lastMessage` is `{}` when there are no messages, so `if (lastMessage)` always passes. Use
`lastMessage?.text`.

### `POST /conversations`

Opens a 1-to-1. Idempotent for the same pair.

```jsonc
// request
{ "userId": "6a885724e5d6aac9752250b2" }

// 200 response  (cut down: no `type`, participants are bare ids)
{ "_id": "6a885727e5d6aac9752250ce",
  "participants": ["6a885723e5d6aac9752250a9", "6a885724e5d6aac9752250b2"],
  "createdAt": "2026-08-21T13:48:23.812Z" }
```

Not enough to render with, so I take the `_id` and get the real object from the list.

Passing your own id doesn't error, it returns some other conversation of yours. I block
self-chat in the UI.

`400 UNKNOWN_USER`, `500` on a malformed id

### `GET /conversations/:id/messages`

Participants only. Newest first, so the UI reverses it.

| Param | Notes |
|---|---|
| `limit` | `0`, negatives and non-numbers are ignored and you get everything. No cap. |
| `before` | message id cursor |

```jsonc
// 200 response
{ "messages": [ { "_id": "6a885735...", "conversation": "6a885727...", "sender": "6a885723...",
                  "text": "see you tomorrow", "createdAt": "2026-08-21T13:48:37.488Z" } ],
  "hasMore": true }
```

`before` is inclusive, so page 2 repeats the last message of page 1. I merge pages into a Map
keyed on `_id`.

`404 NOT_FOUND`, `403 FORBIDDEN`, `500` on a malformed `before`

## Groups

3+ members, a name, 1+ admins. Creator is the first admin. Admins add, remove, promote and
rename. Anyone can leave.

### `POST /conversations/group`

```jsonc
// request
{ "name": "Project Team", "participantIds": ["<id>", "<id>"] }

// 201 response  (the only endpoint that doesn't return 200 on success)
{ "_id": "6a885761...", "type": "group", "name": "Project Team",
  "createdBy": "6a88575c...", "admins": ["6a88575c..."],
  "participants": [ { "_id": "...", "name": "...", "phone": "..." } ],
  "createdAt": "2026-08-21T13:49:21.908Z", "updatedAt": "2026-08-21T13:49:21.908Z" }
```

You're added automatically, so leave yourself out of `participantIds`. Including yourself is
harmless, it dedupes. Final count has to be 3+.

That rule is checked twice and reported differently each time: too few ids gives
`VALIDATION_ERROR` with `details[]`, enough ids that dedupe down to too few gives
`TOO_FEW_MEMBERS` with no `details`. Reading `details[0].message` renders blank for the second.

### `POST /conversations/:id/participants`

Admins only. Send `{ "userIds": ["<id>"] }`, get back `200` and the updated group.

New members get joined to the socket room immediately, no reconnect needed.

`403`, `400 NOT_A_GROUP`, `400 UNKNOWN_USER`, `404 NOT_FOUND`

### `DELETE /conversations/:id/participants/:userId`

Admins only, except your own id, which is how you leave. `200` with the updated group.

Removed members stop getting messages straight away. If the last admin leaves the next member is
promoted automatically, so a group can't end up unmanageable.

`403`, `400 NOT_A_GROUP`, `404 NOT_FOUND`

### `POST /conversations/:id/admins`

Admins only. Send `{ "userId": "<id>" }`. Target must already be a member.

No demote endpoint.

`403`, `400 NOT_A_MEMBER`, `400 NOT_A_GROUP`

### `PATCH /conversations/:id`

Admins only. Send `{ "name": "Renamed Team" }`.

`403`, `400 VALIDATION_ERROR` on an empty name, `400 NOT_A_GROUP` on a direct conversation

## Messages

### `POST /messages`

Same endpoint for direct and group.

```jsonc
// request
{ "conversationId": "<id>", "text": "Hello!" }

// 200 response
{ "_id": "6a885732...", "conversation": "6a885727...", "sender": "6a885724...",
  "text": "Hello!", "createdAt": "2026-08-21T13:48:34.626Z" }
```

`sender` is an id, never populated. In a group, look it up in `participants`.

`""` and `"   "` both return 200 and get broadcast, so blocking empty messages is the client's
job. No length cap either (6000 chars went through), and no sanitization. React escapes on
render, just don't use `dangerouslySetInnerHTML`.

`403` not a participant, `400 VALIDATION_ERROR` if `text` is missing, null or not a string

## Socket

```ts
io('https://frontend-task-chatapp.onrender.com', { auth: { token } })
```

Root origin, not `/api`. A bad or missing token is rejected at the handshake with
`connect_error`, so that's a session failure, not something to retry.

**Send:** `message:send` with `{ conversationId, text }`. Ack is `{ ok: true }` or
`{ ok: false, error }`. I use it to confirm the optimistic bubble.

**Receive:**

```jsonc
// message:new   note `id` not `_id`, and createdAt is epoch ms not ISO
{ "id": "6a885822...", "conversation": "6a88581d...", "sender": "6a88581b...",
  "text": "socket hello", "createdAt": 1787320354937 }

// conversation:updated   full group object, on create / rename / member / admin change
```

Three delivery rules that shaped the implementation:

1. **You don't get `message:new` for your own message.** Only other people do, over REST or
   socket. So optimistic append is required, not an optimization. A second tab as the same user
   stays stale.
2. **`conversation:updated` is groups only.** Open a new 1-to-1 and the other person gets
   nothing. Their first signal is a `message:new` for a conversation id they've never seen. Drop
   unknown ids and the thread never appears. I refetch the list instead.
3. `conversation:updated` reaches every current member including whoever triggered it, and the
   member who was just removed. That last one is how you know to close a group you're out of.

Non-participants are refused both ways: `403` over REST, failed ack over the socket.

## What I'd change

- One envelope everywhere, `{ data, meta? }`, instead of six
- One `POST /conversations` taking `type: 'direct' | 'group'`, not two creation routes
- Create should return the same shape as the list, so you don't have to refetch to render
- `admins: ID[]` + `participants: PublicUser[]` should be one `members: { user, role }[]`. Also kills the
  `participant` / `participants` split between direct and group
- `PUT`/`DELETE /conversations/:id/members/:userId/admin` instead of `POST .../admins`, so demote
  comes for free. Right now there's no way to demote
- `before` should be an opaque cursor from `meta.nextCursor`, and exclusive
- `q` required on search, minimum length, paginated. Dumping the whole user table is the worst
  thing here
- `NO_TOKEN` should be 401, same as `INVALID_TOKEN`
- Socket should send `_id` and ISO, matching REST, so there's one `Message` type
- Echo `message:new` to the sender's other sockets so multi-tab works
- Add read receipts and a `typing` event
