import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CsvData = { head: string[]; rows: string[][] };

function parseToData(input: string): CsvData {
  const lines = input.split("\n");
  const head = lines.shift()?.replace(/"/g, "").split(",") || [];
  const rows = lines.map((line) =>
    line
      .replace(/^"|"$/g, "")
      .split('","')
      .map((item) => item.replace(/""/g, '"'))
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {csv.rows.map((cells: string[], idx: number) => (
            <TableRow key={idx}>
              {cells.map((cell: string, cellIdx: number) => (
                <TableCell key={cellIdx}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
