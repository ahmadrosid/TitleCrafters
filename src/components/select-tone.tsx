import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfigStore } from "@/stores/config-store";
import { Input } from "./ui/input";
import { useRef, useState } from "react";

const defaultOption = [
  "Professional",
  "Academic",
  "Casual",
  "Informative",
  "Storytelling",
  "Confident",
  "Excited",
  "Formal",
  "Friendly",
  "Funny",
];

export function SelectTone({
  onValueChange,
  activeId,
}: {
  activeId: string;
  onValueChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const selectedValue = useConfigStore((state) => {
    return state.titles.get(activeId)?.style || { content: "" };
  });

  const options =
    query === ""
      ? defaultOption
      : defaultOption.filter((option) =>
          option.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Select
      onOpenChange={(open) => {
        if (open) {
          console.log("openned");
          setTimeout(() => {
            inputRef.current?.focus();
          });
        }
      }}
      onValueChange={(value) => {
        onValueChange(value);
        setQuery("");
      }}
      defaultValue={selectedValue.content}
    >
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Select tone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tone</SelectLabel>
          <div className="p-2">
            <Input
              onChange={(e) => setQuery(e.target.value)}
              ref={inputRef}
              placeholder="Search"
            />
          </div>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
