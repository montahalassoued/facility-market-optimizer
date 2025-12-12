import Navbar from "@/components/Navbar";
import FileUploadCard from "@/components/FileUploadCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Store, Truck, FileSpreadsheet, AlertCircle } from "lucide-react";
import { useState } from "react";

interface UploadedFile {
  file: File | null;
  data: Record<string, unknown>[];
}

const Upload = () => {
  const [sitesFile, setSitesFile] = useState<UploadedFile>({ file: null, data: [] });
  const [marketsFile, setMarketsFile] = useState<UploadedFile>({ file: null, data: [] });
  const [transportFile, setTransportFile] = useState<UploadedFile>({ file: null, data: [] });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Upload Data Files
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Upload your CSV files containing sites, markets, and transportation data.
              Each file should follow the required format for accurate optimization.
            </p>
          </div>

          {/* File Upload Cards */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <FileUploadCard
              title="Sites Data"
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

          {/* File Format Instructions */}
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Required File Formats
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Factory className="h-4 w-4 text-primary" />
                  Sites CSV Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-md p-3 font-mono text-xs overflow-x-auto">
                  <p className="text-muted-foreground mb-1"># Example:</p>
                  <p>id,name,lat,lng,capacity,fixed_cost</p>
                  <p>F1,Factory A,40.7,-74.0,1000,50000</p>
                  <p>F2,Factory B,34.0,-118.2,800,45000</p>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Include factory ID, name, coordinates, capacity, and fixed opening cost.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  Markets CSV Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-md p-3 font-mono text-xs overflow-x-auto">
                  <p className="text-muted-foreground mb-1"># Example:</p>
                  <p>id,name,lat,lng,demand</p>
                  <p>M1,Market 1,41.8,-87.6,500</p>
                  <p>M2,Market 2,29.7,-95.3,300</p>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Include market ID, name, coordinates, and demand quantity.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Transport CSV Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-md p-3 font-mono text-xs overflow-x-auto">
                  <p className="text-muted-foreground mb-1"># Example:</p>
                  <p>from,to,cost_per_unit</p>
                  <p>F1,M1,25</p>
                  <p>F1,M2,30</p>
                  <p>F2,M1,28</p>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Include origin factory, destination market, and shipping cost per unit.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="mt-6 border-warning/30 bg-warning/5 shadow-card">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Tips for Best Results</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Ensure all CSV files have headers in the first row</li>
                    <li>Use consistent IDs between files (factory IDs in transport file must match sites file)</li>
                    <li>Coordinates should be in decimal degrees format</li>
                    <li>Numeric values should not contain currency symbols or commas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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

export default Upload;
