# Security Specification for Squad Sort Pro

## Data Invariants
1. A player must belong to an authenticated user (`ownerId`).
2. A player's `type` must be either "player" or "goalkeeper".
3. A player's `rating` must be between 1 and 5.
4. Users can only read and write their own players.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Unauthenticated Write**: Creating a player without being logged in.
2. **Identity Spoofing**: Creating a player with another user's `ownerId`.
3. **Ghost Field Update**: Adding an `isAdmin` field to a player document.
4. **Invalid Type**: Setting `type` to "striker".
5. **Rating Overflow**: Setting `rating` to 10.
6. **Rating Underflow**: Setting `rating` to 0.
7. **Negative Create Time**: Setting `createdAt` to -1.
8. **Malicious ID Poisoning**: Creating a player with a 2KB string as ID.
9. **PII Leak**: Attempting to read all players in the collection without being the owner.
10. **Cross-User Update**: User A attempting to change User B's player name.
11. **Cross-User Delete**: User A attempting to delete User B's player.
12. **Mass Scrape**: Attempting a list query without a proper `where` clause filter (if rules enforce it).

## Red Team Pass Selection
- All `allow list` rules must enforce `resource.data.ownerId == request.auth.uid`.
- All `allow write` rules must enforce `isValidPlayer()`.
- Immutable fields: `id`, `ownerId`, `createdAt` must stay same on update.
