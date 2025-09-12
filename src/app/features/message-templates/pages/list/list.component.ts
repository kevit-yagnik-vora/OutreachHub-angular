import { Component, OnInit } from '@angular/core';
import { MessageTemplateService } from '../../message-template.service';

@Component({
  selector: 'app-message-template-list',
  templateUrl: './list.component.html',
})
export class MessageTemplateListComponent implements OnInit {
  templates: any[] = [];

  constructor(private service: MessageTemplateService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe((data) => (this.templates = data));
  }

  delete(id: string) {
    if (confirm('Are you sure you want to delete this template?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}
