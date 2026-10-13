Part 4 — Security & Antiraid implemented (commands 101-120 subset)

Commands added:
- antiraid
- antispam
- antilink
- antiinvite
- antibot
- antiflood
- altcheck
- blacklistuser
- unblacklistuser
- wordfilter

Database additions:
- temp_channels, temp_roles
- antiraid_settings
- blacklist_users
- wordfilters

Tests:
- antiraid.test.js covers toggles, blacklist, and wordfilter DB helpers

Notes:
- Enforcement hooks (real-time message scanning) will be added in a later batch to avoid heavy event logic in this step.
