import type { PostForm } from "@/types/post";
import { Button } from "../ui/button";
import type React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Field, FieldGroup, FieldLabel } from "../ui/field";

export default function PostForm({
  form,
  setForm,
}: {
  form: PostForm;
  setForm: React.Dispatch<React.SetStateAction<PostForm>>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-2xl font-bold">Create New Post</h3>
      <form className="px-5 py-3 bg-popover border-t border-primary">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title *</FieldLabel>
            <Input id="title" name="title" type="text" />
          </Field>
          <Field>
            <FieldLabel htmlFor="title">Movie or TV Show*</FieldLabel>
            <Input
              id="title"
              name="title"
              type="text"
              value={form.showTitle}
              onChange={(e) => {
                setForm({ ...form, showTitle: e.target.value });
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="title">Body</FieldLabel>
            <Textarea id="title" name="title" className="h-40" />
          </Field>
          <div className="flex justify-end gap-4">
            <Button className="w-20 font-bold" variant={"destructive"}>
              Discard
            </Button>
            <Button className="w-20 font-bold">Post</Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
