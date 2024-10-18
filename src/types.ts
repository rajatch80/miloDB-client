export type MiloDBConfig = {
  nodes: string[]; // An array of base URLs for MiloDB instances
  timeout?: number; // Optional timeout for requests
};

export type SetRequest = {
  key: string;
  value: string;
  ttl?: number; // Optional time-to-live
};

export type GetResponse = {
  value?: string | null; // Returns null if not found
};

export type DeleteResponse = {
  success: boolean;
};
