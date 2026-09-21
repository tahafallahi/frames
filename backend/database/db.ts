import * as dbSearch from "./search";
import * as dbGet from "./shows";
import * as dbComments from "./comments";
import * as dbPosts from "./posts";
import * as dbUsers from "./users";
import * as dbLikes from "./likes";

export default {
  ...dbGet,
  ...dbSearch,
  ...dbComments,
  ...dbPosts,
  ...dbUsers,
  ...dbLikes,
};
