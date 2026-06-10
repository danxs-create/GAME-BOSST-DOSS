export type SecurityStatus = 'REAL' | 'LIMITED' | 'IMPOSSIBLE';

export interface AuditItem {
  id: string;
  featureName: string;
  status: SecurityStatus;
  androidApi: string;
  explanation: string;
  affectedFiles: string[];
  alternativeSolution?: string;
  minAndroidVersion: string;
}

export interface ProposedFeature {
  id: string;
  name: string;
  androidApi: string;
  androidVersion: string;
  mlBenefit: string;
  kotlinSnippet: string;
}

export interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}
