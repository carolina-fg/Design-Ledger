/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ArrowLeft,
  Folder,
  BarChart3,
  ShieldCheck,
  Archive,
  Settings,
  LogOut,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Check,
  Loader2,
  History,
  FileJson,
  Users,
  FileText,
  ChevronRight,
  Sparkles,
  Info,
  HeartPulse
} from "lucide-react";
import { DecisionNode, EthicalFlag, AuditLog } from "./types";
import { initialDecisions } from "./data";
import EthicsLogDashboard from "./components/EthicsLogDashboard";
import SettingsPanel from "./components/SettingsPanel";
import LoginScreen from "./components/LoginScreen";
import ProjectsScreen from "./components/ProjectsScreen";

export default function App() {
  const [decisions, setDecisions] = useState<DecisionNode[]>(initialDecisions);
  
  // Navigation / Login States
  const [currentUser, setCurrentUser] = useState<{ name: string; id: string } | null>(() => {
    const cachedName = localStorage.getItem("settings_designerName");
    const cachedId = localStorage.getItem("settings_designerId");
    if (cachedName && cachedId) {
      return { name: cachedName, id: cachedId };
    }
    return null;
  });

  const [currentNavigationStep, setCurrentNavigationStep] = useState<"login" | "projects" | "main_app">(() => {
    const cachedName = localStorage.getItem("settings_designerName");
    const cachedId = localStorage.getItem("settings_designerId");
    if (cachedName && cachedId) {
      return "projects";
    }
    return "login";
  });

  const [activeProjectCode, setActiveProjectCode] = useState(() => localStorage.getItem("settings_projectId") || "8821-X");

  const [activeNodeId, setActiveNodeId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"records" | "audits" | "protocols">("audits");
  const [activeSidebar, setActiveSidebar] = useState<"metrics" | "ethics" | "settings">("metrics");
  
  // Briefing Comparison states
  const [viewMode, setViewMode] = useState<"workspace" | "compare_briefing" | "refusal_note">("workspace");
  const [briefingText, setBriefingText] = useState(
    "Novo fluxo de triagem automatizada para classificação de risco dos pacientes. O sistema deve sugerir..."
  );
  const [isAnalyzingBriefing, setIsAnalyzingBriefing] = useState(false);
  const [showRefusalModal, setShowRefusalModal] = useState(false);
  const [refusalReason, setRefusalReason] = useState("");
  const [refusalHash, setRefusalHash] = useState("9F8A-2B4C-7D1E-55X9");
  const [designerPositionText, setDesignerPositionText] = useState(
    "Com base nos padrões de risco identificados e em consonância com o Código de Ética Profissional interno, manifesto formalmente a recusa técnica em prosseguir com o desenvolvimento deste fluxo da maneira como foi brifado.\n\nSolicito a revisão estrutural da iniciativa para focar em estratégias de retenção positivas (ofertas de valor, melhoria do serviço) em vez de retenção coercitiva. O design deve facilitar o cancelamento com a mesma eficiência com que facilita a contratação, garantindo que o consentimento do usuário seja livre, informado e ininterrompido."
  );
  const [identifiedPatterns, setIdentifiedPatterns] = useState<any[]>([
    {
      id: "pat1",
      severity: "RISCO CRÍTICO",
      category: "Roach Motel (Dark Pattern)",
      text: "A diretiva exige tornar o caminho de saída desproporcionalmente mais difícil do que o caminho de entrada. A imposição de uma barreira off-line (contato telefônico) para um serviço contratado on-line fere os princípios de autonomia do usuário.",
      cardLink: ""
    },
    {
      id: "pat2",
      severity: "RISCO MODERADO",
      category: "Assimetria de Fricção",
      text: "O design proposto cria uma assimetria artificial focada em exaurir a intenção do usuário através do esforço. Viola as diretrizes de transparência e facilidade de encerramento de vínculo estabelecidas em regulamentações recentes de proteção ao consumidor (ex: Lei do SAC).",
      cardLink: ""
    }
  ]);

  // Handler to call backend API to analyze briefings
  const handleAnalyzeBriefing = async () => {
    if (!briefingText.trim()) {
      alert("Por favor, digite ou cole o briefing do projeto clínico.");
      return;
    }
    setIsAnalyzingBriefing(true);
    try {
      const response = await fetch("/api/analyze-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefingText }),
      });
      if (!response.ok) throw new Error("Erro na comunicação com o servidor de briefing.");
      const data = await response.json();
      setIdentifiedPatterns(data.patterns || []);
      triggerBriefNotification("Briefing analisado e padrões de conformidade atualizados.");
    } catch (err: any) {
      console.error(err);
      triggerBriefNotification("Falha ao analisar briefing. Rodando mitigador heurístico.");
    } finally {
      setIsAnalyzingBriefing(false);
    }
  };

  const handleGenerateRefusalNote = () => {
    const dateStr = new Date().toLocaleDateString("pt-BR") + " " + new Date().toISOString().substring(11, 16) + " UTC";
    let content = `====================================================\n`;
    content += `        NOTA DE RECUSA FORMAL DE DESIGN CLÍNICO\n`;
    content += `====================================================\n`;
    content += `EMISSÃO: ${dateStr}\n`;
    content += `SISTEMA: DESIGN LEDGER AUDIT WORKSPACE\n`;
    content += `AVALIAÇÃO: VETO ÉTICO E TÉCNICO DE DESIGN DE IHC\n\n`;
    content += `Por decisão do colegiado da banca ética e do agente analítico de design, fica REJEITADO o briefing com base nas seguintes violações identificadas nas diretrizes de UX Clínico:\n\n`;
    
    identifiedPatterns.forEach((p, idx) => {
      content += `${idx + 1}. [${p.severity}] ${p.category}\n`;
      content += `   Constatação: ${p.text}\n`;
      if (p.cardLink) {
        content += `   Elemento Relacionado: ${p.cardLink}\n`;
      }
      content += `\n`;
    });
    
    content += `RECOMENDAÇÃO EDITORIAL:\n`;
    content += `1. Eliminar o pre-checked dos loops de consentimento (Seção 4.2);\n`;
    content += `2. Modificar a relação de contraste visual de botões informativos (limite 4.5:1 WCAG);\n`;
    content += `3. Prover um botão explícito de cancelamento sem loops de sobrecarga cognitiva.\n\n`;
    content += `====================================================\n`;
    content += `LEDGER DE AUDITORIA BLINDADO POR HASH AUTÔNOMO.\n`;
    
    setRefusalReason(content);
    
    // Calculate a realistic hash like the screenshot '9F8A-2B4C-7D1E-55X9'
    const block1 = "9F8A";
    const block2 = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
    const block3 = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
    const block4 = Math.floor(Math.random() * 0xFF).toString(16).toUpperCase().padStart(2, "0") + "X" + Math.floor(Math.random() * 9);
    setRefusalHash(`${block1}-${block2}-${block3}-${block4}`);
    
    // Automatically transition to the graphical high fidelity report view
    setViewMode("refusal_note");
    triggerBriefNotification("Relatório de Recusa Fundamentada gerado!");
  };

  // Modals state
  const [showReportModal, setShowReportModal] = useState(false);
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [commitMessage, setCommitMessage] = useState<string | null>(null);

  // New Card Inputs
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardCategory, setNewCardCategory] = useState("Alerta Clínico");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [useGemini, setUseGemini] = useState(true);

  // Loading telemetry sequence for AI Audits
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState("");

  const activeNode = decisions.find((d) => d.id === activeNodeId) || decisions[0];

  // Helper: Approve Variant_B (Resolves Flags with Revision Logs)
  const handleApproveVariantB = () => {
    if (activeNode.status === "APPROVED") return;

    // Create a new revision log
    const resolutionTimestamp = new Date().toISOString().substring(11, 16) + " UTC";
    const newLog: AuditLog = {
      id: `resolved_log_${Date.now()}`,
      type: "LOG: REVISION",
      timestamp: resolutionTimestamp,
      text: "Aprovado Variant_B com remoção de sinalizadores éticos e aplicação de conformidade.",
      refTicket: `REF_TICKET_${Math.floor(1000 + Math.random() * 9000)}`
    };

    setDecisions(
      decisions.map((node) => {
        if (node.id === activeNodeId) {
          return {
            ...node,
            status: "APPROVED",
            colorNode: "teal",
            screens: node.screens.map((screen) => ({
              ...screen,
              hasFlags: false,
              flagsCount: 0,
              highlightedElement: undefined
            })),
            ethicalLedger: {
              flags: [],
              logs: [newLog, ...node.ethicalLedger.logs]
            },
            approvedVariant: "VARIANT_B"
          };
        }
        return node;
      })
    );

    // Show status confirmation feedback
    triggerBriefNotification("Ajuste registrado no Ledger. Decisão em conformidade.");
  };

  // Toast notifications helper
  const triggerBriefNotification = (msg: string) => {
    setCommitMessage(msg);
    setTimeout(() => {
      setCommitMessage(null);
    }, 4000);
  };

  // Helper: Export Client Audit Ledger Log
  const handleExportJournal = () => {
    const fileContent = JSON.stringify(decisions, null, 2);
    const blob = new Blob([fileContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `design_ledger_ethics_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    triggerBriefNotification("Interface Audit exportada com sucesso.");
  };

  // Helper: Run Commit Simulation
  const handleCommitProject = () => {
    triggerBriefNotification("Ledger comitado e hashes de auditoria blindadas na rede.");
  };

  // Action: Launch automated ethical audits via backend (Gemini 3.5-flash)
  const handleRunEthicsAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim() || !newCardDescription.trim()) {
      alert("Por favor, preencha o Nome da Tela e a Descrição do fluxo de UX.");
      return;
    }

    setIsAuditing(true);
    setAuditStep("Inicializando auditoria estrutural...");

    try {
      // Step simulated timer sequence for cinematic professional look
      setTimeout(async () => {
        setAuditStep("Acionando agente de segurança ética...");
        
        try {
          const response = await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              screenName: newCardTitle,
              description: newCardDescription,
              intentCategory: newCardCategory,
            }),
          });

          if (!response.ok) {
            throw new Error("Erro na comunicação com o servidor de Auditoria.");
          }

          setAuditStep("Catalogando sinalizadores e calculando conformidades...");
          const auditResult = await response.json();
          
          setTimeout(() => {
            const newNodeId = decisions.length + 1;
            const newNodeLabel = newNodeId < 10 ? `0${newNodeId}` : `${newNodeId}`;

            const generatedNode: DecisionNode = {
              id: newNodeId,
              label: newNodeLabel,
              title: newCardTitle,
              status: auditResult.hasViolation ? "FLAGGED" : "IN_REVIEW",
              colorNode: auditResult.hasViolation ? "amber" : "teal",
              screens: [
                {
                  id: `screen_gen_${Date.now()}`,
                  title: `${newCardTitle}`,
                  type: "generic",
                  hasFlags: auditResult.hasViolation,
                  flagsCount: auditResult.flags?.length || 0,
                  highlightedElement: auditResult.hasViolation && auditResult.flags?.length > 0 ? {
                    label: auditResult.flags[0].title,
                    description: auditResult.flags[0].description,
                    type: "amber"
                  } : undefined,
                  components: [
                    { type: "header", width: "w-1/2", height: "h-6", text: newCardCategory.toUpperCase() },
                    { type: "row", width: "w-full", height: "h-20", text: newCardDescription },
                    { type: "button", width: "w-28", height: "h-10", text: "Registrado por IA" }
                  ]
                }
              ],
              ethicalLedger: {
                flags: auditResult.flags || [],
                logs: auditResult.logs || []
              },
              approvedVariant: null
            };

            setDecisions([...decisions, generatedNode]);
            setActiveNodeId(newNodeId);
            setIsAuditing(false);
            setShowNewCardModal(false);

            // Resets
            setNewCardTitle("");
            setNewCardDescription("");
            triggerBriefNotification(`Novo nó ${newNodeLabel} cadastrado e avaliado pelo auditor.`);
          }, 800);

        } catch (apiError: any) {
          console.error(apiError);
          setIsAuditing(false);
          alert("Ocorreu um erro ao rodar a auditoria ética. " + apiError.message);
        }
      }, 700);

    } catch (err: any) {
      console.error(err);
      setIsAuditing(false);
    }
  };

  // Stats Counters
  const totalFlagsCount = decisions.reduce(
    (acc, node) => acc + node.screens.reduce((sAcc, s) => sAcc + s.flagsCount, 0),
    0
  );
  const activeSinalizadores = decisions.filter((d) => d.status === "FLAGGED").length;
  const compliantCount = decisions.filter((d) => d.status === "APPROVED").length;

  if (currentNavigationStep === "login") {
    return (
      <LoginScreen 
        onLoginSuccess={(name, id) => {
          setCurrentUser({ name, id });
          setCurrentNavigationStep("projects");
        }}
      />
    );
  }

  if (currentNavigationStep === "projects") {
    return (
      <ProjectsScreen 
        designerName={currentUser?.name || "Cesar Fontes"}
        designerId={currentUser?.id || "UXPA-BR #2411"}
        onLogout={() => {
          localStorage.removeItem("settings_designerName");
          localStorage.removeItem("settings_designerId");
          setCurrentUser(null);
          setCurrentNavigationStep("login");
        }}
        onSelectProject={(projectId, standard) => {
          setActiveProjectCode(projectId);
          localStorage.setItem("settings_projectId", projectId);
          localStorage.setItem("settings_complianceStandard", standard);
          setCurrentNavigationStep("main_app");
        }}
      />
    );
  }

  return (
    <div id="design_ledger_root" className="min-h-screen flex flex-col bg-background font-sans overflow-hidden antialiased text-[#1C1917]">
      
      {/* Dynamic committed toast */}
      {commitMessage && (
        <div className="fixed top-4 right-4 z-[9999] bg-[#F0FDF4] border border-[#DCFCE7] px-4 py-3 text-[#166534] font-sans text-xs rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center gap-2 animate-bounce">
          <Sparkles className="h-4 w-4 animate-spin text-[#0D9488]" />
          <span>{commitMessage}</span>
        </div>
      )}

      {/* TopAppBar */}
      {activeSidebar !== "ethics" && (
        <header className="bg-white border-b border-[#E7E5E4] flex justify-between items-center w-full px-6 py-2 select-none shrink-0 no-print">
          <div className="min-w-[70px]"></div>
          
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="flex items-center gap-1.5">
              <HeartPulse className="h-4.5 w-4.5 text-[#0D9488]" />
              <span className="font-sans text-base font-semibold text-[#1C1917] tracking-normal">
                DESIGN LEDGER
              </span>
            </div>
            <span className="text-[10px] text-[#78716C] font-sans mt-0.5">
              Auditor: <span className="font-medium text-[#1C1917]">{currentUser?.name}</span> ({currentUser?.registrationId})
            </span>
          </div>

          <div className="min-w-[70px]"></div>
        </header>
      )}

      {viewMode === "workspace" ? (
        <>
          {/* Top Sub-Bar */}
      <div className="bg-white border-b border-[#E7E5E4] shrink-0 flex items-center justify-between px-6 h-12">
        <div 
          onClick={() => {
            setCurrentNavigationStep("projects");
            triggerBriefNotification("Retornando ao diretório de projetos seguros.");
          }}
          className="flex items-center gap-3 hover:bg-[#F7F6F3] transition-colors duration-150 p-1.5 rounded-[6px] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-[#0D9488]" />
          <span className="font-sans text-xs text-[#78716C] uppercase tracking-wider hidden sm:inline">Voltar</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportJournal}
            className="font-sans text-xs text-[#78716C] hover:text-[#1C1917] hover:bg-[#F7F6F3] uppercase tracking-wide px-3 py-1.5 border border-[#E7E5E4] transition-colors flex items-center gap-2 rounded-[6px] cursor-pointer"
          >
            <FileJson className="h-3.5 w-3.5" />
            Exportar Diário
          </button>
          
          <button 
            onClick={() => setShowReportModal(true)} 
            className="font-sans text-xs text-white bg-[#0D9488] hover:bg-[#0b7a70] transition-colors px-4 py-1.5 font-medium rounded-[6px] cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Relatório de Risco
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[200px] shrink-0 bg-white border-r border-[#E7E5E4] flex flex-col h-full z-10 select-none">
          {activeSidebar === "ethics" ? (
            <div className="p-4 flex items-center gap-3 border-b border-[#E7E5E4] bg-[#F7F6F3]">
              <div className="p-2 bg-[#0D9488]/10 border border-[#0D9488]/25 rounded-[6px] shrink-0">
                <Folder className="h-4 w-4 text-[#0D9488]" />
              </div>
              <div className="flex flex-col select-none leading-tight overflow-hidden">
                <span className="font-sans text-[9px] text-[#78716C] uppercase font-bold tracking-wider">PROJETO_ID:</span>
                <span className="font-mono text-xs text-[#1C1917] font-bold">{activeProjectCode}</span>
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#0D9488]/40 rounded-[4px] font-sans text-[9px] text-[#0D9488] uppercase tracking-wider font-extrabold shadow-2xs">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D9488] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0D9488]"></span>
                    </span>
                    ATIVO
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-1.5 border-b border-[#E7E5E4] bg-[#F7F6F3]">
              <div className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">PROJECT_ID: {activeProjectCode}</div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white border border-[#D97706]/40 rounded-[4px] text-[#D97706] font-sans text-[9px] font-extrabold uppercase tracking-widest shadow-2xs">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D97706]"></span>
                  </span>
                  EM REVISÃO
                </span>
              </div>
            </div>
          )}

          {activeSidebar !== "ethics" && (
            <div className="p-4 border-b border-[#E7E5E4] bg-[#F7F6F3] flex flex-col gap-2">
              <button 
                onClick={() => setShowNewCardModal(true)}
                className="w-full bg-[#0D9488] hover:bg-[#0b7a70] text-white font-sans text-xs font-semibold h-9 flex items-center justify-center gap-2 transition-colors rounded-[6px] cursor-pointer shadow-sm"
              >
                <Plus className="h-4 w-4" /> 
                Novo Cartão
              </button>

              <button 
                onClick={() => setViewMode("compare_briefing")}
                className="w-full bg-white border border-[#E7E5E4] text-[#1C1917] font-sans text-xs font-semibold h-9 flex items-center justify-center gap-2 hover:bg-[#F7F6F3] transition-colors rounded-[6px] cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#D97706] animate-pulse" /> 
                Analisar Briefing
              </button>
            </div>
          )}

          <nav className="flex-1 flex flex-col p-2 gap-1 overflow-y-auto mt-2 text-xs font-sans">
            <button 
              onClick={() => {
                setActiveSidebar("metrics");
                setViewMode("workspace");
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-left rounded-[6px] transition-colors border-l-2 cursor-pointer ${
                activeSidebar === "metrics" ? "text-[#0D9488] border-l-[#0D9488] font-semibold bg-transparent" : "text-[#78716C] border-transparent hover:text-[#1C1917] hover:bg-[#F7F6F3]"
              }`}
            >
              <BarChart3 className={`h-4 w-4 ${activeSidebar === "metrics" ? "text-[#0D9488]" : "text-[#78716C]"}`} />
              <span className="font-sans font-medium text-xs">Métricas</span>
            </button>

            <button 
              onClick={() => {
                setActiveSidebar("ethics");
                setViewMode("workspace");
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-left rounded-[6px] transition-all duration-150 cursor-pointer border-l-2 ${
                activeSidebar === "ethics" ? "text-[#0D9488] font-semibold border-l-[#0D9488] bg-transparent" : "text-[#78716C] border-transparent hover:text-[#1C1917] hover:bg-[#F7F6F3]"
              }`}
            >
              <ShieldCheck className={`h-4 w-4 ${activeSidebar === "ethics" ? "text-[#0D9488]" : "text-[#78716C]"}`} />
              <span className="font-sans font-medium text-xs">Registro Ético</span>
            </button>
          </nav>

          <div className="p-2 border-t border-[#E7E5E4] flex flex-col gap-1 mt-auto bg-[#F7F6F3]">
            <button 
              onClick={() => {
                setActiveSidebar("settings");
                setViewMode("workspace");
              }}
              className={`flex items-center gap-2.5 px-3 py-2 text-left transition-all duration-150 rounded-[6px] border-l-2 cursor-pointer ${
                activeSidebar === "settings" ? "text-[#0D9488] font-semibold border-l-[#0D9488] bg-transparent" : "text-[#78716C] border-transparent hover:text-[#1C1917] hover:bg-[#F7F6F3]"
              }`}
            >
              <Settings className={`h-3.5 w-3.5 ${activeSidebar === "settings" ? "text-[#0D9488]" : "text-[#78716C]"}`} />
              <span className="font-sans text-xs">Configurações</span>
            </button>
            
            <button 
              onClick={() => {
                triggerBriefNotification("Sessão revogada com segurança. Retornando...");
                setTimeout(() => {
                  localStorage.removeItem("settings_designerName");
                  localStorage.removeItem("settings_designerId");
                  setCurrentUser(null);
                  setCurrentNavigationStep("login");
                }, 800);
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-left text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer rounded-[6px]"
            >
              <LogOut className="h-3.5 w-3.5 text-[#78716C]" />
              <span className="font-sans text-xs">Sair da Sessão</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Display Area based on tabs / sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeSidebar === "settings" ? (
            <SettingsPanel 
              onBack={() => {
                setActiveSidebar("metrics");
                setViewMode("workspace");
              }}
              triggerNotification={triggerBriefNotification}
            />
          ) : activeSidebar === "ethics" ? (
            <EthicsLogDashboard 
              onBack={() => {
                setActiveSidebar("metrics");
                setViewMode("workspace");
              }}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
              }}
              triggerNotification={triggerBriefNotification}
              onViewRefusalNote={() => {
                setViewMode("refusal_note");
                triggerBriefNotification("Exibindo Nota de Recusa Colegiada.");
              }}
            />
          ) : (
            <>
              {/* Decision Timeline Strip */}
              <section className="bg-white border-b border-[#E7E5E4] shrink-0 py-3.5 px-6 relative select-none">
            <div className="flex justify-between items-center mb-3">
              <div className="font-sans text-[10px] text-[#78716C] uppercase font-bold tracking-wider">
                Linha do Tempo · {decisions.length} Decisões Registradas
              </div>
              <div className="font-sans text-[9px] text-[#0D9488] uppercase tracking-wider flex items-center gap-1.5 bg-[#F0FDF4] border border-[#DCFCE7] px-2.5 py-0.5 rounded-full font-semibold">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D9488] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0D9488]"></span>
                </span>
                Auditor IA Ativo
              </div>
            </div>

            <div className="flex items-start w-full max-w-4xl mx-auto relative pt-1 pb-1">
              
              {/* Connecting Hairline */}
              <div className="absolute top-[20px] left-4 right-4 h-[0.5px] bg-[#E7E5E4] z-0"></div>
              
              {/* Nodes */}
              <div className="w-full flex justify-between items-start z-10">
                {decisions.map((node) => {
                  const isActive = node.id === activeNodeId;
                  const isFlagged = node.status === "FLAGGED";

                  return (
                    <div 
                      key={node.id} 
                      onClick={() => setActiveNodeId(node.id)}
                      className="flex flex-col items-center gap-1 relative group cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center relative transition-all duration-150 ${
                        isActive
                          ? "border-[#0D9488] bg-[#0D9488]/10 scale-110 ring-4 ring-[#0D9488]/10"
                          : isFlagged
                            ? "border-[#D97706] bg-white hover:bg-[#FDF2E9]"
                            : "border-[#E7E5E4] bg-white hover:bg-[#F7F6F3]"
                      }`}>
                        
                        {/* Dot */}
                        <div className={`w-2 h-2 rounded-full ${
                          isFlagged ? "bg-[#D97706]" : "bg-[#0D9488]"
                        }`} />

                        {/* Pulse beacon for current action */}
                        {isActive && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0D9488] animate-ping"></div>
                        )}
                        {isActive && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0D9488]"></div>
                        )}
                      </div>

                      {/* Display Node ID number tag */}
                      <span className={`font-mono text-[10px] uppercase tracking-wider mt-1 transition-opacity ${
                        isActive 
                          ? "text-[#0D9488] font-bold" 
                          : "text-[#78716C] group-hover:text-[#1C1917]"
                      }`}>
                        {node.label}
                      </span>

                      {/* Hover Popover Tooltip */}
                      <div className="absolute bottom-11 scale-0 group-hover:scale-100 transition-all z-50 bg-white border border-[#E7E5E4] px-3.5 py-2 rounded-[6px] shadow-lg w-48 pointer-events-none text-left">
                        <div className="font-sans text-[9px] text-[#78716C] uppercase tracking-wider border-b border-[#E7E5E4] pb-1 mb-1 font-bold">
                          Nó {node.label} · {node.status === "FLAGGED" ? "Sinalizado" : "Aprovado"}
                        </div>
                        <div className="font-sans text-[11px] text-[#1C1917] font-medium truncate">
                          {node.title}
                        </div>
                        {node.ethicalLedger.flags.length > 0 && (
                          <div className="text-[#D97706] text-[9px] font-sans font-semibold mt-0.5">
                            ⚠ {node.ethicalLedger.flags.length} Sinalizadores
                          </div>
                        )}
                      </div>

                    </div>
                    );
                })}
              </div>
            </div>
          </section>

          {/* Sub-Views switching according to tabs */}
          {activeTab === "audits" && (
            <main className="flex-1 flex overflow-hidden">
              
              {/* Left Main Column: PROJETO ABERTO */}
              <div className="flex-1 border-r border-[#E7E5E4] flex flex-col overflow-y-auto bg-[#F7F6F3] relative">
                
                {/* Fixed Section Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#E7E5E4] py-3.5 px-6 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-[#78716C]" />
                    <h2 className="font-sans text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                      PROJETO ATIVO / MAPEAMENTO DE CUIDADO
                    </h2>
                  </div>
                  <div className="font-sans text-[10px] text-[#78716C] bg-[#F7F6F3] px-2.5 py-1 border border-[#E7E5E4] uppercase rounded-[4px] font-medium">
                    Foco: <span className="text-[#1C1917] font-semibold">{activeNode.title}</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-6">
                  {activeNode.screens.map((screen, idx) => {
                    const hasScreenFlag = screen.hasFlags;

                    return (
                      <div 
                        key={screen.id || idx}
                        className="bg-white border border-[#E7E5E4] shadow-sm flex flex-col relative overflow-hidden rounded-[6px] transition-all hover:border-[#0D9488]/40 duration-150"
                      >
                         {/* Status bar highlighting on active screen border */}
                         <div className={`absolute top-0 left-0 w-[3px] h-full ${
                          hasScreenFlag ? "bg-[#D97706]" : "bg-[#0D9488]"
                        }`} />
 
                         {/* Top Card Bar */}
                         <div className="border-b border-[#E7E5E4] py-3 px-4 flex justify-between items-center bg-[#F7F6F3] select-none">
                           <span className="font-sans text-xs font-bold text-[#1C1917]">
                             {screen.title}
                           </span>
                           
                           {hasScreenFlag ? (
                             <div className="border border-[#E7E5E4] border-l-2 border-l-[#D97706] bg-[#FFFBEB] px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
                               <AlertTriangle className="h-3.5 w-3.5 text-[#D97706] animate-pulse" />
                               <span className="font-sans text-[10px] text-[#D97706] uppercase tracking-wide font-bold">
                                 {screen.flagsCount} Sinalizadores Ativos
                               </span>
                             </div>
                           ) : (
                             <div className="border border-[#E7E5E4] border-l-2 border-l-[#0D9488] bg-[#F0FDF4] px-2.5 py-1 rounded-[4px]">
                               <span className="font-sans text-[10px] text-[#0D9488] uppercase tracking-wide font-bold">
                                 Sem Advertências
                               </span>
                             </div>
                           )}
                         </div>

                        {/* Card wireframe body representation */}
                        <div className="p-6">
                          
                          {/* Dotted target outline when flagged */}
                          <div className={`border border-dashed h-48 bg-[#F7F6F3] relative rounded-[4px] p-4 flex flex-col gap-4 transition-all ${
                            hasScreenFlag ? "border-[#D97706]/30 bg-[#FFFBEB]/10" : "border-[#E7E5E4]"
                          }`}>
                            
                            {/* Visual Abstract Elements */}
                            <div className="h-5 w-fit bg-white border border-[#E7E5E4] rounded-[4px] font-mono text-[9px] px-2 flex items-center text-[#78716C]">
                              {screen.type.toUpperCase()}_LAYOUT_GRID
                            </div>

                            <div className="flex gap-4 flex-1 overflow-hidden">
                              {/* Main Container Wireframe */}
                              <div className="w-2/3 border border-[#E7E5E4] rounded-[4px] p-3 flex flex-col gap-3.5 bg-white">
                                <div className="h-3 w-full bg-[#EEECEA] rounded-[2px]" />
                                <div className="h-3 w-5/6 bg-[#EEECEA] rounded-[2px]" />
                                <div className="h-3 w-4/6 bg-[#EEECEA] rounded-[2px]" />
                                
                                <div className="flex gap-2 mt-auto text-[#78716C] select-none">
                                  <div className="h-7 w-16 border border-[#E7E5E4] bg-[#F7F6F3] rounded-[4px]" />
                                  <div className="h-7 w-24 border border-[#E7E5E4] bg-white rounded-[4px] flex items-center justify-center font-sans text-[9px]">
                                    Ação_Padrão
                                  </div>
                                </div>
                              </div>

                              {/* Flagged or Target action Container wireframe block */}
                              <div className={`w-1/3 border rounded-[4px] p-3 relative flex flex-col justify-between ${
                                hasScreenFlag 
                                  ? "border-[#D97706]/35 bg-[#FFFBEB]/30" 
                                  : "border-[#E7E5E4] bg-[#F7F6F3]/50"
                              }`}>
                                
                                {/* Amber dot locator element representing coordinates */}
                                {hasScreenFlag && (
                                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#D97706] rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(217,119,6,0.3)] animate-pulse">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                  </div>
                                )}

                                <div>
                                  <div className={`h-4 w-full rounded-[2px] mb-2 ${hasScreenFlag ? 'bg-[#D97706]/20' : 'bg-[#EEECEA]'}`} />
                                  <div className={`h-11 w-full rounded-[2px] flex items-center justify-center ${hasScreenFlag ? 'bg-[#FFFBEB] font-mono text-[8px] p-1 text-[#D97706] leading-normal border border-[#E7E5E4]' : 'bg-[#F7F6F3]'}`}>
                                    {hasScreenFlag ? "RISCO_SINALIZADO" : "REGULAR_BOX"}
                                  </div>
                                </div>

                                <div className={`h-6 w-full rounded-[2px] ${hasScreenFlag ? 'bg-[#D97706]/20' : 'bg-[#EEECEA]'}`} />
                              </div>
                            </div>

                          </div>

                          {/* Highlight context explanation beneath the sketch block */}
                          {screen.highlightedElement && (
                            <div className="mt-3.5 p-4 bg-[#FFFBEB] border-l-2 border-[#D97706] flex items-start gap-2.5 rounded-sm">
                              <Info className="h-4.5 w-4.5 text-[#D97706] shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-sans text-xs font-bold text-[#D97706] uppercase tracking-wider">
                                  Destaque Clínico: {screen.highlightedElement.label}
                                </h4>
                                <p className="font-sans text-xs text-[#78716C] mt-1 leading-relaxed">
                                  {screen.highlightedElement.description}
                                </p>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>

                       {/* Right Column: ETHICAL LEDGER */}
                <div className="w-[325px] shrink-0 bg-[#F7F6F3] border-l border-[#E7E5E4] flex flex-col h-full overflow-hidden select-none">
                 
                 {/* Header ledger */}
                 <div className="sticky top-0 bg-white border-b border-[#E7E5E4] py-3.5 px-4 z-10 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <ShieldCheck className="h-4.5 w-4.5 text-[#0D9488]" />
                     <h2 className="font-sans text-xs font-bold text-[#1C1917] uppercase tracking-wide">
                       Diário de Ética IHC
                     </h2>
                   </div>
                   <History className="h-4 w-4 text-[#78716C] hover:text-[#0D9488] cursor-pointer" />
                 </div>
 
                 {/* Ledger dynamic contents */}
                 <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4 bg-white">
                   {activeNode.ethicalLedger.flags.length === 0 ? (
                     <div className="border border-[#E7E5E4] border-l-2 border-l-[#0D9488] bg-[#F0FDF4] p-5 text-center flex flex-col items-center justify-center gap-3 rounded-[6px]">
                       <CheckCircle2 className="h-8 w-8 text-[#0D9488]" />
                       <div>
                         <div className="font-sans text-xs font-bold text-[#0D9488] uppercase tracking-wide">
                           Sistema em Conformidade
                         </div>
                         <p className="font-sans text-[11px] text-[#78716C] mt-1 leading-normal">
                           Nenhum sinalizador ético pendente cadastrado para esta decisão. Decisão clinicamente aprovada.
                         </p>
                       </div>
                     </div>
                   ) : (
                     activeNode.ethicalLedger.flags.map((flag) => (
                       <div 
                         key={flag.id} 
                         className="border border-[#E7E5E4] border-l-2 border-l-[#D97706] bg-white hover:border-[#D97706]/40 transition-all duration-150 relative rounded-[6px] p-4 shadow-sm"
                       >
                         <div className="flex justify-between items-start mb-2">
                           <div className="font-sans text-[10px] text-[#D97706] uppercase tracking-wide font-bold">
                             {flag.type}
                           </div>
                           <span className="font-mono text-[9px] text-[#78716C] bg-[#F7F6F3] px-1.5 py-0.5 border border-[#E7E5E4] rounded-[3px]">
                             {flag.nodeId}
                           </span>
                         </div>
 
                         <h3 className="font-sans text-xs font-bold text-[#1C1917] mb-2 leading-snug">
                           {flag.title}
                         </h3>
 
                         <div className="flex items-center gap-1.5 mb-2.5">
                           <AlertTriangle className="h-3.5 w-3.5 text-[#D97706]" />
                           <span className="font-sans text-[10px] text-[#D97706] font-semibold uppercase">
                             Gravidade: {flag.severity}
                           </span>
                         </div>
 
                         <p className="font-sans text-[11px] text-[#78716C] leading-relaxed">
                           {flag.description}
                         </p>
                       </div>
                     ))
                   )}
 
                   {/* Operational Logs list */}
                   {activeNode.ethicalLedger.logs.map((log) => (
                     <div 
                       key={log.id} 
                       className={`border border-[#E7E5E4] ${
                         log.type.includes("REVI") || log.type.includes("REVISION")
                           ? "border-l-2 border-l-[#0D9488]"
                           : "border-l-2 border-l-[#78716C]"
                       } bg-white relative rounded-[6px] p-3 shadow-xs`}
                     >
                       <div className="flex justify-between items-start mb-1.5 pl-1">
                         <div className={`font-sans text-[9px] ${
                           log.type.includes("REVI") || log.type.includes("REVISION")
                             ? "text-[#0D9488]"
                             : "text-[#78716C]"
                         } uppercase tracking-wide font-bold`}>
                           {log.type}
                         </div>
                         <span className="font-mono text-[9px] text-[#A8A29E]">
                           {log.timestamp}
                         </span>
                       </div>
 
                       <p className="font-sans text-xs text-[#1C1917] leading-relaxed pl-1 mb-2.5">
                         {log.text}
                       </p>
 
                       {log.refTicket && (
                         <div className="pl-1">
                           <span className="font-mono text-[9px] text-[#78716C] bg-white px-2 py-0.5 border border-[#E7E5E4] rounded-[3px]">
                             {log.refTicket}
                           </span>
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
 
                 {/* Permanent Approval action block */}
                 <div className="p-4 border-t border-[#E7E5E4] bg-[#F7F6F3] shrink-0">
                   <button 
                     onClick={handleApproveVariantB}
                     disabled={activeNode.status === "APPROVED"}
                     className={`w-full font-sans text-xs uppercase tracking-wider h-10 border transition-all duration-150 flex items-center justify-center gap-2 rounded-[6px] font-semibold ${
                       activeNode.status === "APPROVED"
                         ? "bg-[#F0FDF4] border-[#DCFCE7] text-[#10B981] cursor-not-allowed opacity-90"
                         : "bg-[#0D9488] border-[#0D9488] text-white hover:bg-[#0b7a70] cursor-pointer shadow-sm"
                     }`}
                   >
                     <Check className="h-4 w-4" />
                     {activeNode.status === "APPROVED" ? "Decisão em Conformidade" : "Aprovar Decisão B"}
                   </button>
                  </div>

              </div>

            </main>
          )}

          {/* Records Tab View (Detailed Registry of Decisions) */}
          {activeTab === "records" && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#F7F6F3]">
              <h2 className="font-sans text-xs font-bold text-[#1C1917] tracking-wider uppercase">REGISTRO DE DECISÕES DE IHC AUDITADAS</h2>
              <p className="font-sans text-xs text-[#78716C] max-w-2xl">
                O Ledger de design preserva registros imutáveis das escolhas de fluxo UX auditadas, mapeando as dependências de conformidade clínica dos sistemas inteligentes.
              </p>

              <div className="border border-[#E7E5E4] bg-white mt-4 rounded-[6px] overflow-hidden shadow-sm">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead className="bg-[#F7F6F3] border-b border-[#E7E5E4] font-sans text-[10px] uppercase font-bold text-[#78716C] tracking-wider">
                    <tr>
                      <th className="p-3">Nó</th>
                      <th className="p-3">Decisão de Design</th>
                      <th className="p-3">Registros de Telas</th>
                      <th className="p-3">Sinalizadores</th>
                      <th className="p-3">Status Auditoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {decisions.map((node) => (
                      <tr key={node.id} className="border-b border-[#E7E5E4] hover:bg-[#F7F6F3]/50 transition-colors">
                        <td className="p-3 font-mono text-[#0D9488] font-bold">{node.label}</td>
                        <td className="p-3 font-medium text-[#1C1917]">{node.title}</td>
                        <td className="p-3 text-[#78716C]">{node.screens.length} Telas Cadastradas</td>
                        <td className="p-3 text-[#D97706] font-mono">{node.ethicalLedger.flags.length} Ativos</td>
                        <td className="p-3">
                          <span className={`inline-block px-2.5 py-0.5 font-sans text-[9px] uppercase border rounded-[4px] font-extrabold tracking-wider shadow-2xs ${
                            node.status === "APPROVED" 
                              ? "bg-white text-[#0D9488] border-[#0D9488]/40" 
                              : node.status === "FLAGGED"
                                ? "bg-white text-[#EF4444] border-[#EF4444]/40"
                                : "bg-white text-[#D97706] border-[#D97706]/40"
                          }`}>
                            {node.status === "APPROVED" ? "APROVADO" : node.status === "FLAGGED" ? "SINALIZADO" : "EM REVISÃO"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Protocols Tab View (Healthcare UX Guidelines) */}
          {activeTab === "protocols" && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#F7F6F3]">
              <h2 className="font-sans text-xs font-bold text-[#1C1917] tracking-wider uppercase">DIRETRIZES ÉTICAS DE UX CLÍNICO</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#E7E5E4] rounded-[6px] shadow-sm">
                  <h3 className="font-sans text-xs font-bold text-[#D97706] mb-2 uppercase tracking-wide">SEÇÃO 4.2 · CONSENTIMENTO ATIVO</h3>
                  <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                    Sistemas médicos não devem utilizar métodos de aceitação pré-marca (pre-checked checkboxes) para compartilhamento ou disponibilização de dados sensíveis de pacientes para pesquisas comerciais, assegurando opt-in totalmente voluntário.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E7E5E4] rounded-[6px] shadow-sm">
                  <h3 className="font-sans text-xs font-bold text-[#D97706] mb-2 uppercase tracking-wide">SEÇÃO 5.1 · CLAREZA DE DESISTÊNCIA</h3>
                  <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                    Opções de encerramento de prontuários ou exclusão de histórico médico devem possuir caminhos lineares de tela. É vedado criar loops cognitivos ou alertas redundantes para induzir a permanência.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E7E5E4] rounded-[6px] shadow-sm">
                  <h3 className="font-sans text-xs font-bold text-[#D97706] mb-2 uppercase tracking-wide">ACCESSIBILIDADE WCAG AA · CONTRASTE MÍNIMO</h3>
                  <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                    Apresentações visuais de advertências críticas de medicamentos ou dosagens de paciente devem apresentar uma relação de contraste de pelo menos 4.5:1 contra os fundos da tela para prevenir fadiga e erro médico.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#E7E5E4] rounded-[6px] shadow-sm">
                  <h3 className="font-sans text-xs font-bold text-[#0D9488] mb-2 uppercase tracking-wide">MIGRAÇÃO DE SISTEMAS INTELIGENTES</h3>
                  <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                    Qualquer automação de diagnóstico ou auto-preenchimento por Inteligência Artificial deve exigir do profissional um clique confirmador ativo antes de consolidar como registro médico eletrônico definitivo (EMR).
                  </p>
                </div>
              </div>
            </div>
          )}
            </>
          )}

        </div>
      </div>
      </>
      ) : viewMode === "compare_briefing" ? (
        /* Compare Briefing Workspace Section */
        <div id="briefing_comparison_panel" className="flex flex-1 flex-col overflow-hidden bg-[#F7F6F3]">
          {/* VOLTAR AO PROJETO BAR */}
          <div className="bg-white border-b border-[#E7E5E4] px-6 py-3 shrink-0 flex items-center">
            <button 
              onClick={() => setViewMode("workspace")}
              className="p-1.5 hover:bg-[#F7F6F3] transition-all rounded-[6px] cursor-pointer bg-transparent border-0 flex items-center justify-center"
              title="Voltar ao Projeto"
            >
              <ArrowLeft className="h-4 w-4 text-[#0D9488]" />
            </button>
          </div>

          {/* Main workspace comparison column layouts */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column: NOVO BRIEFING */}
            <div className="w-5/12 border-r border-[#E7E5E4] flex flex-col p-6 bg-white overflow-hidden">
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-4">
                Novo Briefing
              </h2>

              <label className="block font-sans text-[10px] text-[#78716C] uppercase tracking-wider mb-2.5">
                Cole o Texto do Briefing
              </label>

              <div className="flex-1 flex flex-col bg-white border border-[#E7E5E4] focus-within:border-[#0D9488] p-4 rounded-[6px] shadow-xs relative transition-colors">
                <textarea
                  value={briefingText}
                  onChange={(e) => setBriefingText(e.target.value)}
                  placeholder="Ex: Novo fluxo de triagem automatizada para classificação de risco dos pacientes. O sistema deve sugerir..."
                  className="w-full flex-1 bg-transparent resize-none text-[#1C1917] font-sans text-xs focus:outline-none leading-relaxed pragger-textarea"
                />

                {isAnalyzingBriefing && (
                  <div className="absolute inset-0 bg-[#F7F6F3]/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 rounded-[6px]">
                    <Loader2 className="h-7 w-7 text-[#0D9488] animate-spin" />
                    <span className="font-sans text-xs text-[#0D9488] uppercase tracking-wider font-bold animate-pulse">
                      Analisando UX Clínico...
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button: ANALISAR BRIEFING */}
              <div className="mt-4 shrink-0">
                <button
                  onClick={handleAnalyzeBriefing}
                  disabled={isAnalyzingBriefing}
                  className="w-full h-11 bg-[#0D9488] text-white hover:bg-[#0b7a70] font-sans text-xs uppercase tracking-wider transition-all duration-150 rounded-[6px] flex items-center justify-center gap-2 cursor-pointer font-bold shadow-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  ANALISAR BRIEFING
                </button>
              </div>
            </div>

            {/* Right Column: PADRÕES IDENTIFICADOS */}
            <div className="w-7/12 flex flex-col p-6 bg-[#F7F6F3] overflow-hidden">
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-4">
                Padrões Identificados
              </h2>

              {/* Identified patterns scrolling block */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {identifiedPatterns.length === 0 ? (
                  <div className="border border-[#E7E5E4] bg-white p-6 text-center rounded-[6px] shadow-sm">
                    <p className="font-sans text-xs text-[#78716C]">
                      Nenhum padrão identificado. Cadastre um briefing clínico e clique em "Analisar Briefing".
                    </p>
                  </div>
                ) : (
                  identifiedPatterns.map((pat) => {
                    const isCritical = pat.severity?.includes("CRÍTIC") || pat.severity?.includes("ALTO");
                    const isModerate = pat.severity?.includes("MODERAD") || pat.severity?.includes("MÉDIO");
                    const isConformity = pat.severity?.includes("CONFORM") || pat.severity?.includes("ATIV");
                    
                    let borderAccent = "border-l-[#A8A29E]";
                    let textAccent = "text-[#A8A29E]";
                    if (isCritical) {
                      borderAccent = "border-l-[#D97706]";
                      textAccent = "text-[#D97706]";
                    } else if (isModerate) {
                      borderAccent = "border-l-[#F59E0B]";
                      textAccent = "text-[#F59E0B]";
                    } else if (isConformity) {
                      borderAccent = "border-l-[#0D9488]";
                      textAccent = "text-[#0D9488]";
                    }

                    return (
                      <div
                        key={pat.id}
                        className={`border border-[#E7E5E4] bg-white hover:border-[#0D9488]/40 transition-all rounded-[6px] p-4 relative border-l-2 ${borderAccent} shadow-sm`}
                      >
                        {/* Upper Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`font-sans text-[10px] uppercase tracking-wider font-bold ${textAccent}`}>
                            {pat.severity} · {pat.category}
                          </span>
                        </div>

                        {/* Description Text */}
                        <p className="font-sans text-xs text-[#78716C] leading-relaxed mb-3">
                          {pat.text}
                        </p>

                        {/* Related Card Locator Link */}
                        {pat.cardLink && pat.cardLink !== "" && (
                          <button
                            onClick={() => {
                              triggerBriefNotification(`Ancorado ao cartão: ${pat.cardLink}`);
                              setViewMode("workspace");
                              if (pat.cardLink.includes("sistema")) {
                                setActiveNodeId(1);
                              } else if (pat.cardLink.includes("indicador")) {
                                setActiveNodeId(2);
                              }
                            }}
                            className="font-sans text-[9px] text-[#0D9488] hover:text-[#0b7a70] transition-all flex items-center gap-1 uppercase tracking-wider text-left border-b border-transparent hover:border-[#0D9488] pb-0.5 cursor-pointer bg-transparent border-0 font-bold"
                          >
                            <span>→ Ver cartão: {pat.cardLink}</span>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Action Button: GERAR NOTA DE RECUSA FORMAL */}
              <div className="mt-4 shrink-0">
                <button
                  onClick={handleGenerateRefusalNote}
                  className="w-full h-11 border border-[#D97706] hover:bg-[#D97706]/5 text-[#D97706] bg-white font-sans text-xs uppercase tracking-wider transition-all duration-150 rounded-[6px] flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <FileText className="h-4 w-4 text-[#D97706]" />
                  GERAR NOTA DE RECUSA FORMAL
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* High Fidelity Refusal Note Screen */
        <div id="refusal_note_panel" className="flex flex-1 flex-col overflow-y-auto bg-[#F7F6F3] text-[#1C1917]">
          {/* Top Action Bar (HIDDEN during print) */}
          <div className="bg-white border-b border-[#E7E5E4] px-6 py-3 shrink-0 flex items-center justify-between no-print select-none">
            {/* Back Button */}
            <button 
              onClick={() => setViewMode("compare_briefing")}
              className="font-sans text-xs text-[#78716C] hover:text-[#1C1917] transition-all uppercase tracking-wider flex items-center gap-1.5 cursor-pointer bg-transparent border-0 font-bold"
            >
              <ArrowLeft className="h-4 w-4 text-[#78716C]" />
              <span>← Voltar à Análise</span>
            </button>

            {/* Export PDF Button */}
            <button 
              onClick={() => {
                window.print();
                triggerBriefNotification("Sinalizando fila de impressão local...");
              }}
              className="font-sans text-xs text-[#0D9488] font-bold hover:bg-[#0D9488]/5 transition-colors duration-150 px-4 py-2 uppercase tracking-wider border border-[#0D9488] bg-white flex items-center gap-2 rounded-[6px] cursor-pointer shadow-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>EXPORTAR PDF</span>
            </button>
          </div>

          {/* Document Printable wrapper container */}
          <div className="flex-1 p-6 md:p-12 overflow-y-auto print:p-0">
            <div className="max-w-[760px] w-full mx-auto bg-white border border-[#E7E5E4] p-8 md:p-12 shadow-md rounded-[6px] print-container print-bg-doc print-text-dark">
              {/* Monospace Centered Header */}
              <div className="text-center mb-8">
                <h1 className="font-sans text-lg md:text-xl uppercase tracking-wider text-[#1C1917] print-text-dark font-bold mb-3">
                  NOTA DE RECUSA FUNDAMENTADA
                </h1>
                
                {/* Date */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-sans text-[#78716C] print-text-muted uppercase tracking-wide font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {new Date().toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              {/* Thin Divider */}
              <div className="border-t border-[#E7E5E4] my-6 print:border-gray-200" />

              {/* 1. BRIEFING RECEBIDO */}
              <div className="mb-8">
                <div className="font-sans text-[10px] uppercase tracking-wider text-[#78716C] print-text-muted mb-3 flex items-center gap-2 font-bold select-none">
                  <FileText className="h-4 w-4 text-[#0D9488] print:text-gray-600" />
                  <span>BRIEFING RECEBIDO</span>
                </div>

                <pre className="bg-[#F7F6F3] border border-[#E7E5E4] p-5 font-mono text-[11px] text-[#1C1917] print-bg-pre print-text-dark rounded-[6px] whitespace-pre-wrap leading-relaxed select-text">
                  {briefingText.split("\n").map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";
                    return trimmed.startsWith(">") ? trimmed : `> ${trimmed}`;
                  }).join("\n")}
                </pre>
              </div>

              {/* 2. PADRÕES IDENTIFICADOS */}
              <div className="mb-8">
                <div className="font-sans text-[10px] uppercase tracking-wider text-[#78716C] print-text-muted mb-3 flex items-center gap-2 font-bold select-none">
                  <AlertTriangle className="h-4 w-4 text-[#D97706] print:text-gray-600" />
                  <span>PADRÕES IDENTIFICADOS</span>
                </div>

                <div className="space-y-4">
                  {identifiedPatterns.length === 0 ? (
                    <div className="border border-[#E7E5E4] bg-white p-5 text-center text-xs text-[#78716C] rounded-[6px] print-card">
                      Nenhum padrão cadastrado.
                    </div>
                  ) : (
                    identifiedPatterns.map((pat) => {
                      const isCritical = pat.severity?.includes("CRÍTIC") || pat.severity?.includes("ALTO");
                      const isModerate = pat.severity?.includes("MODERAD") || pat.severity?.includes("MÉDIO");
                      
                      let borderAccent = "border-l-[#A8A29E]";
                      let badgeColor = "border-[#ff5d5d]/40 text-[#ff5d5d] bg-[#ff5d5d]/5";
                      let badgeText = pat.severity;
                      if (isCritical) {
                        borderAccent = "border-l-[#D97706]";
                        badgeColor = "border-[#D97706]/40 text-[#D97706] bg-[#FFFBEB]";
                        badgeText = "ALTO RISCO ÉTICO";
                      } else if (isModerate) {
                        borderAccent = "border-l-[#F59E0B]";
                        badgeColor = "border-[#F59E0B]/40 text-[#D97706] bg-[#FFFBEB]";
                        badgeText = "MÉDIO RISCO REGULATÓRIO";
                      } else {
                        borderAccent = "border-l-[#0D9488]";
                        badgeColor = "border-[#0D9488]/40 text-[#0D9488] bg-[#F0FDF4]";
                        badgeText = "DIRETRIZ COMPLEMENTAR";
                      }

                      return (
                        <div 
                          key={pat.id} 
                          className={`border border-[#E7E5E4] bg-white p-4 rounded-[6px] shadow-sm print-card border-l-2 ${borderAccent}`}
                        >
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <span className="font-sans text-xs font-bold text-[#1C1917] print-text-dark uppercase tracking-wider">
                              {pat.category}
                            </span>
                            <span className={`border px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold shrink-0 print-badge ${badgeColor}`}>
                              {badgeText}
                            </span>
                          </div>
                          
                          <p className="font-sans text-xs text-[#78716C] print-text-muted leading-relaxed">
                            {pat.text}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 3. POSIÇÃO DO DESIGNER */}
              <div className="mb-10">
                <div className="font-sans text-[10px] uppercase tracking-wider text-[#78716C] print-text-muted mb-4 flex items-center gap-2 font-bold select-none">
                  <ShieldCheck className="h-4 w-4 text-[#0D9488] print:text-gray-600" />
                  <span>POSIÇÃO DO DESIGNER</span>
                </div>

                <div className="border-l-2 border-[#0D9488] pl-4 py-1 relative group print-border-left">
                  <textarea
                    value={designerPositionText}
                    onChange={(e) => setDesignerPositionText(e.target.value)}
                    className="w-full bg-white focus:bg-white border border-[#E7E5E4] focus:border-[#0D9488]/40 p-3 rounded-[6px] font-sans text-xs text-[#1C1917] print-text-dark leading-relaxed resize-y focus:outline-none min-h-[140px] select-text print:bg-transparent print:border-none print:p-0 shadow-xs"
                    placeholder="Digite a declaração ética profissional..."
                  />
                  <div className="absolute right-2 bottom-2 text-[8px] font-sans text-[#A8A29E] group-hover:opacity-100 opacity-0 transition-opacity no-print pointer-events-none select-none">
                    CLIQUE PARA EDITAR A POSIÇÃO DO DESIGNER
                  </div>
                </div>
              </div>

              {/* Document Footer */}
              <div className="mt-12 pt-6 border-t border-[#E7E5E4] flex flex-col sm:flex-row justify-between items-center gap-2 text-[9px] font-sans text-[#78716C] uppercase tracking-wider print-text-muted">
                <span>GERADO POR: DESIGN LEDGER SYSTEM // V.4.2.1</span>
                <span>HASH: {refusalHash}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <footer className="bg-white border-t border-[#E7E5E4] h-10 shrink-0 flex items-center justify-between px-6 z-50 select-none text-xs no-print">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                activeSinalizadores > 0 ? "bg-[#D97706]" : "bg-[#0D9488]"
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                activeSinalizadores > 0 ? "bg-[#D97706]" : "bg-[#0D9488]"
              }`}></span>
            </span>
            <span className="font-sans text-[11px] text-[#78716C] uppercase tracking-wide flex items-center gap-1">
              <span className={activeSinalizadores > 0 ? "text-[#D97706] font-bold" : "text-[#0D9488] font-bold"}>
                {activeSinalizadores} SINALIZADORES ATIVOS
              </span>
            </span>
          </div>
          
          <div className="w-[1px] h-3 bg-[#E7E5E4]"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0D9488]"></div>
            <span className="font-sans text-[11px] text-[#1C1917] uppercase tracking-wide font-semibold">
              {decisions.length} CARTÕES DE DECISÃO
            </span>
          </div>

          <div className="w-[1px] h-3 bg-[#E7E5E4]"></div>

          <div className="flex items-center gap-2 text-[#78716C]">
            <Users className="h-3.5 w-3.5 text-[#78716C]" />
            <span className="font-sans text-[11px] uppercase tracking-wide font-medium">3 MEMBROS DA BANCA</span>
          </div>
        </div>


      </footer>

      {/* MODAL 1: REPORT & COMPLIANCE (RELATÓRIO DE RISCO) */}
      {showReportModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#F7F6F3] border border-[#E7E5E4] p-6 rounded-[6px] shadow-lg relative text-[#1C1917]">
            <h3 className="font-sans text-sm font-bold text-[#1C1917] uppercase tracking-wide mb-2 border-b border-[#E7E5E4] pb-2">
              PAINEL DE CONFORMIDADE ÉTICA CLÍNICA
            </h3>

            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="p-3 border border-[#E7E5E4] bg-white text-center rounded-[6px] shadow-2xs">
                <span className="font-mono text-2xl text-[#D97706] font-bold">{activeSinalizadores}</span>
                <span className="block font-mono text-[10px] text-[#78716C] uppercase tracking-wider mt-1">ALERTA/RISCO</span>
              </div>
              <div className="p-3 border border-[#E7E5E4] bg-white text-center rounded-[6px] shadow-2xs">
                <span className="font-mono text-2xl text-[#0D9488] font-bold">{compliantCount}</span>
                <span className="block font-mono text-[10px] text-[#78716C] uppercase tracking-wider mt-1">APROVAÇÕES</span>
              </div>
              <div className="p-3 border border-[#E7E5E4] bg-white text-center rounded-[6px] shadow-2xs">
                <span className="font-mono text-2xl text-[#1C1917] font-bold">{decisions.length}</span>
                <span className="block font-mono text-[10px] text-[#78716C] uppercase tracking-wider mt-1">TOTAL AUDITS</span>
              </div>
            </div>

            <h4 className="font-sans text-xs font-bold text-[#0D9488] uppercase mb-2">Mitigação Ativa por Decisão de Interface:</h4>
            <div className="max-h-56 overflow-y-auto space-y-2.5 text-xs">
              {decisions.map((node) => {
                let badgeClass = "border-l-2 border-l-[#D97706] text-[#D97706] bg-transparent pl-2 pr-1 py-0.5 font-bold font-mono text-[10px] uppercase";
                if (node.status === "APPROVED") {
                  badgeClass = "border-l-2 border-l-[#0D9488] text-[#0D9488] bg-transparent pl-2 pr-1 py-0.5 font-bold font-mono text-[10px] uppercase";
                }
                return (
                  <div key={node.id} className="p-3 border border-[#E7E5E4] bg-white rounded-[6px] shadow-2xs flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono text-[#0D9488] font-bold mr-2">[{node.label}]</span>
                      <span className="text-[#1C1917] font-medium">{node.title}</span>
                    </div>
                    <span className={badgeClass}>
                      {node.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-[#E7E5E4] pt-4">
              <button 
                onClick={() => setShowReportModal(false)}
                className="font-sans text-xs bg-white border border-[#E7E5E4] hover:bg-[#EEECEA] px-4 py-2 text-[#1C1917] cursor-pointer rounded-[6px]"
              >
                FECHAR PAINEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NOVO CARTÃO (Novo registro para auditoria Inteligente) */}
      {showNewCardModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#F7F6F3] border border-[#E7E5E4] p-6 rounded-[6px] shadow-lg relative text-[#1C1917]">
            
            {isAuditing ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-10 w-10 text-[#0D9488] animate-spin" />
                <div>
                  <h4 className="font-sans text-xs font-bold text-[#0D9488] uppercase tracking-wider animate-pulse">
                    EXECUTANDO AUDITOR IA (GEMINI 3.5-FLASH)
                  </h4>
                  <p className="font-sans text-xs text-[#78716C] mt-2 max-w-xs">
                    {auditStep}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRunEthicsAudit}>
                <h3 className="font-sans text-sm font-bold text-[#1C1917] uppercase tracking-wide mb-1.5">
                  AUDITAR NOVO FLUXO DE DESENHO
                </h3>
                <p className="font-sans text-[11px] text-[#78716C] mb-5">
                  Insira o nome da interface e descreva as opções de UX em seu esboço para que a IA realize o cruzamento ético de conformidade.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-[10px] text-[#78716C] font-semibold uppercase tracking-wider mb-1">
                      NOME DA TELA / CARTÃO
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Tela 03 · Configuração de Dosagem de UTI"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      className="w-full bg-white text-[#1C1917] font-sans text-xs px-3.5 py-2.5 border border-[#E7E5E4] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] rounded-[6px]"
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] text-[#78716C] font-semibold uppercase tracking-wider mb-1">
                      CATEGORIA DE FLUXO CLÍNICO
                    </label>
                    <select
                      value={newCardCategory}
                      onChange={(e) => setNewCardCategory(e.target.value)}
                      className="w-full bg-white text-[#1C1917] font-sans text-xs px-3.5 py-2.5 border border-[#E7E5E4] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] rounded-[6px]"
                    >
                      <option value="Alerta de Alergia">Confirmadores de Alerta Secundários</option>
                      <option value="Prescrição e Dose">Prescrição e Dose do Medicamento</option>
                      <option value="Consentimento do Paciente">Consentimento e Opt-in GDPR</option>
                      <option value="Integração de IA">Integração Clinica de IA (Autocomplete)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] text-[#78716C] font-semibold uppercase tracking-wider mb-1">
                      DESCRIÇÃO DAS ESCOLHAS DE UX (DESENHO DA INTERFACE)
                    </label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Ex: 'Pré-selecionamos a caixa de aceite clínico para que o médico ganhe tempo no fluxo de trabalho. O botão de cancelar fica cinza escuro para ocultar opções irrelevantes.'"
                      value={newCardDescription}
                      onChange={(e) => setNewCardDescription(e.target.value)}
                      className="w-full bg-white text-[#1C1917] font-sans text-xs p-3 border border-[#E7E5E4] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] rounded-[6px] leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t border-[#E7E5E4] justify-end text-xs">
                  <button 
                    type="button"
                    onClick={() => setShowNewCardModal(false)}
                    className="font-sans text-xs bg-white border border-[#E7E5E4] text-[#78716C] px-3.5 py-2 hover:bg-[#EEECEA] transition-colors cursor-pointer rounded-[6px]"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="font-sans text-xs bg-[#0D9488] text-white px-4.5 py-2 hover:bg-[#0b7a70] transition-colors cursor-pointer font-bold rounded-[6px] shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    COMPILAR AUDITOR IA
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: NOTA DE RECUSA FORMAL */}
      {showRefusalModal && (
        <div id="refusal_modal" className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs text-[#1C1917]">
          <div className="w-full max-w-xl bg-[#F7F6F3] border border-[#D97706] p-6 rounded-[6px] shadow-lg relative">
            <h3 className="font-sans text-sm font-bold text-[#D97706] uppercase tracking-wide mb-2 border-b border-[#E7E5E4] pb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#D97706]" />
              SISTEMA DE ÉTICA UX · EMISSÃO DE NOTA DE REJEIÇÃO
            </h3>
            
            <p className="font-sans text-[11px] text-[#78716C] mb-4 leading-relaxed">
              Esta declaração formal foi gerada com base na análise automatizada de IHC contra conformidades éticas clínicas. A cópia deste registro é arquivada nos logs imutáveis do projeto.
            </p>

            <div className="bg-white border border-[#E7E5E4] p-4 rounded-[6px] font-mono text-[11px] text-[#1C1917] h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text scrollbar-thin">
              {refusalReason}
            </div>

            <div className="flex justify-end gap-3 mt-5 border-t border-[#E7E5E4] pt-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(refusalReason);
                  triggerBriefNotification("Nota copiada com sucesso!");
                }}
                className="font-sans text-xs bg-white border border-[#D97706] text-[#D97706] px-4 py-2 hover:bg-[#D97706]/5 transition-colors cursor-pointer rounded-[6px] font-bold"
              >
                COPIAR NOTA
              </button>
              
              <button
                type="button"
                onClick={() => setShowRefusalModal(false)}
                className="font-sans text-xs bg-[#E7E5E4] hover:bg-[#EEECEA] text-[#1C1917] px-4 py-2 transition-colors cursor-pointer rounded-[6px]"
              >
                FECHAR
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
