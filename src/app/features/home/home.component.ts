import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  constructor(private auth: AuthService) {}
  // ===== Line Chart (Campaigns per Day) =====
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  lineChartData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Campaigns',
        data: [5, 8, 4, 10, 6],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // ===== Bar Chart (Contacts Growth) =====
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Contacts',
        data: [120, 150, 180, 170, 200],
        backgroundColor: '#22c55e',
      },
    ],
  };

  // ===== Pie Chart (Message Types) =====
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  pieChartData: ChartData<'pie'> = {
    labels: ['Email', 'SMS', 'WhatsApp'],
    datasets: [
      {
        data: [45, 25, 30],
        backgroundColor: ['#3b82f6', '#facc15', '#ef4444'],
      },
    ],
  };

  user = this.auth.getUserData();
}
