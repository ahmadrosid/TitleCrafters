import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { Copy, ExternalLinkIcon } from "lucide-react";
import { toast } from "react-hot-toast";

type CsvData = { head: string[]; rows: string[][] };

function parseToData(input: string): CsvData {
  const lines = input.split("\n");
  const head =
    lines
      .shift()
      ?.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((item) => item.replace(/"/g, "")) || [];
  const rows = lines.map((line) =>
    line
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((item) => item.replace(/"/g, "").replace(/""/g, '"'))
  );

  return { head, rows };
}

export function TableTitle({ data }: { data: any[] }) {
  if (data.length == 0) return null;
  const csv = parseToData(data[0]);
  return (
    <div className="border rounded shadow-sm bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {csv.head.map((h: string, idx: number) => (
              <TableHead key={idx}>{h}</TableHead>
            ))}
            <TableHead className="w-[10rem]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {csv.rows.map((cells: string[], idx: number) => (
            <TableRow key={idx}>
              {cells.map((cell: string, cellIdx: number) => (
                <TableCell className="group relative" key={cellIdx}>
                  <p className="py-1">{cell}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cell);
                      toast.success("Copied to clipboard");
                    }}
                    className="absolute invisible group-hover:visible right-1 top-1"
                  >
                    <Copy className="w-4" />
                  </button>
                </TableCell>
              ))}
              <TableCell>
                <a
                  className={buttonVariants({
                    variant: "ghost",
                    className:
                      "gap-2 border border-transparent hover:border-gray-400",
                  })}
                  href={"/outline?title=" + encodeURIComponent(cells[1])}
                >
                  Get outline <ExternalLinkIcon className="w-4 h-4" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
