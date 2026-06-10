/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SeverityType = "CRITICAL" | "HIGH" | "WARNING" | "LOW" | "SEM SINALIZADORES" | "GRAVIDADE: CRÍTICA" | "GRAVIDADE: ATENÇÃO";

export interface EthicalFlag {
  id: string;
  type: string; // e.g., "FLAG: DARK PATTERN", "FLAG: PRIVACY LEAK"
  nodeId: string; // e.g., "NODE_ID: 42_CANC"
  title: string;
  severity: SeverityType;
  description: string;
}

export interface AuditLog {
  id: string;
  type: string; // e.g., "LOG: REVISION", "LOG: AUDIT"
  timestamp: string; // e.g., "14:22 UTC"
  text: string;
  refTicket?: string; // e.g., "REF_TICKET_4091"
}

export interface WireframeElement {
  id: string;
  title: string;
  type: "prescription" | "alert" | "button_flow" | "input_matrix" | "generic";
  hasFlags: boolean;
  flagsCount: number;
  highlightedElement?: {
    label: string;
    description: string;
    type: "amber" | "teal";
  };
  components: Array<{
    type: "header" | "row" | "field" | "button" | "box" | "alert_box" | "text_block";
    width: string; // e.g., "w-1/3"
    height: string; // e.g., "h-4"
    colorClass?: string;
    text?: string;
  }>;
}

export interface DecisionNode {
  id: number;
  label: string; // "01", "02", etc.
  title: string; // e.g. "Projeto Prescrição de Dose"
  status: "IN_REVIEW" | "APPROVED" | "FLAGGED";
  colorNode: "teal" | "amber";
  screens: WireframeElement[];
  ethicalLedger: {
    flags: EthicalFlag[];
    logs: AuditLog[];
  };
  approvedVariant: string | null; // e.g. "VARIANT_B"
}

export interface AuditProposalInput {
  screenName: string;
  description: string;
  intentCategory: string; // e.g., "Alert Confirmation", "Billing", "Data Capture"
}
