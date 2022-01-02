import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment as env } from 'src/environments/environment';
import { TranslationModel } from '../models/translation.model';

@Injectable({
  providedIn: 'root',
})
export class TranslationsService {
  constructor(protected http: HttpClient) {}

  public getTranslations(languageGuid: string): Observable<TranslationModel[]> {
    return this.http.get<TranslationModel[]>(
      `${env.apiUrl}/translations/${languageGuid}/language`
    );
  }

  public getTranslationByGuid(guid: string): Observable<TranslationModel[]> {
    return this.http.get<TranslationModel[]>(
      `${env.apiUrl}/translations/${guid}`
    );
  }

  public createTranslation(
    translation: TranslationModel
  ): Observable<TranslationModel[]> {
    const { key, value, isGroup } = translation;
    return this.http.post<TranslationModel[]>(`${env.apiUrl}/translations`, {
      key,
      value,
      isGroup,
    });
  }

  public updateTranslation(translation: TranslationModel): Observable<void> {
    const { guid, key, value, isGroup } = translation;
    return this.http.post<void>(`${env.apiUrl}/translations/${guid}`, {
      key,
      value,
    });
  }

  public deleteTranslation(guid: string): Observable<void> {
    return this.http.delete<void>(`${env.apiUrl}/translations/${guid}`);
  }
}
