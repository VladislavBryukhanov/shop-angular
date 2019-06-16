import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import moment from 'moment';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit, ErrorStateMatcher {

  public hidePassword = true;
  public signUp: boolean;

  public email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  public password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(32)
  ]);

  public firstName = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(20)
  ]);
  public lastName = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(20)
  ]);
  public gender = new FormControl(null);
  public birthday = new FormControl(null);

  public address = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(64)
  ]);
  public phone = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]{4,12}$'),
  ]);

  public userForm = new FormGroup({
    email: this.email,
    password: this.password,
    firstName: this.firstName,
    lastName: this.lastName,
    gender: this.gender,
    birthday: this.birthday,

    contactInfo: new FormGroup({
      address: this.address,
      phone: this.phone
    })
  });

  public genderOptions = [
    {
      name: 'Male',
      value: true,
    },
    {
      name: 'Female',
      value: false,
    }
  ];

  private validation = {
    email: () => {
      if (this.email.hasError('email')) {
        return 'Please enter a valid email address';
      }
      if (this.email.hasError('required')) {
        return 'Email is required';
      }
    },
    password: () => this.validateTextField(this.password, 'Password', 8, 32),
    firstName: () => this.validateTextField(this.firstName, 'First name', 1, 20),
    lastName: () => this.validateTextField(this.lastName, 'Last name', 1, 20),
    address: () => this.validateTextField(this.address, 'Address', 4, 64),
    phone: () => {
      if (this.phone.hasError('pattern')) {
        return 'Wrong phone number format!';
      }
      if (this.email.hasError('required')) {
        return 'Phone number is required';
      }
    }
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route
      .data
      .subscribe(({ signUp }) => {
        this.signUp = signUp;
      });
  }

  isErrorState(control: FormControl | any, form: FormGroupDirective | NgForm | any): boolean {
    return control.invalid && (control.dirty || control.touched || form.submitted);
  }

  validateTextField(fc: FormControl, name: string, minLen: number, maxLen: number) {
      if (fc.hasError('required')) {
        return `${name} is required`;
      }
      if (fc.hasError('minlength')) {
        return `${name} must be longer then ${minLen - 1} characters`;
      }
      if (fc.hasError('maxlength')) {
        return `${name} must be less then ${maxLen + 1} characters`;
      }
  }

  onSignIn() {
    console.log(this.userForm.valid);
  }

  onSignUp() {
    const birthDay = moment(this.userForm.value.birthday).unix();
    console.log(this.userForm.valid);
    console.log(this.userForm);
  }
}
