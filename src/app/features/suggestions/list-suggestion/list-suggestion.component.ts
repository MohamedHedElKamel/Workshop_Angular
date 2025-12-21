import { Component, OnInit } from '@angular/core';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-list-suggestion',
  templateUrl: './list-suggestion.component.html',
  styleUrls: ['./list-suggestion.component.css'] 
})
export class ListSuggestionComponent implements OnInit {

  suggestions: Suggestion[] = [];
  favorites: Suggestion[] = [];
  searchText: string = "";

  constructor(private suggestionService: SuggestionService) {}

  ngOnInit() {
  this.suggestionService.getSuggestionsFromApi().subscribe({
    next: data => {
      this.suggestions = data.map((s: any) => ({
        ...s,
        likes: s.likes ?? s.nbLikes ?? 0 
      }));
    }
  });
}
  

  get filteredSuggestions() {
    return this.suggestions.filter(s =>
      s.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      s.category.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

likeSuggestion(s: Suggestion) {
  const newLikes = (s.likes ?? 0) + 1;

  this.suggestionService.likeSuggestion(s.id, newLikes).subscribe({
    next: () => {
      s.likes = newLikes; 
    },
    error: err => console.error(err)
  });
}



  addToFavorites(s: Suggestion) {
    if (!this.favorites.includes(s)) {
      this.favorites.push(s);
    }
  }

 deleteSuggestion(s: Suggestion) {
    if (!confirm(`Voulez-vous vraiment supprimer "${s.title}" ?`)) return;

    this.suggestionService.deleteSuggestion(s.id).subscribe({
      next: () => {
        this.suggestions = this.suggestions.filter(item => item.id !== s.id);
      },
      error: (err) => console.error('Erreur lors de la suppression :', err)
    });
  }

}
