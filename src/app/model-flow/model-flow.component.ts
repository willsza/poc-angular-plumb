import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import panzoom from 'panzoom';
import { jsPlumb } from 'jsplumb';

@Component({
  selector: 'app-model-flow',
  templateUrl: './model-flow.component.html',
  styleUrls: ['./model-flow.component.css']
})
export class ModelFlowComponent implements AfterViewInit {

  @ViewChild('panzoomContainer', { static: true })
  private panzoomContainer: ElementRef;

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
    outlineStroke: 'white'
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
    isSource: true,
    isTarget: true,
    connector: [ 'Flowchart', { stub: [10, 10], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
    connectorStyle: this.connectorPaintStyle,
    hoverPaintStyle: this.endpointHoverStyle,
    connectorHoverStyle: this.connectorPaintHoverStyle,
    dragOptions: { cursor: 'pointer', zIndex: 2000 },
    overlays: [
      [
        'Label', {
          location: [0.5, 1.5],
          label: 'Drag',
          cssClass: 'endpointSourceLabel',
          visible: false
        }
      ]
    ]
  };

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.jsPlumbInit();
    this.addStartEndPoint();
    this.addFirstScreen();
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

  // GET CONNECTIONS TO RENDER
  getConnections(): void {
    // const connectionList = this.jsPlumbInstance.getConnections();
    // connectionList.forEach(element => {
    //   console.log(element);
    // });
  }


  // PRIVATE METHODS

  private jsPlumbInit(): void {
    this.panZoomController = panzoom(this.panzoomContainer.nativeElement);

    this.jsPlumbInstance = jsPlumb.getInstance({

      DragOptions: { cursor: 'pointer', zIndex: 2000 },
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
        ],
        [
          'Label', {
            location: 0.1,
            id: 'label',
            cssClass: 'aLabel',
            events: {
              tap() { alert('hey'); }
            }
          }
        ]
      ],

      Container: 'workspace'
    });

    // this.jsPlumbInstance.setZoom(0.75);

    this.jsPlumbInstance.bind('beforeDrag', (params) => {
      params.endpoint.getUuid(); // should return myIdentifier
    });
  }

  private addStartEndPoint(): void {
    this.jsPlumbInstance.addEndpoint('start', this.endpoint, {
      anchor: 'Right', uuid: `start`
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
    this.jsPlumbInstance.connect({ uuids: [ 'start', '1_4' ] });
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
