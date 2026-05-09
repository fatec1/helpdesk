/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TicketStatus = 'Aberto' | 'Em Andamento' | 'Pendente' | 'Resolvido' | 'Cancelado';
export type TicketPriority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'technician' | 'admin';
  avatar?: string;
  department?: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  requesterId: string;
  requesterName: string;
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export type ViewType = 'LOGIN' | 'DASHBOARD' | 'TICKET_LIST' | 'CREATE_TICKET' | 'TICKET_DETAIL' | 'ANALYTICS';
