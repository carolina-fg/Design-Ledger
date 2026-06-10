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
  KeyRound,
  Globe
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

interface LoginScreenProps {
  onLoginSuccess: (designerName: string, designerId: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [designerName, setDesignerName] = useState(() => localStorage.getItem("settings_designerName") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showRegisterHelp, setShowRegisterHelp] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Email e senha são obrigatórios.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setStatusMsg("Validando credenciais...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.status === 400 || error.message?.toLowerCase().includes("invalid login credentials") || error.message?.toLowerCase().includes("user not found")) {
          setStatusMsg("Usuário não encontrado. Criando conta... ");
          const signupName = designerName.trim() || email.split("@")[0];
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: signupName },
            },
          });

          if (signupError) {
            throw signupError;
          }

          const sessionUser = signupData.user;
          if (!sessionUser) {
            setErrorMsg("Cadastro iniciado. Verifique seu email para confirmar a conta.");
            setShowRegisterHelp(true);
            return;
          }

          const fullName = (sessionUser.user_metadata as any)?.full_name || email.split("@")[0];
          localStorage.setItem("settings_designerName", fullName);
          localStorage.setItem("settings_designerId", sessionUser.id);
          onLoginSuccess(fullName, sessionUser.id);
          return;
        }

        throw error;
      }

      const sessionUser = data.user;
      if (!sessionUser) {
        throw new Error("Falha ao obter dados do usuário.");
      }

      const fullName = (sessionUser.user_metadata as any)?.full_name || email.split("@")[0];
      localStorage.setItem("settings_designerName", fullName);
      localStorage.setItem("settings_designerId", sessionUser.id);
      onLoginSuccess(fullName, sessionUser.id);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Erro ao autenticar. Verifique seu email e senha.");
    } finally {
      setIsLoading(false);
      setStatusMsg("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1C1917] flex flex-col justify-between p-6 select-none relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="h-4.5 w-1 bg-[#0D9488]" />
          <span className="font-sans text-xs uppercase tracking-wider text-[#78716C] font-semibold">
            DESIGN LEDGER &bull; SECURE WORKSPACE
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-sans text-xs text-[#78716C]">
          <Globe className="h-3.5 w-3.5 text-[#0D9488]" />
          <span>ESTADO: SESSÃO SUPABASE</span>
        </div>
      </div>

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
              Entre com email e senha. A conta será criada automaticamente se ainda não existir.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 mt-2">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] text-xs text-red-700 font-sans">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                Nome do Auditor (opcional)
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

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[#A8A29E]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="seu@email.com"
                  className="w-full bg-white border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] pl-10 pr-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] text-[#78716C] uppercase font-semibold">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#A8A29E]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Senha segura"
                  className="w-full bg-white border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] pl-10 pr-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/20 disabled:opacity-50"
                />
              </div>
            </div>

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
                  Entrar
                </button>
              )}
            </div>
          </form>

          <div className="border-t border-[#E7E5E4] pt-4 mt-1 text-xs text-[#78716C]">
            <p>
              Use seu email e senha para autenticar. Se a conta não existir, ela será criada automaticamente.
            </p>
            {showRegisterHelp && (
              <p className="mt-2 text-[#166534]">
                Verifique seu email caso seja necessário confirmar o cadastro.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] text-[#78716C] font-mono border-t border-[#E7E5E4] pt-4 z-10">
        <div>
          <span>DESIGN LEDGER PROTOCOL v1.42</span>
        </div>
        <div>
          <span>REQUISITOS DO COGNITIVE SHIELD ATIVOS: LGPD, HIPAA, WCAG AA/AAA</span>
        </div>
        <div>
          <span>HASH DE SESSÃO: SUPABASE_AUTH</span>
        </div>
      </div>
    </div>
  );
}
