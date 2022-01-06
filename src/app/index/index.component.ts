import { Component, OnInit } from '@angular/core';
import {
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { LanguageModel } from '../models/language.model';
import { TranslationModel } from '../models/translation.model';
import { LanguagesService } from '../services/languages.service';
import { TranslationsService } from '../services/translations.service';

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
  table: Row[];

  private triggerInit$ = new Subject<void>();

  constructor(
    private languageService: LanguagesService,
    private translationService: TranslationsService
  ) {
    this.table = [];
  }

  ngOnInit(): void {
    this.init$().subscribe(table => (this.table = table));
    this.triggerInit$.next();
  }

  private init$(): Observable<Row[]> {
    return this.triggerInit$.pipe(
      switchMap(() => this.languageService.getLanguages()),
      switchMap(languages => this.translations$(languages)),
      map(concurrentTranslations => this.mapToTable(concurrentTranslations))
    );
  }

  private mapToTable(concurrentTranslations: TranslationModel[][]) {
    let table: Row[] = [];

    for (const [index, translations] of concurrentTranslations.entries()) {
      const newTable = translations.map(translation => {
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

      if (index === 0) {
        table = newTable;
      } else {
        table = this.mergeTables(table, newTable);
      }
    }

    console.log(table);

    return table;
  }

  private translations$(
    languages: LanguageModel[]
  ): Observable<TranslationModel[][]> {
    const subscriptions: Observable<unknown>[] = [];

    for (const language of languages) {
      subscriptions.push(
        this.translationService.getTranslations(language.guid)
      );
    }

    return subscriptions.length
      ? <Observable<TranslationModel[][]>>forkJoin(subscriptions)
      : of([]);
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
