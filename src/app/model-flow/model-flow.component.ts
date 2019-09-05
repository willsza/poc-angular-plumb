import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import panzoom from 'panzoom';
import { jsPlumb } from 'jsplumb';

@Component({
  selector: 'app-model-flow',
  templateUrl: './model-flow.component.html',
  styleUrls: ['./model-flow.component.css']
})
export class ModelFlowComponent implements AfterViewInit {

  @ViewChild('panzoom', { static: true })
  private panzoom: ElementRef;

  @ViewChild('workspace', { static: true })
  private workspace: ElementRef;

  panZoomController: any;
  currentZoomLevel: number;

  canvaInstance: any;
  jsPlumbInstance: any;
  connections: any;

  connectorPaintStyle = {
    strokeWidth: 1,
    stroke: '#60789b',
    joinstyle: 'round',
    outlineStroke: '#f5f9fd',
    outlineWidth: 2
  };

  connectorPaintStyleWarning = {
    strokeWidth: 1,
    stroke: '#ffa100',
    joinstyle: 'round',
    outlineStroke: '#f5f9fd',
    outlineWidth: 2
  };

  connectorPaintStyleError = {
    strokeWidth: 1,
    stroke: '#fe0000',
    joinstyle: 'round',
    outlineStroke: '#f5f9fd',
    outlineWidth: 2
  };

  connectorPaintHoverStyle = {
    strokeWidth: 3,
    stroke: '#216477',
    outlineWidth: 5,
    outlineStroke: '#f5f9fd',
    cursor: 'pointer'
  };

  endpointHoverStyle = {
    fill: '#216477',
    stroke: '#216477'
  };

