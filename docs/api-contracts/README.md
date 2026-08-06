# API Contracts

This directory is reserved for OpenAPI specs and tRPC router contracts that will be defined when backend development begins (Phase 8).

## Planned Modules

| Module | Endpoints | Priority |
|--------|-----------|----------|
| Auth | POST /auth/login, POST /auth/register, POST /auth/refresh | Critical |
| Vehicles | GET /vehicles, GET /vehicles/:id, POST /vehicles | Critical |
| Auctions | GET /auctions, GET /auctions/:id, POST /auctions/:id/bids | Critical |
| WebSocket | ws://auctions/[id]/room | Critical |
| Users | GET /users/:username, PUT /users/me | High |
| Posts | GET /posts, POST /posts, DELETE /posts/:id | Medium |
| Messages | GET /conversations, GET /messages/:convId, POST /messages | High |
| Notifications | GET /notifications, PATCH /notifications/:id/read | Medium |
| Merch | GET /products, POST /cart, POST /orders | Low |
| Uploads | POST /uploads/signed-url | High |

## Integration Order (Phase 8)

1. Auth (NextAuth or Clerk)
2. Vehicles & Auctions (read-only first)
3. Bids + WebSocket real-time
4. Messages & Notifications
5. Community (Posts, Clubs)
6. Sell / Listing creation + S3 uploads
7. Merch + Stripe payments
8. Admin APIs

Each mock service in `packages/mock-data/src/services/` is designed to match this contract interface so swap-in requires only changing the implementation behind the same function signatures.
