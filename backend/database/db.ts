import * as dbSearch from "./search.js";
import * as dbGet from "./shows";
import * as dbComments from "./comments";
import * as dbPosts from "./posts";
import * as dbUsers from "./users";
import * as dbLikes from "./likes";
import * as dbFollows from "./follows"

export default {
  ...dbGet,
  ...dbSearch,
  ...dbComments,
  ...dbPosts,
  ...dbUsers,
  ...dbLikes,
  ...dbFollows,
};
