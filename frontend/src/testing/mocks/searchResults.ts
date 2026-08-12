import mockPosts from "./posts";
import mockShows from "./shows";
import { mockUsers } from "./users";

const mockSearchResult = {
  users: mockUsers.slice(0, 2),
  shows: mockShows.slice(0, 2),
  posts: mockPosts.slice(0, 4),
};

export { mockSearchResult };
