import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  BarChart3,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
} from "lucide-react";

export interface ResultRow {
  id: string;
  factory: string;
  market: string;
  quantity: number;
  cost: number;
}

interface ResultsTableProps {
  results: ResultRow[];
  isLoading?: boolean;
}

type SortField = "factory" | "market" | "quantity" | "cost";
type SortDirection = "asc" | "desc";

const ResultsTable = ({ results, isLoading = false }: ResultsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("factory");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = results.filter(
        (row) =>
          row.factory.toLowerCase().includes(query) ||
          row.market.toLowerCase().includes(query)
      );
    }

    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [results, searchQuery, sortField, sortDirection]);

  const totalCost = useMemo(
    () => results.reduce((sum, row) => sum + row.cost, 0),
    [results]
  );

  const totalQuantity = useMemo(
    () => results.reduce((sum, row) => sum + row.quantity, 0),
    [results]
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const handleExport = () => {
    const headers = ["Factory", "Market", "Quantity", "Cost"];
    const csvContent = [
      headers.join(","),
      ...results.map(
        (row) => `${row.factory},${row.market},${row.quantity},${row.cost}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimization_results.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-card shadow-card animate-slide-up">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent text-accent-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Optimization Results
              </CardTitle>
              <CardDescription>
                {results.length > 0
                  ? `${results.length} assignments found`
                  : "Run optimization to see results"}
              </CardDescription>
            </div>
          </div>

          {results.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Xsls
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No results yet</p>
            <p className="text-xs mt-1">
              Upload files and run optimization to see results
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-accent/50 border border-border">
                <p className="text-xs text-muted-foreground">
                  Total Assignments
                </p>
                <p className="text-xl font-semibold">{results.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/50 border border-border">
                <p className="text-xs text-muted-foreground">Total Demand</p>
                <p className="text-xl font-semibold">
                  {totalQuantity.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-accent/50 border border-border">
                <p className="text-xs text-muted-foreground">Total Cost</p>
                <p className="text-xl font-semibold">
                  {totalCost.toLocaleString()}DT
                </p>
              </div>
              <div className="p-3 rounded-lg bg-accent/50 border border-border">
                <p className="text-xs text-muted-foreground">Avg Cost/Unit</p>
                <p className="text-xl font-semibold">
                  {totalQuantity > 0
                    ? (totalCost / totalQuantity).toFixed(2)
                    : "0.00"}
                  DT
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by factory or market..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead
                        className="font-semibold cursor-pointer select-none"
                        onClick={() => handleSort("factory")}
                      >
                        <div className="flex items-center">
                          Factory
                          <SortIcon field="factory" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="font-semibold cursor-pointer select-none"
                        onClick={() => handleSort("market")}
                      >
                        <div className="flex items-center">
                          Market
                          <SortIcon field="market" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="font-semibold cursor-pointer select-none text-right"
                        onClick={() => handleSort("quantity")}
                      >
                        <div className="flex items-center justify-end">
                          Taille Demand
                          <SortIcon field="quantity" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="font-semibold cursor-pointer select-none text-right"
                        onClick={() => handleSort("cost")}
                      >
                        <div className="flex items-center justify-end">
                          Cost
                          <SortIcon field="cost" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span className="text-muted-foreground">
                              Loading results...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredAndSortedResults.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No matching results found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedResults.map((row, index) => (
                        <TableRow
                          key={row.id}
                          className={
                            index % 2 === 0 ? "bg-card" : "bg-muted/30"
                          }
                        >
                          <TableCell className="font-medium">
                            {row.factory}
                          </TableCell>
                          <TableCell>{row.market}</TableCell>
                          <TableCell className="text-right font-mono">
                            {row.quantity.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {row.cost.toLocaleString()}DT
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
