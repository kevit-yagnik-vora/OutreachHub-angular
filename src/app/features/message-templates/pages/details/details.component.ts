import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageTemplateService } from '../../message-template.service';

@Component({
  selector: 'app-message-template-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class MessageTemplateDetailsComponent implements OnInit {
  template: any;

  constructor(
    private route: ActivatedRoute,
    private templateService: MessageTemplateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.templateService.getById(id).subscribe((data) => {
        this.template = data;
      });
    }
  }
}
