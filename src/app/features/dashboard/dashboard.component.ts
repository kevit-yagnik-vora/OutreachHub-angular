import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  overview: any = {
    charts: { campaignsPerDay: [], msgsPerTypePerDay: [], contactsPerDay: [] },
    tables: { recentCampaigns: [], topTags: [] },
  };
  loading = true;

  fromDate: string | null = null; // bound to <input type="date">
  toDate: string | null = null;

  dateRange: Date[] = [];

  // Chart.js data
  campaignsChartData: ChartData<'line'> = { labels: [], datasets: [] };
  messagesMultiLineData: ChartData<'line'> = { labels: [], datasets: [] };
  contactsChartData: ChartData<'line'> = { labels: [], datasets: [] };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Fetch data from backend
  loadData() {
    if (this.dateRange.length === 2) {
      this.fromDate = this.dateRange[0].toISOString();
      this.toDate = this.dateRange[1].toISOString();
    }

    this.loading = true;
    this.dashboardService
      .getOverview(this.fromDate ?? undefined, this.toDate ?? undefined)
      .subscribe({
        next: (res) => {
          this.overview = res;
          this.prepareCharts();
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch overview', err);
          this.loading = false;
        },
      });
  }

  // Build datasets for charts
  private prepareCharts() {
    // ---------- Campaigns per day ----------
    const campaigns = this.overview.charts.campaignsPerDay || [];
    const campaignLabels = campaigns.map((d: any) => d._id);
    const campaignCounts = campaigns.map((d: any) => d.count || 0);
    this.campaignsChartData = {
      labels: campaignLabels,
      datasets: [
        {
          label: 'Campaigns',
          data: campaignCounts,
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99,102,241,0.5)',
          fill: true,
          tension: 0.3,
        },
      ],
    };

    // ---------- Messages per type per day (multi-line) ----------
    const msgs = this.overview.charts.msgsPerTypePerDay || [];
    const grouped: Record<string, Record<string, number>> = {};
    const allDatesSet = new Set<string>();

    msgs.forEach((row: any) => {
      const date = row._id?.date ?? 'unknown';
      const type = row._id?.type ?? 'Unknown';
      allDatesSet.add(date);
      if (!grouped[type]) grouped[type] = {};
      grouped[type][date] = (grouped[type][date] || 0) + (row.count || 0);
    });

    const allDates = Array.from(allDatesSet).sort();
    const colors = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#6b7280'];

    this.messagesMultiLineData = {
      labels: allDates,
      datasets: Object.keys(grouped).map((type, idx) => ({
        label: type,
        data: allDates.map((d) => grouped[type][d] || 0),
        backgroundColor: colors[idx % colors.length], // fill bars
        borderColor: colors[idx % colors.length], // outline
        borderWidth: 1,
      })),
    };

    // ---------- Contacts per day ----------
    const contacts = this.overview.charts.contactsPerDay || [];
    const contactLabels = contacts.map((d: any) => d._id);
    const contactCounts = contacts.map((d: any) => d.count || 0);
    this.contactsChartData = {
      labels: contactLabels,
      datasets: [
        {
          label: 'Contacts Reached',
          data: contactCounts,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.5)',
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }

  // Helper to display keys safely in templates
  getKey(key: unknown): string {
    return String(key ?? '');
  }
}
