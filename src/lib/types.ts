// ── Project types ──────────────────────────────────────────────────────────

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ProjectStatus = "complete" | "in-progress" | "placeholder";

export type DataClient =
  | "Client A — Multi-Branch Lab Network"
  | "Client B — Metro Diagnostic Center"
  | "Client C — Community Lab & Pharmacy"
  | "Client D — Outpatient Clinic"
  | "Client E — Southeast Asian Clinic"
  | "All Clients"
  | "HelpDesk Platform";

export type TableName =
  | "patients"
  | "orders"
  | "order_items"
  | "patient_services"
  | "patient_service_results";

export interface ProjectMeta {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  difficulty: Difficulty;
  status: ProjectStatus;
  clients: DataClient[];
  tables: TableName[];
  techniques: string[];
  keyMetric?: {
    value: string;
    label: string;
  };
  color: string;
}

// ── Chart data types ───────────────────────────────────────────────────────

export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface LineDataPoint {
  x: string | number;
  y: number;
}

export interface ScatterDataPoint {
  x: number;
  y: number;
  label?: string;
  cluster?: number;
}

export interface KPIData {
  value: string | number;
  label: string;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  status?: "normal" | "warning" | "critical";
}
