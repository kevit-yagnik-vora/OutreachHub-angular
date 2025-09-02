import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../contact.service';
import { Contact } from '../../model/contact.model';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
})
export class ContactsListComponent implements OnInit {
  // page = 1;
  // limit = 5;
  // totalPages = 1;

  // contacts: Contact[] = [];
  // filtered: Contact[] = [];
  // searchTerm = '';

  // showConfirm = false;
  // contactToDelete: Contact | null = null;

  // constructor(private contactService: ContactService) {}

  // ngOnInit() {
  //   this.loadContacts();
  // }

  // loadContacts() {
  //   this.contactService.getContacts(this.page, this.limit).subscribe((res) => {
  //     this.contacts = res.data;
  //     this.filtered = res.data;
  //     this.totalPages = res.pagination.totalPages;
  //   });
  // }

  // nextPage() {
  //   if (this.page < this.totalPages) {
  //     this.page++;
  //     this.loadContacts();
  //   }
  // }

  // prevPage() {
  //   if (this.page > 1) {
  //     this.page--;
  //     this.loadContacts();
  //   }
  // }

  // applyFilter() {
  //   const q = this.searchTerm.trim().toLowerCase();

  //   if (!q) {
  //     this.filtered = [...this.contacts];
  //     return;
  //   }

  //   this.filtered = this.contacts.filter((c) => {
  //     const inName = c.name?.toLowerCase().includes(q);
  //     const inPhone = c.phoneNumber
  //       ? c.phoneNumber.toString().toLowerCase().includes(q)
  //       : false;
  //     const inTags = (c.tags || []).some((t: string) =>
  //       t.toLowerCase().includes(q)
  //     );
  //     return inName || inPhone || inTags;
  //   });
  // }

  // confirmDelete(contact: Contact) {
  //   this.contactToDelete = contact;
  //   this.showConfirm = true;
  // }

  // deleteContact() {
  //   if (!this.contactToDelete?._id) return;
  //   this.contactService.deleteContact(this.contactToDelete._id).subscribe({
  //     next: () => {
  //       this.showConfirm = false;
  //       this.contactToDelete = null;
  //       this.loadContacts();
  //     },
  //     error: (e) => console.error('Delete failed', e),
  //   });
  // }

  // trackById(_: number, c: Contact) {
  //   return c._id || c.phoneNumber;
  // }
  page = 1;
  limit = 5;
  totalPages = 1;

  contacts: Contact[] = [];
  filtered: Contact[] = [];
  searchTerm = '';

  showConfirm = false;
  contactToDelete: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  /** Load contacts from API */
  loadContacts() {
    this.contactService.getContacts(this.page, this.limit).subscribe((res) => {
      this.contacts = res.data;
      this.filtered = [...res.data]; // keep a copy for filtering
      this.totalPages = res.pagination.totalPages;
    });
  }

  /** Go to next page */
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadContacts();
    }
  }

  /** Go to previous page */
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadContacts();
    }
  }

  /** Search filter */
  applyFilter() {
    const q = this.searchTerm.trim().toLowerCase();

    if (!q) {
      this.filtered = [...this.contacts];
      return;
    }

    this.filtered = this.contacts.filter((c) => {
      const inName = c.name?.toLowerCase().includes(q);
      const inPhone = c.phoneNumber
        ? c.phoneNumber.toString().toLowerCase().includes(q)
        : false;
      const inTags = (c.tags || []).some((t: string) =>
        t.toLowerCase().includes(q)
      );
      return inName || inPhone || inTags;
    });
  }

  /** Ask before deleting */
  confirmDelete(contact: Contact) {
    this.contactToDelete = contact;
    this.showConfirm = true;
  }

  /** Delete contact */
  deleteContact() {
    if (!this.contactToDelete?._id) return;
    this.contactService.deleteContact(this.contactToDelete._id).subscribe({
      next: () => {
        this.showConfirm = false;
        this.contactToDelete = null;
        this.loadContacts();
      },
      error: (e) => console.error('Delete failed', e),
    });
  }

  /** For ngFor performance */
  trackById(_: number, c: Contact) {
    return c._id || c.phoneNumber;
  }
}
