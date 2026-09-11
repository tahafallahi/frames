/**
 * Prisma seed script
 *
 * Populates the database with realistic users, shows/movies, posts,
 * threaded comments, follows, tags, likes and a couple of trending entries.
 *
 * Setup:
 *   npm i -D @faker-js/faker bcryptjs tsx
 *   npm i -D @types/bcryptjs   (if you're on plain TS)
 *
 * Add to package.json:
 *   "prisma": { "seed": "tsx prisma/seed.ts" }
 *
 * Run:
 *   npx prisma db seed
 *
 * Note: your generator outputs the client to "../generated/prisma",
 * so we import from there instead of "@prisma/client".
 */

import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { MediaType } from "generated/prisma/enums";
import db from "database/db";

// Deterministic-ish output so re-running gives similar "flavor" of data
faker.seed(20260911);

const DEMO_PASSWORD_HASH = bcrypt.hashSync("Passw0rd!", 10);

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

type ShowSeed = {
  tmdbId: number;
  title: string;
  overview: string;
  releaseYear: number;
  mediaType: MediaType;
  genres: string[];
};

// tmdbId values correspond to the real TMDB ids for these titles — double
// check against the TMDB API before relying on them for poster fetching.
const SHOWS: ShowSeed[] = [
  {
    tmdbId: 1396,
    title: "Breaking Bad",
    overview:
      "A high school chemistry teacher turned methamphetamine manufacturer teams up with a former student as he tries to secure his family's future before a terminal diagnosis catches up with him.",
    releaseYear: 2008,
    mediaType: MediaType.TV_SHOW,
    genres: ["Drama", "Crime", "Thriller"],
  },
  {
    tmdbId: 1399,
    title: "Game of Thrones",
    overview:
      "Noble families vie for control of the Iron Throne while an ancient threat stirs beyond a massive wall of ice in the far north.",
    releaseYear: 2011,
    mediaType: MediaType.TV_SHOW,
    genres: ["Fantasy", "Drama", "Action"],
  },
  {
    tmdbId: 66732,
    title: "Stranger Things",
    overview:
      "A group of kids in a small 1980s town uncover a secret government lab, a monstrous parallel dimension, and a girl with terrifying abilities.",
    releaseYear: 2016,
    mediaType: MediaType.TV_SHOW,
    genres: ["Sci-Fi", "Horror", "Drama"],
  },
  {
    tmdbId: 82856,
    title: "The Mandalorian",
    overview:
      "A lone bounty hunter roams the outer reaches of the galaxy, far from the authority of the New Republic, while protecting a mysterious young charge.",
    releaseYear: 2019,
    mediaType: MediaType.TV_SHOW,
    genres: ["Sci-Fi", "Action", "Adventure"],
  },
  {
    tmdbId: 100088,
    title: "The Last of Us",
    overview:
      "Twenty years after modern civilization has been destroyed, a hardened survivor is hired to smuggle a teenage girl out of an oppressive quarantine zone.",
    releaseYear: 2023,
    mediaType: MediaType.TV_SHOW,
    genres: ["Drama", "Horror", "Sci-Fi"],
  },
  {
    tmdbId: 2316,
    title: "The Office",
    overview:
      "A mockumentary crew follows the daily lives of the employees at a mid-sized paper company in Scranton, Pennsylvania.",
    releaseYear: 2005,
    mediaType: MediaType.TV_SHOW,
    genres: ["Comedy"],
  },
  {
    tmdbId: 278,
    title: "The Shawshank Redemption",
    overview:
      "A banker wrongly convicted of murder forms an unlikely friendship with a fellow inmate over the course of a two-decade prison sentence.",
    releaseYear: 1994,
    mediaType: MediaType.MOVIE,
    genres: ["Drama"],
  },
  {
    tmdbId: 155,
    title: "The Dark Knight",
    overview:
      "Batman raises the stakes in his war on crime as Gotham's new district attorney and a chaotic new criminal mastermind push the city to the brink.",
    releaseYear: 2008,
    mediaType: MediaType.MOVIE,
    genres: ["Action", "Crime", "Drama"],
  },
  {
    tmdbId: 27205,
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology is offered a chance to have his criminal history erased in exchange for planting an idea instead of stealing one.",
    releaseYear: 2010,
    mediaType: MediaType.MOVIE,
    genres: ["Sci-Fi", "Action", "Thriller"],
  },
  {
    tmdbId: 157336,
    title: "Interstellar",
    overview:
      "A team of explorers travel through a wormhole in search of a new home for humanity as Earth becomes increasingly uninhabitable.",
    releaseYear: 2014,
    mediaType: MediaType.MOVIE,
    genres: ["Sci-Fi", "Drama", "Adventure"],
  },
  {
    tmdbId: 496243,
    title: "Parasite",
    overview:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between a wealthy family and a destitute clan living in the same house.",
    releaseYear: 2019,
    mediaType: MediaType.MOVIE,
    genres: ["Drama", "Thriller", "Comedy"],
  },
  {
    tmdbId: 438631,
    title: "Dune",
    overview:
      "A young heir to a noble family is thrust into a battle for control of a desert planet that holds the most valuable resource in the universe.",
    releaseYear: 2021,
    mediaType: MediaType.MOVIE,
    genres: ["Sci-Fi", "Adventure"],
  },
  {
    tmdbId: 872585,
    title: "Oppenheimer",
    overview:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb and the moral reckoning that followed.",
    releaseYear: 2023,
    mediaType: MediaType.MOVIE,
    genres: ["Drama", "History"],
  },
  {
    tmdbId: 545611,
    title: "Everything Everywhere All at Once",
    overview:
      "An exhausted laundromat owner is swept into an adventure where she must connect with parallel versions of herself to save existence.",
    releaseYear: 2022,
    mediaType: MediaType.MOVIE,
    genres: ["Sci-Fi", "Comedy", "Action"],
  },
];

