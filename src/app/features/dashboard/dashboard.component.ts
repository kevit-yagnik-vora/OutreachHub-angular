import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  overview: any = {};
  loading = true;

  fromDate: string | null = null;
  toDate: string | null = null;

  // Chart configs
  lineChartData: ChartData<'line'> = { datasets: [], labels: [] };
  pieChartData: ChartData<'pie'> = { datasets: [], labels: [] };
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.dashboardService
      .getOverview(this.fromDate!, this.toDate!)
      .subscribe((data) => {
        this.overview = data;
        this.prepareCharts();
        this.loading = false;
      });
  }

  private prepareCharts() {
    // ✅ Line Chart (Campaigns by Date)
    this.lineChartData = {
      labels: this.overview.lastDays.map((d: any) => d._id),
      datasets: [
        {
          data: this.overview.lastDays.map((d: any) => d.count),
          label: 'Campaigns',
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          fill: true,
          tension: 0.3,
        },
      ],
    };

    // ✅ Pie Chart (Campaign Message Status)
    this.pieChartData = {
      labels: this.overview.campaignStats.map(
        (s: any) => s._id ?? 'Unknown' // fallback
      ),
      datasets: [
        {
          data: this.overview.campaignStats.map((s: any) => s.count ?? 0),
          backgroundColor: [
            '#22c55e', // green
            '#eab308', // yellow
            '#ef4444', // red
            '#3b82f6', // blue (extra fallback)
            '#6b7280', // gray (extra fallback)
          ],
        },
      ],
    };
  }

  getKey(key: unknown): string {
    return String(key);
  }
}
