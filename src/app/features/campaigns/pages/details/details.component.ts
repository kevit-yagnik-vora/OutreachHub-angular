import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../campaign.service';
import { ContactService } from '../../../contacts/contact.service';
import { interval, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './details.component.html',
})
export class CampaignDetailsComponent implements OnInit, OnDestroy {
  campaignId!: string;
  campaignMessages: any;
  campaign: any;
  private destroy$ = new Subject<void>();
  private messagesDestroy$ = new Subject<void>();
  private messagesPolling = false;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.campaignId = this.route.snapshot.paramMap.get('id')!;
    this.fetchCampaign();
    this.fetchCampaignMessages();
    this.startPollingCampaign();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.messagesDestroy$.next();
    this.messagesDestroy$.complete();
  }

  fetchCampaign() {
    this.campaignService.getCampaignById(this.campaignId).subscribe({
      next: (res) => {
        this.campaign = res;
        this.cdr.detectChanges();
        if (this.campaign.status === 'Running' && !this.messagesPolling) {
          this.startPollingMessages();
        }
      },
      error: (err) => console.error(err),
    });
  }

  fetchCampaignMessages() {
    this.campaignService.getCampaignMessages(this.campaignId).subscribe({
      next: (res) => {
        console.log(res);
        this.campaignMessages = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  startPollingMessages() {
    if (this.messagesPolling) return;
    this.messagesPolling = true;
    interval(3000)
      .pipe(
        takeUntil(this.messagesDestroy$),
        switchMap(() => this.campaignService.getCampaignMessages(this.campaignId))
      )
      .subscribe({
        next: (res) => {
          console.log('Polled messages:', res);
          this.campaignMessages = res;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
  }

  stopPollingMessages() {
    this.messagesDestroy$.next();
    this.messagesPolling = false;
  }

  startPollingCampaign() {
    interval(5000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.campaignService.getCampaignById(this.campaignId))
      )
      .subscribe({
        next: (res) => {
          this.campaign = res;
          this.cdr.detectChanges();
          if (this.campaign.status === 'Running' && !this.messagesPolling) {
            this.startPollingMessages();
          } else if (this.campaign.status !== 'Running' && this.messagesPolling) {
            this.stopPollingMessages();
          }
        },
        error: (err) => console.error(err),
      });
  }
}
