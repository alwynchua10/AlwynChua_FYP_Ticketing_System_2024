import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
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

    if (comment.ticketID !== undefined) {
      formData.append('ticketID', comment.ticketID.toString());
    } else {
      console.error('ticketID is undefined');
    }

    if (comment.commentImage) {
      formData.append('commentImage', comment.commentImage);
    }

    // Retrieve token from local storage and set the Authorization header
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Update 'token' if needed
    });

    return this.http.post<CommentDto>(this.baseUrl, formData, { headers });
  }
}
