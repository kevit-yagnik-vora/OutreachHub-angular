import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../campaign.service';
import { ContactService } from '../../../contacts/contact.service';
import { interval, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './details.component.html',
})
export class CampaignDetailsComponent implements OnInit {
  campaignId!: string;
  campaignMessages: any;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.campaignId = this.route.snapshot.paramMap.get('id')!;
    this.fetchCampaignMessages();
  }

  fetchCampaignMessages() {
    this.campaignService.getCampaignMessages(this.campaignId).subscribe({
      next: (res) => {
        console.log(res);
        this.campaignMessages = res;
      },
      error: (err) => console.error(err),
    });
  }
}
