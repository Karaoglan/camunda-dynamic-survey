import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Question } from '../app.component';
import { AppService } from '../app.service';

export interface FormAnswers {
  controlName: string;
  value: string;
}

@Component({
  selector: 'app-json-form',
  templateUrl: './json-form-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonFormComponentComponent implements OnChanges, OnDestroy {
  @Input() jsonFormData: Question[] = [];
  @Input() processInstanceId = '';

  @Output()
  getQuestionsEvent = new EventEmitter<Question[]>();

  private readonly onDestroy = new Subject<void>();

  public myForm: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder, private service: AppService) {}

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createForm(this.jsonFormData);
  }

  isFormInvalid(): boolean {
    console.log(this.myForm.invalid);
    return this.myForm.invalid;
  }

  changeRadio(index: number): void {
    console.log(index);
    console.log(this.jsonFormData[index]);
    this.service.getTask(this.processInstanceId).subscribe((value) => {
      this.service
        .completeTask(value[0].id, {
          variables: {
            answers: {
              type: 'Json',
              value: this.getFormValueAsAnswerString(index),
            },
            questions: {
              type: 'Json',
              value: JSON.stringify(this.jsonFormData.slice(0, index + 1)),
            },
          },
        })
        .subscribe(() => {
          this.service
            .getQuestionList(this.processInstanceId)
            .subscribe((variables) => {
              this.getQuestionsEvent.emit(
                JSON.parse(variables.questions.value)
              );
              this.ngOnDestroy();
            });
        });
    });
  }

  createForm(questions: Question[]) {
    for (const control of questions) {
      this.myForm.addControl(
        control.questionId,
        this.fb.control(control.answer, [Validators.required])
      );
    }
  }

  submit() {
    console.log(this.myForm.value);
    this.service.getTask(this.processInstanceId).subscribe((value) => {
      this.service
        .completeTask(value[0].id, {
          variables: { end: { type: 'boolean', value: 'true' } },
        })
        .subscribe(console.log);
    });
  }

  getFormValueAsAnswerString(toIndex: number): string {
    let resp = [];
    console.log(this.jsonFormData.slice(undefined, toIndex + 1));
    for (let x of this.jsonFormData.slice(undefined, toIndex + 1)) {
      resp.push({
        questionId: x.questionId,
        answer: this.myForm.get(x.questionId)?.value,
      });
    }
    return JSON.stringify(resp);
  }
}
