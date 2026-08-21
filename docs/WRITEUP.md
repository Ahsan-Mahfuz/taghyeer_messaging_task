# Write-up

## Approach

Swagger lists the requests but not a single response body, so I could not start from it. First
thing I did was call every endpoint against the live API with a real account and write down what
actually came back. That became [API-REFERENCE.md](./API-REFERENCE.md). Everything the UI does is
built on what I measured there, not on what the spec implies.

That order paid off. Six different response envelopes turned up, timestamps come back in two
formats, and the socket names the message id `id` while REST calls it `_id`. If I had wired the UI
first I would have found all of that as runtime crashes instead.

Build order after that:

```
login -> conversation list -> thread -> sending -> socket -> groups -> landing page
```

Landing page at `/` and chat at `/app`, one Next.js project. Two demo links were required and this
way there is one repo and one deploy behind both.

## Design

**Square corners everywhere.** No rounding on cards, bubbles, buttons, avatars, badges. The API
has no avatar images, so every avatar is a coloured block with initials. Rounded, those blocks look
like a placeholder someone forgot to replace. Square, they look chosen. Once the avatars were
square the rest of the UI had to follow. The only exception is the two loading spinners, where a
square ring visibly jerks as it turns.

**One accent, everything else neutral.** A single violet carries the primary button, the active
conversation, the unread badge, and the wordmark. Nothing else competes, so the eye finds the
unread count immediately.

**Three typefaces, each with a job.** Bricolage Grotesque for headings, IBM Plex Sans for
everything you read, IBM Plex Mono for timestamps and counts. The mono is tabular, so a column of
timestamps does not shift width as the digits change.

**Loading is a skeleton, not a spinner.** Sidebar and thread both render grey rows at the exact
height of the real ones, so nothing on screen jumps when the data lands.

**Destructive actions ask first.** Log out, remove a member, leave a group, promote to admin. The
promote dialog says so explicitly, because the API has no demote endpoint and the app cannot undo
it afterwards.

**Mobile is one column.** Below `md` the sidebar fills the screen and opening a conversation
replaces it, with a back arrow to return. Squeezing both panes onto a phone would have left the
message text about twenty characters wide.

Colours and shadows are CSS variables at the top of `globals.css` and dark mode swaps the variable
block. A small inline script in `<head>` sets the theme class before the first paint, so there is
no white flash on load for dark-mode users.

## AI Tools

AI was part of how this got built. The direction, the constraints, the testing and the final
validation were mine.

Before any code existed I set the technical and design constraints: Next.js and Tailwind, no
comments explaining what a line does, no component over 170 lines, reusable structure, square
corners throughout, a single accent colour, a confirmation step on destructive actions, skeleton
loaders instead of spinners. The longest file in the repo is 146 lines.

I ran the API myself and worked from the responses it actually returned rather than from the
specification. I reviewed every screen against the design, adjusted spacing, layout, typography,
interactions and responsive behaviour, and sent it back until it matched what I wanted.

### How AI was used

| Tool          | How I used it                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude (chat) | Explored the visual direction for the chat screen and the landing page, and produced the first design draft I then worked from.                                           |
| Claude Code   | Wrote code against the spec and constraints above, which I read, corrected and iterated on. Also used to check behaviour, refine UI details and tighten responsive edges. |

I did not hand it the problem and take what came back. Each piece was reviewed against the design
and against the API, and a fair amount of it went back more than once.

### What I verified myself

Every finding in [API-ISSUES.md](./API-ISSUES.md) came from calling the live service and reading
the actual response, not from the specification and not from an assumption.

The reference first said search does a case-insensitive substring match on name and phone. When I
used the app, search found nobody. Calling the endpoint directly showed why: phone is exact
equality, name is a case-sensitive prefix, and an account stored as `+8801...` cannot be found at
all. The documentation was wrong and the code built on it was wrong. Both changed.

Other issues that came out of using the application rather than reading it:

- the conversation thread could scroll over the conversation name in the header
- the sidebar header broke at narrow widths
- destructive actions fired on the first click with no confirmation step
- the two sidebar actions read as plain text links instead of buttons

### End-to-end validation

Before deploying I ran the full flow against the live API, with no mocks:

login, search, start a direct chat, create a group, add and remove members, rename a group,
promote a member, leave a group, send and receive messages, drop the connection and reconnect.

Realtime was tested with two browsers side by side, a separate account in each. Loading, empty,
error and offline states were each triggered on purpose rather than assumed to work.

### Responsive and UI

Checked across phone, tablet and desktop widths. Below `md` the chat becomes one column: the
sidebar fills the screen, opening a conversation replaces it, and a back action returns to the
list.

The header, composer, message bubbles, modals, sidebar and landing sections each carry their own
breakpoints rather than leaving it to the base layout. I evaluated several visual directions,
decided the logo treatment, and used the generated design draft as a reference while settling the
final look.

### Where responsibility sits

Claude produced the first design draft and wrote code to my spec. Every decision about what to
build, how it should look, whether it was correct and whether it was finished was mine. I set the
constraints, ran the API, reviewed and corrected the implementation, found and fixed the issues
above, and did the end-to-end and responsive verification before deploying.

## Issues

Full list with reproductions in [API-ISSUES.md](./API-ISSUES.md). The five that changed how the app
is built:

**Search cannot find some users at all.** Phone matching is exact, so an account registered as
`+8801...` is unreachable by anyone searching `01...`. The app rewrites the number to local form
before it reaches the API, and tries a few capitalisations for names.

**The socket never echoes your own message.** Send a message and nothing comes back to you. Without
an optimistic append your own text would be missing until a reload.

**Starting a direct conversation fires no event.** The other person sees nothing until they
refresh. When a message arrives for a conversation the client does not know about, it refetches the
list.

**The `before` cursor is inclusive.** Every page of history repeats the last message of the page
before it. Pages are merged by id rather than concatenated.

**Socket and REST disagree on the same message.** REST returns `_id` with an ISO string, the socket
returns `id` with epoch milliseconds. One adapter normalises both before anything else sees them.