const TAG_NAMES = [
  "spoilers",
  "review",
  "fan-theory",
  "discussion",
  "recommendation",
  "rewatch",
  "season-finale",
  "cinematography",
  "soundtrack",
  "hot-take",
  "casting",
  "easter-eggs",
  "behind-the-scenes",
  "prediction",
  "comparison",
];

const USER_SEEDS = [
  {
    username: "maren_watches",
    bioTopic: "prestige dramas and slow-burn thrillers",
  },
  {
    username: "kjeldberg",
    bioTopic: "practical effects and old-school sci-fi",
  },
  { username: "screentime_sam", bioTopic: "anything A24 puts out" },
  { username: "noor.reviews", bioTopic: "character-driven writing" },
  { username: "popcorn_theory", bioTopic: "fan theories nobody asked for" },
  { username: "dvillanueva", bioTopic: "cinematography and long takes" },
  { username: "lateshowlena", bioTopic: "finales that stick the landing" },
  { username: "reel_rachel", bioTopic: "underrated 2010s films" },
  { username: "binged_it_all", bioTopic: "whatever's trending this week" },
  { username: "tommo_critiques", bioTopic: "score and soundtrack breakdowns" },
  { username: "quietcinema", bioTopic: "slow cinema and mood pieces" },
  { username: "hana_streams", bioTopic: "K-dramas and international film" },
  { username: "cast_and_crew", bioTopic: "who's working with who these days" },
  {
    username: "midnight_marathon",
    bioTopic: "horror and psychological thrillers",
  },
  { username: "arjun.on.film", bioTopic: "worldbuilding and franchise lore" },
  { username: "second_screen_sadie", bioTopic: "live-tweeting finales" },
  { username: "callum_reviews", bioTopic: "comedy pacing and ensemble casts" },
  {
    username: "the_last_watchlist",
    bioTopic: "clearing out a backlog no one else finished",
  },
  { username: "priya_plots", bioTopic: "plot structure and pacing" },
  { username: "gritty_reboots", bioTopic: "adaptations done right (or wrong)" },
  {
    username: "off_the_shelf_omar",
    bioTopic: "deep cuts nobody else has seen",
  },
  {
    username: "finalact_fiona",
    bioTopic: "endings that ruin or redeem a show",
  },
  {
    username: "backlot_ben",
    bioTopic: "production trivia and behind-the-scenes stories",
  },
  {
    username: "wren_watches_everything",
    bioTopic: "genre-hopping between horror and rom-coms",
  },
];

const POST_TITLE_TEMPLATES: Array<(title: string, genre: string) => string> = [
  (t) => `Just finished ${t} and I need to talk about it`,
  (t, g) => `Why ${t} might be the best ${g.toLowerCase()} in years`,
  (t) => `Unpopular opinion: ${t} is a little overrated`,
  (t) =>
    `Rewatched ${t} this weekend and caught things I missed the first time`,
  (t) => `${t} spoiler thread — come yell with me`,
  (t) => `The ending of ${t} has been living in my head rent free`,
  (t) => `Where does ${t} rank for you all-time?`,
  (t) => `Can we talk about the pacing in ${t}?`,
  (t) => `${t} soundtrack has been on repeat all week`,
  (t) => `Finally got around to ${t} — was it worth the hype?`,
];

const POST_BODY_OPENERS = [
  "Okay so I know I'm late to this, but I finally sat down and watched it start to finish.",
  "Went in with pretty low expectations and came out fully converted.",
  "This has been sitting in my watchlist for way too long and I regret waiting.",
  "Rewatched this with a friend who'd never seen it, and their reactions made me appreciate it even more.",
  "I've seen this recommended everywhere for months, so I finally gave it a shot.",
  "Not sure why nobody warned me how much this would wreck me emotionally.",
];

const POST_BODY_MIDDLES = [
  "The pacing dragged a little in the middle stretch, but everything paid off by the end.",
  "The performances carried scenes that would've fallen flat with a weaker cast.",
  "I wasn't expecting the tone shift halfway through, but it worked better than I thought it would.",
  "Some of the side characters felt underused, which is a shame given how strong the setup was.",
  "The score does a lot of heavy lifting in the quieter scenes.",
  "A few plot threads got wrapped up a little too neatly for my taste.",
];

const POST_BODY_CLOSERS = [
  "Would genuinely recommend it to anyone who's on the fence.",
  "Curious what everyone else thought about the third act.",
  "Already planning a rewatch, which almost never happens for me.",
  "Not perfect, but easily one of the more memorable things I've watched this year.",
  "Would love to hear if anyone felt differently about the ending.",
  "Adding this to my list of comfort rewatches going forward.",
];

const COMMENT_TEMPLATES = [
  "Completely agree, especially about the pacing in the back half.",
  "I actually had the opposite reaction — the slow build was my favorite part.",
  "The ending hit way harder than I expected, glad someone else is talking about this.",
  "Been saying this for weeks, glad it's finally getting recognition.",
  "Respectfully disagree, I think the middle stretch dragged a bit too much.",
  "This is exactly why I keep recommending it to everyone I know.",
  "Wait until you see how it all ties together in the finale.",
  "The soundtrack alone makes it worth a rewatch honestly.",
  "I went in skeptical and left with a completely different opinion.",
  "Solid take, though I'd still put the earlier seasons above this one.",
  "The character work here is criminally underrated.",
  "Same reaction here, did not expect to feel this much about a side character.",
];

