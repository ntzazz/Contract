import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from '../contract.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  contracts: any[] = [];
  tasks: any[] = [];
  dueContractsCount = 0;
  pieChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  pieChartLabels = ['Global', 'Local'];

  constructor(private contractService: ContractService, private router: Router) {}

  ngOnInit() {
    this.contracts = this.contractService.getContracts();
    this.tasks = this.contractService.getTasks();

    const globalCount = this.contracts.filter(c => c.scope === 'Global').length;
    const localCount = this.contracts.filter(c => c.scope === 'Local').length;
    this.pieChartData = {
      datasets: [{
        data: [globalCount, localCount],
        backgroundColor: ['#0078D4', '#28A745']
      }],
      labels: this.pieChartLabels
    };

    const today = new Date('2025-02-26');
    this.dueContractsCount = this.contracts.filter(c => {
      if (!c.dueDate) return false;
      const due = new Date(c.dueDate);
      const diff = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);
      return diff <= 5 && diff >= 0;
    }).length;
  }

  onPieChartClick(event: any) {
    const index = event.active[0]?.index;
    if (index !== undefined) {
      const scope = this.pieChartLabels[index];
      this.router.navigate(['/contracts'], { queryParams: { scope } });
    }
  }

  onScoreCardClick() {
    this.router.navigate(['/contracts'], { queryParams: { dueIn5Days: true } });
  }
}