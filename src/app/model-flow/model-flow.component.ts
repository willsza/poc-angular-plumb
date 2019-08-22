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
    this.endPointsInit();
  }

  jsPlumbInit(): void {
    this.jsPlumbInstance = jsPlumb.getInstance({
      // default drag options
      DragOptions: { cursor: 'pointer', zIndex: 2000 },
      // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
      // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
      ConnectionOverlays: [
          [ "Arrow", {
              location: 1,
              visible: true,
              width: 11,
              length: 11,
              id: "ARROW",
              events:{
                  click:function() { alert("you clicked on the arrow overlay")}
              }
          } ],
          [ "Label", {
              location: 0.1,
              id: "label",
              cssClass: "aLabel",
              events: {
                  tap:function() { alert("hey"); }
              }
          }]
      ],

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
      // endpoint: [ 'Dot', { radius: 5 } ],
      // connector : 'Flowchart',
      // anchors: ["Bottom", "Continuous"],
      // maxConnections: 32,
      // dropOptions: {
      //   drop(e, ui) {
      //     alert('drop!');
      //   }
      // }
    };

    // const table1EP = this.jsPlumbInstance.addEndpoint('table_1', { uuid: '0001' }, endpointOptions );
    // const table2EP = this.jsPlumbInstance.addEndpoint('table_2', { uuid: '0002' }, endpointOptions );
    // const table3EP = this.jsPlumbInstance.addEndpoint('table_3', { uuid: '0003' }, endpointOptions );
    // const table4EP = this.jsPlumbInstance.addEndpoint('table_4', { uuid: '0004' }, endpointOptions );

    const endPointElements = document.getElementsByClassName('card');
    // this.jsPlumbInstance.addEndpoint(endPointElements, endpointOptions );


    const connectorPaintStyle = {
      strokeWidth: 1,
      stroke: '#60789b',
      joinstyle: 'round',
      outlineStroke: '#f5f9fd',
      outlineWidth: 2
    };
        // .. and this is the hover style.
    const connectorHoverStyle = {
      strokeWidth: 3,
      stroke: "#216477",
      outlineWidth: 5,
      outlineStroke: "white"
    };

    const endpointHoverStyle = {
        fill: "#216477",
        stroke: "#216477"
    };


    const sourceEndpoint = {
      endpoint: "Dot",
      paintStyle: {
          stroke: "transparent",
          fill: "transparent",
          radius: 5,
          strokeWidth: 1
      },
      isSource: true,
      connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
      connectorStyle: connectorPaintStyle,
      hoverPaintStyle: endpointHoverStyle,
      connectorHoverStyle: connectorHoverStyle,
      dragOptions: {},
      overlays: [
          [ "Label", {
              location: [0.5, 1.5],
              label: "Drag",
              cssClass: "endpointSourceLabel",
              visible:false
          } ]
      ]
    };

    const targetEndpoint = {
      endpoint: "Dot",
      paintStyle: { fill: "#7AB02C", radius: 5 },
      hoverPaintStyle: endpointHoverStyle,
      maxConnections: -1,
      dropOptions: { hoverClass: "hover", activeClass: "active" },
      isTarget: true,
      overlays: [
          [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
      ]
    };

    this.jsPlumbInstance.addEndpoint('table_1', sourceEndpoint, {
      anchor: 'TopCenter', uuid: '0001'
    });

    this.jsPlumbInstance.addEndpoint('table_1', targetEndpoint, {
      anchor: 'BottomCenter', uuid: '0002'
    });

    this.jsPlumbInstance.addEndpoint('table_1', targetEndpoint, {
      anchor: 'BottomLeft', uuid: '0003'
    });

    this.jsPlumbInstance.addEndpoint('table_2', sourceEndpoint, {
      anchor: 'TopCenter', uuid: '0004'
    });

    this.jsPlumbInstance.addEndpoint('table_2', targetEndpoint, {
      anchor: 'BottomCenter', uuid: '0005'
    });

    this.jsPlumbInstance.addEndpoint('table_3', targetEndpoint, {
      anchor: 'BottomCenter', uuid: '0006'
    });

    this.jsPlumbInstance.addEndpoint('table_3', sourceEndpoint, {
      anchor: 'TopCenter', uuid: '0007'
    });

    this.jsPlumbInstance.addEndpoint('table_3', sourceEndpoint, {
      anchor: 'TopLeft', uuid: '0008'
    });

    this.jsPlumbInstance.addEndpoint('table_3', sourceEndpoint, {
      anchor: 'TopRight', uuid: '0009'
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0, 0, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0.2, 0, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0.4, 0, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0.6, 0, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0.8, 0, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 1, 0, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0, 0.2, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0, 0.4, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0, 0.6, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0, 0.8, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_4", sourceEndpoint, {
      anchor: [ 0, 1, 0, 0 ]
    });

    this.jsPlumbInstance.addEndpoint("table_5", sourceEndpoint, {
      endpoint: ['Rectangle', { width: '60px', height: '5px' } ],
      anchor: 'TopCenter'
    });

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
