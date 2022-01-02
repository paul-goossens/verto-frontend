import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment as env } from 'src/environments/environment';
import { LanguageModel } from '../models/language.model';

@Injectable({
  providedIn: 'root',
})
export class LanguagesService {
  constructor(protected http: HttpClient) {}

  getLanguages(): Observable<LanguageModel[]> {
    return this.http.get<LanguageModel[]>(`${env.apiUrl}/languages`);
  }

  getLanguageByGuid(guid: string): Observable<LanguageModel[]> {
    return this.http.get<LanguageModel[]>(`${env.apiUrl}/languages/${guid}`);
  }

  createLanguage(language: LanguageModel): Observable<LanguageModel[]> {
    const { value } = language;
    return this.http.post<LanguageModel[]>(`${env.apiUrl}/languages`, {
      value
    });
  }

  updateLanguage(language: LanguageModel): Observable<void> {
    const { guid, value } = language;
    return this.http.post<void>(`${env.apiUrl}/languages/${guid}`, {
      value
    });
  }

  deleteLanguage(guid: string): Observable<void> {
    return this.http.delete<void>(`${env.apiUrl}/languages/${guid}`);
  }
}
