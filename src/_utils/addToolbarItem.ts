import { default as MxGraph, mxGraph } from "mxgraph";
const { mxEvent, mxUtils } = MxGraph();

export default function addToolbarItem(graph: mxGraph, toolbar: any, prototype: any, image: any) {
  // Function that is executed when the image is dropped on
  // the graph. The cell argument points to the cell under
  // the mousepointer if there is one.
  var funct = function(graph: any, evt: any, cell: any, x: any, y: any) {
    graph.stopEditing(false);

    var vertex = graph.getModel().cloneCell(prototype);
    vertex.geometry.x = x;
    vertex.geometry.y = y;
    graph.addCell(vertex);
    graph.setSelectionCell(vertex);
  };

  // Creates the image which is used as the drag icon (preview)
  var img = toolbar.addMode(null, image, function(evt: any, cell: any) {
    var pt = graph.getPointForEvent(evt,false);
    funct(graph, evt, cell, pt.x, pt.y);
  });

  // Disables dragging if element is disabled. This is a workaround
  // for wrong event order in IE. Following is a dummy listener that
  // is invoked as the last listener in IE.
  mxEvent.addListener(img, "mousedown", function(evt: any) {
    // do nothing
  });

  // This listener is always called first before any other listener
  // in all browsers.
  mxEvent.addListener(img, "mousedown", function(evt: Event) {
    if (!img.enabled) {
      mxEvent.consume(evt);
    }
  });

  mxUtils.makeDraggable(img, graph, funct);

  return img;
}