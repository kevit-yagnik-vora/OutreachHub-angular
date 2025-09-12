import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactService } from '../../contact.service';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { RoleService } from '../../../../core/services/role.service';
import { IContact } from '../../model/contact.model';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
})
export class ContactsListComponent implements OnInit, OnDestroy {
  page = 1;
  limit = 5;
  totalPages = 1;

  contacts: IContact[] = [];
  filtered: IContact[] = [];
  searchTerm = '';

  showConfirm = false;
  contactToDelete: IContact | null = null;

  private wsSub?: Subscription;

  constructor(
    private contactService: ContactService,
    private workspaceService: WorkspaceService,
    public roleService: RoleService
  ) {}

  ngOnInit() {
    // subscribe to workspace changes
    this.wsSub = this.workspaceService.selectedWorkspace$.subscribe((ws) => {
      if (ws) {
        this.page = 1;
        this.loadContacts();
      }
    });

    // initial load if workspace already present
    if (this.workspaceService.getWorkspace()) {
      this.loadContacts();
    }
  }

  ngOnDestroy() {
    this.wsSub?.unsubscribe();
  }

  loadContacts() {
    this.contactService
      .getContacts(this.page, this.limit, this.searchTerm)
      .subscribe({
        next: (res) => {
          this.contacts = res.data || [];
          this.filtered = [...this.contacts];
          this.totalPages = res.pagination?.totalPages || 1;
        },
        error: (e) => {
          console.error('Failed to load contacts', e);
          this.contacts = [];
          this.filtered = [];
        },
      });
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadContacts();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadContacts();
    }
  }

  applyFilter() {
    // If you want search on backend, call loadContacts() with searchTerm:
    // this.loadContacts();
    // If you want client-side filter on current page (already loaded):
    const q = (this.searchTerm || '').trim().toLowerCase();
    if (!q) {
      this.filtered = [...this.contacts];
      return;
    }
    this.filtered = this.contacts.filter((c) => {
      const inName = c.name?.toLowerCase().includes(q);
      const inPhone = c.phoneNumber
        ? c.phoneNumber.toString().toLowerCase().includes(q)
        : false;
      const inTags = (c.tags || []).some((t) => t.toLowerCase().includes(q));
      return inName || inPhone || inTags;
    });
  }

  confirmDelete(contact: IContact) {
    this.contactToDelete = contact;
    this.showConfirm = true;
  }

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

  trackById(_: number, c: IContact) {
    return c._id || c.phoneNumber;
  }
}
