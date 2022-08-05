export interface Schema {
  notifications: {
    id: string;
    message: string;
    destination: "all" | "from_email" | "broadcast" | string | string[];
    createdAt: string | Date;
  }[];

  email_queue: {
    message: string;
    to: "all" | string | string[];
    createdAt: string | Date;
  }[];
}
