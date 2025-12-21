import { Injectable } from '@angular/core';
import { Suggestion } from '../../models/suggestion';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  constructor(private http: HttpClient) { }

    
    suggestionUrl ='http://localhost:3000/suggestions'

    getSuggestionsFromApi(): Observable<Suggestion[]> {
      return this.http.get<Suggestion[]>(this.suggestionUrl);
    }

    getSuggestionById(id: number): Observable<Suggestion> {
      return this.http.get<any>(`${this.suggestionUrl}/${id}`).pipe(
        map(response => {
          
          const suggestion = response.suggestion || response;
         
          return {
            ...suggestion,
            date: new Date(suggestion.date)
          };
        })
      );
    }

    deleteSuggestion(id: number): Observable<void> {
      return this.http.delete<void>(`${this.suggestionUrl}/${id}`);
    }

    addSuggestion(suggestion: Omit<Suggestion, 'id'>): Observable<Suggestion> {
      return this.http.post<Suggestion>(this.suggestionUrl, suggestion);
    }
   
   updateSuggestion(id: number, data: Partial<Suggestion>) {
  return this.http.put<Suggestion>(
    `${this.suggestionUrl}/${id}`,
    data
  );
}

likeSuggestion(id: number, likes: number) {
  return this.http.put(
    `http://localhost:3000/suggestions/${id}/like`,
    { likes }
  );
}


}