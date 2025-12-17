import { DataPoint, Dataset, MetricSummary } from '../types';

export const parseCSV = (content: string, filename: string): Dataset => {
  const lines = content.trim().split(/\r\n|\n/);
  if (lines.length < 2) {
    throw new Error("CSV file must contain a header row and at least one data row.");
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const data: DataPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue; // Skip empty lines
    
    const values = line.split(',');
    const entry: DataPoint = {};

    headers.forEach((header, index) => {
      // Try to parse as number, strictly.
      const rawValue = values[index]?.trim();
      const numValue = Number(rawValue);

      if (rawValue !== '' && !isNaN(numValue)) {
        entry[header] = numValue;
      } else {
        entry[header] = rawValue;
      }
    });

    data.push(entry);
  }

  // Identify numeric columns for analysis (exclude timestamps usually)
  const numericColumns = headers.filter(h => {
    // Check first few rows to see if it's consistently a number
    // We ignore columns named strictly "id" or "timestamp" for metric calculation purposes usually,
    // but keep them available.
    const isNumber = data.length > 0 && typeof data[0][h] === 'number';
    return isNumber;
  });

  const summaries = numericColumns.map(col => calculateStats(data, col));

  return {
    filename,
    data,
    headers,
    numericColumns,
    summaries
  };
};

const calculateStats = (data: DataPoint[], key: string): MetricSummary => {
  const values = data.map(d => d[key] as number).sort((a, b) => a - b);
  const count = values.length;
  const sum = values.reduce((acc, v) => acc + v, 0);

  const getPercentile = (p: number) => {
    const index = Math.ceil(p * count) - 1;
    return values[Math.max(0, Math.min(index, count - 1))];
  };

  return {
    metric: key,
    min: values[0],
    max: values[count - 1],
    avg: parseFloat((sum / count).toFixed(2)),
    p50: getPercentile(0.50),
    p90: getPercentile(0.90),
    p95: getPercentile(0.95),
    p99: getPercentile(0.99),
  };
};
