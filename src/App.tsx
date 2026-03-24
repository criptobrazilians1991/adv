import { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Send, Shield, Anchor, Plane, Info, AlertTriangle, Download, Trash2, X } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MilitaryGuidePDF } from './components/MilitaryGuidePDF';
import { Logo } from './components/Logo';
import { NewsMarquee } from './components/NewsMarquee';

type Branch = 'Marinha' | 'Exército' | 'Aeronáutica';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
}

export default function App() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(() => {
    return (localStorage.getItem('militaryChatBranch') as Branch) || null;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('militaryChatMessages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem('militaryChatBranch', selectedBranch);
    } else {
      localStorage.removeItem('militaryChatBranch');
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('militaryChatMessages', JSON.stringify(messages));
    } else {
      localStorage.removeItem('militaryChatMessages');
    }
  }, [messages]);

  // Initialize chat from localStorage on mount if needed
  useEffect(() => {
    if (selectedBranch && !chatRef.current) {
      const systemInstruction = `Você é um advogado especialista em Direito Militar Brasileiro, com profundo conhecimento no Estatuto dos Militares (Lei nº 6.880/1980), na Constituição Federal, em jurisprudências (STF, STJ, STM) e nas normativas internas da Marinha, Exército e Aeronáutica.
Sua função é orientar militares sobre seus direitos e deveres.
Você deve analisar os casos apresentados à luz da hierarquia das leis, identificando quando portarias, regulamentos ou ordens internas (RDE, RDAER, RDM, etc.) podem ser inconstitucionais ou ilegais por ferirem o Estatuto dos Militares ou a Constituição.
Forneça respostas claras, objetivas e fundamentadas legalmente, citando artigos e leis quando pertinente.
O usuário informou que pertence à seguinte Força Armada: ${selectedBranch}. Adapte sua resposta considerando as peculiaridades dessa Força, mas sempre respeitando a hierarquia normativa.`;

      const firstUserIndex = messages.findIndex(m => m.role === 'user');
      let history: any[] = [];
      
      if (firstUserIndex !== -1) {
        const relevantMessages = messages.slice(firstUserIndex);
        history = relevantMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));
      }

      chatRef.current = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: {
          systemInstruction,
          temperature: 0.2,
        },
        history: history.length > 0 ? history : undefined,
      });

      if (messages.length === 0) {
        setMessages([
          {
            id: Date.now().toString(),
            role: 'model',
            content: `Olá! Sou seu assistente jurídico especializado no Estatuto dos Militares e Direito Militar. Como você serve na **${selectedBranch}**, levarei em consideração as normativas específicas da sua Força, sempre à luz da Constituição e do Estatuto (Lei 6.880/80).\n\nComo posso orientá-lo hoje sobre seus direitos ou deveres?`
          }
        ]);
      }
    }
  }, [selectedBranch, messages, ai]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setMessages([]); // Clear messages to trigger the initialization effect with a clean slate
    chatRef.current = null;
  };

  const handleClearHistory = () => {
    setSelectedBranch(null);
    setMessages([]);
    chatRef.current = null;
    localStorage.removeItem('militaryChatBranch');
    localStorage.removeItem('militaryChatMessages');
    setShowClearConfirm(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: modelMessageId, role: 'model', content: '', isStreaming: true },
    ]);

    try {
      const responseStream = await chatRef.current.sendMessageStream({
        message: userMessage.content,
      });

      let fullResponse = '';
      for await (const chunk of responseStream) {
        fullResponse += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMessageId
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedBranch) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NewsMarquee />
        <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4">
          <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-slate-900 p-6 sm:p-8 text-center text-white flex flex-col items-center">
            <Logo size={48} light className="mb-4 sm:mb-6 scale-75 sm:scale-100" />
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
              Seu assistente especializado em Direito Militar Brasileiro, focado na Lei 6.880/1980 e hierarquia constitucional.
            </p>
          </div>
          
          <div className="p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 text-center">
              Para um atendimento personalizado, selecione a Força em que você serve:
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => handleBranchSelect('Marinha')}
                className="flex flex-row sm:flex-col items-center justify-start sm:justify-center p-4 sm:p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group gap-4 sm:gap-0"
              >
                <Anchor className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 group-hover:text-blue-600 sm:mb-3 shrink-0" />
                <span className="font-semibold text-slate-700 group-hover:text-blue-700 text-left sm:text-center">Marinha do Brasil</span>
              </button>
              
              <button
                onClick={() => handleBranchSelect('Exército')}
                className="flex flex-row sm:flex-col items-center justify-start sm:justify-center p-4 sm:p-6 border-2 border-slate-200 rounded-xl hover:border-emerald-600 hover:bg-emerald-50 transition-all group gap-4 sm:gap-0"
              >
                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 group-hover:text-emerald-600 sm:mb-3 shrink-0" />
                <span className="font-semibold text-slate-700 group-hover:text-emerald-700 text-left sm:text-center">Exército Brasileiro</span>
              </button>
              
              <button
                onClick={() => handleBranchSelect('Aeronáutica')}
                className="flex flex-row sm:flex-col items-center justify-start sm:justify-center p-4 sm:p-6 border-2 border-slate-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all group gap-4 sm:gap-0"
              >
                <Plane className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 group-hover:text-sky-600 sm:mb-3 shrink-0" />
                <span className="font-semibold text-slate-700 group-hover:text-sky-700 text-left sm:text-center">Força Aérea Brasileira</span>
              </button>
            </div>

            <div className="mt-6 sm:mt-8 flex justify-center">
              <PDFDownloadLink
                document={<MilitaryGuidePDF />}
                fileName="Guia_Procedimentos_Militares.pdf"
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 sm:px-6 py-3 rounded-xl transition-colors shadow-sm w-full sm:w-auto"
              >
                {({ loading }) => (
                  <>
                    <Download className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-medium text-sm sm:text-base">
                      {loading ? 'Gerando PDF...' : 'Baixar Resumo de Procedimentos'}
                    </span>
                  </>
                )}
              </PDFDownloadLink>
            </div>

            <div className="mt-6 sm:mt-8 bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-amber-800">
                <strong>Aviso Legal:</strong> Esta IA fornece orientações baseadas no Estatuto dos Militares e jurisprudência, mas não substitui a consulta formal a um advogado especialista ou à assessoria jurídica da sua Organização Militar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <NewsMarquee />
      {/* Header */}
      <header className="bg-slate-900 text-white p-2 sm:p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="shrink-0 scale-75 sm:scale-100 origin-left">
            <Logo size={24} light />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-red-900/50 hover:bg-red-800/80 text-red-200 px-2 sm:px-3 py-1.5 rounded-full border border-red-800/50 transition-colors"
              title="Limpar Histórico"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Limpar Histórico</span>
            </button>

            <PDFDownloadLink
              document={<MilitaryGuidePDF />}
              fileName="Guia_Procedimentos_Militares.pdf"
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 hover:bg-slate-700 px-2 sm:px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
              title="Baixar Guia"
            >
              {({ loading }) => (
                <>
                  <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-slate-200 hidden sm:inline">
                    {loading ? 'Gerando...' : 'Baixar Guia'}
                  </span>
                </>
              )}
            </PDFDownloadLink>

            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 px-2 sm:px-3 py-1.5 rounded-full border border-slate-700">
              {selectedBranch === 'Marinha' && <Anchor className="w-4 h-4 text-blue-400 shrink-0" />}
              {selectedBranch === 'Exército' && <Shield className="w-4 h-4 text-emerald-400 shrink-0" />}
              {selectedBranch === 'Aeronáutica' && <Plane className="w-4 h-4 text-sky-400 shrink-0" />}
              <span className="text-xs sm:text-sm font-medium text-slate-200 hidden sm:inline">{selectedBranch}</span>
              <span className="text-xs font-medium text-slate-200 sm:hidden">
                {selectedBranch === 'Marinha' ? 'MB' : selectedBranch === 'Exército' ? 'EB' : 'FAB'}
              </span>
              <button 
                onClick={() => setSelectedBranch(null)}
                className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-slate-400 hover:text-white underline"
              >
                Trocar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Clear History Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Limpar Histórico</h3>
              <button onClick={() => setShowClearConfirm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja apagar toda a conversa atual? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Sim, limpar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[95%] sm:max-w-[90%] md:max-w-[80%] rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                }`}
              >
                {msg.role === 'model' ? (
                  <div className="markdown-body prose prose-sm sm:prose-base prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-100 prose-pre:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-800">
                    <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                    {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-slate-400 animate-pulse" />
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm sm:text-base">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-2 sm:p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="flex items-end gap-1.5 sm:gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-1.5 sm:p-2 focus-within:ring-2 focus-within:ring-slate-800 focus-within:border-transparent transition-all shadow-sm"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Descreva sua dúvida..."
              className="flex-1 max-h-32 min-h-[40px] sm:min-h-[44px] bg-transparent border-none resize-none focus:outline-none p-2 text-sm sm:text-base text-slate-800 placeholder-slate-400"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 sm:p-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 mb-0.5"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-1.5 sm:mt-2 text-center">
            <p className="text-[10px] sm:text-xs text-slate-500 flex items-center justify-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              A IA pode cometer erros. Verifique informações importantes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
