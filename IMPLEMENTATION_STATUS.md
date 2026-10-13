Part 5: Utilities + economy core batch implemented

Added modules and commands:
- utility: calculator, weather, define, urban, remind, reminders, delreminder, time, qr, shorten, color
- economy core: balance, daily, weekly, monthly, work, beg, pay, rob, inventory, shop, buy, sell
- validators and economy repository for persistent balances/cooldowns/reminders
- tests/economy.test.js

Database additions:
- economy_accounts
- economy_transactions
- command_cooldowns
- reminders

Notes:
- Public-time/provider commands fall back gracefully and are honest about service availability.
- No secrets are used in code; all settings remain in env variables.
