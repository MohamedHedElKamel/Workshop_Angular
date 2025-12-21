import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrls: ['./suggestion-details.component.css']
})
export class SuggestionDetailsComponent implements OnInit {

  suggestion?: Suggestion;
  id!: number;
  suggestions: Suggestion[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    
    this.suggestionService.getSuggestionsFromApi().subscribe({
      next: data => this.suggestions = data,
      error: err => console.error('Erreur API liste suggestions:', err)
    });

   
    this.route.params.subscribe(params => {
      this.id = Number(params['id']);
      this.suggestionService.getSuggestionById(this.id).subscribe({
        next: s => {
          this.suggestion = s;
        },
        error: err => {
          console.error('Erreur API suggestion:', err);
          this.suggestion = undefined;
        }
      });
    });
  }

  goNext() {
    if (!this.suggestions || this.suggestions.length === 0) return;

    const sortedSuggestions = [...this.suggestions].sort((a, b) => a.id - b.id);
    const currentIndex = sortedSuggestions.findIndex(s => s.id === this.id);
    
    if (currentIndex !== -1 && currentIndex < sortedSuggestions.length - 1) {
      const nextId = sortedSuggestions[currentIndex + 1].id;
      this.router.navigate(['/suggestions', nextId]);
    }
  }
}