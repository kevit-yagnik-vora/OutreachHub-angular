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

  // Chart configs
  lineChartData: ChartData<'line'> = { datasets: [], labels: [] };
  pieChartData: ChartData<'pie'> = { datasets: [], labels: [] };
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    console.log('DashboardComponent initialized');
    this.dashboardService.getOverview().subscribe((data) => {
      this.overview = data;
      this.prepareCharts();
      this.loading = false;
    });
  }

  private prepareCharts() {
    // Line chart (last 7 days)
    this.lineChartData = {
      labels: this.overview.last7Days.map((d: any) => d._id),
      datasets: [
        {
          data: this.overview.last7Days.map((d: any) => d.count),
          label: 'Campaigns',
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          fill: true,
          tension: 0.3,
        },
      ],
    };

    // Pie chart (campaign status)
    this.pieChartData = {
      labels: this.overview.campaignStats.map((s: any) => s._id),
      datasets: [
        {
          data: this.overview.campaignStats.map((s: any) => s.count),
          backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
        },
      ],
    };
  }
}
