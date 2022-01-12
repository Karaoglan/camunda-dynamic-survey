import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';

  qValue: Question[] = [];

  qAValue: QuestionAnswer[] = [];

  formData$: Observable<Question[]> = of([]);

  processInstanceId: string = '';

  rootFnol: Root = {
    variables: {
      answers: {
        type: 'Json',
        value: JSON.stringify(this.qAValue),
      },
      questions: {
        type: 'Json',
        value: JSON.stringify(this.qValue),
      },
    },
  };

  constructor(public service: AppService) {}

  startProcess() {
    this.service.start(this.rootFnol).subscribe((value) => {
      this.processInstanceId = value.id;
      this.formData$ = this.service
        .getQuestionList(value.id)
        .pipe(map((variables) => JSON.parse(variables.questions.value)));
    });
  }

  getQuestions(questions: Question[]): void {
    this.formData$ = of(questions);
  }
}

export interface Root {
  variables: Variables;
}

export interface Variables {
  questions?: Questions;
  answers?: AnswerRoot;
  end?: Questions;
}

export interface Questions {
  type?: string;
  //value?: Question[];
  value: string;
}

/*export interface Root {
  questions: Question[];
}*/

export interface Question {
  answer?: string;
  fieldType: string;
  label: string;
  options: Option[];
  questionId: any;
}

export interface Option {
  label: string;
  value: string;
  id?: string;
}

// ------------

export interface AnswerRoot {
  type: string;
  //value: QuestionAnswer[];
  value: string;
}

export interface QuestionAnswer {
  questionId?: string;
  answer?: string;
}
