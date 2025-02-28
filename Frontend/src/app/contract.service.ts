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

  getContracts() { return this.dummyData.contracts; }
  getTasks() { return this.dummyData.tasks; }
}