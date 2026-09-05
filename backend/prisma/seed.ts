import { MediaType } from "generated/prisma/enums";
import { prisma } from "lib/prisma";
import bcrypt from "bcrypt";


function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function getPosterPath(tmdbId: number, mediaType: MediaType, title: string): Promise<string> {
  const apiKey = process.env.TMDB_API_KEY;
  if (apiKey) {
    try {
      const endpoint = mediaType === "MOVIE" ? "movie" : "tv";
      const res = await fetch(
        `https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${apiKey}`
      );
      if (res.ok) {
        const data = (await res.json()) as { poster_path?: string };
        if (data.poster_path) {
          return `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        }
      }
    } catch {
      // fall through to placeholder
    }
  }
  return `https://picsum.photos/seed/${slugify(title)}-poster/500/750`;
}

const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCI_FI: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;

const GENRE_NAMES: Record<number, string> = {
  [GENRES.ACTION]: "Action",
  [GENRES.ADVENTURE]: "Adventure",
  [GENRES.ANIMATION]: "Animation",
  [GENRES.COMEDY]: "Comedy",
  [GENRES.CRIME]: "Crime",
  [GENRES.DOCUMENTARY]: "Documentary",
  [GENRES.DRAMA]: "Drama",
  [GENRES.FAMILY]: "Family",
  [GENRES.FANTASY]: "Fantasy",
  [GENRES.HISTORY]: "History",
  [GENRES.HORROR]: "Horror",
  [GENRES.MUSIC]: "Music",
  [GENRES.MYSTERY]: "Mystery",
  [GENRES.ROMANCE]: "Romance",
  [GENRES.SCI_FI]: "Science Fiction",
  [GENRES.THRILLER]: "Thriller",
  [GENRES.WAR]: "War",
  [GENRES.WESTERN]: "Western",
};

interface ShowSeed {
  tmdbId: number;
  title: string;
  overview: string;
  releaseYear: number;
  mediaType: MediaType;
  genres: number[];
}

const SHOWS: ShowSeed[] = [
  {
    tmdbId: 278,
    title: "The Shawshank Redemption",
    overview:
      "A banker wrongly convicted of murder forms an unlikely friendship with a fellow inmate over two decades in Shawshank State Penitentiary.",
    releaseYear: 1994,
    mediaType: "MOVIE",
    genres: [GENRES.DRAMA, GENRES.CRIME],
  },
  {
    tmdbId: 155,
    title: "The Dark Knight",
    overview:
      "Batman faces his greatest psychological and physical test when a chaotic criminal calling himself the Joker unleashes havoc on Gotham City.",
    releaseYear: 2008,
    mediaType: "MOVIE",
    genres: [GENRES.ACTION, GENRES.CRIME, GENRES.DRAMA, GENRES.THRILLER],
  },
  {
    tmdbId: 680,
    title: "Pulp Fiction",
    overview:
      "The lives of two mob hitmen, a boxer, and a gangster's wife intertwine in four tales of violence and redemption across Los Angeles.",
    releaseYear: 1994,
    mediaType: "MOVIE",
    genres: [GENRES.CRIME, GENRES.DRAMA],
  },
  {
    tmdbId: 27205,
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology is given a chance at redemption if he can pull off the impossible: inception.",
    releaseYear: 2010,
    mediaType: "MOVIE",
    genres: [GENRES.ACTION, GENRES.SCI_FI, GENRES.ADVENTURE],
  },
  {
    tmdbId: 550,
    title: "Fight Club",
    overview:
      "An insomniac office worker and a soap salesman form an underground fight club that spirals into something far more dangerous.",
    releaseYear: 1999,
    mediaType: "MOVIE",
    genres: [GENRES.DRAMA],
  },
  {
    tmdbId: 603,
    title: "The Matrix",
    overview:
      "A hacker discovers that reality as he knows it is a simulation controlled by machines, and joins a rebellion to free humanity.",
    releaseYear: 1999,
    mediaType: "MOVIE",
    genres: [GENRES.ACTION, GENRES.SCI_FI],
  },
  {
    tmdbId: 157336,
    title: "Interstellar",
    overview:
      "A team of explorers travels through a wormhole in search of a new habitable planet as Earth becomes increasingly uninhabitable.",
    releaseYear: 2014,
    mediaType: "MOVIE",
    genres: [GENRES.ADVENTURE, GENRES.DRAMA, GENRES.SCI_FI],
  },
  {
    tmdbId: 496243,
    title: "Parasite",
    overview:
      "A poor family schemes to become employed by a wealthy household, setting off a chain of events that blurs the line between class and survival.",
    releaseYear: 2019,
    mediaType: "MOVIE",
    genres: [GENRES.COMEDY, GENRES.THRILLER, GENRES.DRAMA],
  },
  {
    tmdbId: 438631,
    title: "Dune",
    overview:
      "A young heir to a powerful noble family must travel to a dangerous desert planet to secure the future of his people.",
    releaseYear: 2021,
    mediaType: "MOVIE",
    genres: [GENRES.SCI_FI, GENRES.ADVENTURE],
  },
  {
    tmdbId: 19995,
    title: "Avatar",
    overview:
      "A paraplegic Marine dispatched to the moon Pandora finds himself torn between following orders and protecting the world he feels is his home.",
    releaseYear: 2009,
    mediaType: "MOVIE",
    genres: [GENRES.SCI_FI, GENRES.ADVENTURE, GENRES.FANTASY],
  },
  {
    tmdbId: 1396,
    title: "Breaking Bad",
    overview:
      "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future.",
    releaseYear: 2008,
    mediaType: "TV_SHOW",
    genres: [GENRES.CRIME, GENRES.DRAMA, GENRES.THRILLER],
  },
  {
    tmdbId: 66732,
    title: "Stranger Things",
    overview:
      "When a young boy disappears in a small Indiana town, his friends, family, and local police uncover a mystery involving secret experiments and otherworldly forces.",
    releaseYear: 2016,
    mediaType: "TV_SHOW",
    genres: [GENRES.DRAMA, GENRES.FANTASY, GENRES.HORROR],
  },
  {
    tmdbId: 1399,
    title: "Game of Thrones",
    overview:
      "Noble families vie for control of the Iron Throne while an ancient threat awakens beyond a massive wall in the north.",
    releaseYear: 2011,
    mediaType: "TV_SHOW",
    genres: [GENRES.DRAMA, GENRES.FANTASY, GENRES.ACTION],
  },
  {
    tmdbId: 2316,
    title: "The Office",
    overview:
      "A mockumentary crew captures the daily grind of an eccentric paper company staff at the Scranton branch of Dunder Mifflin.",
    releaseYear: 2005,
    mediaType: "TV_SHOW",
    genres: [GENRES.COMEDY],
  },
  {
    tmdbId: 1668,
    title: "Friends",
    overview:
      "Six friends navigate careers, romance, and adulthood together in 1990s Manhattan.",
    releaseYear: 1994,
    mediaType: "TV_SHOW",
    genres: [GENRES.COMEDY, GENRES.ROMANCE],
  },
  {
    tmdbId: 82856,
    title: "The Mandalorian",
    overview:
      "A lone bounty hunter travels the outer reaches of the galaxy, far from the authority of the New Republic, and finds himself an unexpected companion.",
    releaseYear: 2019,
    mediaType: "TV_SHOW",
    genres: [GENRES.SCI_FI, GENRES.ADVENTURE, GENRES.FANTASY],
  },
  {
    tmdbId: 87739,
    title: "The Queen's Gambit",
    overview:
      "An orphaned chess prodigy struggles with addiction while rising to the top of the competitive chess world in the 1960s.",
    releaseYear: 2020,
    mediaType: "TV_SHOW",
    genres: [GENRES.DRAMA],
  },
  {
    tmdbId: 60059,
    title: "Better Call Saul",
    overview:
      "A small-time lawyer with big ambitions slowly transforms into the morally flexible fixer he's destined to become.",
    releaseYear: 2015,
    mediaType: "TV_SHOW",
    genres: [GENRES.CRIME, GENRES.DRAMA],
  },
];

const TAGS = [
  "must-watch",
  "rewatch",
  "spoilers",
  "underrated",
  "binge-worthy",
  "plot-twist",
  "cinematography",
  "series-finale",
  "recommendation",
  "hot-take",
];

interface UserSeed {
  username: string;
  email: string;
  bio: string;
}

const USERS: UserSeed[] = [
  { username: "alexrivera92", email: "alex.rivera@example.com", bio: "Film school dropout, professional couch critic. 🍿" },
  { username: "mchen_reviews", email: "m.chen@example.com", bio: "TV writer by day, deep-dive rewatcher by night." },
  { username: "sophiegoeswatching", email: "sophie.g@example.com", bio: "Currently working through the AFI top 100. Send help." },
  { username: "deepakfromqueens", email: "deepak.q@example.com", bio: "If it's got a twist ending I've probably seen it three times." },
  { username: "lunaslate", email: "luna.slate@example.com", bio: "Horror movies are my comfort food." },
  { username: "thegreatgatsby_ben", email: "ben.g@example.com", bio: "Comparing every new release to Fight Club whether it's fair or not." },
  { username: "priya.codes.and.watches", email: "priya.k@example.com", bio: "Software engineer by day, binge-watcher by night." },
  { username: "noah_onreplay", email: "noah.r@example.com", bio: "I will not shut up about Better Call Saul." },
  { username: "camillewrites", email: "camille.w@example.com", bio: "Freelance writer, currently obsessed with Korean cinema." },
  { username: "jaydeewatches", email: "jaydee.w@example.com", bio: "Just here for the plot twists." },
  { username: "em_reviews_things", email: "em.reviews@example.com", bio: "Rating everything out of 10 whether you asked or not." },
  { username: "tomthecinephile", email: "tom.c@example.com", bio: "35mm or nothing." },
  { username: "hana.k", email: "hana.k@example.com", bio: "Sci-fi nerd, will die on the Dune hill." },
  { username: "marcusonthecouch", email: "marcus.c@example.com", bio: "Rewatching sitcoms until the heat death of the universe." },
];

interface PostSeed {
  tmdbId: number;
  title: string;
  content: string;
  tags: string[];
  withImage?: boolean;
}

const POSTS: PostSeed[] = [
  {
    tmdbId: 278,
    title: "Just finished my annual rewatch and I'm an emotional wreck (as usual)",
    content:
      "There's a reason this tops every 'best movies' list. The way Andy's patience pays off over decades still gets me every single time. Also, Morgan Freeman's narration is doing so much heavy lifting. The ending hits different no matter how many times I've seen it.",
    tags: ["rewatch", "must-watch"],
  },
  {
    tmdbId: 155,
    title: "Heath Ledger's Joker still hasn't been topped",
    content:
      "Rewatched this last night for probably the 15th time and the interrogation scene is just perfect filmmaking. Every choice he makes feels unpredictable but weirdly logical at the same time. Curious what people think holds up better as blockbuster filmmaking, this or something more recent.",
    tags: ["cinematography", "hot-take"],
  },
  {
    tmdbId: 680,
    title: "The non-linear structure works so much better on a rewatch",
    content:
      "First time I watched this I was mostly confused about the timeline. Second watch, everything clicks into place and you start noticing all the little callbacks. Tarantino's dialogue is on another level here.",
    tags: ["rewatch", "plot-twist"],
  },
  {
    tmdbId: 27205,
    title: "Ok so does the top actually stop spinning or not",
    content:
      "I know this discussion is like 15 years old at this point, but I just showed it to my roommate who'd never seen it and we argued about the ending for an hour. What's your take, dream or reality?",
    tags: ["plot-twist", "spoilers"],
  },
  {
    tmdbId: 550,
    title: "This movie gets better every time I revisit it",
    content:
      "Watched it again for a film class assignment and the twist holds up way better than I remembered. Might be one of the best character reveals in movie history and I say that fully aware of how played out that opinion is.",
    tags: ["rewatch", "plot-twist"],
    withImage: true,
  },
  {
    tmdbId: 603,
    title: "The practical effects still look better than most CGI today",
    content:
      "Caught a re-release on the big screen last weekend and the bullet time sequences are still jaw-dropping. Wild that this came out in 1999 and still looks better than a lot of modern blockbusters.",
    tags: ["cinematography", "must-watch"],
  },
  {
    tmdbId: 157336,
    title: "That docking scene might be the most tense five minutes in any movie",
    content:
      "No dialogue, just Hans Zimmer's score building and building. I was gripping the armrest the entire time even though I've seen this movie ten times at this point.",
    tags: ["cinematography", "must-watch"],
  },
  {
    tmdbId: 496243,
    title: "The genre shift in the second half completely changes the movie",
    content:
      "Went in expecting a slow drama and got a thriller, a dark comedy, and something close to horror all rolled into one. That Best Picture win was earned.",
    tags: ["must-watch", "spoilers"],
  },
  {
    tmdbId: 438631,
    title: "Villeneuve made the sandworms feel genuinely massive",
    content:
      "The scale of everything in this movie is insane, every shot feels designed to make you feel small. Really curious how they handle the back half of the book in the sequel.",
    tags: ["cinematography", "must-watch"],
    withImage: true,
  },
  {
    tmdbId: 19995,
    title: "Still holds up visually more than a decade later",
    content:
      "Rewatched this ahead of the sequels and the underwater sequences from the newer movies clearly took cues from how immersive Pandora felt in the original.",
    tags: ["cinematography", "rewatch"],
  },
  {
    tmdbId: 1396,
    title: "Ozymandias might be the best episode of television ever made",
    content:
      "No spoilers for anyone still working through it, but that episode is non-stop dread from start to finish. Bryan Cranston's performance during that phone call scene destroyed me.",
    tags: ["spoilers", "series-finale"],
  },
  {
    tmdbId: 1396,
    title: "Rewatching from the start and Walt is so much more unlikable than I remembered",
    content:
      "It's easy to forget how much of a coward he is in season one once you've seen where he ends up. The writing on this show is unbelievably patient.",
    tags: ["rewatch", "hot-take"],
  },
  {
    tmdbId: 66732,
    title: "Season 1 still hits different than the later seasons",
    content:
      "There's something about the smaller-scale mystery in season one that I miss. The newer seasons go bigger but the first one nailed that 80s small-town horror vibe perfectly.",
    tags: ["binge-worthy", "hot-take"],
  },
  {
    tmdbId: 1399,
    title: "Can we talk about the Red Wedding years later",
    content:
      "Still think about how blindsided everyone was watching this live. No show has replicated that feeling of genuine shock since.",
    tags: ["spoilers", "plot-twist"],
  },
  {
    tmdbId: 2316,
    title: "Rewatching this for probably the 6th time and it still works",
    content:
      "Comfort show doesn't even begin to describe it. Michael Scott's cringe humor somehow gets funnier every time instead of more uncomfortable.",
    tags: ["rewatch", "binge-worthy"],
  },
  {
    tmdbId: 1668,
    title: "Which era of Friends is actually the best",
    content:
      "Early seasons have the best chemistry but later seasons have some of the funniest individual episodes. Curious where everyone lands on this.",
    tags: ["hot-take", "rewatch"],
  },
  {
    tmdbId: 82856,
    title: "Baby Yoda carried season one and I stand by that",
    content:
      "The show found its footing once it leaned into the found-family dynamic between Mando and Grogu. Some of the best Star Wars content in years, easily.",
    tags: ["must-watch", "binge-worthy"],
    withImage: true,
  },
  {
    tmdbId: 87739,
    title: "Didn't think a show about chess could be this tense",
    content:
      "Every match felt like a fight scene somehow. Anya Taylor-Joy's performance carries the entire show, and the costume design deserves way more credit than it gets.",
    tags: ["must-watch", "underrated"],
  },
  {
    tmdbId: 60059,
    title: "This might actually be better than Breaking Bad",
    content:
      "Controversial opinion, but Jimmy's slow transformation into Saul is some of the best character writing on TV. The final season stuck the landing perfectly.",
    tags: ["hot-take", "series-finale"],
  },
];

const TOP_LEVEL_COMMENTS = [
  "Completely agree, one of my all-time favorites.",
  "I actually think it's a bit overrated but I get the appeal.",
  "This is exactly what I needed to read today, going to rewatch tonight.",
  "The ending lives rent free in my head.",
  "Hard disagree, but I respect the take.",
  "Wait until you watch it a third time, it somehow gets even better.",
  "I remember watching this for the first time and being floored.",
  "The score alone makes this worth revisiting.",
  "Underrated pick honestly, more people should be talking about this.",
  "This thread is making me want to start a rewatch tonight.",
  "Saying this as someone who's seen it way too many times: still holds up.",
  "The pacing drags a little for me in the middle but the payoff is worth it.",
  "This is now the third post today that's convinced me to rewatch it.",
  "Not me adding this to my watchlist for the fifth time because of a comment section.",
];

const REPLIES = [
  "Right?? I felt the exact same way.",
  "Haha same, ended up rewatching the whole thing that weekend.",
  "That's fair, I can see where you're coming from.",
  "Exactly what I was thinking!",
  "Lol I was NOT ready for that reveal either.",
  "Same here, still think about it honestly.",
  "This is the most correct comment in this thread.",
  "Interesting, I've never thought about it that way.",
];



async function main() {
  console.log("Clearing existing data...");
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.trending.deleteMany();
  await prisma.federatedUser.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.user.deleteMany();
  await prisma.show.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.genre.deleteMany();

  console.log("Seeding genres...");
  await prisma.genre.createMany({
    data: Object.entries(GENRE_NAMES).map(([id, name]) => ({ id: Number(id), name })),
  });

  console.log("Seeding shows (this may take a moment if fetching real posters)...");
  const showRecords: Record<number, { id: string }> = {};
  for (const show of SHOWS) {
    const posterPath = await getPosterPath(show.tmdbId, show.mediaType, show.title);
    const created = await prisma.show.create({
      data: {
        tmdbId: show.tmdbId,
        title: show.title,
        overview: show.overview,
        releaseYear: show.releaseYear,
        mediaType: show.mediaType,
        posterPath,
        genres: { connect: show.genres.map((id) => ({ id })) },
      },
    });
    showRecords[show.tmdbId] = { id: created.id };
  }

  console.log("Seeding tags...");
  await prisma.tag.createMany({ data: TAGS.map((name) => ({ name })) });

  console.log("Seeding users...");
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const userRecords: { id: string; username: string }[] = [];
  for (const u of USERS) {
    const created = await prisma.user.create({
      data: {
        username: u.username,
        email: u.email,
        hashedPassword: passwordHash,
        bio: u.bio,
        profilePath: `https://i.pravatar.cc/300?u=${u.username}`,
      },
    });
    userRecords.push({ id: created.id, username: created.username });
  }

  console.log("Seeding federated identities...");
  await prisma.federatedUser.create({
    data: {
      subject: "google-oauth2|108234871234567890123",
      user_id: userRecords[6].id, // priya.codes.and.watches
      provider: "google",
    },
  });
  await prisma.federatedUser.create({
    data: {
      subject: "github|8823412",
      user_id: userRecords[11].id, // tomthecinephile
      provider: "github",
    },
  });

  console.log("Seeding follows...");
  const followPairs = new Set<string>();
  for (const user of userRecords) {
    const followCount = randomInt(3, 6);
    const candidates = userRecords.filter((u) => u.id !== user.id);
    const targets = pickRandomN(candidates, followCount);
    for (const target of targets) {
      const key = `${user.id}:${target.id}`;
      if (followPairs.has(key)) continue;
      followPairs.add(key);
      await prisma.follows.create({
        data: { followerId: user.id, followeeId: target.id },
      });
    }
  }

  console.log("Seeding favorites...");
  const showIds = Object.values(showRecords).map((s) => s.id);
  for (const user of userRecords) {
    const favCount = randomInt(2, 5);
    const favorites = pickRandomN(showIds, favCount);
    await prisma.user.update({
      where: { id: user.id },
      data: { favorites: { connect: favorites.map((id) => ({ id })) } },
    });
  }

  console.log("Seeding posts, comments, and likes...");
  for (const postSeed of POSTS) {
    const show = showRecords[postSeed.tmdbId];
    const author = pickRandom(userRecords);
    const post = await prisma.post.create({
      data: {
        title: postSeed.title,
        content: postSeed.content,
        picturePath: postSeed.withImage
          ? `https://picsum.photos/seed/${slugify(postSeed.title)}/800/450`
          : null,
        authorId: author.id,
        showId: show.id,
        tags: { connect: postSeed.tags.map((name) => ({ name })) },
      },
    });

    // Top-level comments
    const commentCount = randomInt(2, 4);
    const commenters = pickRandomN(userRecords, commentCount);
    const createdComments: { id: string }[] = [];
    for (const commenter of commenters) {
      const comment = await prisma.comment.create({
        data: {
          content: pickRandom(TOP_LEVEL_COMMENTS),
          postId: post.id,
          authorId: commenter.id,
        },
      });
      createdComments.push({ id: comment.id });
    }

    // Occasional replies (1-2 levels deep)
    for (const comment of createdComments) {
      if (Math.random() < 0.5) {
        const replyCount = randomInt(1, 2);
        for (let i = 0; i < replyCount; i++) {
          const replier = pickRandom(userRecords);
          await prisma.comment.create({
            data: {
              content: pickRandom(REPLIES),
              postId: post.id,
              authorId: replier.id,
              parentId: comment.id,
            },
          });
        }
      }
    }

    // Likes on the post
    const likers = pickRandomN(userRecords, randomInt(2, userRecords.length));
    for (const liker of likers) {
      await prisma.like.create({
        data: { userId: liker.id, postId: post.id },
      });
    }

    // Likes on a subset of comments
    const allComments = await prisma.comment.findMany({ where: { postId: post.id } });
    for (const comment of allComments) {
      if (Math.random() < 0.6) {
        const commentLikers = pickRandomN(userRecords, randomInt(1, 4));
        for (const liker of commentLikers) {
          try {
            await prisma.like.create({
              data: { userId: liker.id, commentId: comment.id },
            });
          } catch {
            // skip on unique constraint collision (same user already liked)
          }
        }
      }
    }
  }

  console.log("Seeding trending...");
  for (const show of SHOWS) {
    await prisma.trending.create({
      data: {
        showId: showRecords[show.tmdbId].id,
        popularity: randomInt(50, 5000),
      },
    });
  }

  console.log("Done seeding.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });