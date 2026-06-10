import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Flag,
  RotateCcw,
  BookOpen
} from "lucide-react";

interface EthicsLogDashboardProps {
  onBack: () => void;
  activeTab: "records" | "audits" | "protocols";
  setActiveTab: (tab: "records" | "audits" | "protocols") => void;
  triggerNotification: (msg: string) => void;
  onViewRefusalNote: () => void;
}

export default function EthicsLogDashboard({
  onBack,
  activeTab,
  setActiveTab,
  triggerNotification,
  onViewRefusalNote
}: EthicsLogDashboardProps) {
  const [selectedFilter, setSelectedFilter] = useState<"todos" | "sinalizacoes" | "revisoes" | "recusas">("todos");

  const logsData = [
    {
      id: "log1",
      type: "sinalizacoes",
      tag: "SINALIZAÇÃO · PADRÃO ESCURO",
      time: "T+12:44:01",
      nodeId: "8821-X",
      description: "Decisão A emprega carga cognitiva assimétrica...",
      badge: "NÓ_ID: 42_CANC",
      linkText: "VER CARTÃO →",
      color: "orange",
      action: () => triggerNotification("Sinalizador de nó ativado na visualização flutuante.")
    },
    {
      id: "log2",
      type: "aprovacoes",
      tag: "APROVAÇÃO · DECISÃO_B",
      time: "T+14:22:15",
      nodeId: "8821-X",
      description: "Decisão B aprovada após revisão secundária...",
      badge: "REF_TICKET_4091",
      linkText: "VER RELATÓRIO →",
      color: "teal",
      action: () => triggerNotification("Exibindo sumário detalhado da homologação Variant_B.")
    },
    {
      id: "log3",
      type: "sinalizacoes",
      tag: "SINALIZAÇÃO · AUTONOMIA CLÍNICA",
      time: "T-2d:09:11",
      nodeId: "7203-A",
      description: "Briefing não especifica grau de mediação humana...",
      badge: "RISCO: CRÍTICO",
      linkText: "VER ANÁLISE →",
      color: "orange",
      action: () => triggerNotification("Carregando parecer técnico de auditoria integrada.")
    },
    {
      id: "log4",
      type: "revisoes", // Also matches recusas
      isRecusa: true,
      tag: "REVISÃO · BRIEFING RECUSADO",
      time: "T-3d:11:44",
      nodeId: "7203-A",
      description: "Nota de recusa formal gerada...",
      badge: "REF_TICKET_5102",
      linkText: "VER NOTA →",
      color: "white",
      action: onViewRefusalNote // Transition to formal refusal letter
    },
    {
      id: "log5",
      type: "aprovacoes",
      tag: "APROVAÇÃO · RELATÓRIO FINAL",
      time: "T-5d:16:30",
      nodeId: "6891-C",
      description: "Relatório de conformidade narrativa exportado...",
      badge: "0 SINALIZADORES",
      linkText: "VER RELATÓRIO →",
      color: "teal",
      action: () => triggerNotification("Abrindo arquivo histórico de auditoria externa.")
    }
  ];

  // Filter logs based on selection
  const filteredLogs = logsData.filter(log => {
    if (selectedFilter === "todos") return true;
    if (selectedFilter === "sinalizacoes") return log.type === "sinalizacoes";
    if (selectedFilter === "revisoes") return log.type === "revisoes";
    if (selectedFilter === "recusas") return log.isRecusa === true;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F7F6F3] select-none text-[#1C1917] h-full overflow-hidden">
      
      {/* HEADER SECTION (Top Bar) */}
      <div className="bg-white border-b border-[#E7E5E4] px-6 py-3 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Title / Path */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs text-[#0D9488] uppercase tracking-wide font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#0D9488]" />
            REGISTRO ÉTICO
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 border-b sm:border-b-0 border-[#E7E5E4] pb-2 sm:pb-0">
          <button 
            onClick={() => setActiveTab("records")}
            className={`font-sans text-xs uppercase tracking-wide pb-1 transition-all relative font-semibold ${
              activeTab === "records" ? "text-[#0D9488] font-bold" : "text-[#78716C] hover:text-[#1C1917] cursor-pointer"
            }`}
          >
            REGISTROS
            {activeTab === "records" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#0D9488]" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab("audits")}
            className={`font-sans text-xs uppercase tracking-wide pb-1 transition-all relative font-semibold ${
              activeTab === "audits" ? "text-[#0D9488] font-bold" : "text-[#78716C] hover:text-[#1C1917] cursor-pointer"
            }`}
          >
            AUDITORIAS
            {activeTab === "audits" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#0D9488]" />
            )}
          </button>

          <button 
            onClick={() => setActiveTab("protocols")}
            className={`font-sans text-xs uppercase tracking-wide pb-1 transition-all relative font-semibold ${
              activeTab === "protocols" ? "text-[#0D9488] font-bold" : "text-[#78716C] hover:text-[#1C1917] cursor-pointer"
            }`}
          >
            PROTOCOLOS
            {activeTab === "protocols" && (
              <div className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#0D9488]" />
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={() => triggerNotification("EXPORT: Diário de logs éticos compilado no drive local.")}
            className="font-sans text-xs text-[#78716C] border border-[#E7E5E4] hover:bg-[#F7F6F3] hover:text-[#1C1917] transition-colors uppercase tracking-wide px-3.5 py-1.5 rounded-[6px] cursor-pointer"
          >
            EXPORTAR LOG
          </button>

          <button 
            onClick={() => triggerNotification("COMMIT: Homologação e hashes registradas no Ledger.")}
            className="font-sans text-xs text-white bg-[#0D9488] hover:bg-[#0b7a70] transition-colors uppercase tracking-wide px-4.5 py-1.5 font-bold rounded-[6px] cursor-pointer shadow-sm"
          >
            CONFIRMAR
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* VIEW 1: AUDITORIAS */}
        {activeTab === "audits" && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Column: Logs List */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden border-r border-[#E7E5E4]">
              
              {/* Inner List filter tabs */}
              <div className="flex items-center gap-4 border-b border-[#E7E5E4] pb-3 mb-5 select-none shrink-0">
                <button 
                  onClick={() => setSelectedFilter("todos")}
                  className={`font-sans text-[11px] px-3 py-1 rounded-[6px] border uppercase transition-all cursor-pointer font-bold ${
                    selectedFilter === "todos" 
                      ? "bg-[#F0FDF4] border-[#0D9488] text-[#0D9488]" 
                      : "border-transparent text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  TODOS
                </button>

                <button 
                  onClick={() => setSelectedFilter("sinalizacoes")}
                  className={`font-sans text-[11px] px-3 py-1 rounded-[6px] border uppercase transition-all cursor-pointer font-bold ${
                    selectedFilter === "sinalizacoes" 
                      ? "bg-[#FFFBEB] border-[#D97706] text-[#D97706]" 
                      : "border-transparent text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  SINALIZAÇÕES
                </button>

                <button 
                  onClick={() => setSelectedFilter("revisoes")}
                  className={`font-sans text-[11px] px-3 py-1 rounded-[6px] border uppercase transition-all cursor-pointer font-bold ${
                    selectedFilter === "revisoes" 
                      ? "bg-[#F7F6F3] border-[#E7E5E4] text-[#1C1917]" 
                      : "border-transparent text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  REVISÕES
                </button>

                <button 
                  onClick={() => setSelectedFilter("recusas")}
                  className={`font-sans text-[11px] px-3 py-1 rounded-[6px] border uppercase transition-all cursor-pointer font-bold ${
                    selectedFilter === "recusas" 
                      ? "bg-red-50 border-red-200 text-red-600" 
                      : "border-transparent text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  RECUSAS
                </button>
              </div>

              {/* Scrollable list of cards */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {filteredLogs.length === 0 ? (
                  <div className="border border-[#E7E5E4] py-12 text-center text-xs text-[#78716C] rounded-[6px] bg-white">
                    Nenhum registro encontrado no filtro atual.
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    // Set color-specific border classes - left border only, no colorful background badges per instructions!
                    let accentColorBorderClass = "border-l-[3px] border-l-[#D97706]";
                    let tagColorTextClass = "text-[#D97706]";
                    
                    if (log.color === "teal") {
                      accentColorBorderClass = "border-l-[3px] border-l-[#0D9488]";
                      tagColorTextClass = "text-[#0D9488]";
                    } else if (log.color === "white") {
                      accentColorBorderClass = "border-l-[3px] border-l-[#78716C]";
                      tagColorTextClass = "text-[#1C1917]";
                    }

                    return (
                      <div 
                        key={log.id} 
                        className={`bg-white border border-[#E7E5E4] hover:bg-[#F7F6F3]/40 rounded-[6px] shadow-xs p-4 relative transition-all duration-150 ${accentColorBorderClass}`}
                      >
                        {/* Title Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <div className="flex items-center gap-1.5 select-none">
                            {log.color === "orange" && <span className="text-[#D97706] text-[10px]">▲</span>}
                            {log.color === "teal" && <span className="text-[#0D9488] text-[10px]">✔</span>}
                            {log.color === "white" && <span className="text-[#78716C] text-[10px]">⟲</span>}
                            <span className={`font-sans text-xs font-bold leading-none uppercase ${tagColorTextClass}`}>
                              {log.tag}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[#78716C] self-start sm:self-auto">
                            {log.time} | ID: {log.nodeId}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="font-sans text-xs text-[#1C1917] leading-relaxed mb-4">
                          {log.description}
                        </p>

                        {/* Footer pill & trigger action links */}
                        <div className="flex justify-between items-center select-none pt-2 border-t border-[#E7E5E4]/60">
                          {/* Badge Pill (high-contrast white tag-style) */}
                          <span className={`font-mono text-[9px] px-2.5 py-0.5 border rounded-[4px] font-bold tracking-wide shadow-2xs ${
                            log.color === "orange" 
                              ? "bg-white border-[#D97706]/40 text-[#D97706]" 
                              : log.color === "teal"
                                ? "bg-white border-[#0D9488]/40 text-[#0D9488]"
                                : "bg-white border-[#E7E5E4] text-[#78716C]"
                          }`}>
                            {log.badge}
                          </span>
 
                          {/* Link action */}
                          <button 
                            onClick={log.action}
                            className="font-sans text-xs text-[#0D9488] hover:text-[#0b7a70] cursor-pointer bg-transparent border-none p-1 transition-colors uppercase select-none flex items-center gap-1 font-bold"
                          >
                            {log.linkText}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: session stats and metrics side panel */}
            <div className="w-full md:w-[280px] shrink-0 p-6 flex flex-col gap-6 overflow-y-auto bg-white border-l border-[#E7E5E4]">
              
              {/* Card metrics Panel */}
              <div className="border border-[#E7E5E4] bg-[#F7F6F3]/50 p-5 rounded-[6px]">
                <h3 className="font-sans text-[10px] tracking-wider text-[#78716C] font-semibold border-b border-[#E7E5E4] pb-2 mb-4 uppercase">
                  MÉTRICAS DE SESSÃO
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-[#78716C]">TOTAL DE SINALIZAÇÕES</span>
                    <span className="font-mono text-xs text-[#D97706] font-bold">23</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-[#78716C]">RECUSAS FORMAIS</span>
                    <span className="font-mono text-xs text-red-600 font-bold">6</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-[#78716C]">APROVAÇÕES</span>
                    <span className="font-mono text-xs text-[#0D9488] font-bold">31</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-[#78716C]">PROJETOS SEM ALERTA</span>
                    <span className="font-mono text-xs text-[#78716C]">8</span>
                  </div>
                </div>
              </div>

              {/* Card guidelines Panel */}
              <div className="border border-[#E7E5E4] bg-[#F7F6F3]/50 p-5 rounded-[6px]">
                <h3 className="font-sans text-[10px] tracking-wider text-[#78716C] font-semibold border-b border-[#E7E5E4] pb-2 mb-4 uppercase">
                  DIRETRIZES MAIS VIOLADAS
                </h3>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2 font-mono text-xs text-[#1C1917]">
                    <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                    <span>4.2 (4x)</span>
                  </li>
                  <li className="flex items-center gap-2 font-mono text-xs text-[#1C1917]">
                    <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                    <span>7.1 (3x)</span>
                  </li>
                  <li className="flex items-center gap-2 font-mono text-xs text-[#1C1917]">
                    <span className="h-2 w-2 rounded-full bg-[#D97706]" />
                    <span>2.8 (2x)</span>
                  </li>
                </ul>
              </div>

              {/* Large Complete Audit Export Button */}
              <div className="mt-auto">
                <button 
                  onClick={() => triggerNotification("EXPORT COMPLETE: Diário integral criptografado exportado com sucesso.")}
                  className="w-full font-sans text-xs text-[#0D9488] hover:bg-[#0D9488]/15 border border-[#0D9488]/65 transition-colors uppercase tracking-wider py-3 text-center rounded-[6px] font-bold block cursor-pointer"
                >
                  EXPORTAR AUDITORIA COMPLETA
                </button>
              </div>
            </div>
            
          </div>
        )}

        {/* VIEW 2: RECORDS */}
        {activeTab === "records" && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
            <h2 className="font-sans text-sm uppercase tracking-wide text-[#0D9488] font-bold mb-3 select-none">
              HISTÓRICO DO LEDGER DE CONFORMIDADE
            </h2>
            <p className="font-sans text-xs text-[#78716C] leading-relaxed mb-6 select-none">
              O ledger garante um registro criptográfico dos carimbos de data/hora estruturais do projeto clínico.
            </p>
 
            <div className="border border-[#E7E5E4] bg-white rounded-[6px] shadow-sm overflow-hidden select-text">
              <table className="w-full text-left font-sans text-xs leading-normal">
                <thead className="bg-[#F7F6F3] border-b border-[#E7E5E4] font-sans text-[10px] uppercase font-bold tracking-wider text-[#78716C]">
                  <tr>
                    <th className="p-3">Ref Bloco</th>
                    <th className="p-3">Componente / Decisão</th>
                    <th className="p-3">Resultados de Heurística</th>
                    <th className="p-3">Cripto Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5E4] text-[#1C1917]">
                  <tr className="hover:bg-[#F7F6F3]/50 transition-colors">
                    <td className="p-3 font-mono text-[#0D9488] font-bold">NÓ_#42</td>
                    <td className="p-3 font-semibold text-[#1C1917]">Fricção Ativa no Cancelamento</td>
                    <td className="p-3 text-[#D97706] font-semibold">Veto Ético (Sec. 5.1/4.2)</td>
                    <td className="p-3 font-mono text-[10px] text-[#78716C]">9F8A-2B4C-7D1E-55X9</td>
                  </tr>
                  <tr className="hover:bg-[#F7F6F3]/50 transition-colors">
                    <td className="p-3 font-mono text-[#0D9488] font-bold">NÓ_#41</td>
                    <td className="p-3 font-semibold text-[#1C1917]">Exclusão de Registros Prontuário</td>
                    <td className="p-3 text-[#0D9488] font-semibold">Homologado Variant_B</td>
                    <td className="p-3 font-mono text-[10px] text-[#78716C]">A24F-D3E2-55BA-283C</td>
                  </tr>
                  <tr className="hover:bg-[#F7F6F3]/50 transition-colors">
                    <td className="p-3 font-mono text-[#0D9488] font-bold">NÓ_#40</td>
                    <td className="p-3 font-semibold text-[#1C1917]">Consentimento Prontuário IA</td>
                    <td className="p-3 text-[#0D9488] font-semibold">Aprovado sem sinalizadores</td>
                    <td className="p-3 font-mono text-[10px] text-[#78716C]">04BC-33E1-FF22-A83C</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
 
        {/* VIEW 3: PROTOCOLS */}
        {activeTab === "protocols" && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full select-text">
            <h2 className="font-sans text-sm uppercase tracking-wide text-[#0D9488] font-bold mb-4">
              DIRETRIZES ÉTICAS DE UX CLÍNICO (MANUAL REGULADA)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[#E7E5E4] bg-white rounded-[6px] shadow-sm">
                <span className="font-sans text-[11px] text-[#D97706] font-bold block mb-1">
                  SEÇÃO 4.2 · CONSENTIMENTO ATIVO
                </span>
                <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                  Sistemas médicos de triagem não devem utilizar métodos de aceitação pré-marca (pre-checked checkboxes) para compartilhamento de dados sensíveis de pacientes.
                </p>
              </div>

              <div className="p-4 border border-[#E7E5E4] bg-white rounded-[6px] shadow-sm">
                <span className="font-sans text-[11px] text-[#D97706] font-bold block mb-1">
                  SEÇÃO 5.1 · CLAREZA DE DESISTÊNCIA
                </span>
                <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                  Caminhos de encerramento contratual e exclusão de cadastros devem ser lineares. Proibido forçar o usuário a ligar ou preencher formulários assíncronos extras se a contratação foi online.
                </p>
              </div>

              <div className="p-4 border border-[#E7E5E4] bg-white rounded-[6px] shadow-sm">
                <span className="font-sans text-[11px] text-[#D97706] font-bold block mb-1">
                  WCAG AA · CONTRASTE DE INTERFACING
                </span>
                <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                  Elementos interativos e avisos clínicos cruciais devem prover relação de contraste mínima de 4.5:1 para garantir a legibilidade em cenários severos ou urgentes.
                </p>
              </div>

              <div className="p-4 border border-[#E7E5E4] bg-white rounded-[6px] shadow-sm">
                <span className="font-sans text-[11px] text-[#D97706] font-bold block mb-1">
                  IA MÉDICA · VALIDAÇÃO ADICIONAL (EMR)
                </span>
                <p className="font-sans text-xs text-[#78716C] leading-relaxed">
                  Todas as sugestões automatizadas por redes de IA precisam de validação por duplo fator humano ativo em tela antes da consolidação definitiva em prontuário eletrônico.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
