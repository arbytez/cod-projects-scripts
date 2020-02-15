# Cod Projects and Scripts

- **[GetssBot](/getssbot)**: simple telegram bot written in python that monitors a specific folder and send all news jpg file to specific telegram users/groups. So configuring to monitor the screenshot cod server folder it sends us all new players ss made. The bot accepts two arguments, the full path folder and how many seconds the folder is monitored.
- **[Cod4ManagerBot](/cod4-manager-bot)**: telegram bot written in C# that let you send rcon commands to a cod4 server and 'offban' (ban a player that is not playing) recent players. To authorize new users they must send a message to the bot with text 'sendid' and you will receive a pm from bot that ask if add them or not. Set your tg id in the config file. Example config file: _/cod4-manager-bot/Data/config/config.json.EXAMPLE_.
- **[Cod4Dashboard](/cod4dashboard)**:
  - _backend_: **apollo graphql express** server that exposes the cod4 players statistics from a sqlite db (db used from the GSManager system). The server can query the cod server status and send rcon commands. It's possible to set specific players to be shown as admin or vip. It uses also a **prisma backend** for user registration and authentication/authorization checks. ~~Set their player id on file _/cod4dashboard/backend/src/admins-vips.js_ (TODO: write this info in a config file instead a js file).~~
  - _frontend_: web app built with ~~sapper/svelte~~ **next.js** that displays players statistics, cod server status and the possibility to send rcon commands to the cod server (like a remote terminal for it). Note that all the backend api calls were generated automatically with the help of _graphql-codegen_, a very useful setup has been done because it generates all the api calls in automatic with type checking and declarations file, usable in vanilla js or typescript projects.
  - _sqlitedb_: folder that must contains the sqlite database with the players statistics (GSManager db).
- **[Cod4LogManager](/cod4-log-manager)**: log monitor for a cod4 server. The desired result for this project is to build a system like GSManager but written in nodejs and not php. Only a few commands have been implemented but the monitoring system is stable (without the bug that the system must force a fast map restart to handle the log correctly) and it is possible to expand the functionalities at will. Check the example config in the _/cod4-log-manager/src/config_ folder (you must remove the .EXAMPLE extension).
- **[Cod4RconTerminal](/cod4-rcon-terminal)**: install dependencies with _npm i_, write the env vars in the _.env.production_ file (_COD4_SERVER_IP_, _COD4_SERVER_PORT_, _COD4_RCON_ and _MAX_TIMEOUT_, see _.env.production.EXAMPLE_) and start it with _npm start_. You are ready to send rcon commands to your cod4 server. It is possible to send the commands _getstatus_ or _getinfo_ without setting the rcon password.

⚠️ 👉️ check also **[cod4-rcon-commands](https://github.com/arbytez/cod4-rcon-commands)**
