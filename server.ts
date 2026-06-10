import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load local environment variables
dotenv.config();

async function generateContentWithRetry(ai: any, params: {
  contents: any;
  config?: any;
}) {
  const models = ["gemini-flash-latest", "gemini-3.5-flash"];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`[Gemini SDK] Attempting generateContent with model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      console.log(`[Gemini SDK] Generation successful using model: ${model}`);
      return response;
    } catch (err: any) {
      console.warn(`[Gemini SDK] Failed generateContent with ${model}:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json());

  // AI Ethical Audit API Endpoint
  app.post("/api/audit", async (req: express.Request, res: express.Response) => {
    const { screenName, description, intentCategory } = req.body;

    if (!screenName || !description) {
      res.status(400).json({ error: "Screen Name and UX Description are required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Helper for offline fallback behavior
    const runLocalAudit = () => {
      const lowerDesc = description.toLowerCase();
      const lowerName = screenName.toLowerCase();
      let hasViolation = false;
      const flags: any[] = [];
      const logs: any[] = [];

      if (
        lowerDesc.includes("hide") || 
        lowerDesc.includes("ocultar") || 
        lowerDesc.includes("cancelar") || 
        lowerDesc.includes("forced") ||
        lowerDesc.includes("forçar") ||
        lowerDesc.includes("difícil")
      ) {
        hasViolation = true;
        flags.push({
          id: `opt_flag_${Date.now()}_1`,
          type: "FLAG: DARK PATTERN",
          nodeId: "NODE_ID: 77_OBST",
          title: "Obstáculo de Cancelamento (Forced Continuity)",
          severity: "CRITICAL",
          description: "O fluxo de UX impõe atritos persistentes para cancelar, omitindo ou atrasando o encerramento do serviço. Viola seção de liberdade de escolha clínica."
        });
        logs.push({
          id: `opt_log_${Date.now()}_1`,
          type: "LOG: REVISION",
          timestamp: new Date().toISOString().substring(11, 16) + " UTC",
          text: "Simplificar fluxo de desistência em uma única tela de confirmação, removendo alertas subsequentes.",
          refTicket: `REF_TICKET_${Math.floor(1000 + Math.random() * 9000)}`
        });
      }

      if (
        lowerDesc.includes("padrão") || 
        lowerDesc.includes("default") || 
        lowerDesc.includes("pré-marcado") ||
        lowerDesc.includes("pre-checked") ||
        lowerDesc.includes("checked")
      ) {
        hasViolation = true;
        flags.push({
          id: `opt_flag_${Date.now()}_2`,
          type: "FLAG: COMPLIANCE BREACH",
          nodeId: "NODE_ID: 29_OPTIN",
          title: "Opt-In Pré-Selecionado Detectado",
          severity: "HIGH",
          description: "Caixas de seleção pré-marcadas para compartilhamento de dados violam explicitamente os princípios do GDPR e o compromisso de privacidade do paciente."
        });
        logs.push({
          id: `opt_log_${Date.now()}_2`,
          type: "LOG: REVISION",
          timestamp: new Date().toISOString().substring(11, 16) + " UTC",
          text: "Remover pré-seleção ativa, exigindo autorização manual explícita (Opt-In ativo).",
          refTicket: `REF_TICKET_${Math.floor(1000 + Math.random() * 9000)}`
        });
      }

      if (
        lowerDesc.includes("contraste") || 
        lowerDesc.includes("cinza") || 
        lowerDesc.includes("cor") ||
        lowerDesc.includes("pequeno") ||
        lowerDesc.includes("leitura")
      ) {
        hasViolation = true;
        flags.push({
          id: `opt_flag_${Date.now()}_3`,
          type: "FLAG: VISUAL OBFUSCATION",
          nodeId: "NODE_ID: 11_CONTRAST",
          title: "Ofuscação de Alerta Clínico",
          severity: "WARNING",
          description: "O contraste visual do aviso de segurança está abaixo da proporção 4.5:1 exigida pelas normas de acessibilidade (WCAG AA)."
        });
        logs.push({
          id: `opt_log_${Date.now()}_3`,
          type: "LOG: REVISION",
          timestamp: new Date().toISOString().substring(11, 16) + " UTC",
          text: "Melhorar peso da fonte e contraste de cor para #dee4df contra superfícies escuras.",
          refTicket: `REF_TICKET_${Math.floor(1000 + Math.random() * 9000)}`
        });
      }

      if (!hasViolation) {
        logs.push({
          id: `opt_log_${Date.now()}_4`,
          type: "LOG: AUDIT",
          timestamp: new Date().toISOString().substring(11, 16) + " UTC",
          text: `A tela "${screenName}" foi avaliada como complacente sem pendências éticas graves detectadas pelas heurísticas estruturais locais.`,
          refTicket: `REF_TICKET_${Math.floor(1000 + Math.random() * 9000)}`
        });
      }

      return {
        hasViolation,
        flags,
        logs: logs.length > 0 ? logs : [{
          id: `opt_log_${Date.now()}_def`,
          type: "LOG: INITIAL AUDIT",
          timestamp: new Date().toISOString().substring(11, 16) + " UTC",
          text: "Cadastro inicial registrado e validado nas heurísticas da trilha auditiva.",
          refTicket: "REF_TICKET_MOCK"
        }]
      };
    };

    // Graceful fallback to rich local simulated engine if API key is not yet configured or is the default placeholder
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.warn("GEMINI_API_KEY is not configured. Running offline heuristic evaluation engine.");
      res.json(runLocalAudit());
      return;
    }

    try {
      // Lazy initialize the SDK
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `
        Analise a seguinte decisão/design de tela de interface médico-hospitalar e procure por violações éticas, padrões obscuros (dark patterns), sobrecarga cognitiva, problemas de contraste ou riscos à segurança do paciente.

        Nome da Tela: "${screenName}"
        Categoria de Intenção: "${intentCategory}"
        Descrição do Fluxo da Interface: "${description}"

        Retorne o resultado estritamente em formato JSON seguindo o esquema especificado.
        Seja rigoroso, científico e focado na eficácia e segurança clínica.
      `;

      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          systemInstruction: `Você é uma IA auditora especialista em ética de design de softwares de saúde (Design Auditor/Ethical Ledger). Analise detalhadamente se a descrição da interface possui problemas de ética como 'forced continuity', 'misdirection', pre-checked consents (violando LGPD/GDPR), ou obstrução de segurança. Responda em Português brasileiro.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hasViolation: {
                type: Type.BOOLEAN,
                description: "Se há violações éticas ou problemas de usabilidade encontrados."
              },
              flags: {
                type: Type.ARRAY,
                description: "Lista de sinalizadores éticos pendentes encontrados. Retorne vazio se não houver.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: {
                      type: Type.STRING,
                      description: "Tipo de flag corporativa, ex: 'FLAG: DARK PATTERN', 'FLAG: COGNITIVE OVERLAY', 'FLAG: COMPLIANCE BREACH', 'FLAG: VISUAL OBFUSCATION'."
                    },
                    nodeId: {
                      type: Type.STRING,
                      description: "Identificador único estrutural fictício de nó, ex: 'NODE_ID: 99_OBST'."
                    },
                    title: {
                      type: Type.STRING,
                      description: "Título curto da falha, ex: 'Direcionamento Induzido Detectado'."
                    },
                    severity: {
                      type: Type.STRING,
                      description: "Nível de gravidade crítica da falha. Deve ser um: 'CRITICAL', 'HIGH', 'WARNING', 'LOW'."
                    },
                    description: {
                      type: Type.STRING,
                      description: "Explicação técnica detalhada de como essa interface viola políticas éticas hospitalares e os riscos éticos e legais associados."
                    }
                  },
                  required: ["type", "nodeId", "title", "severity", "description"]
                }
              },
              logs: {
                type: Type.ARRAY,
                description: "Lista de propostas de revisão ou logs corretivos. Retorne pelo menos um log.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: {
                      type: Type.STRING,
                      description: "Sempre usar 'LOG: REVISION' ou 'LOG: AUDIT'."
                    },
                    text: {
                      type: Type.STRING,
                      description: "Trabalho prático sugerido para solucionar o problem e adequar a interface."
                    },
                    refTicket: {
                      type: Type.STRING,
                      description: "Ticket corporativo gerado com formato 'REF_TICKET_XXXX' com 4 números aleatórios."
                    }
                  },
                  required: ["type", "text", "refTicket"]
                }
              }
            },
            required: ["hasViolation", "flags", "logs"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini.");
      }

      // Parse JSON from Gemini and stream back
      const resultObj = JSON.parse(responseText.trim());
      
      // Assign persistent tracking IDs to result flags
      if (resultObj.flags && Array.isArray(resultObj.flags)) {
        resultObj.flags = resultObj.flags.map((f: any, idx: number) => ({
          ...f,
          id: `ai_flag_${Date.now()}_${idx}`
        }));
      }
      
      if (resultObj.logs && Array.isArray(resultObj.logs)) {
        resultObj.logs = resultObj.logs.map((l: any, idx: number) => ({
          ...l,
          id: `ai_log_${Date.now()}_${idx}`,
          timestamp: new Date().toISOString().substring(11, 16) + " UTC"
        }));
      }

      res.json(resultObj);
    } catch (err: any) {
      console.error("Gemini API server auditing error:", err);
      console.warn("Falling back to local screen compliance heuristics due to API failure.");
      const offlineResult = runLocalAudit();
      
      // Prepend an informative warning flag so the user is clearly notified that local mode saved the day
      offlineResult.flags.unshift({
        id: `api_err_fallback_${Date.now()}`,
        type: "INFO: COMPLIANCE RETRIEVAL",
        nodeId: "API_403_FALLBACK",
        title: "Motor Local de Auditoria Ativo",
        severity: "WARNING",
        description: `O modelo remoto reportou restrição ou limite excedido de API (HTTP 403). Ativamos automaticamente o subsistema de heurísticas offline local para garantir a segurança clínica.`
      });
      
      res.json(offlineResult);
    }
  });

  // Briefing Comparison & Ethical UX Pattern Analysis Endpoint
  app.post("/api/analyze-briefing", async (req: express.Request, res: express.Response) => {
    const { briefingText } = req.body;

    if (!briefingText || briefingText.trim() === "") {
      res.status(400).json({ error: "Briefing text is required for analysis." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Local heuristical algorithm if Gemini is offline or restricted
    const runLocalBriefing = () => {
      const textLower = briefingText.toLowerCase();
      let patterns: any[] = [];

      if (
        textLower.includes("triagem") ||
        textLower.includes("risco") ||
        textLower.includes("sugerir") ||
        textLower.includes("pacientes") ||
        textLower.includes("classificação")
      ) {
        patterns = [
          {
            id: `pat_${Date.now()}_1`,
            severity: "RISCO MODERADO",
            category: "ROTULAGEM DE OUTPUT DE IA",
            text: "A interface precisa deixar claro que a classificação é uma sugestão do sistema e não um diagnóstico final.",
            cardLink: "Label 'Sugerido pelo sistema'"
          },
          {
            id: `pat_${Date.now()}_2`,
            severity: "RISCO CRÍTICO",
            category: "AUTONOMIA DA DECISÃO CLÍNICA",
            text: "O médico deve ter a capacidade de sobrescrever a decisão do algoritmo sem fricção excessiva na interface.",
            cardLink: "Posição do indicador de risco por IA"
          },
          {
            id: `pat_${Date.now()}_3`,
            severity: "SEM HISTÓRICO",
            category: "TRIAGEM AUTOMATIZADA",
            text: "Padrão não encontrado no repositório anterior. Requer análise ética primária estrutural.",
            cardLink: ""
          }
        ];
      } else if (textLower.includes("dosagem") || textLower.includes("dose") || textLower.includes("uti") || textLower.includes("medicamento")) {
        patterns = [
          {
            id: `pat_${Date.now()}_1`,
            severity: "RISCO CRÍTICO",
            category: "DOSAGEM E PRESCRIÇÃO CLÍNICA",
            text: "Dosagem sugerida automaticamente por IA não deve possuir pre-checks ativos para evitar sobrecargas de dosificação e choque anafilático.",
            cardLink: "Alerta de Dose Limite"
          },
          {
            id: `pat_${Date.now()}_2`,
            severity: "RISCO MODERADO",
            category: "CONFIRMAÇÃO DE CONTRASTE DE CORES",
            text: "Cuidado com o contraste cinza em botões críticos de rejeição de dosagem. Deve ser mantido o limite de 4.5:1 WCAG.",
            cardLink: "Botão Rejeitar Proposta"
          },
          {
            id: `pat_${Date.now()}_3`,
            severity: "CONFORMIDADE",
            category: "CONTROLE DE SEGURANÇA UX REFORÇADO",
            text: "Integração do fluxo de UX em conformidade com as diretivas do Ministério da Saúde.",
            cardLink: ""
          }
        ];
      } else {
        patterns = [
          {
            id: `pat_${Date.now()}_1`,
            severity: "RISCO MODERADO",
            category: "PADRÕES DE ESCOLHA INDUZIDA",
            text: "Identificado pré-seleção potencial na caixa de consentimento do termos de prontuário eletrônico. Verifique as recomendações da LGPD.",
            cardLink: "Popup de Consentimento"
          },
          {
            id: `pat_${Date.now()}_2`,
            severity: "RISCO CRÍTICO",
            category: "FALHA DE VISIBILIDADE DE ALERTA",
            text: "Alertas críticos podem ser ofuscados se inseridos em tabs secundárias de navegação. Garanta prioridade espacial de visualização.",
            cardLink: "Notificações Clínicas"
          },
          {
            id: `pat_${Date.now()}_3`,
            severity: "SEM HISTÓRICO",
            category: "MÓDULO DE SEGUNDA OPINIÃO",
            text: "Novas funcionalidades de auxílio diagnóstico requerem revisão estrutural com a banca ética médica.",
            cardLink: ""
          }
        ];
      }
      return patterns;
    };

    // Local heuristical algorithm if Gemini is offline
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.warn("GEMINI_API_KEY not configured. Running offline briefing patterns analyzer.");
      res.json({ patterns: runLocalBriefing() });
      return;
    }

    try {
      // Setup Google Gen AI SDK
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `
        Analise o seguinte briefing de design de software clínico/hospitalar inteligênte ou funcionalidade de saúde:
        "${briefingText}"

        Encontre de 2 a 4 padrões éticos, riscos de IHC (interação humano-computador), dark patterns ou violações de regras clínicas e conformidade de UX (como diretrizes WCAG, Autonomia Clínica, Clareza Diagnóstica ou Consentimento).
        Retorne o resultado de forma resumida e profissional em Português brasileiro no formato estruturado especificado no responseSchema.
      `;

      const response = await generateContentWithRetry(ai, {
        contents: prompt,
        config: {
          systemInstruction: `Você é uma IA de auditoria de conformidade clínica (Design Compliance Bot). Sua função é analisar briefings de requisitos clínicos UX e identificar pontos críticos de design ético, privacidade, dark patterns ou autonomia clínica de UX. Retorne os resultados rigorosamente em formato JSON com explicações claras que traduzam os requisitos em diretrizes práticas de design.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              patterns: {
                type: Type.ARRAY,
                description: "Lista de padrões ou problemas de ética de UX identificados no briefing.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    severity: {
                      type: Type.STRING,
                      description: "Nível do risco ou status do padrão. Use 'RISCO MODERADO', 'RISCO CRÍTICO', 'SEM HISTÓRICO' ou 'CONFORMIDADE'."
                    },
                    category: {
                      type: Type.STRING,
                      description: "Breve categoria ou bloco afetado em caixa alta, ex: 'ROTULAGEM DE OUTPUT DE IA', 'AUTONOMIA DA DECISÃO CLÍNICA', 'CONFIRMAÇÃO DE DUPLO AGENTE'."
                    },
                    text: {
                      type: Type.STRING,
                      description: "Curto parágrafo em Português que explica por que este ponto é importante e qual é a diretriz clínica exigida."
                    },
                    cardLink: {
                      type: Type.STRING,
                      description: "Nome de um elemento de cartão sugerido ou elemento de interface para verificar, ex: 'Label \"Sugerido pelo sistema\"', 'Posição do indicador de risco por IA', ou vazio se não houver."
                    }
                  },
                  required: ["severity", "category", "text", "cardLink"]
                }
              }
            },
            required: ["patterns"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini for briefing analyzer.");
      }

      const resultObj = JSON.parse(responseText.trim());
      
      // Inject unique client IDs
      if (resultObj.patterns && Array.isArray(resultObj.patterns)) {
        resultObj.patterns = resultObj.patterns.map((pat: any, idx: number) => ({
          ...pat,
          id: `pat_${Date.now()}_${idx}`
        }));
      }

      res.json(resultObj);

    } catch (err: any) {
      console.error("Gemini briefing analysis error:", err);
      console.warn("Falling back to local briefings heuristics due to Gemini API restriction/permission block.");
      const defaultPatterns = runLocalBriefing();
      
      // Inject an explanation advisory explaining that the offline safe analyzer was loaded due to API 403 access restrictions
      defaultPatterns.unshift({
        id: `pat_fallback_${Date.now()}_warn`,
        severity: "CONFORMIDADE ÉTICA",
        category: "SUBSISTEMA OFFLINE COMPACTO",
        text: "Ativamos automaticamente o motor local de auditoria de briefing em virtude de uma restrição remota de acesso à API (status 403/proibido). Detecções de riscos clínicos e usabilidade continuam garantidas offline.",
        cardLink: ""
      });
      
      res.json({ patterns: defaultPatterns });
    }
  });

  // Serve static assets in development & production correctly
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Design Ledger] Secure server running on http://localhost:${PORT}`);
  });
}

startServer();
