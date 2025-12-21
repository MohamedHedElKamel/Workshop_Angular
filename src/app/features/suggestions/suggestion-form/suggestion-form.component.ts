import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SuggestionService } from '../../../core/services/suggestion.service';
import { Suggestion } from '../../../models/suggestion';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private suggestionService: SuggestionService,
     
  ) {}

  id!: number;
isEdit = false;

ngOnInit() {
  this.form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(30)]],
    category: ['', Validators.required],
    date: [{ value: new Date(), disabled: true }],
    status: [{ value: 'en attente', disabled: true }]
  });

  this.route.params.subscribe(params => {
    if (params['id']) {
      this.isEdit = true;
      this.id = +params['id'];

      this.suggestionService.getSuggestionById(this.id).subscribe(s => {
        this.form.patchValue({
          title: s.title,
          description: s.description,
          category: s.category,
          date: s.date,
          status: s.status
        });
      });
    }
  });
}


 submit() {
  if (this.form.invalid) return;

  const newSuggestion = {
    title: this.form.get('title')?.value,
    description: this.form.get('description')?.value,
    category: this.form.get('category')?.value,
    date: new Date(),
    status: 'en attente',
    likes: 0 
  };

  this.suggestionService.addSuggestion(newSuggestion).subscribe({
    next: () => this.router.navigate(['/suggestions']),
    error: err => console.error('Erreur ajout', err)
  });
}

}
