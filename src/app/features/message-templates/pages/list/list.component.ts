import { Component, OnInit } from '@angular/core';
import { MessageTemplateService } from '../../message-template.service';
import { RoleService } from '../../../../core/services/role.service';
import { IMessageTemplate } from '../../models/message-template.model';
import { WorkspaceService } from '../../../../core/services/workspace.service';

@Component({
  selector: 'app-message-template-list',
  templateUrl: './list.component.html',
})
export class MessageTemplateListComponent implements OnInit {
  templates: IMessageTemplate[] = [];
  pagination: any = {};
  workspaceId: any = this.workspaceService.getWorkspaceId(); // ✅ set from logged-in user
  page = 1;
  limit = 6;

  showConfirm = false;
  messageToDelete: IMessageTemplate | null = null;

  constructor(
    private messageService: MessageTemplateService,
    public roleService: RoleService,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    if (this.roleService.isEditor()) {
      this.messageService
        .getByWorkspace(this.workspaceId, this.page, this.limit)
        .subscribe({
          next: (res) => {
            this.templates = res.data;
            this.pagination = res.pagination;
          },
          error: (err) => {
            console.error('Error loading templates', err);
          },
        });
    } else {
      this.messageService
        .getAllByWorkspace(this.workspaceId, this.page, this.limit)
        .subscribe({
          next: (res) => {
            this.templates = res.data;
            this.pagination = res.pagination;
          },
          error: (err) => {
            console.error('Error loading templates', err);
          },
        });
    }
  }

  deleteMessage() {
    if (!this.messageToDelete?._id) return;
    this.messageService.delete(this.messageToDelete._id).subscribe({
      next: () => {
        this.showConfirm = false;
        this.messageToDelete = null;
        this.load();
      },
      error: (e) => console.error('Delete failed', e),
    });
  }

  confirmDelete(message: IMessageTemplate) {
    this.messageToDelete = message;
    this.showConfirm = true;
  }

  nextPage() {
    if (this.page < this.pagination.totalPages) {
      this.page++;
      this.load();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }
}
