import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { jsPlumb } from 'jsplumb';

@Component({
  selector: 'app-model-flow',
  templateUrl: './model-flow.component.html',
  styleUrls: ['./model-flow.component.css']
})
export class ModelFlowComponent implements AfterViewInit {

  @ViewChild('workspace', { static: true })
  private workspace: ElementRef;

  jsPlumbInstance: any;
  connections: any;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.jsPlumbInit();
    this.draggableElementsInit();
    this.endPointsInit();
    // console.log(this.jsPlumbInstance);
  }

  addTable(): void {
    const card = this.renderer.createElement('div');
    const cardBody = this.renderer.createElement('div');
    const text = this.renderer.createText('Table');

    this.renderer.addClass(card, 'card');
    this.renderer.addClass(cardBody, 'card-body');

    this.renderer.appendChild(card, cardBody);
    this.renderer.appendChild(cardBody, text);
    this.renderer.appendChild(this.workspace.nativeElement, card);

    this.draggableElementsInit();
  }

  jsPlumbInit(): void {
    this.jsPlumbInstance = jsPlumb.getInstance({
      Container: 'workspace'
    });

    // this.jsPlumbInstance.bind('connection', function(info) {
    //   alert('New connection!\nFrom: ' + info.sourceId + '\nTo: ' + info.targetId);
    // });
  }

  draggableElementsInit(): void {
    const dragElements = document.getElementsByClassName('card');
    this.jsPlumbInstance.draggable(dragElements, {
      containment: 'workspace',
      drag(event) {
        // Your code comes here
        // console.log(this.jsPlumbInstance.repaint('table_1')); // Note that it will only repaint the dragged element
      },
      stop(event) {
        // Your code for capturing dragged element position.
        console.log(event.pos);
      }
    });
  }

  endPointsInit(): void {
    const endpointOptions = {
      isSource: true,
      isTarget: true,
      endpoint: [ 'Dot', { radius: 5 } ],
      connector : 'Flowchart',
      anchor: 'Continuous',
      maxConnections: -1,
      dropOptions: {
        drop(e, ui) {
          alert('drop!');
        }
      }
    };

    const table1EP = this.jsPlumbInstance.addEndpoint('table_1', { uuid: '0001' }, endpointOptions );
    const table2EP = this.jsPlumbInstance.addEndpoint('table_2', { uuid: '0002' }, endpointOptions );
    const table3EP = this.jsPlumbInstance.addEndpoint('table_3', { uuid: '0003' }, endpointOptions );
    const table4EP = this.jsPlumbInstance.addEndpoint('table_4', { uuid: '0004' }, endpointOptions );

    // this.jsPlumbInstance.connect({ uuids: [ '0001', '0004' ] });


    this.jsPlumbInstance.setDefaultScope('workspace');
  }

  getConnections(): void {
    // this.connections = this.jsPlumbInstance.getAllConnections();
    const table1 = document.getElementById('table_1');
    const table2 = document.getElementById('table_2');
    const table3 = document.getElementById('table_3');
    const table4 = document.getElementById('table_4');

    table1.style.top = '280px';
    table1.style.left = '100px';
    table2.style.top = '280px';
    table2.style.left = '300px';
    table3.style.top = '280px';
    table3.style.left = '500px';
    table4.style.top = '280px';
    table4.style.left = '700px';

    this.jsPlumbInstance.repaint('table_1', { left: 100, top: 280 });
    this.jsPlumbInstance.repaint('table_2', { left: 300, top: 280 });
    this.jsPlumbInstance.repaint('table_3', { left: 500, top: 280 });
    this.jsPlumbInstance.repaint('table_4', { left: 700, top: 280 });

    this.jsPlumbInstance.connect({ uuids: [ '0001', '0002' ] });
    this.jsPlumbInstance.connect({ uuids: [ '0002', '0003' ] });
    this.jsPlumbInstance.connect({ uuids: [ '0003', '0004' ] });
  }

}