  endpoint = {
    endpoint: 'Dot',
    paintStyle: {
        stroke: 'transparent',
        fill: '#7AB02C',
        radius: 5,
        strokeWidth: 1
    },
    // isSource: true,
    // isTarget: true,
    connector: [ 'Flowchart', { stub: [10, 10], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
    connectorStyle: this.connectorPaintStyle,
    connectorHoverStyle: this.connectorPaintHoverStyle,
    hoverPaintStyle: this.endpointHoverStyle,
    dragOptions: {
      cursor: 'pointer',
      zIndex: 2000
    },
    // overlays: [
    //   ['Label', {label: 'labelName', location: 0.5, cssClass: 'connectingConnectorLabel'}]
    // ],
  };


  flowchart: any = {
    nodes: [
      {
        id: '1',
        top: '280',
        left: '200'
      },
      {
        id: '2',
        top: '20',
        left: '260'
      },
      {
        id: '3',
        top: '180',
        left: '700'
      },
      {
        id: '4',
        top: '303',
        left: '900'
      }
    ],
    edges: [
      {
        id: 'con_1',
        source: '1',
        target: '2'
      },
      {
        id: 'con_2',
        source: '1',
        target: '3'
      },
      {
        id: 'con_3',
        source: '1',
        target: '4'
      },
    ]
  };


  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.jsPlumbInit();
    this.addStartEndPoint();
    // this.addFirstScreen();
    this.draggableElementsInit();
    this.jpSetNewZoom();

    // this.zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
    // this.currentZoomLevel = this.zoomLevels[4];
    // panzoom(document.querySelector('#scene'));

  }

  // zoom(): void {
  //   const isSmooth = false;
  //   const scale = this.currentZoomLevel;


  //   if (scale) {
  //     const transform = this.panZoomController.getTransform();
  //     const deltaX = transform.x;
  //     const deltaY = transform.y;
  //     const offsetX = scale + deltaX;
  //     const offsetY = scale + deltaY;

  //     if (isSmooth) {
  //       this.panZoomController.smoothZoom(0, 0, scale);
  //     } else {
  //       this.panZoomController.zoomTo(offsetX, offsetY, scale);
  //     }
  //   }

  // }

  // zoomToggle(zoomIn: boolean): void {
  //   const idx = this.zoomLevels.indexOf(this.currentZoomLevel);
  //   if (zoomIn) {
  //     if (typeof this.zoomLevels[idx + 1] !== 'undefined') {
  //       this.currentZoomLevel = this.zoomLevels[idx + 1];
  //     }
  //   } else {
  //     if (typeof this.zoomLevels[idx - 1] !== 'undefined') {
  //       this.currentZoomLevel = this.zoomLevels[idx - 1];
  //     }
  //   }
  //   if (this.currentZoomLevel === 1) {
  //     this.panZoomController.moveTo(0, 0);
  //     this.panZoomController.zoomAbs(0, 0, 1);
  //   } else {
  //     this.zoom();
  //   }
  // }

  reset(): void {
    this.panZoomController.moveTo(0 , 0);
    this.panZoomController.zoomAbs(0, 0, 1);
  }

  // PUBLIC METHODS

  // CREATE NEW SCREEN ELEMENTS
  addScreen(): void {
    const card = this.renderer.createElement('div');
    const cardMore = this.renderer.createElement('div');
    const cardImg = this.renderer.createElement('div');
    const cardBody = this.renderer.createElement('div');
    const cardInput = this.renderer.createElement('input');

    const collectionCards = document.getElementsByClassName('card');
    const cardId = `${ collectionCards.length + 1 }`;

    this.renderer.addClass(card, 'card');
    this.renderer.addClass(cardMore, 'card-more');
    this.renderer.addClass(cardImg, 'card-img');
    this.renderer.addClass(cardBody, 'card-body');
    this.renderer.addClass(cardInput, 'form-control');
    this.renderer.addClass(cardInput, 'form-control-sm');
    this.renderer.setAttribute(cardInput, 'placeholder', 'Enter screen name');
    this.renderer.setAttribute(card, 'id', cardId);

    this.renderer.appendChild(card, cardMore);
    this.renderer.appendChild(card, cardImg);
    this.renderer.appendChild(card, cardBody);
    this.renderer.appendChild(cardBody, cardInput);
    this.renderer.appendChild(this.workspace.nativeElement, card);

    this.draggableElementsInit();
    this.addEndPoints(cardId);
  }


  getNodes(): void {
    const cards = [].slice.call(document.getElementsByClassName('card'));

    const nodes = cards.map((card: HTMLElement) => {
      return {
        nodeId: card.id,
        nodeTop: card.style.top,
        nodeLeft: card.style.left
      };
    });

    console.log(nodes);

  }

  // GET CONNECTIONS TO RENDER
  getConnections(): void {
    const connections: any[] = [];

    this.jsPlumbInstance.getConnections()
      .forEach(connection => {
        connections.push({
          connectionId: connection.id,
          sourceId: connection.sourceId,
          targetId: connection.targetId,
          sourceUuid: connection.endpoints[0].getUuid(),
          targetUuid: connection.endpoints[1].getUuid()
        });
      });

    // console.log(this.jsPlumbInstance.selectEndpoints({ source: 'start' }));
    console.log(connections);

    this.getNodes();
  }


  // PRIVATE METHODS

  private jsPlumbInit(): void {
    this.panZoomController = panzoom(this.panzoom.nativeElement);

    this.jsPlumbInstance = jsPlumb.getInstance();

    this.jsPlumbInstance.importDefaults({
      Anchor: 'Continuous',
      Connector: [ 'Flowchart', { stub: [10, 10], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
      ConnectionOverlays: [
        [
          'PlainArrow', {
            location: 1,
            visible: true,
            width: 10,
            length: 7,
            id: 'ARROW',
            events: {
              click() { alert('you clicked on the arrow overlay'); }
            }
          }
        ]
      ],
      Container: 'workspace',
      DragOptions: { cursor: 'crosshair' },
      Endpoint: [ 'Dot', { radius: 5 } ],
      Endpoints: [ [ 'Dot', { radius: 5 } ], [ 'Dot', { radius: 5 } ] ],
      EndpointStyle: { fill: '#7AB02C', strokeWidth: 1 },
      EndpointStyles: [
        { fill: '#7AB02C', strokeWidth: 1 },
        { fill: '#7AB02C', strokeWidth: 1 }
      ],
      HoverPaintStyle: {
        strokeWidth: 3,
        stroke: '#216477',
        outlineWidth: 5,
        outlineStroke: '#f5f9fd',
        cursor: 'pointer'
      },
      MaxConnections: -1,
      PaintStyle: {
        strokeWidth: 1,
        stroke: '#60789b',
        joinstyle: 'round',
        outlineStroke: '#f5f9fd',
        outlineWidth: 2
      }
    });


    // this.jsPlumbInstance = jsPlumb.getInstance({
      // Endpoint: 'Dot',
      // PaintStyle: {
      //     stroke: 'transparent',
      //     fill: '#7AB02C',
      //     strokeWidth: 1
      // },
      // // isSource: true,
      // // isTarget: true,
      // Connector: [ 'Flowchart', { stub: [10, 10], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
      // ConnectorStyle: this.connectorPaintStyle,
      // ConnectorHoverStyle: this.connectorPaintHoverStyle,
      // HoverPaintStyle: this.endpointHoverStyle,

      // DragOptions: { cursor: 'pointer', zIndex: 2000 },
      // ConnectionOverlays: [
      //   [
      //     'PlainArrow', {
      //       location: 1,
      //       visible: true,
      //       width: 10,
      //       length: 7,
      //       id: 'ARROW',
      //       events: {
      //         click() { alert('you clicked on the arrow overlay'); }
      //       }
      //     }
      //   ],
        // [
        //   'Label', {
        //     location: 0.1,
        //     id: 'label',
        //     cssClass: 'aLabel',
        //     events: {
        //       tap() { alert('hey'); }
        //     }
        //   }
        // ]
      // ],

      // Container: 'workspace'
    // });



    // this.jsPlumbInstance.setZoom(0.75);


    // BLOCK CONNECTION ON YOURSELF
    this.jsPlumbInstance.bind('beforeDrop', (params) => {
      return params.sourceId === params.targetId ? false : true;
    });

    // DELETE CONNECTION CLICK LINE
    this.jsPlumbInstance.bind('click', (conn, originalEvent) => {
      if (confirm('Delete connection from ' + conn.sourceId + ' to ' + conn.targetId + '?')) {
        this.jsPlumbInstance.deleteConnection(conn);
      }
    });



    this.flowchart.edges.forEach(connection => {
      this.jsPlumbInstance.connect(connection);
    });

  }

  private addStartEndPoint(): void {
    this.jsPlumbInstance.addEndpoint('start', this.endpoint, {
      anchor: 'Right', uuid: `start_1`
    });

    this.jsPlumbInstance.makeSource('1', {
      // anchor: 'Continuous',
      // maxConnections: -1,
      // dragOptions: {
      //   stop: (e, ui) => {
      //     // Stop drag event
      //   }
      // },
      filter: (event, element) => {
        return event.target.classList.contains('card')
        || event.target.classList.contains('card-body');
      }
    });

    this.jsPlumbInstance.makeSource('2', {
      // anchor: 'Continuous',
      // maxConnections: -1,
      filter: (event, element) => {
        return event.target.classList.contains('card')
        || event.target.classList.contains('card-body');
      },
      // overlays: [
      //   ['Label', {label: 'labelName', location: 0.5, cssClass: 'connectingConnectorLabel'}]
      // ],
    });

    this.jsPlumbInstance.makeSource('3', {
      // anchor: 'Continuous',
      // maxConnections: -1,
      filter: (event, element) => {
        return event.target.classList.contains('card')
        || event.target.classList.contains('card-body');
      }
    });

    this.jsPlumbInstance.makeSource('4', {
      // anchor: 'Continuous',
      // maxConnections: -1,
      filter: (event, element) => {
        return event.target.classList.contains('card')
        || event.target.classList.contains('card-body');
      }
    });

    this.jsPlumbInstance.makeTarget('1', {
      // anchor: 'Continuous',
      // maxConnections: -1,
    });

    this.jsPlumbInstance.makeTarget('2', {
      // anchor: 'Continuous',
      // maxConnections: -1
    });

    this.jsPlumbInstance.makeTarget('3', {
      // anchor: 'Continuous',
      // maxConnections: -1
    });

    this.jsPlumbInstance.makeTarget('4', {
      // anchor: 'Continuous',
      // maxConnections: -1
    });

  }

  private addFirstScreen(): void {
    this.addScreen();

    const card = document.getElementById('1');
    card.style.top = '177px';
    card.style.left = '300px';

    this.addEndPoints('1');
    this.jsPlumbInstance.repaint('1', { left: 300, top: 177 });

    this.addFirstConection();
  }

  private addFirstConection(): void {
    this.jsPlumbInstance.connect({ uuids: [ 'start_1', '1_4' ] });
  }

  private addEndPoints(elementId): void {
    this.jsPlumbInstance.addEndpoint(elementId, this.endpoint, {
      anchor: 'Top', uuid: `${elementId}_1`
    });

    this.jsPlumbInstance.addEndpoint(elementId, this.endpoint, {
      anchor: 'Bottom', uuid: `${elementId}_3`
    });

    this.jsPlumbInstance.addEndpoint(elementId, this.endpoint, {
      anchor: 'Left', uuid: `${elementId}_4`
    });

    this.jsPlumbInstance.addEndpoint(elementId, this.endpoint, {
      anchor: 'Right', uuid: `${elementId}_2`
    });
  }


  // INIT DRAGGABLE ELEMENTS
  private draggableElementsInit(): void {
    const dragElements = document.getElementsByClassName('card');
    this.jsPlumbInstance.draggable(dragElements, {
      // grid: [100, 100],
      filter: '.card-move',
      filterExclude: false,
      // containment: 'workspace',
      drag(event) {
      },
      stop(event) {
        // console.log(event.pos);
      }
    });
  }



  jpSetNewZoom(): void {
    this.panZoomController.on('transform', (e) => {
      const transform = e.getTransform();
      this.jsPlumbInstance.setZoom(transform.scale);
    });
  }

}
