import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MessageTemplateService } from '../../../message-templates/message-template.service';
import { CampaignService } from '../../campaign.service';
import { WorkspaceService } from '../../../../core/services/workspace.service';

interface MessageTemplate {
  _id: string;
  name: string;
  type: 'Text' | 'Text-Image';
  message: { text: string; imageUrl?: string };
}

@Component({
  selector: 'app-campaign-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class CampaignFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  templates: MessageTemplate[] = [];
  filteredTemplates: MessageTemplate[] = [];
  templatesOpen = false;
  selectedTemplate?: MessageTemplate | null = null;
  workspaceId = this.workspaceService.getWorkspaceId() || '';
  userId = localStorage.getItem('userId') || '';
  totalRecipients = 0;
  tags: string[] = [];
  private destroy$ = new Subject<void>();

  @ViewChild('templateSearchInput')
  templateSearchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private templateSvc: MessageTemplateService,
    private campaignSvc: CampaignService,
    private workspaceService: WorkspaceService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      templateId: [null, Validators.required],
      selectedTags: [[], Validators.required],
      message: this.fb.group({
        text: ['', Validators.required],
        imageUrl: [''],
      }),
    });

    this.loadTemplates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Load templates from backend
  loadTemplates() {
    if (!this.workspaceId) return;
    this.templateSvc.listByWorkspace(this.workspaceId, 1, 500).subscribe({
      next: (res: any) => {
        console.log('Templates loaded', res);
        this.templates = Array.isArray(res) ? res : res?.data || [];
        this.filteredTemplates = [...this.templates];
      },
      error: (err) => {
        console.error('Failed to load templates', err);
        this.templates = [];
        this.filteredTemplates = [];
      },
    });
  }

  // Search filter
  onTemplateSearch(q: string) {
    const s = (q || '').trim().toLowerCase();
    if (!s) {
      this.filteredTemplates = [...this.templates];
    } else {
      this.filteredTemplates = this.templates.filter((t) =>
        t.name.toLowerCase().includes(s)
      );
    }
    this.templatesOpen = true;
  }

  // Select a template
  selectTemplate(t: MessageTemplate) {
    this.selectedTemplate = t;
    this.templatesOpen = false;

    // patch values into form
    this.form.patchValue({
      templateId: t._id,
      message: {
        text: t.message?.text || '',
        imageUrl: t.message?.imageUrl || '',
      },
    });

    this.updateImageValidators(t.type);

    // put template name back in input box
    if (this.templateSearchInput) {
      this.templateSearchInput.nativeElement.value = t.name;
    }
  }

  // If user presses Enter to match by name
  trySelectByName(inputValue: string) {
    const name = (inputValue || '').trim();
    if (!name) return;

    const exact = this.templates.find(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );
    if (exact) {
      this.selectTemplate(exact);
      return;
    }

    if (this.filteredTemplates.length === 1) {
      this.selectTemplate(this.filteredTemplates[0]);
      return;
    }

    this.templatesOpen = true;
  }

  // Add validators dynamically for image
  private updateImageValidators(type?: 'Text' | 'Text-Image' | null) {
    const imageControl = this.form.get(['message', 'imageUrl'])!;
    if (type === 'Text-Image') {
      imageControl.setValidators([Validators.required]);
    } else {
      imageControl.clearValidators();
    }
    imageControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  // ---------------- TAG MANAGEMENT ----------------
  addTagFromInput(el: HTMLInputElement) {
    const raw = (el.value || '').trim();
    if (!raw) return;
    const parts = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    parts.forEach((p) => this.addTag(p));
    el.value = '';
  }

  onTagInputKeydown(event: KeyboardEvent, inputEl: HTMLInputElement) {
    if (event.key === ',') {
      this.addTagFromInput(inputEl);
      event.preventDefault();
    }
  }

  addTag(tag: string) {
    if (!tag) return;
    const arr: string[] = this.form.get('selectedTags')!.value || [];
    if (!arr.includes(tag)) {
      arr.push(tag);
      this.form.get('selectedTags')!.setValue(arr);
      this.updateRecipientCount(arr);
    }
  }

  removeTag(tag: string) {
    const arr: string[] = this.form.get('selectedTags')!.value || [];
    const idx = arr.indexOf(tag);
    if (idx >= 0) {
      arr.splice(idx, 1);
      this.form.get('selectedTags')!.setValue(arr);
      this.updateRecipientCount(arr);
    }
  }

  updateRecipientCount(tags: string[]) {
    if (!tags || tags.length === 0) {
      this.totalRecipients = 0;
      return;
    }
    this.campaignSvc.countContactsByTags(this.workspaceId, tags).subscribe({
      next: (r: any) => (this.totalRecipients = r?.count ?? 0),
      error: (err) => {
        console.error(err);
        this.totalRecipients = 0;
      },
    });
  }

  // Save campaign
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fv = this.form.value;
    const payload = {
      name: fv.name,
      description: fv.description,
      selectedTags: fv.selectedTags,
      message: {
        text: fv.message.text,
        imageUrl: fv.message.imageUrl || '',
      },
      workspace: this.workspaceId,
    };

    this.campaignSvc.create(payload).subscribe({
      next: () => this.router.navigate(['/campaigns']),
      error: (err) => console.error('Create failed', err),
    });
  }

  // clear selected template
  clearSelectedTemplate() {
    this.selectedTemplate = null;
    this.form.patchValue({
      templateId: null,
      message: { text: '', imageUrl: '' },
    });
    this.updateImageValidators(null);
    if (this.templateSearchInput)
      this.templateSearchInput.nativeElement.value = '';
  }
}
