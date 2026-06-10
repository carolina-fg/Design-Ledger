/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DecisionNode } from "./types";

export const initialDecisions: DecisionNode[] = [
  {
    id: 1,
    label: "01",
    title: "Prescrição de dose",
    status: "IN_REVIEW",
    colorNode: "teal",
    screens: [
      {
        id: "w1_s1",
        title: "Tela 01 · Prescrição de dose",
        type: "prescription",
        hasFlags: true,
        flagsCount: 2,
        highlightedElement: {
          label: "Área de Continuidade Forçada",
          description: "A decisão de design oculta o caminho de cancelamento atrás de múltiplos diálogos de confirmação.",
          type: "amber"
        },
        components: [
          { type: "header", width: "w-1/3", height: "h-6", text: "PRESCR_DOSE_V1" },
          { type: "row", width: "w-full", height: "h-36", text: "Layout com fluxos secundários de validação" },
          { type: "field", width: "w-2/3", height: "h-14", text: "Dosagem recomendada: 120mg/dia (padrão)" },
          { type: "alert_box", width: "w-1/3", height: "h-24", text: "Atenção: Sobrecarga cognitiva detectada ao fechar fluxo." }
        ]
      },
      {
        id: "w1_s2",
        title: "Tela 02 · Alerta de interação medicamentosa",
        type: "alert",
        hasFlags: false,
        flagsCount: 0,
        components: [
          { type: "header", width: "w-1/2", height: "h-6", text: "INTERAÇÃO_MEDICAMENTOSA" },
          { type: "row", width: "w-full", height: "h-20" },
          { type: "button", width: "w-24", height: "h-10", text: "Cancelar" },
          { type: "button", width: "w-24", height: "h-10", text: "Confirmar (Complacente)", colorClass: "bg-primary/10 border-primary/30 text-primary" }
        ]
      }
    ],
    ethicalLedger: {
      flags: [
        {
          id: "flag_1_1",
          type: "SINALIZAÇÃO: PADRÃO ESCURO",
          nodeId: "NÓ_ID: 42_CANC",
          title: "Continuidade Forçada Detectada",
          severity: "GRAVIDADE: CRÍTICA",
          description: "A decisão de design oculta o caminho de cancelamento atrás de múltiplos diálogos de confirmação. Viola o protocolo interno da seção 4.2."
        },
        {
          id: "flag_1_2",
          type: "SINALIZAÇÃO: SOBRECARGA COGNITIVA",
          nodeId: "NÓ_ID: 15_RECOMM",
          title: "Dose Máxima Preservada por Padrão",
          severity: "GRAVIDADE: ATENÇÃO",
          description: "Definir a seleção de dose padrão para a configuração máxima pode gerar omissão médica em fluxos de trabalho de alta frequência de IHC."
        }
      ],
      logs: [
        {
          id: "log_1_1",
          type: "LOG: REVISÃO",
          timestamp: "14:22 UTC",
          text: "Substituído o fluxo de cancelamento de várias etapas por um diálogo de confirmação de clique único.",
          refTicket: "REF_TICKET_4091"
        },
        {
          id: "log_1_2",
          type: "LOG: AUDITORIA INICIAL",
          timestamp: "12:00 UTC",
          text: "Tela submetida para verificação automatizada de alinhamento e registro no ledger ético.",
          refTicket: "REF_TICKET_3980"
        }
      ]
    },
    approvedVariant: null
  },
  {
    id: 2,
    label: "02",
    title: "Alerta de alergia",
    status: "FLAGGED",
    colorNode: "amber",
    screens: [
      {
        id: "w2_s1",
        title: "Tela 01 · Supressão de Alerta Crítico",
        type: "alert",
        hasFlags: true,
        flagsCount: 1,
        highlightedElement: {
          label: "Baixo Contraste Crítico",
          description: "O contraste do texto de advertência está abaixo do limite mínimo de 3.0:1, reduzindo drasticamente a visibilidade de perigos.",
          type: "amber"
        },
        components: [
          { type: "header", width: "w-2/3", height: "h-6", text: "WARN_ALLERGY_RESPONSE" },
          { type: "alert_box", width: "w-full", height: "h-16", text: "Paciente relata choque anafilático a penicilina." },
          { type: "button", width: "w-full", height: "h-10", text: "Ignorar Alerta e Continuar" }
        ]
      }
    ],
    ethicalLedger: {
      flags: [
        {
          id: "flag_2_1",
          type: "SINALIZAÇÃO: OFUSCAÇÃO VISUAL",
          nodeId: "NÓ_ID: 88_BYPASS",
          title: "Alerta de Alergia Mitigado no Layout",
          severity: "GRAVIDADE: CRÍTICA",
          description: "O texto primário de aviso de alergia usa um tom cinza de baixíssimo contraste, enquanto o botão 'Ignorar Alerta' utiliza design evidente de alta visibilidade, o que pode induzir a supressões clínicas por engano."
        }
      ],
      logs: [
        {
          id: "log_2_1",
          type: "LOG: SINALIZADO",
          timestamp: "11:15 UTC",
          text: "Componente crítico de desvio de alergia identificado com discrepância visual. As diretrizes de acessibilidade exigem contraste de segurança > 4.5:1.",
          refTicket: "REF_TICKET_4122"
        }
      ]
    },
    approvedVariant: null
  },
  {
    id: 3,
    label: "03",
    title: "Diagnóstico Inteligente",
    status: "APPROVED",
    colorNode: "teal",
    screens: [
      {
        id: "w3_s1",
        title: "Tela 01 · Sugestões de Diagnósticos",
        type: "prescription",
        hasFlags: false,
        flagsCount: 0,
        components: [
          { type: "header", width: "w-1/2", height: "h-6", text: "SMART_DIAG_AUTOPOLY" },
          { type: "row", width: "w-full", height: "h-24", text: "Confirmação manual obrigatória antes de consolidar registros." }
        ]
      }
    ],
    ethicalLedger: {
      flags: [],
      logs: [
        {
          id: "log_3_1",
          type: "LOG: REVISÃO",
          timestamp: "09:30 UTC",
          text: "Autopreenchimento inteligente por IA validado. Plataforma exige caixa de seleção manual ativa de confirmação em tela antes de salvar no EMR.",
          refTicket: "REF_TICKET_4011"
        }
      ]
    },
    approvedVariant: "VARIANT_B"
  },
  {
    id: 4,
    label: "04",
    title: "Termo de Consentimento",
    status: "FLAGGED",
    colorNode: "amber",
    screens: [
      {
        id: "w4_s1",
        title: "Tela 01 · Consentimento de Compartilhamento ",
        type: "generic",
        hasFlags: true,
        flagsCount: 1,
        highlightedElement: {
          label: "Consentimento Ativo Pré-Marcado",
          description: "Caixas de seleção pré-assinaladas para compartilhamento comercial violam os padrões fundamentais de opt-in voluntário da LGPD.",
          type: "amber"
        },
        components: [
          { type: "header", width: "w-3/4", height: "h-6", text: "CONSENT_GDPR_SHIELD" },
          { type: "field", width: "w-full", height: "h-12", text: "[X] Autorizo o envio de dados clínicos para terceiros (Pré-marcado)" }
        ]
      }
    ],
    ethicalLedger: {
      flags: [
        {
          id: "flag_4_1",
          type: "SINALIZAÇÃO: BRECHA DE CONFORMIDADE",
          nodeId: "NÓ_ID: 12_GDPR",
          title: "Consentimento de Dados Pré-Marcado",
          severity: "GRAVIDADE: CRÍTICA",
          description: "O compartilhamento de dados médicos do paciente para pesquisas científicas comerciais está configurado como pré-selecionado por padrão. Viola termos de clareza, transparência e consentimento explícito da LGPD/GDPR."
        }
      ],
      logs: [
        {
          id: "log_4_1",
          type: "LOG: CONFORMIDADE ADVERTIDO",
          timestamp: "16:04 UTC",
          text: "Auditoria apontou mecanismos de anuência automática como perigo ético grave. Recomenda-se exclusão imediata e exigência de clique de opt-in ativo.",
          refTicket: "REF_TICKET_4301"
        }
      ]
    },
    approvedVariant: null
  },
  {
    id: 5,
    label: "05",
    title: "Notificação Telemetria",
    status: "IN_REVIEW",
    colorNode: "teal",
    screens: [
      {
        id: "w5_s1",
        title: "Tela 01 · Notificação de Telemetria UTI",
        type: "prescription",
        hasFlags: false,
        flagsCount: 0,
        components: [
          { type: "header", width: "w-1/3", height: "h-6", text: "TELEMETRY_ALERT_V5" },
          { type: "row", width: "w-full", height: "h-20", text: "Alarme sonoro progressivo verificado." }
        ]
      }
    ],
    ethicalLedger: {
      flags: [],
      logs: [
        {
          id: "log_5_1",
          type: "LOG: REVISÃO",
          timestamp: "15:45 UTC",
          text: "Aguardando homologação final do comitê. Níveis de prioridade do alarme sonoro e visual validados de acordo com as diretrizes de ergonomia.",
          refTicket: "REF_TICKET_4505"
        }
      ]
    },
    approvedVariant: null
  }
];
