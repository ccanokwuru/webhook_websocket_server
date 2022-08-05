export interface NotificationI {
  id: string;
  message: string;
  destination: "all" | "from_email" | "broadcast" | string | string[];
  sent?: boolean;
  createdAt: string | Date;
}

export interface EmailQueueI {
  id: string;
  message: string;
  sent?: boolean;
  to: "all" | string | string[];
  createdAt: string | Date;
}

export interface Schema {
  notifications: NotificationI[];

  email_queue: EmailQueueI[];
}
