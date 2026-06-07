export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Category = 'HARDWARE' | 'SOFTWARE' | 'NETWORK';
export type TicketStatus = 'OPEN' | 'COMPLETED' | 'CANCELED' | 'ASSIGNED' | 'PAYMENT_PENDING' | 'IN_PROGRESS';
export type BackupFrequency = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

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

/** Resposta do POST /api/backups/trigger e POST /api/backups/restore */
export interface BackupMessageResponse {
  message: string;
}
 
/** Resposta do POST /api/backups/schedule e DELETE /api/backups/schedule/cancel */
export interface ScheduleBackupResponse {
  message: string;
  frequency: BackupFrequency | null;
  nextExecution: string | null; // ISO LocalDateTime serializado pelo Jackson
  active: boolean;
}
 
/**
 * Registro local de backups executados manualmente.
 * O backend não tem endpoint de listagem — mantemos histórico no localStorage.
 */
export interface BackupHistory {
  id: string;
  fileName: string;        // nome real do arquivo gerado pelo backend
  triggeredAt: string;     // ISO string
  status: 'Sucesso' | 'Falha';
  message: string;
}
 
/** Estado do agendamento ativo (guardado localmente) */
export interface BackupScheduleState {
  active: boolean;
  frequency: BackupFrequency | null;
  nextExecution: string | null;
}
 
