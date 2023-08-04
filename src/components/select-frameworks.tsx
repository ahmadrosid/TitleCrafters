import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { frameworks } from "@/lib/frameworks";
import { useConfigStore, setFrameworks } from "@/stores/config-store";
import { Label } from "./ui/label";

export function SelectFrameworks() {
  const { selectedValues, activeId } = useConfigStore((state) => {
    return {
      selectedValues: new Set(
        state.titles
          .get(state.activeId)
          ?.frameworks.map((item) => item.label) || []
      ),
      activeId: state.activeId,
    };
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 border justify-start"
        >
          <div className="flex items-center">
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            <p className="truncate">Select frameworks</p>
          </div>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  frameworks
                    .filter((option) => selectedValues.has(option.label))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.label}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={"Frameworks"} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((option) => {
                const isSelected = selectedValues.has(option.label);
                return (
                  <CommandItem
                    key={option.label + option.description}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.label);
                      } else {
                        selectedValues.add(option.label);
                      }
                      setFrameworks(
                        activeId,
                        frameworks.filter((item) =>
                          selectedValues.has(item.label)
                        )
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <div className="max-w-xl">
                      <Label>{option.label}</Label>
                      <p className="text-gray-600 truncate">
                        {option.description}
                      </p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setFrameworks(activeId, [])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
