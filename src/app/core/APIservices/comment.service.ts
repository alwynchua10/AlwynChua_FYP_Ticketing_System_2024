import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDto } from '../models/CommentDto';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'https://localhost:7179/api/Comments'; // Update with your API base URL

  constructor(private http: HttpClient) {}

  getComments(ticketID: number): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${this.baseUrl}?ticketId=${ticketID}`);
  }

  postComment(comment: CommentDto): Observable<CommentDto> {
    const formData = new FormData();
    formData.append('text', comment.text);

    // Check if ticketID is defined before converting to string
    if (comment.ticketID !== undefined) {
      formData.append('ticketID', comment.ticketID.toString());
    } else {
      console.error('ticketID is undefined'); // Log an error if ticketID is not provided
    }

    // Check if commentImage is provided
    if (comment.commentImage) {
      formData.append('commentImage', comment.commentImage); // Ensure this is the correct type (Blob or File)
    }

    // Log the formData contents for debugging
    console.log('Submitting comment:', formData);

    return this.http.post<CommentDto>(this.baseUrl, formData);
  }
}
