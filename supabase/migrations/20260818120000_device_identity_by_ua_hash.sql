/*
# Góc Đồ Lướt — Device identity by User-Agent hash

1. Overview
Device identity now derives from SHA-256(User-Agent) on the server (like the
Automation_Ecosystem admin), instead of a client-generated UUID stored in
localStorage. The same browser is always ONE device row, regardless of how
many logins happen or whether localStorage was cleared / incognito used.

2. Migration
Legacy rows carry a UUID in `device_id` (36 chars, not 64 hex) — revoke them
so the next login creates a fresh row keyed by the UA hash. Revoked rows stay
visible in the device list for audit.
*/

UPDATE public.user_sessions
SET status = 'revoked'
WHERE device_id !~ '^[0-9a-f]{64}$';