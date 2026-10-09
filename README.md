# Description
Frames is my pet project that always wanted to create. Because of my wonder at how Reddit worked behind the scenes, so I wanted to give it shot at making the same functionalities.
# Stack
- Frontend
  - Vite
  - React
  - Typescript
  - React-query
  - React-router
  - Shadcn/ui
  - Tailwind
  - Motion
  - React-hook-forms
- Backend
  - Express
  - Prisma
  - Postgres

# Process
I wanted to build this all from ground up by myself. So I made a ux user flow, a wireframe, and then turned it into a Figma design. After that I developed the backend and the fronted simultaneously, making each component in React, then implementing the required backend endpoints. 
The biggest mistake I made was not worrying about responsive design at start, I thought I could just tack on some tailwind classes and it would be perfect on phone, but I came to realize how much of a mistake it was to postpone making it suitable for smaller screens.

# Features
I was really interested in making a search bar that could get any tv show or movie, I was worried there might not even be a way to do it, but thanks to tmdb's api it wasn't that hard. Now the site fetches the users, posts, TV shows and movies matching the search query at the same time. I did so, by making every call to the third party api from my own server, instead of the client.
Another thing that was really hard to figure out, was making like and dislikes on posts and comments optimistic. It took a lot of trial and error, but at the end I think the result is pretty good.

This was a really fun project to work on, I really liked making a polished full fledged website that is beautiful and fun to use.
