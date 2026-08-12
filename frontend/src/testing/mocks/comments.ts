import { mockUsers } from "@/testing/mocks/users";
import type { Comment } from "@/types/types";

export const mockComments: Comment[] = [
  {
    text: "This show completely fell off after season 2.",
    user: mockUsers[0],
    likes: 12,
    replies: [],
  },

  {
    text: "The finale actually made me cry, unpopular opinion I guess.",
    user: mockUsers[1],
    likes: 45,
    replies: [
      {
        text: "Same, I was not expecting that from myself.",
        user: mockUsers[2],
        likes: 8,
        replies: [],
      },
    ],
  },

  {
    text: "Was the ending rushed or was it just me?",
    user: mockUsers[2],
    likes: 30,
    replies: [
      {
        text: "Definitely rushed, felt like 2 episodes got cut.",
        user: mockUsers[0],
        likes: 15,
        replies: [],
      },
      {
        text: "I thought the pacing was fine honestly.",
        user: mockUsers[1],
        likes: 4,
        replies: [],
      },
    ],
  },

  {
    text: "The book handled this arc so much better.",
    user: mockUsers[0],
    likes: 60,
    replies: [
      {
        text: "Haven't read it, is it worth picking up?",
        user: mockUsers[1],
        likes: 5,
        replies: [
          {
            text: "Yeah, first 3 books are great, it dips after that.",
            user: mockUsers[0],
            likes: 9,
            replies: [
              {
                text: "Good to know, thanks!",
                user: mockUsers[1],
                likes: 1,
                replies: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    text: "Anyone else think the soundtrack was underrated?",
    user: mockUsers[1],
    likes: 22,
    replies: [],
  },

  {
    text: "Casting was perfect across the board imo.",
    user: mockUsers[2],
    likes: 88,
    replies: [
      {
        text: "Agreed, especially the lead.",
        user: mockUsers[0],
        likes: 10,
        replies: [],
      },
      {
        text: "The lead was fine, side characters stole the show though.",
        user: mockUsers[1],
        likes: 18,
        replies: [
          {
            text: "The best friend character was so underused sadly.",
            user: mockUsers[2],
            likes: 6,
            replies: [],
          },
        ],
      },
      {
        text: "Hard disagree but respect the take.",
        user: mockUsers[0],
        likes: 2,
        replies: [],
      },
    ],
  },

  {
    text: "This is easily top 3 shows of the year for me.",
    user: mockUsers[0],
    likes: 51,
    replies: [
      {
        text: "What are the other two?",
        user: mockUsers[2],
        likes: 3,
        replies: [
          {
            text: "The other two I mentioned in another thread lol",
            user: mockUsers[0],
            likes: 1,
            replies: [
              {
                text: "lol fair enough",
                user: mockUsers[2],
                likes: 0,
                replies: [
                  {
                    text: "This thread got derailed fast",
                    user: mockUsers[1],
                    likes: 7,
                    replies: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    text: "Rewatching this from the start, forgot how good the pilot was.",
    user: mockUsers[2],
    likes: 33,
    replies: [],
  },

  {
    text: "Controversial but I liked the villain more than the protagonist.",
    user: mockUsers[1],
    likes: 40,
    replies: [
      {
        text: "Not controversial at all, the villain had way better writing.",
        user: mockUsers[2],
        likes: 14,
        replies: [
          {
            text: "Facts, the motivations actually made sense.",
            user: mockUsers[1],
            likes: 5,
            replies: [],
          },
        ],
      },
      {
        text: "I'm on the fence, both were solid.",
        user: mockUsers[0],
        likes: 3,
        replies: [],
      },
    ],
  },

  {
    text: "Hoping season 3 doesn't take another 2 years.",
    user: mockUsers[0],
    likes: 27,
    replies: [
      {
        text: "Streaming platforms and their release schedules smh.",
        user: mockUsers[2],
        likes: 11,
        replies: [],
      },
    ],
  },
];