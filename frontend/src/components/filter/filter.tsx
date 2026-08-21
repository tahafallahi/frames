import type { Filter, SelectedFilters } from "@/types/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function Filter({
  filters,
  selectedFilters,
  setSelectedFilters,
}: {
  filters: Filter[];
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
}) {
  function handleClick(filter: string, tag: string) {
    if (selectedFilters[filter].includes(tag)) {
      setSelectedFilters({
        ...selectedFilters,
        [filter]: [...selectedFilters[filter].filter((sf) => sf != tag)],
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [filter]: [tag, ...selectedFilters[filter]],
      });
    }
  }

  return (
    <div className="w-75 flex flex-col gap-3">
      <h5 className="text-2xl">Filter By</h5>
      <div className="flex flex-col gap-6 border-l py-3 px-5">
        {filters.map((f, i) => (
          <div key={i} className="flex flex-col gap-2">
            <h6 className="text-base ">{f.title}:</h6>
            <div className="flex flex-wrap gap-2">
              {f.items.map((tag) => (
                <Button
                  variant={"ghost"}
                  onClick={() => handleClick(f.title, tag)}
                >
                  <Badge
                    variant={
                      selectedFilters[f.title]?.includes(tag)
                        ? "default"
                        : "outline"
                    }
                    className="p-4 text-base rounded-full"
                  >
                    {tag}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
