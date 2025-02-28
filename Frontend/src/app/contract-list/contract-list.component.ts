import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = [];

  constructor(private contractService: ContractService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.contracts = this.contractService.getContracts();
    this.filteredContracts = this.contracts;

    this.route.queryParams.subscribe(params => {
      if (params['scope']) {
        this.filteredContracts = this.contracts.filter(c => c.scope === params['scope']);
      } else if (params['dueIn5Days']) {
        const today = new Date('2025-02-26');
        this.filteredContracts = this.contracts.filter(c => {
          if (!c.dueDate) return false;
          const due = new Date(c.dueDate);
          const diff = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);
          return diff <= 5 && diff >= 0;
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Draft': return 'badge bg-secondary';
      case 'In-Review': return 'badge bg-warning';
      case 'In Approval': return 'badge bg-info';
      case 'Effective': return 'badge bg-success';
      default: return 'badge bg-light';
    }
  }
}