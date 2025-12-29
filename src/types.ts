export interface DataJSON {
  tags: string[];
  value: string[];
  is_enabled: number[];
  switchable: number[];
  switch_position: number[];
  section_number: number[];
  all_sections: string[];
  available_versions: string[];
  squid_version: string[];
  units: string[];
  message_built: string[];
  message_warning: string[];
  help: string[];
}

export interface SearchResult {
  title: string;
  record: number;
}

export interface SearchState {
  loading: boolean;
  results: SearchResult[];
  value: string;
}

export type SearchAction =
  | { type: 'CLEAN_QUERY' }
  | { type: 'START_SEARCH'; query: string }
  | { type: 'FINISH_SEARCH'; results: SearchResult[] };
