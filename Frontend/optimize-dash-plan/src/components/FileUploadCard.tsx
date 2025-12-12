import { Upload, FileText, X, Check } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface FileUploadCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onFileSelect: (file: File, data: Record<string, unknown>[]) => void;
  file: File | null;
  onClear: () => void;
}

const FileUploadCard = ({
  title,
  description,
  icon,
  onFileSelect,
  file,
  onClear,
}: FileUploadCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet);

      setPreview(jsonData.slice(0, 5));
      onFileSelect(selectedFile, jsonData);
    };

    reader.readAsArrayBuffer(selectedFile);
  }
};

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPreview([]);
    setShowPreview(false);
    onClear();
  };

  const columns = preview.length > 0 ? Object.keys(preview[0]) : [];

  return (
    <Card className="bg-card shadow-card hover:shadow-card-lg transition-shadow duration-300 animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent text-accent-foreground">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
       <input 
       id="file-upload"
       ref={inputRef}
       type="file"
       accept=".xlsx"
       onChange={handleFileChange}
       className="hidden"
/>

<label htmlFor="file-upload" className="sr-only">
  Upload your file
</label>



        {!file ? (
          <Button
            variant="outline"
            className="w-full h-24 border-2 border-dashed border-border hover:border-primary hover:bg-accent/50 transition-all duration-200"
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-6 w-6" />
              <span className="text-sm font-medium">Click to upload XSls</span>
            </div>
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-success/10">
                  <Check className="h-4 w-4 text-success" />
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {file.name}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {preview.length > 0 && (
              <div>
                <Button
                  variant="link"
                  className="px-0 text-sm text-primary"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? "Hide preview" : "Show preview"}
                </Button>

                {showPreview && (
                  <div className="mt-2 rounded-md border border-border overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto max-h-48">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            {columns.map((col) => (
                              <TableHead
                                key={col}
                                className="text-xs font-semibold whitespace-nowrap"
                              >
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {preview.map((row, i) => (
                            <TableRow key={i} className="even:bg-muted/30">
                              {columns.map((col) => (
                                <TableCell
                                  key={col}
                                  className="text-xs py-2 whitespace-nowrap"
                                >
                                  {String(row[col] ?? "")}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
