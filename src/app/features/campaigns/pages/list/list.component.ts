import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CampaignService } from '../../campaign.service';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { RoleService } from '../../../../core/services/role.service';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './list.component.html',
})
export class CampaignListComponent implements OnInit, OnDestroy {
  campaigns: any[] = [];
  pagination: any = {};
  page = 1;
  limit = 6;
  pollingSubs: { [id: string]: Subscription } = {};

  constructor(
    private svc: CampaignService,
    private workspaceService: WorkspaceService,
    public roleService: RoleService
  ) {}
  workspaceId: string | null = this.workspaceService.getWorkspaceId();

  ngOnInit() {
    this.load();
  }

  load() {
    if (!this.workspaceId) throw new Error('No workspace selected');
    this.svc
      .listByWorkspace(this.workspaceId, this.page, this.limit)
      .subscribe((res) => {
        this.campaigns = res.data;
        this.pagination = res.pagination;

        this.campaigns.forEach((c) => {
          if (c.status === 'Running' && !this.pollingSubs[c._id]) {
            this.startPolling(c._id);
          }
        });
      });
  }

  startPolling(campaignId: string) {
    this.pollingSubs[campaignId] = interval(60000)
      .pipe(switchMap(() => this.svc.get(campaignId)))
      .subscribe((updated: any) => {
        const idx = this.campaigns.findIndex((x) => x._id === campaignId);
        if (idx >= 0) this.campaigns[idx] = updated;

        if (updated.status !== 'Running') {
          this.pollingSubs[campaignId].unsubscribe();
          delete this.pollingSubs[campaignId];
        }
      });
  }

  stopAllPolling() {
    Object.values(this.pollingSubs).forEach((s) => s.unsubscribe());
    this.pollingSubs = {};
  }

  ngOnDestroy() {
    this.stopAllPolling();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }
  nextPage() {
    if (this.page < (this.pagination.totalPages || 1)) {
      this.page++;
      this.load();
    }
  }

  delete(id: string) {
    if (!confirm('Delete campaign?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }

  copy(id: string) {
    this.svc.copy(id).subscribe(() => this.load());
  }

  launch(id: string) {
    if (
      !confirm('Launch campaign? This will create messages and start sending.')
    )
      return;
    this.svc.launchCampaign(id).subscribe(() => {
      this.load();
    });
  }
}
