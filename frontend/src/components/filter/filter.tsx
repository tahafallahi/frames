import type { Filter } from "@/types/user";
import { Badge } from "../ui/badge";

export default function Filter({ filters }: { filters: Filter[] }) {
  return (
    <div className="w-75 flex flex-col gap-3">
      <h5 className="text-2xl">Filter By</h5>
      <div className="flex flex-col gap-6 border-l py-3 px-5">
        {filters.map((f, i) => (
          <div key={i} className="flex flex-col gap-2">
            <h6 className="text-base ">{f.title}:</h6>
            <div className="flex flex-wrap gap-2">
              {f.items.map((i) => (
                <Badge variant={i.selected? "default": "outline"} className="p-4 text-base rounded-full">{i.name}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
