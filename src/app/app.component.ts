import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from './input/input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule, ReactiveFormsModule, InputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    input: this.fb.control('', { validators: [Validators.required] }),
  });

  ngModelInput = '';

  updated(value: string) {
    console.log(value);
  }

  ngModelUpdated(value: string) {
    console.log(value);
  }
}
