import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field>
      <input
        matInput
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        (change)="updateInput($event)"
      />

      <mat-error>Required field</mat-error>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent<T> implements ControlValueAccessor {
  private readonly destroyRef = inject(DestroyRef);
  readonly control = inject(NgControl, { optional: true, self: true });

  readonly = model<boolean>(false);
  placeholder = input('');

  updated = output<T>();

  errorStatus = signal(false);
  isValid = computed(() => !this.readonly() && this.errorStatus());
  onTouched!: () => void;
  onChange!: (value: T) => void;

  private e = effect(() => {
    console.log(`error status for ${this.control?.name}`, this.errorStatus());
  });

  constructor() {
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  ngAfterContentInit() {
    if (this.control) {
      this.control.control?.statusChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.errorStatus.set(value === 'INVALID');
        });
    }
  }

  writeValue(value: T): void {
    this.handleValueChange(value);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.readonly.set(isDisabled);
  }

  updateInput(event: Event) {
    const value = (event.target as HTMLInputElement).value as unknown as T;

    this.handleValueChange(value, true);

    this.updated.emit(value);
  }

  private handleValueChange(value: T, emit = false) {
    if (emit) {
      this.onChange(value);
    }
  }
}
