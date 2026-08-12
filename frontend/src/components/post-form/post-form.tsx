import { Button } from "../ui/button";

export default function PostForm() {
  return (
    <form className="w-175 px-5 py-3 flex flex-col bg-popover border-t border-primary gap-6">
      <div className="text-muted-foreground flex flex-col gap-1">
        <label htmlFor="title">Title*</label>
        <input id="title" type="text" className="pl-3 p-1 border-primary rounded-lg border"/>
      </div>
      <div className="text-muted-foreground flex flex-col gap-1">
        <label htmlFor="title">Movie or TV Show*</label>
        <input id="title" type="text" className="pl-3 p-1 border-primary rounded-lg border"/>
      </div>
      <div className="text-muted-foreground flex flex-col gap-1">
        <label htmlFor="title">Body</label>
        <textarea id="title" type="text" className="pl-3 p-1 border-primary rounded-lg border"/>
      </div>
      <div className="flex justify-end gap-4">
        <Button className="w-20 font-bold" variant={"destructive"}>Discard</Button>
        <Button className="w-20 font-bold">Post</Button>
      </div>
    </form>
  );
}