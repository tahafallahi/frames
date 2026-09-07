import PostForm from "@/components/post-form/post-form";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function CreatePost() {
  const [form, setFomr] = useState(null)

  // const showQuery = useQuery({
  //   queryKey: ["show", showId, form.mediaType],
  //   queryFn: async () => {
  //     return (await api.get<Show>("/shows/" + mediaType + "/" + showId)).data;
  //   },
  // });


  return (
    <>
    <div>
      <PostForm />
    </div>
    <div></div>
    </>
  );
}