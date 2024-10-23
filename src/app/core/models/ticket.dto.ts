export interface TicketDto {
  ticketID?: number;
  title: string;
  description: string;
  submissionDate?: Date;
  statusID: number;
  statusName?: string;
  priorityID: number;
  priorityName?: string;
  userID: number;
  userName?: string;
  categoryID: number;
  categoryName?: string;
}
