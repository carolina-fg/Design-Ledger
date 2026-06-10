import React, { useState, useEffect } from "react";
import { 
  Settings, 
  ShieldCheck, 
  Sliders, 
  User, 
  Cpu, 
  Database, 
  Lock, 
  RotateCcw, 
  Save, 
  RefreshCw, 
  Info,
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface SettingsPanelProps {
  onBack: () => void;
  triggerNotification: (msg: string) => void;
}

export default function SettingsPanel({
  onBack,
  triggerNotification
}: SettingsPanelProps) {
  // General State initialized from localStorage or defaults
  const [projectId, setProjectId] = useState(() => localStorage.getItem("settings_projectId") || "8821-X");
  const [complianceStandard, setComplianceStandard] = useState(() => localStorage.getItem("settings_complianceStandard") || "LGPD");
  const [wcagContrast, setWcagContrast] = useState(() => localStorage.getItem("settings_wcagContrast") || "AA");
  const [auditStrictness, setAuditStrictness] = useState(() => localStorage.getItem("settings_auditStrictness") || "high");
  
  // AI Model State
  const [activeModel, setActiveModel] = useState(() => localStorage.getItem("settings_activeModel") || "gemini-2.0-flash");
  const [autoRefusal, setAutoRefusal] = useState(() => localStorage.getItem("settings_autoRefusal") === "true");
  const [temperature, setTemperature] = useState(() => Number(localStorage.getItem("settings_temperature") || "0.2"));
  
  // Ethical Credentials
  const [designerName, setDesignerName] = useState(() => localStorage.getItem("settings_designerName") || "Auditório de UX Clínico");
  const [designerId, setDesignerId] = useState(() => localStorage.getItem("settings_designerId") || "UXPA-BR #2411");
  const [ledgerSalt, setLedgerSalt] = useState(() => localStorage.getItem("settings_ledgerSalt") || "SHA256_COGNITIVE_SHIELD");

  // Notifications toggles
  const [soundAlerts, setSoundAlerts] = useState(() => localStorage.getItem("settings_soundAlerts") !== "false");
  const [showFooterHashes, setShowFooterHashes] = useState(() => localStorage.getItem("settings_showFooterHashes") !== "false");

  // Save Settings Handlers
  const handleSaveSettings = () => {
    localStorage.setItem("settings_projectId", projectId);
    localStorage.setItem("settings_complianceStandard", complianceStandard);
    localStorage.setItem("settings_wcagContrast", wcagContrast);
    localStorage.setItem("settings_auditStrictness", auditStrictness);
    localStorage.setItem("settings_activeModel", activeModel);
    localStorage.setItem("settings_autoRefusal", String(autoRefusal));
    localStorage.setItem("settings_temperature", String(temperature));
    localStorage.setItem("settings_designerName", designerName);
    localStorage.setItem("settings_designerId", designerId);
    localStorage.setItem("settings_ledgerSalt", ledgerSalt);
    localStorage.setItem("settings_soundAlerts", String(soundAlerts));
    localStorage.setItem("settings_showFooterHashes", String(showFooterHashes));

    // Force updates visually across the application
    triggerNotification("CONFIGS_COMMIT: Diretrizes e preferências re-sincronizadas.");
  };

  const handleResetDefaults = () => {
    if (confirm("Deseja restaurar as configurações padrão de fábrica do Design Ledger?")) {
      setProjectId("8821-X");
      setComplianceStandard("LGPD");
      setWcagContrast("AA");
      setAuditStrictness("high");
      setActiveModel("gemini-2.0-flash");
      setAutoRefusal(false);
      setTemperature(0.2);
      setDesignerName("Auditório de UX Clínico");
      setDesignerId("UXPA-BR #2411");
      setLedgerSalt("SHA256_COGNITIVE_SHIELD");
      setSoundAlerts(true);
      setShowFooterHashes(true);
      
      triggerNotification("CONFIGS_RESET: Layout e parâmetros éticos restaurados.");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F7F6F3] text-[#1C1917] h-full overflow-hidden select-none">
      
      {/* HEADER SECTION (Top Bar) */}
      <div className="bg-white border-b border-[#E7E5E4] px-6 py-3.5 shrink-0 flex items-center justify-between gap-4">
        {/* Title / Path */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-[#78716C]">
            DESIGN LEDGER / SISTEMA
          </span>
          <span className="font-sans text-xs text-[#E7E5E4] font-bold">&gt;</span>
          <span className="font-sans text-xs text-[#0D9488] uppercase tracking-wide font-bold flex items-center gap-1.5">
            <Settings className="h-4 w-4 text-[#0D9488]" />
            CONFIGURAÇÕES GERAIS
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleResetDefaults}
            className="font-sans text-xs text-[#78716C] border border-[#E7E5E4] hover:bg-[#F7F6F3] hover:text-[#1C1917] transition-colors uppercase tracking-wide px-3.5 py-1.5 rounded-[6px] cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="h-3 w-3" />
            RESTAURAR PADRÕES
          </button>

          <button 
            onClick={handleSaveSettings}
            className="font-sans text-xs text-white bg-[#0D9488] hover:bg-[#0b7a70] transition-all duration-150 uppercase tracking-wide px-4.5 py-1.5 font-bold rounded-[6px] cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Save className="h-3 w-3 text-white" />
            SALVAR ALTERAÇÕES
          </button>
        </div>
      </div>

      {/* Main Settings Form Panel Scrollable */}
      <div className="flex-1 p-6 overflow-y-auto max-w-5xl mx-auto w-full select-text">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          
          {/* SECTION 1: PROJETO & CONFORMIDADE REGULATÓRIA */}
          <div className="p-5 border border-[#E7E5E4] bg-white rounded-[6px] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 font-sans text-xs tracking-wide text-[#0D9488] font-bold border-b border-[#E7E5E4] pb-2.5 uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>REGULAÇÃO & CONFORMIDADE</span>
            </div>

            {/* Input Parameter: Project ID */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                ID DE HARDWARE / PROJETO LEDGER
              </label>
              <input 
                type="text" 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)}
                className="bg-[#F7F6F3] border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] px-3 py-2 text-xs font-mono text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/20 transition-all"
                placeholder="Exemplo: 8821-X"
              />
              <span className="text-[10px] text-[#78716C] leading-snug">
                Identificador criptográfico gerado na inicialização da árvore de decisões do ledger.
              </span>
            </div>

            {/* Selection Parameter: Standard */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                DIRETRIZ DE PROTEÇÃO DE DADOS ATIVA
              </label>
              <select 
                value={complianceStandard}
                onChange={(e) => setComplianceStandard(e.target.value)}
                className="bg-[#F7F6F3] border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] px-2.5 py-2 text-xs font-sans text-[#1C1917] focus:outline-none transition-all"
              >
                <option value="LGPD">LGPD (Brasil - Lei Geral de Proteção de Dados)</option>
                <option value="HIPAA">HIPAA (USA - Health Insurance Portability and Accountability Act)</option>
                <option value="GDPR">GDPR (Europa - General Data Protection Regulation)</option>
                <option value="ANS">ANS (Agência Nacional de Saúde Complementar)</option>
              </select>
            </div>

            {/* WCAG Contrast Level selection */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                VALIDAÇÃO DE CONTEXTO VISUAL (WCAG)
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button 
                  type="button" 
                  onClick={() => setWcagContrast("AA")}
                  className={`font-sans text-xs py-2 rounded-[6px] border uppercase transition-all font-semibold ${
                    wcagContrast === "AA" 
                      ? "bg-[#F0FDF4] border-[#0D9488] text-[#0D9488]" 
                      : "border-[#E7E5E4] bg-white text-[#78716C] hover:text-[#1C1917] hover:bg-[#F7F6F3]"
                  }`}
                >
                  NÍVEL AA (MÍNIMO 4.5:1)
                </button>
                <button 
                  type="button" 
                  onClick={() => setWcagContrast("AAA")}
                  className={`font-sans text-xs py-2 rounded-[6px] border uppercase transition-all font-semibold ${
                    wcagContrast === "AAA" 
                      ? "bg-[#F0FDF4] border-[#0D9488] text-[#0D9488]" 
                      : "border-[#E7E5E4] bg-white text-[#78716C] hover:text-[#1C1917] hover:bg-[#F7F6F3]"
                  }`}
                >
                  NÍVEL AAA (RECOMENDADO 7.0:1)
                </button>
              </div>
            </div>

            {/* Compliance strictness mode */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                GRAVATIVIDADE DO VETO ÉTICO
              </label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#78716C]">
                  <input 
                    type="radio" 
                    name="strictness" 
                    value="standard" 
                    checked={auditStrictness === "standard"}
                    onChange={() => setAuditStrictness("standard")}
                    className="accent-[#0D9488]"
                  />
                  <span>Rigor Padrão (Informativo)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#78716C]">
                  <input 
                    type="radio" 
                    name="strictness" 
                    value="high"
                    checked={auditStrictness === "high"}
                    onChange={() => setAuditStrictness("high")}
                    className="accent-[#0D9488]"
                  />
                  <span>Rigor Crítico (Colegiado Total)</span>
                </label>
              </div>
            </div>
            
          </div>

          {/* SECTION 2: PARÂMETROS DO AUDITOR IA */}
          <div className="p-5 border border-[#E7E5E4] bg-white rounded-[6px] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 font-sans text-xs tracking-wide text-[#0D9488] font-bold border-b border-[#E7E5E4] pb-2.5 uppercase">
              <Cpu className="h-4 w-4" />
              <span>MOTOR DE DESIGN IA GERATIVO</span>
            </div>

            {/* Model Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                MODELO ANALÍTICO DE LINGUAGEM
              </label>
              <select 
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="bg-[#F7F6F3] border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] px-2.5 py-2 text-xs font-sans text-[#1C1917] focus:outline-none transition-all"
              >
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Nativo de Alta Capacidade)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Resposta Instantânea)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Auditoria de Casos Extremos)</option>
                <option value="combinatorial-heuristics">Heurística Combinatória Local (Offline)</option>
              </select>
            </div>

            {/* Auto-Refusal Checkbox Toggle */}
            <div className="flex items-start gap-3 mt-1.5 p-3.5 bg-[#F7F6F3] border border-[#E7E5E4] rounded-[6px]">
              <input 
                type="checkbox" 
                id="autoRefusalCheck"
                checked={autoRefusal}
                onChange={(e) => setAutoRefusal(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-[4px] border-[#E7E5E4] bg-white text-[#0D9488] focus:ring-[#0D9488] focus:ring-offset-0 cursor-pointer accent-[#0D9488]"
              />
              <div className="flex flex-col gap-0.5 cursor-pointer select-none">
                <label htmlFor="autoRefusalCheck" className="font-sans text-xs text-[#1C1917] font-bold">
                  Automação de Recusa Ética Automática
                </label>
                <span className="text-[10px] text-[#78716C] leading-normal">
                  Quando ativo, qualquer desvio rotulado com gravidade "Risco Crítico" (ex: Dark Patterns coercitivos) impedirá a homologação e travará o ledger até parecer colegiado presencial do designer.
                </span>
              </div>
            </div>

            {/* Slider: Temperature or Creativity / Critical Index */}
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider">
                <span className="text-[#78716C]">GRAU DE CRITICALIDADE (TEMPERATURA)</span>
                <span className="text-[#0D9488] font-bold">{temperature.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="1.0" 
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-[#0D9488] bg-[#E7E5E4] h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between items-center text-[9px] text-[#78716C] font-sans">
                <span>0.00 (CONSERVADOR/ESTRITO)</span>
                <span>1.00 (ALTAMENTE ADVERSATIVO)</span>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SECTION 3: CREDENCIAIS DO DESIGNER REGISTRADO */}
          <div className="p-5 border border-[#E7E5E4] bg-white rounded-[6px] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 font-sans text-xs tracking-wide text-[#0D9488] font-bold border-b border-[#E7E5E4] pb-2.5 uppercase">
              <User className="h-4 w-4" />
              <span>CARIMBO PROFISSIONAL & ASSINATURA</span>
            </div>

            {/* Input Parameter: Principal Designer */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                NOME PROFISSIONAL INTEGRADO
              </label>
              <input 
                type="text" 
                value={designerName} 
                onChange={(e) => setDesignerName(e.target.value)}
                className="bg-[#F7F6F3] border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] px-3 py-2 text-xs font-sans text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/20 transition-all"
                placeholder="Exemplo: Clara Gomes"
              />
            </div>

            {/* Input Parameter: Council Credentials / UXPA Registration */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs text-[#78716C] font-semibold uppercase tracking-wider">
                INSCRIÇÃO EM CORPO ÉTICO OU CONSELHO
              </label>
              <input 
                type="text" 
                value={designerId} 
                onChange={(e) => setDesignerId(e.target.value)}
                className="bg-[#F7F6F3] border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] px-3 py-2 text-xs font-mono text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/20 transition-all"
                placeholder="Exemplo: UXPA-BR / CRC"
              />
              <span className="text-[10px] text-[#78716C] leading-snug">
                Identificador impresso nos relatórios formais exportados e assinado no hash dos blocos.
              </span>
            </div>

            {/* Ledger Salt Block key */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs text-[#78716C] font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>SALT CRIPTOGRÁFICO DO LIVRO RAZÃO</span>
                <Lock className="h-3.5 w-3.5 text-[#A8A29E]" />
              </label>
              <input 
                type="password" 
                value={ledgerSalt} 
                onChange={(e) => setLedgerSalt(e.target.value)}
                className="bg-[#F7F6F3] border border-[#E7E5E4] focus:border-[#0D9488] rounded-[6px] px-3 py-2 text-xs font-mono text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/20 transition-all"
              />
            </div>
          </div>

          {/* SECTION 4: PREFERÊNCIAS DE INTERFACE DO LEDGER */}
          <div className="p-5 border border-[#E7E5E4] bg-white rounded-[6px] shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 font-sans text-xs tracking-wide text-[#0D9488] font-bold border-b border-[#E7E5E4] pb-2.5 uppercase">
              <Sliders className="h-4 w-4" />
              <span>PREFERÊNCIAS DO WORKSPACE</span>
            </div>

            {/* Checkbox item 1 */}
            <div className="flex items-start gap-3 p-1">
              <input 
                type="checkbox" 
                id="soundAlertsCheck"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-[4px] border-[#E7E5E4] bg-white text-[#0D9488] focus:ring-[#0D9488] focus:ring-offset-0 cursor-pointer accent-[#0D9488]"
              />
              <div className="flex flex-col gap-0.5 cursor-pointer">
                <label htmlFor="soundAlertsCheck" className="font-sans text-xs text-[#1C1917] font-bold">
                  Sinalizadores de Som de Perigo UX
                </label>
                <span className="text-[10px] text-[#78716C] leading-normal">
                  Executar bipes osciladores de síntese analógica no navegador quando novos riscos forem identificados na timeline.
                </span>
              </div>
            </div>

            {/* Checkbox item 2 */}
            <div className="flex items-start gap-3 p-1">
              <input 
                type="checkbox" 
                id="footerHashesCheck"
                checked={showFooterHashes}
                onChange={(e) => setShowFooterHashes(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded-[4px] border-[#E7E5E4] bg-white text-[#0D9488] focus:ring-[#0D9488] focus:ring-offset-0 cursor-pointer accent-[#0D9488]"
              />
              <div className="flex flex-col gap-0.5 cursor-pointer">
                <label htmlFor="footerHashesCheck" className="font-sans text-xs text-[#1C1917] font-bold">
                  Mostrar Auditoria de Caracteres no Rodapé
                </label>
                <span className="text-[10px] text-[#78716C] leading-normal">
                  Garante a exibição transparente do hash criptográfico ativo em tempo real na barra de estados do aplicativo.
                </span>
              </div>
            </div>

            {/* Informational block about ledger security */}
            <div className="mt-2 p-3.5 bg-[#F0FDF4] border border-[#DCFCE7] rounded-[6px] text-xs text-[#166534] leading-relaxed flex gap-3">
              <Info className="h-5 w-5 text-[#0D9488] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#15803d]">Integridade Protegida</strong>: Todas as alterações realizadas neste console de controle são salvas na camada de armazenamento seguro local de forma isolada, impedindo falsificação narrativa estrutural.
              </div>
            </div>
            
          </div>

        </div>
      </div>

    </div>
  );
}
