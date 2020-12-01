import {Component, OnInit} from '@angular/core';
import {DataTransferService} from '../../services/data-transfer.service';

@Component({
  selector: 'app-setup-budgets',
  templateUrl: './setup-budgets.component.html',
  styleUrls: ['./setup-budgets.component.scss']
})
export class SetupBudgetsComponent implements OnInit {
  constructor(private dataService: DataTransferService) {
  }

  ngOnInit(): void {
  }
  public get isLoading(): boolean{
    return this.dataService.loading.getValue();
  }
}
