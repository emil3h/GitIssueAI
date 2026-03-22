export interface FileData {
  name: string;
  content: string;
}

export interface CompareRequest {
  file1Content: string;
  file2Content: string;
  file1Name: string;
  file2Name: string;
  instructions?: string;
}

export interface CompareResponse {
  summary: string;
  differences: string[];
  ghCommand: string;
}

export interface SamplePair {
  id: string;
  label: string;
  description: string;
  fileType: string;
  file1: FileData;
  file2: FileData;
}
