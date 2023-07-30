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

export function SelectTone({
  onValueChange,
}: {
  onValueChange: (value: string) => void;
}) {
  const selectedValue = useConfigStore((state) => state.style);
  const options = [
    "Professional",
    "Academic",
    "Casual",
    "Informative",
    "Storytelling",
  ];
  return (
    <Select onValueChange={onValueChange} defaultValue={selectedValue.content}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select tone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tone</SelectLabel>
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
