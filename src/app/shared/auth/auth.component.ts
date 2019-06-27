import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
// import moment from 'moment';
import * as moment from 'moment';
import { AuthService } from '../../services/auth/auth.service';
import _ from 'lodash';

@Component({
  selector: 'app-sign',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, ErrorStateMatcher {

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

  public validation = {
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

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

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

  onSignIn(e) {
    e.preventDefault();
    const { email, password } = this.userForm.value;
    this.authService.signIn({ email, password });
  }

  onSignUp(e) {
    e.preventDefault();
    console.log(this.userForm);
    const birthDay = moment(this.userForm.value.birthday).unix();
    const newUser = new FormData();
    newUser.append('birthDay', birthDay.toString());
    _.each(this.userForm.value, (value, key) => {
      newUser.append(key, value);
    });
  }
}
