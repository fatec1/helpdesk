/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  PlusCircle, 
  BarChart3, 
  LogOut, 
  Bell, 
  Search, 
  User as UserIcon,
  HelpCircle,
  Settings,
  ChevronRight,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, TicketStatus, User, ViewType, TicketPriority } from './types';

// --- Mock Data ---
const MOCK_USER: User = {
  id: 'u1',
  name: 'João Silva',
  email: 'joao.silva@empresa.com',
  role: 'user',
  department: 'Marketing',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80'
};

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'CH-2024-001',
    title: 'Problema com acesso à VPN',
    description: 'Não consigo conectar à VPN da empresa desde hoje cedo. Apresenta erro de timeout.',
    status: 'Em Andamento',
    priority: 'Alta',
    category: 'Redes',
    requesterId: 'u1',
    requesterName: 'João Silva',
    assigneeId: 't1',
    assigneeName: 'Carlos Técnico',
    createdAt: '2026-05-08T10:30:00Z',
    updatedAt: '2026-05-08T14:20:00Z',
    messages: [
      { id: 'm1', senderId: 'u1', senderName: 'João Silva', text: 'Não consigo conectar à VPN.', timestamp: '2026-05-08T10:30:00Z' },
      { id: 'm2', senderId: 'system', senderName: 'Sistema', text: 'Chamado atribuído ao técnico Carlos.', timestamp: '2026-05-08T10:35:00Z', isSystem: true },
      { id: 'm3', senderId: 't1', senderName: 'Carlos Técnico', text: 'Olá João, estou verificando seu acesso no firewall.', timestamp: '2026-05-08T14:20:00Z' }
    ]
  },
  {
    id: 'CH-2024-002',
    title: 'Impressora do RH não imprime colorido',
    description: 'A impressora HP do RH está saindo apenas em preto e branco mesmo com cartuchos cheios.',
    status: 'Aberto',
    priority: 'Média',
    category: 'Hardware',
    requesterId: 'u1',
    requesterName: 'João Silva',
    createdAt: '2026-05-09T08:15:00Z',
    updatedAt: '2026-05-09T08:15:00Z',
    messages: []
  },
  {
    id: 'CH-2024-003',
    title: 'Troca de Senha Expirada',
    description: 'Minha senha do Windows expirou e não estou conseguindo resetar pelo portal.',
    status: 'Resolvido',
    priority: 'Alta',
    category: 'Contas',
    requesterId: 'u1',
    requesterName: 'João Silva',
    assigneeName: 'Ana Suporte',
    createdAt: '2026-05-07T09:00:00Z',
    updatedAt: '2026-05-07T10:15:00Z',
    messages: [
      { id: 'm4', senderId: 'u1', senderName: 'João Silva', text: 'Senha expirada, preciso de ajuda.', timestamp: '2026-05-07T09:00:00Z' },
      { id: 'm5', senderId: 'system', senderName: 'Sistema', text: 'Chamado resolvido com sucesso.', timestamp: '2026-05-07T10:15:00Z', isSystem: true }
    ]
  }
];

