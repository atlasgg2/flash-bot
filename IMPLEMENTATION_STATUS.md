Part 3: Channel & Role management added (batch)

Commands implemented in this batch:
- createchannel, createvoice, createstage, createcat, deletechannel, renamechannel, channellimit, channelbitrate, tempchannel, channelinfo
- addrole, removerole, createrole, deleterole, renamerole, rolecolor, roleinfo

Notes:
- Temporary channels are persisted in `temp_channels` table.
- Confirmation flows use `src/middleware/confirm.js` for destructive actions where appropriate.
