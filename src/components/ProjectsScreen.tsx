/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Folder, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Clock,
  Layers,
  HeartPulse,
  LogOut,
  Calendar
} from "lucide-react";

interface ProjectItem {
  id: string;
  name: string;
  projectIdCode: string;
  complianceStandard: string;
  status: "IN_REVIEW" | "APPROVED" | "FLAGGED";
  nodesCount: number;
  flaggedCount: number;
  lastUpdated: string;
  hospitalUnit: string;
}

interface ProjectsScreenProps {
  designerName: string;
  designerId: string;
  onLogout: () => void;
  onSelectProject: (projectId: string, standard: string) => void;
}

export default function ProjectsScreen({
  designerName,
  designerId,
  onLogout,
  onSelectProject
}: ProjectsScreenProps) {
  // Pre-configured projects representing clinical high fidelity systems
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([
    {
      id: "proj_1",
      name: "Hospital Copa Star · Central de Triagem Automatizada",
      projectIdCode: "8821-X",
      complianceStandard: "LGPD",
      status: "IN_REVIEW",
      nodesCount: 3,
      flaggedCount: 1,
      lastUpdated: "Hoje, 14:22 UTC",
      hospitalUnit: "Unidade de Tratamento Intensivo de IHC"
    }
  ]);

  // Modals / Input states for new project
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjId, setNewProjId] = useState("");
  const [newProjStandard, setNewProjStandard] = useState("LGPD");
  const [newProjUnit, setNewProjUnit] = useState("Medicina Baseada em Evidências");

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) {
      alert("Por favor digite o nome do projeto clínico.");
      return;
    }
    
    const generatedId = newProjId.trim() || `PRJ-${Math.floor(1000 + Math.random() * 9000)}-Z`;

    const newProject: ProjectItem = {
      id: `proj_custom_${Date.now()}`,
      name: newProjName,
      projectIdCode: generatedId,
      complianceStandard: newProjStandard,
      status: "IN_REVIEW",
      nodesCount: 1,
      flaggedCount: 0,
      lastUpdated: "Agora mesmo, UTC",
      hospitalUnit: newProjUnit
    };

    setProjectsList([newProject, ...projectsList]);
    setNewProjName("");
    setNewProjId("");
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1C1917] flex flex-col p-6 select-none relative">
      
      {/* HEADER SECTION */}
      <header className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E7E5E4] pb-5 z-10 bg-[#F7F6F3]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4.5 w-4.5 text-[#0D9488]" />
            <h1 className="font-sans text-base font-semibold text-[#1C1917] tracking-normal">
              DESIGN LEDGER
            </h1>
          </div>
          <p className="text-xs text-[#78716C] font-sans">
            Auditor Ativo: <span className="text-[#1C1917] font-semibold">{designerName}</span> &bull; ID: <span className="text-[#1C1917] font-mono">{designerId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="font-sans text-xs text-white bg-[#0D9488] hover:bg-[#0b7a70] transition-colors px-4 py-2 font-medium rounded-[6px] cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Mapa de Fluxo
          </button>

          <button 
            onClick={onLogout}
            className="font-sans text-xs text-[#78716C] border border-[#E7E5E4] hover:bg-white hover:text-[#1C1917] transition-all px-3 py-2 rounded-[6px] cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5 py-8 z-10">
        
        {/* Slim Banner Notification */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] px-4 py-2 rounded-[4px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 min-h-10 text-xs w-full">
          <div className="flex items-center gap-2 text-[#166534]">
            <ShieldCheck className="h-4 w-4 text-[#0D9488] shrink-0" />
            <span className="font-sans text-[11px] font-medium tracking-wide uppercase text-[#0D9488]">
              Consórcio Eticamente Cristalizado
            </span>
            <span className="text-[#78716C] font-normal normal-case hidden md:inline-block">
              | Selecione um registro de projeto para iniciar a auditoria
            </span>
          </div>
          <div className="font-mono text-[9px] text-[#166534]/75 uppercase tracking-wider font-semibold self-end sm:self-auto">
            Dispositivos conectados: 04 ativos
          </div>
        </div>

        {/* PROJECTS SECTION */}
        <div className="mt-4">
          <div className="font-sans text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-4">
            Projetos Auditáveis ({projectsList.length})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projectsList.map((project) => {
              // Status Styling Configuration per guidelines: left border & text in top-right, no badge bg
              let statusText = "EM REVISÃO";
              let leftBorderClass = "border-l-2 border-l-[#D97706]";
              let statusColorClass = "text-[#D97706]";

              if (project.status === "APPROVED") {
                statusText = "CONFORMIDADE TOTAL";
                leftBorderClass = "border-l-2 border-l-[#0D9488]";
                statusColorClass = "text-[#0D9488]";
              } else if (project.status === "FLAGGED") {
                statusText = "VETO ÉTICO DETECTADO";
                leftBorderClass = "border-l-2 border-l-[#EF4444]";
                statusColorClass = "text-[#EF4444]";
              }

              return (
                <div 
                  key={project.id}
                  className={`bg-white border border-[#E7E5E4] hover:border-[#0D9488]/50 p-6 rounded-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col justify-between gap-5 transition-all duration-200 group hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] ${leftBorderClass}`}
                >
                  <div className="flex flex-col gap-1.5">
                    {/* Top row with project ID and status text only (no filled badge) */}
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-[#78716C] uppercase tracking-wide">
                        PROJ_ID: {project.projectIdCode}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 bg-white border rounded-[4px] text-[10px] uppercase font-extrabold font-sans tracking-wider shadow-xs ${
                        project.status === "APPROVED"
                          ? "text-[#0D9488] border-[#0D9488]/40"
                          : project.status === "FLAGGED"
                            ? "text-[#EF4444] border-[#EF4444]/40"
                            : "text-[#D97706] border-[#D97706]/40"
                      }`}>
                        {statusText}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-sans text-base font-normal text-[#1C1917] group-hover:text-[#0D9488] transition-colors leading-snug mt-1">
                      {project.name}
                    </h3>

                    {/* Department / Unit info */}
                    <div className="text-xs text-[#78716C] tracking-wide font-sans flex items-center gap-1.5 mt-0.5">
                      <Layers className="h-3.5 w-3.5 text-[#A8A29E]" />
                      <span>{project.hospitalUnit}</span>
                    </div>
                  </div>

                  {/* Quantitative Stats Row */}
                  <div className="grid grid-cols-3 gap-6 border-t border-b border-[#E7E5E4]/60 py-4.5 my-1">
                    <div className="flex flex-col">
                      <span className="font-sans text-[10px] text-[#A8A29E] uppercase font-semibold tracking-wider">CONFORMIDADE</span>
                      <span className="font-sans text-xs text-[#1C1917] font-medium mt-1">{project.complianceStandard} (MD)</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[10px] text-[#A8A29E] uppercase font-semibold tracking-wider">TELAS LEDGER</span>
                      <span className="font-sans text-xs text-[#1C1917] font-medium mt-1">{project.nodesCount} REGISTROS</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[10px] text-[#A8A29E] uppercase font-semibold tracking-wider">ALERTA ÉTICO</span>
                      <span className={`font-sans text-xs font-semibold mt-1 ${project.flaggedCount > 0 ? "text-[#D97706]" : "text-[#0D9488]"}`}>
                        {project.flaggedCount === 0 ? "0 SINALIZADORES" : `${project.flaggedCount} SINALIZADOS`}
                      </span>
                    </div>
                  </div>

                  {/* Action and updated stamp */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-[#78716C] font-mono text-[10px]">
                      <Calendar className="h-3 w-3 text-[#A8A29E]" />
                      <span>Último bloco: {project.lastUpdated}</span>
                    </div>

                    <button 
                      onClick={() => onSelectProject(project.projectIdCode, project.complianceStandard)}
                      className="font-sans text-xs text-[#0D9488] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <span>CARREGAR NO LEDGER</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* CREATE NEW PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 select-text">
          <div className="bg-[#F7F6F3] border border-[#E7E5E4] w-full max-w-md p-6 rounded-[8px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex flex-col gap-5">
            <div>
              <h2 className="font-sans text-sm font-semibold text-[#1C1917]">
                Criar Novo Projeto de Auditoria
              </h2>
              <p className="text-xs text-[#78716C] mt-1">
                Gere uma nova sub-camada regulatória independente no ledger.
              </p>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 font-sans">
                <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                  Nome do Projeto Clínico / Sistema
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="EX: Triagem de Pronto Atendimento - Adulto" 
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full bg-white border border-[#E7E5E4] rounded-[6px] px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/20"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-sans">
                <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                  ID do Projeto / Hardware (Opcional)
                </label>
                <input 
                  type="text" 
                  placeholder="EX: 8821-X ou Auto-Gerado" 
                  value={newProjId}
                  onChange={(e) => setNewProjId(e.target.value)}
                  className="w-full bg-white border border-[#E7E5E4] rounded-[6px] px-3 py-2 text-xs font-mono text-[#1C1917] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/20"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-sans">
                <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                  Central Hospitalar ou Área de Aplicação
                </label>
                <input 
                  type="text" 
                  placeholder="EX: Medicina de Urgência e Emergência" 
                  value={newProjUnit}
                  onChange={(e) => setNewProjUnit(e.target.value)}
                  className="w-full bg-white border border-[#E7E5E4] rounded-[6px] px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/20"
                />
              </div>

              <div className="flex flex-col gap-1.5 font-sans">
                <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                  Protocolo Principal de Conformidade
                </label>
                <select 
                  value={newProjStandard} 
                  onChange={(e) => setNewProjStandard(e.target.value)}
                  className="w-full bg-white border border-[#E7E5E4] rounded-[6px] px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#0D9488]"
                >
                  <option value="LGPD">LGPD (Brasil - Lei Geral de Proteção de Dados)</option>
                  <option value="HIPAA">HIPAA (USA - Health Insurance)</option>
                  <option value="GDPR">GDPR (Europa - Regulamento de Privacidade)</option>
                  <option value="ANS">ANS (Regulação de Operadoras de Saúde)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="font-sans text-xs text-[#78716C] border border-[#E7E5E4] hover:bg-white tracking-normal px-4 py-2 rounded-[6px] cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="font-sans text-xs text-white bg-[#0D9488] hover:bg-[#0b7a70] tracking-normal font-semibold px-4 py-2 rounded-[6px] cursor-pointer"
                >
                  Estruturar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] text-[#78716C] font-mono border-t border-[#E7E5E4] pt-4 mt-auto">
        <div>
          <span>DESIGN LEDGER SECURE SYSTEM v1.42</span>
        </div>
        <div>
          <span>HASH DE SESSÃO: SSL-SECURE-STATION-64</span>
        </div>
      </footer>

    </div>
  );
}
