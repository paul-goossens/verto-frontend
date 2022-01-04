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

export interface RowValues {
  guid: string;
  languageGuid: string;
  value: string;
}

export interface Row {
  key: string;
  values: RowValues[];
  isGroup: boolean;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  languages: LanguageModel[];
  table: Row[];

  constructor(
    private languageService: LanguagesService,
    private translationService: TranslationsService
  ) {
    this.languages = [];
    this.table = [];
  }

  ngOnInit(): void {
    this.initLanguages();
  }

  private initLanguages(): void {
    this.languageService
      .getLanguages()
      .pipe(
        tap(languages => {
          this.languages = languages;
          this.languages.forEach(language => {
            this.initTranslations(language);
          });
        })
      )
      .subscribe();
  }

  private initTranslations(language: LanguageModel) {
    const { guid } = language;
    this.translationService
      .getTranslations(guid)
      .pipe(
        tap(translations => {
          const table = translations.map(translation => {
            const { guid, key, value, isGroup, languageGuid } = translation;

            const values = [
              {
                guid,
                languageGuid,
                value,
              },
            ];

            return {
              key,
              isGroup,
              values,
            };
          });

          if (this.table.length > 0) {
            this.table = this.mergeTables(this.table, table);
          } else {
            this.table = table;
          }
        })
      )
      .subscribe();
  }

  private mergeTables(array: Row[], newArray: Row[]): Row[] {
    for (const newItem of newArray) {
      const index = array.findIndex(item => item.key === newItem.key);

      if (index === -1) {
        array.push(newItem);
      } else {
        array[index].values.push(newItem.values[0]);
      }
    }

    return array;
  }
}
