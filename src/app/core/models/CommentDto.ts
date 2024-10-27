export interface CommentDto {
  commentID?: number; // Optional for POST
  text: string;
  ticketID: number;
  userID?: number; // Optional to capture user ID if needed
  createdOn?: Date; // Optional for display purposes
  userName?: string; // Optional if you want to show the user's name
  commentImage?: string | Blob; // To store the image path or URL
}
