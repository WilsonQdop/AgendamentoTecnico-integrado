export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Category = 'HARDWARE' | 'SOFTWARE' | 'NETWORK';
export type TicketStatus = 'OPEN' | 'COMPLETED' | 'CANCELED' | 'ASSIGNED' | 'PAYMENT_PENDING' | 'IN_PROGRESS';
export type BackupFrequency = 'ONCE' | 'DAILY' | 'WEEKLY ' | 'MONTHLY';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  theme: 'light' | 'dark' | 'high_contrast';
  notifications: {
    emailCalls: boolean;
    smsAlerts: boolean;
    criticalOnly: boolean;
  };
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: Category;
  status: 'Ativo' | 'Ocupado' | 'Inativo';
  ticketsCount: number;
}

export interface TicketUpdate {
  id: string;
  comment: string;
  changeDate: string; // Já normalizaremos para string legível
  newStatus: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'PAYMENT_PENDING';
  oldStatus: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'PAYMENT_PENDING';
  updateBy: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'PAYMENT_PENDING';
  baseValue: number;
  finalValue: number;
  paymentConfirmed: boolean;
  creationDate: string;
  clientName: string;
  technicalName: string | null;
  technicalId: string | null; // UUID vindo do Java
  updates: TicketUpdate[];
  
  // Mantidos para compatibilidade com o restante do App
  location?: string;
  equipment?: string;
  clientId?: string;
  slaEstimate?: string;
  files?: any[];
}

export interface BackupHistory {
  id: string;
  type: 'Incremental' | 'Geral';
  size: string; // e.g. "12.4 GB"
  status: 'Sucesso' | 'Falha';
  date: string;
}

export interface BackupConfig {
  frequency: BackupFrequency;
  startDate: string;
  startHour: string;
  cloudSync: boolean;
  integrityCheck: boolean;
}
