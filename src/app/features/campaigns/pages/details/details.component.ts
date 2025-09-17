import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../campaign.service';
import { ContactService } from '../../../contacts/contact.service';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './details.component.html',
})
export class CampaignDetailsComponent implements OnInit {
  campaign: any;
  contacts: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private contactService: ContactService
  ) {}

  messages: any[] = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.campaignService
        .getCampaignById(id)
        .subscribe((c) => (this.campaign = c));
      this.campaignService
        .getCampaignMessages(id)
        .subscribe((m) => (this.messages = m));
    }
  }

  // private loadCampaign(campaignId: string) {
  //   this.campaignService.getCampaignById(campaignId).subscribe({
  //     next: (data) => {
  //       this.campaign = data;
  //       this.loading = false;

  //       // fetch contacts by tags
  //       if (this.campaign?.tags?.length) {
  //         this.contactService
  //           .getContactsByTags(this.campaign.workspaceId, this.campaign.tags)
  //           .subscribe((res) => (this.contacts = res));
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading campaign', err);
  //       this.loading = false;
  //     },
  //   });
  // }
  private loadCampaign(campaignId: string) {
    this.campaignService.getCampaignDetails(campaignId).subscribe({
      next: (data) => {
        console.log('Campaign details', data);
        this.campaign = data.campaign;
        this.contacts = data.targetedContacts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading campaign details', err);
        this.loading = false;
      },
    });
  }
}
