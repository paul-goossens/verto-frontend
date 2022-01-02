import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { LanguageModel } from '../models/language.model';
import { TranslationModel } from '../models/translation.model';
import { LanguagesService } from '../services/languages.service';
import { TranslationsService } from '../services/translations.service';

export interface Data {
  language: LanguageModel;
  translations: TranslationModel[];
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  data: Data[];

  constructor(
    private languageService: LanguagesService,
    private translationService: TranslationsService
  ) {
    this.data = [];
  }

  ngOnInit(): void {
    this.initLanguages();
  }

  private initLanguages(): void {
    this.languageService
      .getLanguages()
      .pipe(
        tap(languages => {
          languages.forEach(language => {
            this.initTranslations(language);
          });
        })
      )
      .subscribe();
  }

  private initTranslations(language: LanguageModel) {
    this.translationService
      .getTranslations(language.guid)
      .pipe(
        tap(translations => {
          this.initData(language, translations);
        })
      )
      .subscribe();
  }

  private initData(language: LanguageModel, translations: TranslationModel[]) {
    this.data.push({
      language,
      translations,
    });
  }
}
