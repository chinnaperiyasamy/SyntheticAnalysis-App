export interface DataPoint {
  [key: string]: string | number;
}

export interface MetricSummary {
  metric: string;
  min: number;
  max: number;
  avg: number;
  p50: number; // Median
  p90: number;
  p95: number;
  p99: number;
}

export interface Dataset {
  filename: string;
  data: DataPoint[];
  headers: string[];
  numericColumns: string[];
  summaries: MetricSummary[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}
