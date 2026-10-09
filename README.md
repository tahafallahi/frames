# Frames
A forum site to talk, review and discuss movies and TV shows. It is my full-stack pet project that I always wanted to build, because I was curious about how Reddit worked behind the scenes, so I wanted to give it shot and see if I could make the core functionalities.

# Features
- Posts and comments, likes and dislikes with optimistic updates, so the UI is intuitive and fast.
- Deounced search that gets users, posts, TV shows and movies at the same time. Show and movie results come from the TMDB API.
- Responsive design that works on phones as well as desktops. (kinda*)

# Stack
**Frontend:**Vite, React, TypeScript, React Query, React Router, shadcn/ui, Tailwind CSS, Motion, React Hook Form
**Backend:**Express, Prisma, Postgres

# Process
I wanted to build this all from ground up by myself. So I made a user flow chart, a wire frame, and then turned it into a Figma design. After that I developed the backend and the fronted simultaneously, making each component in React, then implementing the required backend endpoints. 

# Challenges and Lessons
**Searching from third party and the database**. I was really interested in making a search bar that could get any TV show or movie, I was worried there might not even be a way to do it, but thanks to TMDB's API it wasn't that hard. Now the site fetches the users, posts, TV shows and movies matching the search query at the same time. I did so, by making every call to the third party API from my own server, instead of the client.

**Optimistic likes and dislikes.**Another thing that was really hard to figure out, was making like and dislikes on posts and comments optimistic. It took a lot of trial and error, but at the end I think the result is pretty good.

**Responsive design.** The biggest mistake I made was not worrying about responsive design at start, I thought I could just tack on some tailwind classes and it would be perfect on phone, but I came to realize how much of a mistake it was to postpone making it suitable for smaller screens.

This was a really fun project to work on, I really liked making a polished full fledged website that is beautiful and fun to use.

# Getting Started
```bash
# clone the repo
git clone git@github.com:tahafallahi/frames.git

# install dependencies (frontend and backend)
cd frames/frontend
npm install
cd frames/backend
npm install

# set up environment variables

# run database migrations
npx prisma migrate dev

# seed fake posts and users (optional)
npx prisma db seed

# start frontend and backend
cd frames/frontend
npm run dev

cd frames/backend
npm run dev
```