const REPLY_TEMPLATES = [
  "Fair point, I hadn't thought about it that way.",
  "Ha, yeah I felt that too on my second watch.",
  "Still not fully convinced, but I get where you're coming from.",
  "Exactly — that's what pushed it from good to great for me.",
  "Honestly might have to rewatch it now just to check.",
  "That scene lives in my head rent free too.",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pick<T>(arr: T[]): T {
  return faker.helpers.arrayElement(arr);
}

function pickSome<T>(arr: T[], min: number, max: number): T[] {
  return faker.helpers.arrayElements(arr, { min, max });
}

function buildPostContent(showTitle: string): string {
  return [
    pick(POST_BODY_OPENERS),
    pick(POST_BODY_MIDDLES),
    pick(POST_BODY_CLOSERS),
  ].join(" ");
}

// ---------------------------------------------------------------------------
// Seed steps
// ---------------------------------------------------------------------------

async function resetDatabase() {
  // Order matters because of foreign key constraints.
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.trending.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.federatedUser.deleteMany();
  await prisma.show.deleteMany();
  await prisma.user.deleteMany();
  await prisma.session.deleteMany();
}

async function seedUsers() {
  const users = [];
  for (const seed of USER_SEEDS) {
    const user = await prisma.user.create({
      data: {
        username: seed.username,
        email: faker.internet.email({ firstName: seed.username }).toLowerCase(),
        hashedPassword: DEMO_PASSWORD_HASH,
        bio: `Here for ${seed.bioTopic}. ${faker.person.bio()}`,
        profilePath: faker.image.avatarGitHub(),
      },
    });
    users.push(user);
  }

  // A handful of users sign in via a federated provider instead of a password.
  const federatedCandidates = faker.helpers.arrayElements(users, 4);
  for (const [i, user] of federatedCandidates.entries()) {
    await prisma.federatedUser.create({
      data: {
        subject: faker.string.uuid(),
        user_id: user.id,
        provider: i % 2 === 0 ? "google" : "github",
      },
    });
  }

  return users;
}

async function seedShows() {
  const shows = [];
  for (const s of SHOWS) {
    const show = await prisma.show.create({
      data: {
        tmdbId: s.tmdbId,
        title: s.title,
        posterPath: (await db.getShow(s.tmdbId, s.mediaType)).posterPath,
        overview: s.overview,
        releaseYear: s.releaseYear,
        mediaType: s.mediaType,
        genres: s.genres,
      },
    });
    shows.push(show);
  }
  return shows;
}

async function seedTrending(shows: Awaited<ReturnType<typeof seedShows>>) {
  const trendingShows = faker.helpers.arrayElements(shows, 10);
  for (const show of trendingShows) {
    await prisma.trending.create({
      data: {
        showId: show.id,
        popularity: faker.number.int({ min: 50, max: 9999 }),
      },
    });
  }
}

async function seedTags() {
  const tags = [];
  for (const name of TAG_NAMES) {
    const tag = await prisma.tag.create({ data: { name } });
    tags.push(tag);
  }
  return tags;
}

async function seedFollows(users: Awaited<ReturnType<typeof seedUsers>>) {
  const seen = new Set<string>();
  for (const follower of users) {
    const followeeCount = faker.number.int({ min: 2, max: 8 });
    const followees = faker.helpers.arrayElements(
      users.filter((u) => u.id !== follower.id),
      followeeCount,
    );
    for (const followee of followees) {
      const key = `${follower.id}:${followee.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      await prisma.follows.create({
        data: { followerId: follower.id, followeeId: followee.id },
      });
    }
  }
}

async function seedFavorites(
  users: Awaited<ReturnType<typeof seedUsers>>,
  shows: Awaited<ReturnType<typeof seedShows>>,
) {
  for (const user of users) {
    const favoriteShows = pickSome(shows, 1, 5);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        favorites: { connect: favoriteShows.map((s) => ({ id: s.id })) },
      },
    });
  }
}

async function seedPosts(
  users: Awaited<ReturnType<typeof seedUsers>>,
  shows: Awaited<ReturnType<typeof seedShows>>,
  tags: Awaited<ReturnType<typeof seedTags>>,
) {
  const posts = [];

  for (const show of shows) {
    const postCount = faker.number.int({ min: 1, max: 4 });
    for (let i = 0; i < postCount; i++) {
      const author = pick(users);
      const genre = pick(show.genres.length ? show.genres : ["story"]);
      const titleTemplate = pick(POST_TITLE_TEMPLATES);

      const post = await prisma.post.create({
        data: {
          title: titleTemplate(show.title, genre),
          content: buildPostContent(show.title),
          authorId: author.id,
          showId: show.id,
          tags: { connect: pickSome(tags, 1, 3).map((t) => ({ id: t.id })) },
        },
      });
      posts.push(post);
    }
  }

  return posts;
}

async function seedComments(
  users: Awaited<ReturnType<typeof seedUsers>>,
  posts: Awaited<ReturnType<typeof seedPosts>>,
) {
  const comments = [];

  for (const post of posts) {
    const topLevelCount = faker.number.int({ min: 0, max: 6 });
    for (let i = 0; i < topLevelCount; i++) {
      const author = pick(users);
      const comment = await prisma.comment.create({
        data: {
          content: pick(COMMENT_TEMPLATES),
          postId: post.id,
          authorId: author.id,
        },
      });
      comments.push(comment);

      // Occasionally add one or two replies to this comment.
      if (faker.datatype.boolean({ probability: 0.4 })) {
        const replyCount = faker.number.int({ min: 1, max: 2 });
        for (let j = 0; j < replyCount; j++) {
          const replyAuthor = pick(users);
          const reply = await prisma.comment.create({
            data: {
              content: pick(REPLY_TEMPLATES),
              postId: post.id,
              authorId: replyAuthor.id,
              parentId: comment.id,
            },
          });
          comments.push(reply);
        }
      }
    }
  }

  return comments;
}

async function seedLikes(
  users: Awaited<ReturnType<typeof seedUsers>>,
  posts: Awaited<ReturnType<typeof seedPosts>>,
  comments: Awaited<ReturnType<typeof seedComments>>,
) {
  const seenPostLikes = new Set<string>();
  const seenCommentLikes = new Set<string>();

  for (const post of posts) {
    const likers = pickSome(users, 0, 12);
    for (const liker of likers) {
      const key = `${liker.id}:${post.id}`;
      if (seenPostLikes.has(key)) continue;
      seenPostLikes.add(key);
      await prisma.like.create({
        data: { userId: liker.id, postId: post.id },
      });
    }
  }

  for (const comment of comments) {
    const likers = pickSome(users, 0, 6);
    for (const liker of likers) {
      const key = `${liker.id}:${comment.id}`;
      if (seenCommentLikes.has(key)) continue;
      seenCommentLikes.add(key);
      await prisma.like.create({
        data: { userId: liker.id, commentId: comment.id },
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Resetting database...");
  await resetDatabase();

  console.log("Seeding users...");
  const users = await seedUsers();

  console.log("Seeding shows...");
  const shows = await seedShows();

  console.log("Seeding trending shows...");
  await seedTrending(shows);

  console.log("Seeding tags...");
  const tags = await seedTags();

  console.log("Seeding follows...");
  await seedFollows(users);

  console.log("Seeding favorites...");
  await seedFavorites(users, shows);

  console.log("Seeding posts...");
  const posts = await seedPosts(users, shows, tags);

  console.log("Seeding comments...");
  const comments = await seedComments(users, posts);

  console.log("Seeding likes...");
  await seedLikes(users, posts, comments);

  console.log(
    `Done. Created ${users.length} users, ${shows.length} shows, ${posts.length} posts, ${comments.length} comments.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
