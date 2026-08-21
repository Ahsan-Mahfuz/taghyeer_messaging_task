# API Issues

Swagger doesn't document responses, so I went through the API before building. What I found:

## Had to work around

**Search matches far less than it claims, and some users cannot be found at all.** Measured
against a user stored as `{ name: "Kamrul Hasan", phone: "01980451633" }`:

| query | result |
|---|---|
| `Kamrul` | match |
| `kamrul` | no match, case sensitive |
| `Hasan` | no match, only the start of the name counts |
| `01980451633` | match |
| `01980451` | no match, phone is exact equality |
| `+8801980451633` | 500 |

Name is a case-sensitive prefix, phone is exact equality. That fits
`{ $or: [{ name: /^<q>/ }, { phone: <q> }] }`, which also explains the 500, since `^+880...` is an
invalid regex and the error text says exactly that.

The two rules combine badly: **a user stored with a leading `+` can never be found by phone.**
Their exact number 500s on the name regex, and escaping it to `\+880...` stops the crash but then no
longer equals the stored string. No query reaches them, so "search by a number" fails outright
rather than degrading.

Fixed on my side in two places. Registration rewrites `+8801...` to `01...` before sending, so anyone
signing up here stays reachable, and the login hint says so rather than doing it quietly. Search
then sends several spellings at once and merges by `_id`, so either phone format and any
capitalization resolves. Checked against the live API: `+8801998320044`, `01998320044`, `Rafiq`,
`rafiq` and `RAFIQ` all reach the same person.

**Empty messages are accepted.** `""` and `"   "` both return 200, over REST and socket. Blocking
them is all client-side: trim before send, disable the button when empty. The shared database
already has empty messages in it, so don't render those either.

**`before` pagination overlaps.**

```
?limit=5                 ->  m12 m11 m10 m9 m8
?limit=5&before=<m8 id>  ->  m8  m7  m6  m5  m4    <- m8 twice
```

`$lte` where it should be `$lt`. I merge pages into a Map keyed on `_id`.

**No `message:new` for your own messages.** Only other people get it, over REST or socket. So
optimistic append is required, not optional.

**No event when a direct conversation is created.** `conversation:updated` is groups only. The
other person's first signal is a `message:new` for an id they've never seen. Ignore it and the
thread never appears. I refetch the list.

## Everything else

| Issue | Fix |
|---|---|
| Six response envelopes | normalize in the API client |
| Create returns a different shape than the list (no `type`, bare id participants) | use the `_id`, read the object from the list |
| Socket sends `id` + epoch ms, REST sends `_id` + ISO | one `toMessage()` adapter |
| Conversation with your own id returns an unrelated one | filter yourself out of search |
| Malformed ObjectId 500s with the raw Mongoose error | validate 24-hex first |
| Missing token is 400, bad token is 401 | check for either |
| Login with an existing phone and a new name renames the account | can't fix client-side |
| Blank `q` returns every user in the database | no search under 2 characters |
| The 3-member rule returns two different error shapes | fall back `details[0].message` -> `message` |
| `GET /api/health` 404s, it lives on the root origin | don't use it |
| `limit=0` and `limit=abc` are ignored, you get everything | always send a valid limit |
| Messages come back newest first | reversed in the adapter |
| `lastMessage` is `{}` not `null` | check `lastMessage?.text` |
| Group create returns 201, everything else 200 | don't branch on status |
| `admins` are ids, `participants` are objects | adapter resolves them |
| No length cap, 6000 chars accepted | cap the input |
| HTML stored raw, no sanitization | React escaping only |
| JWT lasts 7 days, no refresh | 401 clears the session |

## Also checked

Admin gates are enforced server-side, not just hidden in the UI. Removed members stop receiving
messages immediately, and if the last admin leaves the next one is promoted, so a group can't get
stuck. Adding someone updates their socket room without a reconnect.
