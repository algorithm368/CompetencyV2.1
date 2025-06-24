export interface Education {
  id: number;
  syear?: number | null;
  eyear?: number | null;
  level_edu?: string | null;
  universe?: string | null;
  faculty?: string | null;
  branch?: string | null;
  date: string; // ISO timestamp
  portfolio_id?: number | null;
}
