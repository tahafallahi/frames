import axios from "axios";

if (!process.env.TMDB_URL) throw new Error("TMDB_URL is not defined.");
if (!process.env.TMDB_ACCESS_TOKEN) throw new Error("TMDB_ACCESS_TOKEN is not defined.");

const tmdbApi = axios.create({ baseURL: process.env.TMDB_URL, headers: {
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
}, timeout: 5000});


export { tmdbApi };
