import * as React from "react";
import * as ReactDOM from "react-dom";
import { default as MxGraph, mxCell,  mxGraphModel } from "mxgraph";
import { CompactPicker } from "react-color";
import { NumberPicker } from 'react-widgets';
// import simpleNumberLocalizer from 'react-widgets-simple-number';
import parser from "xml-js";
import {
  getStyleByKey,
  setInitialConfiguration,
} from "./_utils";
import { useState } from "react";

const {
  mxEvent,
  mxGraph,
  mxConnectionHandler,
  mxUtils,
  mxPoint,
  mxEdgeHandler,
  mxConstraintHandler,
  mxCodec,
  mxCellState,
  mxConnectionConstraint,
  mxDragSource
} = MxGraph();

// simpleNumberLocalizer();

export default function DiagramEditor(props: any) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const bottomToolbarRef = React.useRef<HTMLDivElement>(null);

  const [colorPickerVisible, setColorPickerVisible] = React.useState(false);
  const [selected, setSelected] = React.useState<any>(null);
  const [colorPickerType, setColorPickerType] = React.useState(null);
  const [graph, setGraph] = useState<any>();
  const [activeFont, setActiveFont] = React.useState<any>(null);

  React.useEffect(() => {
    
    const container = containerRef.current;
    if (!container) return;
    mxEvent.disableContextMenu(container);
    
    if (!graph) {
      
      const myGraph = new mxGraph(container);
      const model: mxGraphModel = myGraph.getModel();

      // model.beginUpdate();

      setGraph(myGraph);
    }

    // Adds cells to the model in a single step
    if (graph) {
      //setInitialConfigurationNew(graph, toolbarRef);
      setInitialConfiguration(graph, toolbarRef, bottomToolbarRef);

      // Updates the display
      graph.getModel().endUpdate();
      graph.getModel().addListener(mxEvent.CHANGE, onChange);
      graph.getSelectionModel().addListener(mxEvent.CHANGE, onSelected);
      graph.getModel().addListener(mxEvent.ADD, onElementAdd);
      graph.getModel().addListener(mxEvent.MOVE_END, onDragEnd);
      graph.maximumContainerSize = 2000;
    }
  }, [graph]);
  
  const getEditPreview = () => {
    var dragElt = document.createElement("div");
    dragElt.style.border = "dashed black 1px";
    dragElt.style.width = "120px";
    dragElt.style.height = "40px";
    return dragElt;
  };
  // const createDragElement = () => {
  //   // const { graph } = state;
  //   if(!mxSidebarRef) return;
  //   const tasksDrag = ReactDOM.findDOMNode(
  //     mxSidebarRef
  //   )?.querySelectorAll(".task");
  //   Array.prototype.slice.call(tasksDrag).forEach(ele => {
  //     const value = ele.getAttribute("data-value");
  //     let ds = mxUtils.makeDraggable(
  //       ele,
  //       graphF,
  //       (graph: any, evt: any, target: any, x: any, y: any) =>
  //         funct(graph, evt, target, x, y, value),
  //       dragElt,
  //       null,
  //       null,
  //       graph.autoscroll,
  //       true
  //     );
  //     ds.isGuidesEnabled = function() {
  //       return graph.graphHandler.guidesEnabled;
  //     };
  //     ds.createDragElement = mxDragSource.prototype.createDragElement;
  //   });
  // };
  
  // const settingConnection = () => {
  //   mxConstraintHandler.prototype.intersects = function(
  //     icon,
  //     point,
  //     source,
  //     existingEdge
  //   ) {
  //     return !source || existingEdge || mxUtils.intersects(icon.bounds, point);
  //   };

  //   var mxConnectionHandlerUpdateEdgeState =
  //     mxConnectionHandler.prototype.updateEdgeState;
  //   mxConnectionHandler.prototype.updateEdgeState = function(pt, constraint) {
  //     if (pt != null && previous != null) {
  //       var constraints = graph.getAllConnectionConstraints(previous);
  //       var nearestConstraint = null;
  //       var dist = null;

  //       for (var i = 0; i < constraints.length; i++) {
  //         var cp = graph.getConnectionPoint(previous, constraints[i]);

  //         if (cp != null) {
  //           var tmp =
  //             (cp.x - pt.x) * (cp.x - pt.x) + (cp.y - pt.y) * (cp.y - pt.y);

  //           if (dist == null || tmp < dist) {
  //             nearestConstraint = constraints[i];
  //             dist = tmp;
  //           }
  //         }
  //       }

  //       if (nearestConstraint != null) {
  //         sourceConstraint = nearestConstraint;
  //       }

  //       // In case the edge style must be changed during the preview:
  //       edgeState.style["edgeStyle"] = "orthogonalEdgeStyle";
  //       // And to use the new edge style in the new edge inserted into the graph,
  //       // update the cell style as follows:
  //       edgeState.cell.style = mxUtils.setStyle(
  //         edgeState.cell.style,
  //         "edgeStyle",
  //         edgeState.style["edgeStyle"]
  //       );
  //     }

  //     mxConnectionHandlerUpdateEdgeState.apply(this, arguments);
  //   };

  //   if (graph.connectionHandler.connectImage == null) {
  //     graph.connectionHandler.isConnectableCell = function(cell) {
  //       return false;
  //     };
  //     mxEdgeHandler.prototype.isConnectableCell = function(cell) {
  //       return graph.connectionHandler.isConnectableCell(cell);
  //     };
  //   }

  //   graph.getAllConnectionConstraints = function(terminal) {
  //     if (terminal != null && model.isVertex(terminal.cell)) {
  //       return [
  //         new mxConnectionConstraint(new mxPoint(0.5, 0), true),
  //         new mxConnectionConstraint(new mxPoint(0, 0.5), true),
  //         new mxConnectionConstraint(new mxPoint(1, 0.5), true),
  //         new mxConnectionConstraint(new mxPoint(0.5, 1), true)
  //       ];
  //     }
  //     return null;
  //   };

  //   // Connect preview
  //   graph.connectionHandler.createEdgeState = function(me) {
  //     var edge = graph.createEdge(
  //       null,
  //       null,
  //       "Edge",
  //       null,
  //       null,
  //       "edgeStyle=orthogonalEdgeStyle"
  //     );

  //     return new mxCellState(
  //       graph.view,
  //       edge,
  //       graph.getCellStyle(edge)
  //     );
  //   };
  // };

  const onChange = () => {
    if (graph.view.scale < 1) {
    }
  };

  const onSelected = (evt: { cells: any[]; }) => {
    if (props.onSelected) {
      props.onSelected(evt);      
    }
    console.log(evt.cells[0])
    setSelected(evt.cells[0]);
    setColorPickerVisible(false);
    if (evt.cells[0]) {
      const style = graph.getCellStyle(evt.cells[0])
      const fontSize = typeof style.fontSize === 'string' && style.fontSize.indexOf('px') > 0 ? style.fontSize.slice(0, -2) : style.fontSize
      setActiveFont(parseInt(fontSize))
    }
  };

  const onElementAdd = (evt: any) => {
    if (props.onElementAdd) {
      props.onElementAdd(evt);
    }
  };

  const onDragEnd = (evt: any) => {
    if (props.onDragEnd) {
      props.onDragEnd(evt);
    }
  };

  const onAdd = (geometry: string) => {
    //console.log("lets add an", geometry);
  };

  const renderAddButton = (geometry: string) => (
    <div
      className={`toolbar-button button-add-${geometry}`}
      onClick={()=>onAdd(geometry)}
      role="button"
    >
      {geometry === "text" && "T"}
    </div>
  );
  
  const renderColorChange = (type: any, content: any)  => {
    if (!selected || !selected.style) {
      return null;
    }
    return (
      <div
        className={"button-color-change"}
        onClick={() => {
          setColorPickerVisible(!colorPickerVisible);
          setColorPickerType(type);
        }}
        style={{
          backgroundColor: getStyleByKey(selected.style, type)
        }}
      >
        {content}
      </div>
    );
  };

  const updateCellColor = (type:any, color:any) => {
    graph.setCellStyles(type, color.hex);
  };
  const updateCellFont = (type:any, font:any) => {
    graph.setCellStyles(type, font)
  }

  const renderColorPicker = () =>
    colorPickerVisible &&
    selected &&
    selected.style && (
      <div>        
        <div className="toolbar-separator" />
        <CompactPicker
          color={getStyleByKey(selected.style, "fillColor")}
          onChange={color => {
            updateCellColor(colorPickerType, color);
          }}
        />
      </div>
    );


  const renderFontPicker = () => 
    selected &&
    selected.style && 
    (
      <div>
          <div className="toolbar-separator" />
          <NumberPicker
            max={30}
            min={1}
            value={activeFont}
            onChange={value => {
              setTimeout(() => {
                setActiveFont(value);
                updateCellFont ('fontSize', `${value}px` );
              }, 500);
            }}
          />          
          <div className="toolbar-separator" />
        </div>
    );
  

  const onReaderLoad = (e:any) => {

    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    var json = JSON.parse(e.target.result);
    var options = { compact: true, ignoreComment: true, spaces: 4 };
    var xml = parser.js2xml(json.mxGraphModel, options);
    var doc = mxUtils.parseXml(xml);

    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, graph.getModel());
    console.log(doc.documentElement, "=");
    var parent = graph.getDefaultParent();
    var elt = doc.documentElement.firstChild;
    var list = [];
    // Adds cells to the model in a single step
    graph.getModel().beginUpdate();
    try {
      while (elt != null) {
        var cell: any = codec.decodeCell(elt);
        console.log(cell, list);

        if (cell && cell.vertex) {
          var geoData = cell.geometry.attributes;
          cell.geometry = {
            x: geoData.x.value,
            y: geoData.y.value,
            width: geoData.width.value,
            height: geoData.height.value
          };
          list.push(cell);
        } else if (cell && cell.edge) {
          cell.geometry = { x: 0, y: 0, width: 0, height: 0, relative: true };
          cell.edge = true;
          if (cell.target) {
            cell.target = list.filter(c => c.id === cell.target)[0];
            var i = list.length - 1;
            for (; i >= 0; i--) {
              if (list[i] && list[i].vertex && list[i].id !== cell.target) {
                cell.source = list[i];
                break;
              }
            }
          } else {
            var j = list.length - 1;
            for (; j >= 0; j--) {
              if (list[j] && list[j].vertex && !cell.target) {
                cell.target = list[j];
                continue;
              } else if (cell.target) {
                cell.source = list[j];
                break;
              }
            }
          }
          list.push(cell);
        }

        graph.refresh();
        elt = elt.nextSibling;
      }
      graph.addCells(list);
      console.log(list);
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
    //setGraph(graph);
  };
  const fileChanged = function(event: any) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = function(upload: any) {
      onReaderLoad(upload);
    };
    if (file) reader.readAsText(file);
  };

  return (
    <div className="mxgraph-container">
      <div className="mxgraph-toolbar-container">
        <div className="mxgraph-toolbar-container mxgraph-toolbar" ref={toolbarRef} />
        <div className="mxgraph-top-toolbar-container">
          {renderFontPicker()}
          {renderColorChange("fillColor", null)}
          {renderColorChange("fontColor", "T")}
          {renderColorChange("strokeColor", "|")}
          {renderColorPicker()}
        </div>
        <div
          className="mxgraph-bottom-toolbar-container"
          ref={bottomToolbarRef}
        />
      </div>
      <div
        ref={containerRef}
        className="mxgraph-drawing-container"
        style={{ height: '100%' }}
      />
      <input
        type="file"
        name="upfile"
        id="upfile"
        onChange={fileChanged}
        style={{ display: "none" }}
      />
    </div>
  );
}