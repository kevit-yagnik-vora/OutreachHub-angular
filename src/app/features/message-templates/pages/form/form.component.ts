import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageTemplateService } from '../../message-template.service';
import { WorkspaceService } from '../../../../core/services/workspace.service';

@Component({
  selector: 'app-message-template-form',
  templateUrl: './form.component.html',
})
export class MessageTemplateFormComponent implements OnInit {
  form!: FormGroup;
  templateId!: string | null;

  constructor(
    private fb: FormBuilder,
    private service: MessageTemplateService,
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.templateId = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['Text', Validators.required], // default to Text
      message: this.fb.group({
        text: ['', Validators.required],
        imageUrl: [''],
      }),
      workspace: [this.workspaceService.getWorkspaceId(), Validators.required],
    });

    if (this.templateId) {
      this.service.getById(this.templateId).subscribe((data) => {
        this.form.patchValue(data);
        this.form.get('workspace')?.setValue(data.workspace._id);
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.templateId) {
      console.log(this.form.value.workspace._id);
      this.service.update(this.templateId, this.form.value).subscribe(() => {
        this.router.navigate(['/message-templates']);
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.router.navigate(['/message-templates']);
      });
    }
  }
}
