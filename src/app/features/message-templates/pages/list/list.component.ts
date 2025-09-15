import { Component, OnInit } from '@angular/core';
import { MessageTemplateService } from '../../message-template.service';
import { RoleService } from '../../../../core/services/role.service';
import { IMessageTemplate } from '../../models/message-template.model';

@Component({
  selector: 'app-message-template-list',
  templateUrl: './list.component.html',
})
export class MessageTemplateListComponent implements OnInit {
  templates: IMessageTemplate[] = [];
  showConfirm = false;
  messageToDelete: IMessageTemplate | null = null;

  constructor(
    private messageService: MessageTemplateService,
    public roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.messageService.getAll().subscribe((data) => (this.templates = data));
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
}
