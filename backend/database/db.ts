import * as dbSearch from "./search.js";
import * as dbGet from "./shows.js";
import * as dbComments from "./comments.js";
import * as dbPosts from "./posts.js";
import * as dbUsers from "./users.js";
import * as dbLikes from "./likes.js";
import * as dbFollows from "./follows.js"

export default {
  ...dbGet,
  ...dbSearch,
  ...dbComments,
  ...dbPosts,
  ...dbUsers,
  ...dbLikes,
  ...dbFollows,
};
