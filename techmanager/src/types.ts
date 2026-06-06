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
  date: string;
  author: string;
  comment: string;
  statusChange?: TicketStatus;
}

export interface Ticket {
  id: string;
  title: string;
  priority: Priority;
  category: Category;
  location: string;
  equipment: string;
  description: string;
  clientId: string;
  clientName: string;
  technical_id?: string;

  technical?: {
    id: string;
    name: string;
    email?: string;
  } | null;

  technicalId?: string; 
  technicalName?: string;
  assignedTechnicianId?: string;

  baseValue: number;
  finalValue: number;
  status: TicketStatus;
  creationDate: string;
  slaEstimate: string; // e.g. "4h", "24h", "3 dias"
  files: string[];     // Mock file names
  updates: TicketUpdate[];
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
