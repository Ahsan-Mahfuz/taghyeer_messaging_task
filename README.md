# Pulse

A chat client for the Taghyre chat API. Phone-number login, one-to-one and group
conversations, messages over Socket.IO.

Two pages:

- `/` landing page
- `/app` the chat itself

## Links

|              |                                                         |
| ------------ | ------------------------------------------------------- |
| Landing page | https://taghyeer-messaging-task.vercel.app              |
| Chat app     | https://taghyeer-messaging-task.vercel.app/app          |
| Source       | https://github.com/Ahsan-Mahfuz/taghyeer_messaging_task |

Both pages come out of this one project, so there is a single deploy behind them.

## Run it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

It talks to the hosted API by default. To point it elsewhere, make a `.env.local`:

```
NEXT_PUBLIC_CHAT_ORIGIN=https://frontend-task-chatapp.onrender.com
```

Also available: `pnpm build`, `pnpm start`, `pnpm lint`.

## Built with

Next.js 16 (App Router, Turbopack, React Compiler), React 19, TypeScript, Tailwind v4,
socket.io-client. Tailwind v4 has no config file, so the colours and shadows live as CSS
variables at the top of `src/app/globals.css`.

## Layout

| Folder                   | What is in it                                    |
| ------------------------ | ------------------------------------------------ |
| `src/app`                | the two routes, global CSS, favicon              |
| `src/components/landing` | hero, features, steps, footer                    |
| `src/components/chat`    | sidebar, thread, composer, group panels, dialogs |
| `src/components/auth`    | login card                                       |
| `src/components/ui`      | Button, Modal, Avatar, ConfirmDialog, icons      |
| `src/hooks`              | session, socket, messages, outbox, auto-scroll   |
| `src/lib`                | API client, socket wiring, types, formatting     |

## Decisions you may wonder about

**Sent messages appear before the server confirms.** The socket does not echo your own
message back to you, so without an optimistic append your own text would sit there missing
until a reload. Failed sends stay in place with a retry.

**Phone numbers are rewritten to `01XXXXXXXXX` at login.** Search compares phone numbers for
exact equality, so an account registered as `+8801...` can never be found by anyone. The app
normalises the number before it reaches the API.

**Messages are merged by id, not appended.** The `before` cursor is inclusive, so every page
of history repeats one message from the page before it.

**A 401 signs you out.** There is no refresh endpoint. The token and user sit in
`localStorage` under `pulse-session`.

## API docs

I wrote these first, by running the API, before any UI existed.

- [docs/API-REFERENCE.md](docs/API-REFERENCE.md) - every endpoint with a real request and
  response, error codes, the socket contract
- [docs/API-ISSUES.md](docs/API-ISSUES.md) - what is broken or missing, and what this app
  does about each one
