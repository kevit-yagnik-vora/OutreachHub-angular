import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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
export class CampaignFormComponent implements OnInit, OnDestroy, AfterViewInit {
  form!: FormGroup;
  templates: MessageTemplate[] = [];
  filteredTemplates: MessageTemplate[] = [];
  templatesOpen = false;
  selectedTemplate?: MessageTemplate | null = null;
  workspaceId = this.workspaceService.getWorkspaceId() || '';
  userId = localStorage.getItem('userId') || '';
  totalRecipients = 0;
  tags: string[] = [];
  isEdit = false;
  campaignId = '';
  campaign: any;

  private destroy$ = new Subject<void>();

  @ViewChild('templateSearchInput')
  templateSearchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private templateSvc: MessageTemplateService,
    private campaignSvc: CampaignService,
    private workspaceService: WorkspaceService,
    public router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      selectedTags: [[]],
      message: this.fb.group({
        text: ['', Validators.required],
        imageUrl: [''],
      }),
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.campaignId = id || '';
      if (this.campaignId) {
        this.isEdit = true;
        this.campaignSvc
          .getCampaignById(this.campaignId)
          .subscribe((campaign) => {
            console.log('Campaign loaded', campaign);
            this.campaign = campaign;
            const patchData = {
              name: campaign.name,
              description: campaign.description,
              launchDate: campaign.launchDate
                ? new Date(campaign.launchDate).toISOString().slice(0, 16)
                : '',
              selectedTags: [...(campaign.selectedTags || [])],
              templateId: campaign.message?._id || '',
              message: {
                text: campaign.message?.text || '',
                imageUrl: campaign.message?.imageUrl || '',
              },
            };
            console.log('Patching form with:', patchData);
            this.form.patchValue(patchData);
            console.log('Form value after patch:', this.form.value);
            console.log(
              'selectedTags set to:',
              this.form.get('selectedTags')?.value
            );
            this.updateRecipientCount(this.form.get('selectedTags')?.value);
            this.cdr.detectChanges();
            this.loadTemplates();
          });
      }
    });
    this.loadTemplates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.updateInputValue();
  }

  private updateInputValue(): void {
    setTimeout(() => {
      if (this.selectedTemplate && this.templateSearchInput) {
        this.templateSearchInput.nativeElement.value =
          this.selectedTemplate.name;
        this.templatesOpen = false;
        this.cdr.detectChanges();
      }
    }, 0);
  }

  loadTemplates() {
    if (!this.workspaceId) return;
    this.templateSvc.listByWorkspace(this.workspaceId, 1, 500).subscribe({
      next: (res: any) => {
        console.log('Templates loaded', res);
        this.templates = Array.isArray(res) ? res : res?.data || [];
        this.filteredTemplates = [...this.templates];
        if (this.isEdit && this.campaign?.message) {
          this.selectedTemplate = this.templates.find(
            (t) =>
              t.message.text === this.campaign.message.text &&
              t.message.imageUrl === this.campaign.message.imageUrl
          );
          if (this.selectedTemplate) {
            console.log(
              'selectedTemplate set from templates by content match:',
              this.selectedTemplate
            );
            this.updateInputValue();
          } else {
            console.log(
              'Template not found for message:',
              this.campaign.message
            );
          }
        }
      },
      error: (err) => {
        console.error('Failed to load templates', err);
        this.templates = [];
        this.filteredTemplates = [];
      },
    });
  }

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

  selectTemplate(t: MessageTemplate) {
    this.selectedTemplate = t;
    this.templatesOpen = false;

    this.form.patchValue({
      templateId: t._id,
      message: {
        text: t.message?.text || '',
        imageUrl: t.message?.imageUrl || '',
      },
    });

    this.updateImageValidators(t.type);

    if (this.templateSearchInput) {
      this.templateSearchInput.nativeElement.value = t.name;
    }
  }

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

  private updateImageValidators(type?: 'Text' | 'Text-Image' | null) {
    const imageControl = this.form.get(['message', 'imageUrl'])!;
    if (type === 'Text-Image') {
      imageControl.setValidators([Validators.required]);
    } else {
      imageControl.clearValidators();
    }
    imageControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

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

    if (this.isEdit) {
      this.campaignSvc
        .updateCampaign(this.form.value, this.campaignId)
        .subscribe({
          next: () => this.router.navigate(['/campaigns']),
          error: (err) => console.error('Update failed', err),
        });
    } else {
      this.campaignSvc.create(payload).subscribe({
        next: () => this.router.navigate(['/campaigns']),
        error: (err) => console.error('Create failed', err),
      });
    }
  }

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
