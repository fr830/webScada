import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from './data/data.service';

import { raphael } from 'raphael';
import { morris } from 'morris';
@Component({
  selector: 'app-scada',
  templateUrl: './scada.component.html',
  styleUrls: ['./scada.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScadaComponent implements OnInit {
  private tempalteArray = [
    'horizontal-pipe',
     'vertical-pipe',
     'top-valve',
     'bottom-valve',
     'right-valve',
     'left-valve',
     'crosspipe',
     'top-tway',
     'bottom-tway',
     'right-tway',
     'left-tway',
     'left-top-elbow',
     'right-top-elbow',
     'left-bottom-elbow',
     'right-bottom-elbow',
     'vertical-tank',
     'horizontal-tank',
     'cutaway',
     'pump',
     'pipe-end-bottom',
     'pipe-end-top',
     'pipe-end-right',
     'pipe-end-left',
     'vertical-rotor',
     'horizontal-rotor'
  ];

  constructor( public dataService: DataService) {
  }

  ngOnInit() {

    //   for ( let i of this.tempalteArray) {
    //       const tagContent = this.getTagInnerHTML( 'app-' + i);
    //       this.appendChild( 'svg-show-content', tagContent);
    //   }
    console.log( this.dataService.getScada());
  }

  private getTagInnerHTML( tagName) {
      return document.getElementsByTagName('' + tagName + '')[0].innerHTML;
  }

  private appendChild( ele, child) {
      document.getElementsByClassName('' + ele + '')[0].innerHTML += child;
  }
}
