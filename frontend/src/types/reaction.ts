export enum ReactionType {
  LIKE ="LIKE",
  "DISLIKE" = "DISLIKE"
}

export enum ReactionAction {
  ADD= "ADD",
  REMOVE = "REMOVE"
}

export interface Reaction {
  type: ReactionType;
}

export interface ReactionPayload {
  type: ReactionType;
  action: ReactionAction;
}
