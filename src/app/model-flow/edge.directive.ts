import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appEdge]'
})
export class EdgeDirective implements AfterViewInit{
  ngAfterViewInit(): void {
    console.log(this.edges);
    console.log(this.elementRef);
  }

  @Input('edges')
  edges: any[];

  constructor(protected elementRef: ElementRef) { 
    
    
  }



}
