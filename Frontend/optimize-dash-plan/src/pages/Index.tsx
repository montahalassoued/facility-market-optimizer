import { useState } from "react";
import Navbar from "@/components/Navbar";
import FileUploadCard from "@/components/FileUploadCard";
import ResultsTable, { ResultRow } from "@/components/ResultsTable";
import { Factory, Store, Truck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  file: File | null;
  data: Record<string, unknown>[];
}

const Index = () => {
  // File state
  const [sitesFile, setSitesFile] = useState<UploadedFile>({
    file: null,
    data: [],
  });
  const [marketsFile, setMarketsFile] = useState<UploadedFile>({
    file: null,
    data: [],
  });
  const [transportFile, setTransportFile] = useState<UploadedFile>({
    file: null,
    data: [],
  });

  // Results state
  const [results, setResults] = useState<ResultRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLocations, setMapLocations] = useState<
    {
      id: string;
      name: string;
      lat: number;
      lng: number;
      type: "factory" | "market";
      isOpen?: boolean;
      isServed?: boolean;
    }[]
  >([]);
  const [mapConnections, setMapConnections] = useState<
    { from: string; to: string; quantity: number }[]
  >([]);

  const handleRunOptimization = async () => {
    if (!sitesFile.file || !marketsFile.file || !transportFile.file) {
      toast.error(
        "Please upload all required files before running optimization"
      );
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("usines_file", sitesFile.file);
      formData.append("marches_file", marketsFile.file);
      formData.append("transport_file", transportFile.file);

      const response = await fetch("http://localhost:5000/optimize", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.error) {
        toast.error(`Optimization failed: ${data.error}`);
        return;
      }

      const backendResults: ResultRow[] = Object.entries(data.assignations).map(
        ([market, assign]: [
          string,
          { factory: string; demand: number; cost: number }
        ]) => ({
          id: market,
          market,
          factory: assign.factory,
          quantity: assign.demand,
          cost: assign.cost,
        })
      );
      setResults(backendResults);

      // Map connections avec la demande comme quantity
      const connections = backendResults
        .map((r) => {
          const fromId = sitesFile.data.find((f) => f.name === r.factory)?.id;
          const toId = marketsFile.data.find((m) => m.name === r.market)?.id;

          if (!fromId || !toId) {
            console.warn(`Connection skipped: ${r.factory} -> ${r.market}`);
            return null;
          }

          return {
            from: fromId,
            to: toId,
            quantity: r.quantity,
          };
        })
        .filter(Boolean) as { from: string; to: string; quantity: number }[];

      setMapConnections(connections);

      toast.success("Optimization completed successfully!", {
        description: `Found ${backendResults.length} optimal assignments`,
      });
    } catch (error) {
      console.error("Optimization error:", error);
      toast.error("An error occurred during optimization");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              OptiFlow: Optimize Your Supply Chain
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Upload your supply chain data and automatically determine the
              optimal locations for factories and the best market assignments.
            </p>
          </div>

          {/* File Upload Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </span>
              Upload Data Files
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <FileUploadCard
                title="Factories Data"
                description="Factory locations and capacities"
                icon={<Factory className="h-5 w-5" />}
                file={sitesFile.file}
                onFileSelect={(file, data) => setSitesFile({ file, data })}
                onClear={() => setSitesFile({ file: null, data: [] })}
              />
              <FileUploadCard
                title="Markets Data"
                description="Market locations and demands"
                icon={<Store className="h-5 w-5" />}
                file={marketsFile.file}
                onFileSelect={(file, data) => setMarketsFile({ file, data })}
                onClear={() => setMarketsFile({ file: null, data: [] })}
              />
              <FileUploadCard
                title="Transport Data"
                description="Shipping costs and routes"
                icon={<Truck className="h-5 w-5" />}
                file={transportFile.file}
                onFileSelect={(file, data) => setTransportFile({ file, data })}
                onClear={() => setTransportFile({ file: null, data: [] })}
              />
            </div>
          </section>

          {/* Results Section */}

          <section className="mb-8">
            <div className="mt-4 mb-8">
              <button
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                onClick={handleRunOptimization}
                disabled={isLoading}
              >
                {isLoading ? "Optimizing..." : "Run Optimization"}
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </span>
              Results & Visualization
            </h2>
            <div className="grid gap-6 ">
              <ResultsTable results={results} isLoading={isLoading} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>OptiFlow — Supply Chain Optimization Platform</p>
        </div>
      </footer>
    </div>
  );
};
export default Index;
