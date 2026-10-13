Part 2: Moderation commands added

Commands implemented in this batch:
- kick
- ban
- warn
- warnings
- purge
- lock

Added tests:
- permissionGuard unit tests
- moderation DB tests for warnings

Notes:
- Moderation commands use the permissionGuard to validate user and bot permissions and role hierarchy.
- Destructive batch operations will be confirmed in later steps (masskick/massban etc.).
