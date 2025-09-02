import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../contact.service';
import { Contact } from '../../model/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent implements OnInit {
  isEdit = false;
  id: string | null = null;
  saving = false;

  tags: string[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]], // simple digits rule
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.contactService.getContactById(this.id).subscribe({
        next: (c) => {
          this.form.patchValue({ name: c.name, phoneNumber: c.phoneNumber });
          this.tags = c.tags || [];
        },
      });
    }
  }

  addTag(input: HTMLInputElement) {
    const value = input.value.trim();
    if (!value) return;
    if (!this.tags.includes(value)) this.tags.push(value);
    input.value = '';
  }

  handleComma(ev: KeyboardEvent, input: HTMLInputElement) {
    if (ev.key === ',') {
      ev.preventDefault();
      this.addTag(input);
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  submit() {
    if (this.form.invalid) return;

    const payload: Contact = {
      ...this.form.value,
      tags: this.tags,
    } as Contact;

    this.saving = true;

    const obs =
      this.isEdit && this.id
        ? this.contactService.updateContact(this.id, payload)
        : this.contactService.createContact(payload);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigateByUrl('/contacts');
      },
      error: (e) => {
        this.saving = false;
        console.error('Save failed', e);
      },
    });
  }
}
