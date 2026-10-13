import type { Request, Response } from "express";
import { supabase } from "../lib/supabase.js";

export async function createSignedUploadUrl(req: Request, res: Response) {
  const { path } = req.query;

  if (typeof path !== "string") return res.json({error: "Path must be of type string"})

  const { data, error } = await supabase.storage
    .from("post")
    .createSignedUploadUrl(path);

  res.json(data)
}
