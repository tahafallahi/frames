import "dotenv/config";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { PrismaClient, MediaType } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const NUM_USERS = 100;
const NUM_SHOWS = 100;
const NUM_POSTS = 100;
const MAX_COMMENTS_PER_POST = 8;
const MAX_REPLIES_PER_COMMENT = 3;
const MAX_LIKES_PER_TARGET = 15;
const MAX_FOLLOWS_PER_USER = 10;
const MAX_FAVORITES_PER_USER = 5;

const GENRE_NAMES = [
  "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Fantasy",
  "Romance", "Thriller", "Documentary", "Animation", "Crime",
  "Mystery", "Adventure", "Family", "Musical",
];

const titleTemplates = [
  () => `The ${faker.word.adjective()} ${faker.word.noun()}`,
  () => `${faker.person.lastName()}'s ${faker.word.noun()}`,
  () => `Return of the ${faker.word.adjective()} ${faker.word.noun()}`,
  () => `${faker.word.noun()}: ${faker.word.adjective()} ${faker.word.noun()}`,
];

function randomTitle() {
  return faker.helpers
    .arrayElement(titleTemplates)()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pickSome<T>(arr: T[], max: number): T[] {
  const count = faker.number.int({ min: 0, max: Math.min(max, arr.length) });
  return faker.helpers.arrayElements(arr, count);
}


async function seedGenres() {
  await prisma.genre.createMany({
    data: GENRE_NAMES.map((name, i) => ({ id: i + 1, name })),
  });
  return prisma.genre.findMany();
}

async function seedTags() {
  const names = faker.helpers.uniqueArray(() => faker.word.noun(), 40);
  await prisma.tag.createMany({ data: names.map((name) => ({ name })) });
  return prisma.tag.findMany();
}

async function seedShows(genres: { id: number }[]) {
  const shows = [];
  for (let i = 0; i < NUM_SHOWS; i++) {
    const show = await prisma.show.create({
      data: {
        id: i + 1,
        title: randomTitle(),
        overview: faker.lorem.paragraph(),
        releaseYear: faker.number.int({ min: 1970, max: 2026 }),
        mediaType: faker.helpers.arrayElement([MediaType.MOVIE, MediaType.TV_SHOW]),
        posterPath: faker.image.urlPicsumPhotos(),
        genres: { connect: pickSome(genres, 3).map((g) => ({ id: g.id })) },
      },
    });
    shows.push(show);
  }
  return shows;
}

async function seedTrending(shows: { id: number }[]) {
  const trendingShows = faker.helpers.arrayElements(shows, 20);
  await prisma.trending.createMany({
    data: trendingShows.map((show) => ({
      showId: show.id,
      popularity: faker.number.int({ min: 1, max: 1000 }),
    })),
  });
}

async function seedUsers(shows: { id: number }[]) {
  const hashedPassword = await bcrypt.hash("password123", 10);
  const usernames = faker.helpers.uniqueArray(
    () => faker.internet.username().toLowerCase(),
    NUM_USERS,
  );

  const users = [];
  for (const username of usernames) {
    const user = await prisma.user.create({
      data: {
        username,
        hashedPassword,
        profilePath: faker.datatype.boolean() ? faker.image.avatar() : null,
        bio: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        favorites: {
          connect: pickSome(shows, MAX_FAVORITES_PER_USER).map((s) => ({ id: s.id })),
        },
      },
    });
    users.push(user);
  }
  return users;
}

async function seedFollows(users: { id: string }[]) {
  const pairs = new Set<string>();
  const data: { followerId: string; followeeId: string }[] = [];

  for (const user of users) {
    const others = users.filter((u) => u.id !== user.id);
    const targets = pickSome(others, MAX_FOLLOWS_PER_USER);
    for (const target of targets) {
      const key = `${user.id}:${target.id}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      data.push({ followerId: user.id, followeeId: target.id });
    }
  }

  await prisma.follows.createMany({ data });
}

async function seedPosts(
  users: { id: string }[],
  shows: { id: number }[],
  tags: { id: number }[],
) {
  const posts = [];
  for (let i = 0; i < NUM_POSTS; i++) {
    const post = await prisma.post.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 8 }),
        content: faker.datatype.boolean() ? faker.lorem.paragraphs(2) : null,
        picturePath: faker.datatype.boolean() ? faker.image.urlPicsumPhotos() : null,
        authorId: faker.helpers.arrayElement(users).id,
        showId: faker.helpers.arrayElement(shows).id,
        tags: { connect: pickSome(tags, 4).map((t) => ({ id: t.id })) },
      },
    });
    posts.push(post);
  }
  return posts;
}

async function seedCommentsAndReplies(
  posts: { id: string }[],
  users: { id: string }[],
) {
  const allComments: { id: string; postId: string }[] = [];

  for (const post of posts) {
    const numComments = faker.number.int({ min: 0, max: MAX_COMMENTS_PER_POST });
    for (let i = 0; i < numComments; i++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          postId: post.id,
          authorId: faker.helpers.arrayElement(users).id,
        },
      });
      allComments.push({ id: comment.id, postId: post.id });

      const numReplies = faker.number.int({ min: 0, max: MAX_REPLIES_PER_COMMENT });
      for (let j = 0; j < numReplies; j++) {
        const reply = await prisma.comment.create({
          data: {
            content: faker.lorem.sentence(),
            postId: post.id,
            authorId: faker.helpers.arrayElement(users).id,
            parentId: comment.id,
          },
        });
        allComments.push({ id: reply.id, postId: post.id });
      }
    }
  }

  return allComments;
}

async function seedLikes(
  users: { id: string }[],
  posts: { id: string }[],
  comments: { id: string }[],
) {
  const seenPostLikes = new Set<string>();
  const seenCommentLikes = new Set<string>();
  const data: { userId: string; postId?: string; commentId?: string }[] = [];

  for (const post of posts) {
    const likers = pickSome(users, MAX_LIKES_PER_TARGET);
    for (const user of likers) {
      const key = `${user.id}:${post.id}`;
      if (seenPostLikes.has(key)) continue;
      seenPostLikes.add(key);
      data.push({ userId: user.id, postId: post.id });
    }
  }

  for (const comment of comments) {
    const likers = pickSome(users, Math.floor(MAX_LIKES_PER_TARGET / 2));
    for (const user of likers) {
      const key = `${user.id}:${comment.id}`;
      if (seenCommentLikes.has(key)) continue;
      seenCommentLikes.add(key);
      data.push({ userId: user.id, commentId: comment.id });
    }
  }

  await prisma.like.createMany({ data });
}

async function main() {
  console.log("Seeding genres and tags...");
  const genres = await seedGenres();
  const tags = await seedTags();

  console.log("Seeding shows...");
  const shows = await seedShows(genres);
  await seedTrending(shows);

  console.log("Seeding users...");
  const users = await seedUsers(shows);
  await seedFollows(users);

  console.log("Seeding posts...");
  const posts = await seedPosts(users, shows, tags);

  console.log("Seeding comments and replies...");
  const comments = await seedCommentsAndReplies(posts, users);

  console.log("Seeding likes...");
  await seedLikes(users, posts, comments);

  console.log("Done.");
  console.log({
    genres: genres.length,
    tags: tags.length,
    shows: shows.length,
    users: users.length,
    posts: posts.length,
    comments: comments.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });