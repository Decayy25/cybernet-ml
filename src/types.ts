export interface Location {
  _id: string;
  area: string;
  status: "tersedia" | "tidak_tersedia";
}

export type LocationRequest = Omit<Location, "_id">;

export interface PredictionResponse {
  area?: string;
  status: string;
  confidence?: string;
  isVerified?: boolean;
  matchedArea?: string;
  error?: string;
}

export interface ClassificationResult {
  label: string;
  value: number;
}
