import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private dummyData = {
    contracts: [
      { contractId: 'C001', contractName: 'Vendor Sync Agreement', scope: 'Global', partnerName: 'VendorX', status: 'Draft', beginDate: '2025-02-01', countries: ['US', 'UK', 'CN'], owner: 'John', notes: 'Drafting in progress', dueDate: '2025-03-02' },
      { contractId: 'C002', contractName: 'Local Supply Deal', scope: 'Local', partnerName: 'SupplierA', status: 'In-Review', beginDate: '2025-01-15', countries: ['IN'], owner: 'Jane', notes: 'Under legal review', dueDate: '2025-03-03' },
      { contractId: 'C003', contractName: 'Global Partnership', scope: 'Global', partnerName: 'PartnerB', status: 'Effective', beginDate: '2025-02-10', countries: ['US', 'UK'], owner: 'Bob', notes: 'Signed and active', dueDate: null }
    ],
    tasks: [
      { taskName: 'Review C002', description: 'Check legal terms', dueDate: '2025-03-03' },
      { taskName: 'Approve C001', description: 'Final approval needed', dueDate: '2025-03-02' }
    ]
  };

  constructor() {
    // Generate additional contracts (100 total)
    const statuses = ['Draft', 'In-Review', 'In Approval', 'Effective', 'Terminated'];
    const scopes = ['Global', 'Local'];
    const partners = ['VendorX', 'SupplierA', 'PartnerB', 'CorpC', 'TechD', 'GlobalE', 'LocalF'];
    const countriesList = ['US', 'UK', 'CN', 'IN', 'JP', 'DE', 'FR', 'CA', 'AU', 'BR'];
    const owners = ['John', 'Jane', 'Bob', 'Alice', 'Mike', 'Sarah', 'Tom'];

    for (let i = 4; i <= 100; i++) {
      const id = `C${String(i).padStart(3, '0')}`;
      const scope = scopes[Math.floor(Math.random() * scopes.length)];
      const partner = partners[Math.floor(Math.random() * partners.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const beginDate = `2025-${String(Math.floor(Math.random() * 2) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
      const countryCount = scope === 'Global' ? Math.floor(Math.random() * 4) + 2 : 1; // Global: 2-5, Local: 1
      const countries = [...new Set(Array(countryCount).fill(0).map(() => countriesList[Math.floor(Math.random() * countriesList.length)]))];
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const dueDate = status === 'Effective' || status === 'Terminated' ? null : 
        `2025-03-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`; // Random due dates in March

      this.dummyData.contracts.push({
        contractId: id,
        contractName: `${scope} Contract ${i}`,
        scope,
        partnerName: partner,
        status,
        beginDate,
        countries,
        owner,
        notes: `${status} phase - ${partner}`,
        dueDate
      });
    }

    // Generate additional tasks (100 total)
    for (let i = 3; i <= 100; i++) {
      const contract = this.dummyData.contracts[Math.floor(Math.random() * this.dummyData.contracts.length)];
      const taskActions = ['Review', 'Approve', 'Draft', 'Sign'];
      const action = taskActions[Math.floor(Math.random() * taskActions.length)];
      const dueDate = contract.dueDate || `2025-03-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`;

      this.dummyData.tasks.push({
        taskName: `${action} ${contract.contractId}`,
        description: `${action} contract with ${contract.partnerName}`,
        dueDate
      });
    }
  }

  getContracts() { return this.dummyData.contracts; }
  getTasks() { return this.dummyData.tasks; }
}