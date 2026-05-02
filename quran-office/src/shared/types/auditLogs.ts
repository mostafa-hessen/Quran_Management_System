export type AuditAction = 
  | "CREATE_STUDENT" 
  | "UPDATE_STUDENT" 
  | "DELETE_STUDENT"
  | "CREATE_HALAQA"
  | "UPDATE_HALAQA"
  | "DELETE_HALAQA";

export interface AuditLog {
  log_id: string;
  action_type: AuditAction;
  entity_id: string; // studentId or halaqaId
  created_at: string;
  changes?: {
    previous_data?: any;
    new_data?: any;
  };
  metadata?: Record<string, any>;
}

export interface CreateAuditLogInput {
  action_type: AuditAction;
  entity_id: string;
  changes?: {
    previous_data?: any;
    new_data?: any;
  };
  metadata?: Record<string, any>;
}
