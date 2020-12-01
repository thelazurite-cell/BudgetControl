import {Component, OnInit} from '@angular/core';
import {DataTransferService} from '../../services/data-transfer.service';
import {BehaviorSubject} from 'rxjs';
import {Category} from '../../classes/dto/category';
import {DialogModel} from '../../dialog/dialog/dialog-model';
import {DtoHelper} from '../setup-budgets/dto.helper';
import {DialogService} from '../../services/dialog.service';


export class ColorHelper {
  public static determineIfDark(source, color) {
    let r;
    let g;
    let b;
    let a = 1;
    let hsp;

    if (color.match(/^rgb/)) {
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      r = color[1];
      g = color[2];
      b = color[3];
      a = color[4];
      console.log(a);
    } else {
      color = +('0x' + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    if (a === 0) {
      source.isDarkColor = false;
      return;
    }
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    ) / (a);

    const darkColor = hsp <= 127.5;
    if (darkColor !== source.isDarkColor) {
      source.isDarkColor = darkColor;
    }
  }
}

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

  public categoriesSub: BehaviorSubject<any[]> = new BehaviorSubject(this.dataService.cache.get('category'));


  public get categories(): Category[] {
    return this.categoriesSub.getValue();
  }

  public set categories(value: Category[]) {
    if (value && value.length) {
      for (let i = 0; i < value.length; i++) {
        const category = value[i];
        ColorHelper.determineIfDark(category, category.color);
      }
    }
    this.categoriesSub.next(value);
  }

  public get categoriesAllocated(): number {
    if (this.categories) {
      return this.categories.map(itm => itm.threshold).reduce((a, b) => a + b, 0);
    }
    return 0;
  }

  public get thresholdValue(): number {
    const financialTerms = this.dataService.cache.get('term');
    if (financialTerms) {
      const term = financialTerms.filter(itm => !itm.expiryDate);
      if (term.length > 0) {
        return term[0].baseIncome;
      }
    }

    return 0;
  }

  constructor(public dataService: DataTransferService, private dialogService: DialogService) {
    this.categories = this.dataService.cache.get('category');
    this.dataService.updater.subscribe((val) => {
      if (val.name === 'cacheUpdated') {
        if (val.type === 'category') {
          console.log(this.dataService.cache.get('category'));
          this.categories = this.dataService.cache.get('category');
        }
      }
    });
  }

  ngOnInit(): void {
  }

  public colorChanged(category, source) {
    category.isDirty = true;
    ColorHelper.determineIfDark(category, source);
  }

  onDelete(category) {
    if (DtoHelper.hasIdentifier(category)) {
      const model = new DialogModel(
        'Confirm Deletion',
        `Are you sure you want to delete the category '${category.name}'?
         All expenditures would be placed under 'General'. These changes cannot be undone once saved.`
      );

      this.dialogService.showDialog(model, ['Yes', 'No']);
      this.dialogService.selection.subscribe((value) => {
        if (value === 'Yes') {
          category.isDeleted = true;
        }
      });
    } else {
      const start = this.categories.indexOf(category);
      this.categories.splice(start, 1);
    }
  }

  addCategory() {
    this.categories.push(new Category());
  }

  public onCategoryThresholdChange(category, $event) {
    const num = Number($event.target.value);
    category.threshold = num;
    category.isDirty = true;
  }

  onCategoryChange(category, $event) {
    category.name = $event.target.value;
    category.isDirty = true;
  }

  async onSave(types: string[]) {
    await this.dataService.onSave(types).then(() => {
    });
  }
}
