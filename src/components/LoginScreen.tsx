/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Lock, 
  User, 
  Loader2, 
  FileText,
  KeyRound,
  Globe
} from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (designerName: string, designerId: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [designerName, setDesignerName] = useState(() => localStorage.getItem("settings_designerName") || "Cesar Fontes");
  const [designerId, setDesignerId] = useState(() => localStorage.getItem("settings_designerId") || "UXPA-BR #2411");
  const [accessKey, setAccessKey] = useState("••••••••");
  const [region, setRegion] = useState("BR-CENTER-01");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designerName.trim()) {
      setErrorMsg("O nome do Auditor Clínico é obrigatório.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setStatusMsg("Conectando ao barramento seguro local...");

    setTimeout(() => {
      setStatusMsg("Mapeando biblioteca de conformidade (LGPD & HIPAA)...");
      setTimeout(() => {
        setStatusMsg("Assinando livro razão com assinatura digital de chave privada...");
        setTimeout(() => {
          setIsLoading(false);
          localStorage.setItem("settings_designerName", designerName);
          localStorage.setItem("settings_designerId", designerId);
          onLoginSuccess(designerName, designerId);
        }, 600);
      }, 550);
    }, 600);
  };

  const handleQuickPrefill = (name: string, cred: string) => {
    setDesignerName(name);
    setDesignerId(cred);
    setAccessKey("AES-256-CLIENT-LEDGER");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1C1917] flex flex-col justify-between p-6 select-none relative overflow-hidden">
      
      {/* Header bar / Logo */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="h-4.5 w-1 bg-[#0D9488]" />
          <span className="font-sans text-xs uppercase tracking-wider text-[#78716C] font-semibold">
            DESIGN LEDGER &bull; SECURE WORKSPACE
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-sans text-xs text-[#78716C]">
          <Globe className="h-3.5 w-3.5 text-[#0D9488]" />
          <span>ESTADO: CHAVE_ATIVA_SHA256</span>
        </div>
      </div>

      {/* Main Login Card block */}
      <div className="w-full max-w-md mx-auto my-auto z-10 py-10">
        <div className="bg-white border border-[#E7E5E4] p-8 rounded-[8px] shadow-[0_12px_40px_rgba(0,0,0,0.05)] flex flex-col gap-6 relative">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#E7E5E4] p-2.5 rounded-full shadow-sm">
            <ShieldAlert className="h-5 w-5 text-[#0D9488]" />
          </div>

          <div className="text-center mt-3">
            <h1 className="font-sans text-lg text-[#1C1917] font-semibold tracking-tight">
              DESIGN LEDGER
            </h1>
            <p className="text-xs text-[#78716C] mt-1 font-sans leading-relaxed">
              Plataforma de Validação Ética e Auditoria de UX Design
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 mt-2">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] text-xs text-red-700 font-sans">
                {errorMsg}
              </div>
            )}

             {/* Input 1: Auditor Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                Identificação do Auditor Clínico
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[#A8A29E]" />
                <input 
                  type="text" 
                  value={designerName}
                  onChange={(e) => setDesignerName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Seu nome completo"
                  className="w-full bg-white border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] pl-10 pr-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Input 3: Access Code (Optional Masked / Secret) */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                Chave de Criptografia da Chave-Mestra
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#A8A29E]" />
                <input 
                  type="password" 
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] pl-10 pr-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Selector: Node Region */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                Servidor de Validação
              </label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white border border-[#E7E5E4] rounded-[6px] px-3 py-2 text-xs font-sans text-[#1C1917] focus:outline-none focus:border-[#0D9488] disabled:opacity-50"
              >
                <option value="BR-CENTER-01">Nó Seguro Metropolitano (BR-CENTER-01)</option>
                <option value="US-WEST-04">Auditoria Remota Cripto (US-WEST-04)</option>
                <option value="LOCAL-OFFLINE">Heurística Local Offline (LOCAL-CONTAINER)</option>
              </select>
            </div>

            {/* BUTTON or Loading Indicator */}
            <div className="mt-2 text-xs">
              {isLoading ? (
                <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[6px] p-3 flex flex-col gap-2 items-center justify-center">
                  <Loader2 className="h-5 w-5 text-[#0D9488] animate-spin" />
                  <span className="font-sans text-[11px] text-[#166534] tracking-normal text-center animate-pulse">
                    {statusMsg}
                  </span>
                </div>
              ) : (
                <button 
                  type="submit"
                  className="w-full bg-[#0D9488] hover:bg-[#0b7a70] text-white font-sans text-xs font-semibold py-3 rounded-[6px] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  Homologar e Entrar
                </button>
              )}
            </div>
          </form>

          {/* Quick Prefills Section */}
          <div className="border-t border-[#E7E5E4] pt-4 mt-1">
            <span className="font-sans text-[10px] text-[#78716C] uppercase font-semibold tracking-wider block mb-2">
              AUDITORES JÁ ATIVOS NESTE LEDGER:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => handleQuickPrefill("Cesar Fontes", "UXPA-BR #2411")}
                className="text-left bg-[#EEECEA]/40 hover:bg-[#EEECEA] border border-[#E7E5E4] p-2 rounded-[6px] transition-colors cursor-pointer"
              >
                <span className="font-sans text-[11px] text-[#1C1917] font-medium block">Cesar Fontes</span>
                <span className="font-sans text-[9px] text-[#78716C]">Design Tech Lead</span>
              </button>
              <button 
                type="button"
                onClick={() => handleQuickPrefill("Clara Gomes", "CREMESP #9042")}
                className="text-left bg-[#EEECEA]/40 hover:bg-[#EEECEA] border border-[#E7E5E4] p-2 rounded-[6px] transition-colors cursor-pointer"
              >
                <span className="font-sans text-[11px] text-[#1C1917] font-medium block">Clara Gomes</span>
                <span className="font-sans text-[9px] text-[#78716C]">Comitê Médico de Inovação</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer system details */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] text-[#78716C] font-mono border-t border-[#E7E5E4] pt-4 z-10">
        <div>
          <span>DESIGN LEDGER PROTOCOL v1.42</span>
        </div>
        <div>
          <span>REQUISITOS DO COGNITIVE SHIELD ATIVOS: LGPD, HIPAA, WCAG AA/AAA</span>
        </div>
        <div>
          <span>HASH DE SESSÃO: NONE_UNAUTHORIZED</span>
        </div>
      </div>

    </div>
  );
}