// --- Components ---

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const styles = {
    'Aberto': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Em Andamento': 'bg-amber-100 text-amber-700 border-amber-200',
    'Pendente': 'bg-purple-100 text-purple-700 border-purple-200',
    'Resolvido': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Cancelado': 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const styles = {
    'Baixa': 'bg-slate-50 text-slate-600',
    'Média': 'bg-indigo-50 text-indigo-600',
    'Alta': 'bg-orange-50 text-orange-600',
    'Crítica': 'bg-red-50 text-red-600',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${styles[priority]}`}>
      {priority}
    </span>
  );
};

// --- View: Login ---
const LoginView = ({ onLogin }: { onLogin: () => void }) => {
  const [showRecover, setShowRecover] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <TicketIcon className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">OmniSupport</h1>
          <p className="text-slate-500 text-sm">Central de Atendimento Interno</p>
        </div>

        {!showRecover ? (
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail Corporativo</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900"
                placeholder="nome.sobrenome@empresa.com"
                defaultValue="joao.silva@empresa.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Senha</label>
                <button 
                  type="button"
                  onClick={() => setShowRecover(true)}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900"
                placeholder="••••••••"
                defaultValue="password123"
              />
            </div>
            <div className="flex items-center">
              <input 
                id="remember" 
                type="checkbox" 
                className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" 
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">Lembrar acesso</label>
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-100 transition-colors flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : 'Entrar no Sistema'}
            </button>
          </form>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Recuperar Senha</h3>
            <p className="text-sm text-slate-500 mb-6 font-normal">Insira seu e-mail corporativo para receber as instruções de redefinição.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail Corporativo</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="exemplo@empresa.com"
                />
              </div>
              <button 
                onClick={() => {
                  alert('E-mail enviado! Verifique sua caixa de entrada.');
                  setShowRecover(false);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg"
              >
                Enviar Instruções
              </button>
              <button 
                onClick={() => setShowRecover(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg transition-colors"
              >
                Voltar ao Login
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">© 2026 OmniSupport Technology. Todos os direitos reservados.</p>
        </div>
      </motion.div>
    </div>
  );
};

// --- View: Dashboard ---
const DashboardView = ({ tickets, user, setView, setCurrentTicket }: { 
  tickets: Ticket[], 
  user: User, 
  setView: (v: ViewType) => void,
  setCurrentTicket: (t: Ticket) => void
}) => {
  const stats = [
    { label: 'Meus Chamados', value: tickets.length, icon: TicketIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Em Andamento', value: tickets.filter(t => t.status === 'Em Andamento').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Resolvidos', value: tickets.filter(t => t.status === 'Resolvido').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Critérios de SLA', value: '98%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Olá, {user.name.split(' ')[0]}</h2>
          <p className="text-slate-500">Veja o que está acontecendo com seus suportes hoje.</p>
        </div>
        <button 
          onClick={() => setView('CREATE_TICKET')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <PlusCircle size={20} />
          Novo Chamado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={22} />
            </div>
            <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Atividades Recentes</h3>
            <button 
              onClick={() => setView('TICKET_LIST')}
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              Ver todos
            </button>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            {tickets.map((ticket, i) => (
              <div 
                key={ticket.id} 
                onClick={() => {
                  setCurrentTicket(ticket);
                  setView('TICKET_DETAIL');
                }}
                className={`p-5 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${i !== tickets.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  ticket.status === 'Resolvido' ? 'bg-emerald-50 text-emerald-600' : 
                  ticket.status === 'Em Andamento' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <TicketIcon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-semibold text-slate-900 truncate pr-4">{ticket.title}</h4>
                    <span className="text-xs text-slate-400 font-mono flex-shrink-0">{ticket.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={ticket.status} />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
                <ChevronRight className="text-slate-300" size={20} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Acesso Rápido</h3>
          <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <HelpCircle size={80} />
            </div>
            <h4 className="text-lg font-semibold mb-2">Central de Ajuda</h4>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Encontre FAQs, tutoriais e manuais para resolver problemas comuns rapidamente.
            </p>
            <button className="bg-white/10 hover:bg-white/20 text-white w-full py-2.5 rounded-lg font-medium text-sm transition-colors border border-white/10">
              Acessar FAQ
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Bell size={20} />
              </div>
              <h4 className="font-semibold text-slate-900">Notificações</h4>
            </div>
            <div className="space-y-3">
              <div className="text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-medium text-slate-800">Manutenção Programada</p>
                <p className="text-slate-500 text-xs mt-0.5">O sistema de Wi-Fi ficará offline hoje às 18h no Bloco B.</p>
              </div>
              <div className="text-sm p-3 bg-slate-50 rounded-lg border border-slate-100 opacity-60">
                <p className="font-medium text-slate-800">Troca de Senha</p>
                <p className="text-slate-500 text-xs mt-0.5">Sua senha de rede expira em 3 dias.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- View: Ticket List ---
const TicketListView = ({ tickets, setCurrentTicket, setView }: { 
  tickets: Ticket[], 
  setCurrentTicket: (t: Ticket) => void,
  setView: (v: ViewType) => void 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Lista de Chamados</h2>
          <p className="text-slate-500">Gerencie e acompanhe todos os seus suportes.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar chamados..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assunto</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Prioridade</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Criado em</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{ticket.id}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{ticket.title}</p>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{ticket.category}</p>
                </td>
                <td className="px-6 py-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => {
                      setCurrentTicket(ticket);
                      setView('TICKET_DETAIL');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- View: Create Ticket ---
const CreateTicketView = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (t: Partial<Ticket>) => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'Média' as TicketPriority,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Novo Chamado</h2>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Assunto do Chamado *</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Não consigo acessar minha conta..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <p className="mt-1 text-xs text-slate-400">Seja breve e objetivo no título.</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Categoria *</label>
              <select 
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Selecione uma categoria</option>
                <option value="Hardware">Hardware / Computadores</option>
                <option value="Redes">Redes / Internet</option>
                <option value="Sistemas">Sistemas Internos / ERP</option>
                <option value="Contas">Acesso e Senhas</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Prioridade *</label>
              <div className="flex gap-2">
                {(['Baixa', 'Média', 'Alta'] as TicketPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      formData.priority === p 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição Detalhada *</label>
              <textarea 
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="Descreva o problema com o máximo de detalhes possível para agilizar o atendimento..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-4">
            <button 
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              Abrir chamado agora
            </button>
            <button 
              type="button"
              onClick={onBack}
              className="px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex gap-4">
        <HelpCircle className="text-indigo-600 flex-shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-bold text-indigo-900 mb-1">Dica de Eficiência</h4>
          <p className="text-xs text-indigo-700 leading-relaxed">
            Chamados com descrições detalhadas e categorias corretas costumam ser resolvidos **30% mais rápido** pela equipe técnica.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- View: Ticket Detail ---
const TicketDetailView = ({ ticket, onBack }: { ticket: Ticket, onBack: () => void }) => {
  const [msgInput, setMsgInput] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft size={20} />
          </button>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 truncate max-w-xl font-display">{ticket.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs font-semibold text-indigo-600">{ticket.id}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">Aberto em {new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
            </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Informações do Problema</h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[500px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-indigo-600" size={18} />
              <h3 className="font-bold text-slate-800">Linha do Tempo e Conversa</h3>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {ticket.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <MessageSquare size={48} className="opacity-20" />
                <p className="text-sm font-medium">Nenhuma mensagem ainda.</p>
              </div>
            ) : (
              ticket.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : msg.senderId === MOCK_USER.id ? 'justify-end' : 'justify-start'}`}>
                  {msg.isSystem ? (
                    <div className="bg-slate-200/50 px-4 py-1.5 rounded-full border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{msg.text}</p>
                    </div>
                  ) : (
                    <div className={`max-w-[80%] space-y-1 ${msg.senderId === MOCK_USER.id ? 'items-end' : 'items-start'}`}>
                      <p className="text-[10px] font-bold text-slate-400 px-1 uppercase">{msg.senderName}</p>
                      <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                        msg.senderId === MOCK_USER.id 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium px-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Envie uma mensagem ou atualização..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
              />
              <button 
                disabled={!msgInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                Enviar
              </button>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 text-center">Utilize o chat para agilizar o suporte e tirar dúvidas rápidas.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Estado Atual</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Status</label>
                <div className="w-full">
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Prioridade</label>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Técnico Responsável</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <UserIcon size={14} className="text-slate-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{ticket.assigneeName || 'Não atribuído'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ações de Resolvimento</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-bold hover:bg-emerald-100 transition-colors">Marcar como Resolvido</button>
              <button className="w-full px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">Reabrir Chamado</button>
              <button className="w-full px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">Cancelar Solicitação</button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center text-center">
          <HelpCircle className="text-slate-400 mb-3" size={32} />
          <h4 className="font-bold text-slate-900 mb-1">Alguma dúvida?</h4>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">Se este chamado não resolve seu problema completamente, você pode ligar para o ramal **5544**.</p>
          <button className="text-indigo-600 font-bold text-xs hover:underline uppercase tracking-wider">Ver FAQ Relacionado</button>
        </div>
      </div>
    </div>
  );
};

// --- View: Analytics ---
const AnalyticsView = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Painel Técnico e Estatísticas</h2>
        <p className="text-slate-500">Monitoramento global de desempenho e saúde do suporte.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tempo Médio Resposta', value: '45 min', sub: '-12% vs último mês' },
          { label: 'Resolução no 1º Contato', value: '64%', sub: '+3% vs último mês' },
          { label: 'Satisfação do Usuário', value: '4.8/5.0', sub: 'Baseado em 142 votos' },
          { label: 'Fila de Pendentes', value: '18', sub: 'Tendência de queda' },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="text-3xl font-bold text-slate-900">{item.value}</p>
            <p className="text-xs text-indigo-500 mt-2 font-medium">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm h-80 flex flex-col items-center justify-center text-slate-400">
          <BarChart3 size={48} className="mb-4 opacity-20" />
          <p className="font-medium">Distribuição por Categoria</p>
          <p className="text-xs mt-1">(Visualização Gráfica de demonstração)</p>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm h-80 flex flex-col items-center justify-center text-slate-400">
          <div className="flex gap-2 items-end h-32 mb-6">
            <div className="w-8 bg-indigo-100 rounded-t-lg h-1/2"></div>
            <div className="w-8 bg-indigo-200 rounded-t-lg h-3/4"></div>
            <div className="w-8 bg-indigo-400 rounded-t-lg h-full"></div>
            <div className="w-8 bg-indigo-600 rounded-t-lg h-2/3"></div>
            <div className="w-8 bg-indigo-300 rounded-t-lg h-1/3"></div>
          </div>
          <p className="font-medium">Volume de Chamados (Semana)</p>
          <p className="text-xs mt-1">(Tendência de volume diário)</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Técnicos em Destaque</h3>
          <span className="text-xs font-bold text-slate-500 uppercase">Mês de Maio</span>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Carlos Técnico', solved: 45, rating: 4.9, avatar: 'CT' },
            { name: 'Ana Suporte', solved: 42, rating: 5.0, avatar: 'AS' },
            { name: 'Marcos TI', solved: 38, rating: 4.7, avatar: 'MT' },
          ].map((tech, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {tech.avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{tech.name}</p>
                  <p className="text-xs text-slate-500">{tech.solved} chamados resolvidos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-500">★ {tech.rating}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Avaliação Média</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App Entry ---
export default function App() {
  const [view, setView] = useState<ViewType>('LOGIN'); // Start with LOGIN
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Heuristic #1: Visibility of system status
  // Feedbacks are handled via state and transitions

  const handleCreateTicket = (data: Partial<Ticket>) => {
    const newTicket: Ticket = {
      id: `CH-2024-00${tickets.length + 1}`,
      title: data.title || 'Sem Título',
      description: data.description || '',
      category: data.category || 'Outros',
      priority: data.priority || 'Média',
      status: 'Aberto',
      requesterId: MOCK_USER.id,
      requesterName: MOCK_USER.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    
    setTickets([newTicket, ...tickets]);
    setView('DASHBOARD');
    // Heuristic #1 & #3: Action feedback
    alert('Chamado aberto com sucesso!');
  };

  const SidebarItem = ({ icon: Icon, label, id, active }: { icon: any, label: string, id: ViewType, active: boolean }) => (
    <button 
      onClick={() => setView(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
      }`}
    >
      <Icon size={20} className={active ? 'text-white' : 'group-hover:text-blue-600 text-slate-400'} />
      <span className={`font-semibold text-sm ${!isSidebarOpen && 'hidden md:block lg:hidden'}`}>{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1 h-1 bg-white rounded-full" />}
    </button>
  );

  if (view === 'LOGIN') return <LoginView onLogin={() => setView('DASHBOARD')} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 z-50 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-100">
            <TicketIcon className="text-white" size={24} />
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight font-display">OmniSupport</h1>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" id="DASHBOARD" active={view === 'DASHBOARD'} />
          <SidebarItem icon={TicketIcon} label="Chamados" id="TICKET_LIST" active={view === 'TICKET_LIST' || view === 'TICKET_DETAIL'} />
          <SidebarItem icon={PlusCircle} label="Novo Chamado" id="CREATE_TICKET" active={view === 'CREATE_TICKET'} />
          <SidebarItem icon={BarChart3} label="Estatísticas" id="ANALYTICS" active={view === 'ANALYTICS'} />
        </nav>

        <div className="px-4 py-6 border-t border-slate-100 space-y-2">
          <SidebarItem icon={Settings} label="Configurações" id="DASHBOARD" active={false} />
          <SidebarItem icon={HelpCircle} label="Ajuda / FAQ" id="DASHBOARD" active={false} />
          <button 
            onClick={() => setView('LOGIN')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold text-sm"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Breadcrumbs - Heuristic #4 & #6 */}
            <nav className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">SISTEMA</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-slate-900">{view.replace('_', ' ')}</span>
          </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 tracking-tight leading-none">{MOCK_USER.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{MOCK_USER.department}</p>
              </div>
              <img 
                src={MOCK_USER.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm transition-transform hover:scale-105 cursor-pointer"
              />
            </div>
          </div>
        </header>

        {/* Content View Rendering */}
        <section className="p-8 pb-12 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'DASHBOARD' && (
                <DashboardView 
                  tickets={tickets} 
                  user={MOCK_USER} 
                  setView={setView} 
                  setCurrentTicket={setCurrentTicket}
                />
              )}
              {view === 'TICKET_LIST' && (
                <TicketListView 
                  tickets={tickets} 
                  setCurrentTicket={setCurrentTicket}
                  setView={setView}
                />
              )}
              {view === 'CREATE_TICKET' && (
                <CreateTicketView 
                  onBack={() => setView('DASHBOARD')}
                  onSubmit={handleCreateTicket}
                />
              )}
              {view === 'TICKET_DETAIL' && currentTicket && (
                <TicketDetailView 
                  ticket={currentTicket}
                  onBack={() => setView('TICKET_LIST')}
                />
              )}
              {view === 'ANALYTICS' && (
                <AnalyticsView />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Footer info - Help & Doc */}
        <footer className="mt-auto px-8 py-6 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs">
          <div className="flex gap-6">
            <button className="hover:text-blue-600 transition-colors">Termos de Uso</button>
            <button className="hover:text-blue-600 transition-colors">Política de Privacidade</button>
            <button className="hover:text-blue-600 transition-colors">Suporte ao Sistema</button>
          </div>
          <p>© 2026 OmniSupport Tech. Versão v2.4.0-stable</p>
        </footer>
      </main>
    </div>
  );
}
