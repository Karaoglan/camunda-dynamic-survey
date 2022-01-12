import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnswerRoot, Questions, Root } from './app.component';

export interface GetVariables {
  answers: AnswerRoot;
  questions: Questions;
}

export interface GetTaskResponse {
  id: string;
  name: any;
  assignee: any;
  created: string;
  due: any;
  followUp: any;
  delegationState: any;
  description: any;
  executionId: string;
  owner: any;
  parentTaskId: any;
  priority: number;
  processDefinitionId: string;
  processInstanceId: string;
  taskDefinitionKey: string;
  caseExecutionId: any;
  caseInstanceId: any;
  caseDefinitionId: any;
  suspended: boolean;
  formKey: any;
  tenantId: any;
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  start(rootFnol: Root): Observable<StartProcessResponse> {
    return this.http.post<StartProcessResponse>(
      '/engine-rest/process-definition/key/fnol-process/start',
      rootFnol
    );
  }

  getQuestionList(processId: string): Observable<GetVariables> {
    return this.http.get<GetVariables>(
      `/engine-rest/process-instance/${processId}/variables`
    );
  }

  getTask(processInstanceId: string): Observable<GetTaskResponse[]> {
    return this.http.post<GetTaskResponse[]>('/engine-rest/task', {
      processInstanceId,
    });
  }

  completeTask(taskId: string, answerRoot: Root): any {
    return this.http.post<any>(
      `/engine-rest/task/${taskId}/complete`,
      answerRoot
    );
  }
}

export interface StartProcessResponse {
  links: Link[];
  id: string;
  definitionId: string;
  businessKey: any;
  caseInstanceId: any;
  ended: boolean;
  suspended: boolean;
  tenantId: any;
}

export interface Link {
  method: string;
  href: string;
  rel: string;
}
