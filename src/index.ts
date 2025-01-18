import express from "npm:express";
import routeGuest from "./routes/guest.routes.ts";
import routeEvent from "./routes/event.routes.ts";
import routeUser from "./routes/user.routes.ts";

import "./db.ts";

const app = express();

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use(routeGuest);
app.use(routeEvent);
app.use(routeUser);

app.listen(4000, () => {
  console.log("Server listen on port", 4000);
});

/*

deno run -A --watch src/index.ts


Dropdown:

- Be normal state
- Open and then fetch data
- Show load icon 
- Receive data and display + remove icon
- Do animations


# # # TODO + PROGRESS ➰✅❓❌
# 
# CREATE EVERY TABLE ➰
# # CRUD FOR EVENTS ➰
# # CRUD FOR CATEGORIES ➰
# # CRUD FOR WODS
# # CRUD FOR RESULTS
# # CRUD FOR USERS
# 
#
#
#
#
#
#
#
#
#
#






*/