import { mxCompactTreeLayout, mxGraph } from "mxgraph";
import { useCallback, useEffect, useRef, useState } from "react";
import mxHelper from './_helpers/mxgraph';                       // <- import values from factory()
import JsonCodec from "./JsonCodec";


const Toolbar = (props: { graph: mxGraph | undefined, layout: mxCompactTreeLayout | undefined, setGraph: any }) => {
    const { graph, layout, setGraph } = props;
    const [zoom, setZoom] = useState<number>();
    const [json, setJson] = useState('');

    const toolbar = useRef<HTMLDivElement>(null);

    const getJsonModel = (graph: mxGraph) => {
        const encoder = new JsonCodec();
        const jsonModel = encoder.decode(graph.getModel());
        return {
            graph: jsonModel
        };
    };

    const renderJSON = (dataModel: any, graph: mxGraph) => {
        const jsonEncoder = new JsonCodec();
        let vertices: any = {};
        const parent = graph.getDefaultParent();
        graph.getModel().beginUpdate(); // Adds cells to the model in a single step
        try {
            dataModel &&
                dataModel.graph.map((node: any) => {
                    if (node.value) {
                        if (typeof node.value === "object") {
                            const xmlNode = jsonEncoder.encode(node.value);
                            vertices[node.id] = graph.insertVertex(
                                parent,
                                null,
                                xmlNode,
                                node.geometry.x,
                                node.geometry.y,
                                node.geometry.width,
                                node.geometry.height,
                                node.style
                            );
                        } else if (node.value === "Edge") {
                            graph.insertEdge(
                                parent,
                                null,
                                "Edge",
                                vertices[node.source],
                                vertices[node.target],
                                node.style
                            );
                        }
                    }
                });
        } finally {
            graph.getModel().endUpdate(); // Updates the display
        }
    };

    const stringifyWithoutCircular = (json: any) => {
        return JSON.stringify(
            json,
            (key, value) => {
                if (
                    (key === "parent" || key === "source" || key === "target") &&
                    value !== null
                ) {
                    return value.id;
                } else if (key === "value" && value !== null && value.localName) {
                    let results: any = {};
                    Object.keys(value.attributes).forEach(attrKey => {
                        const attribute = value.attributes[attrKey];
                        results[attribute.nodeName] = attribute.nodeValue;
                    });
                    return results;
                }
                return value;
            },
            4
        );
    };

    const initToolbar = (graph: mxGraph, layout: mxCompactTreeLayout) => {

        if (null === toolbar.current) return;

        // var toolbar = ReactDOM.findDOMNode(refs.toolbar);
        // let toolbar = toolbar.current;

        toolbar.current.appendChild(
            mxHelper.mxUtils.button("zoom(+)", function (evt: Event) {
                graph.zoomIn();
            })
        );
        toolbar.current.appendChild(
            mxHelper.mxUtils.button("zoom(-)", function (evt: Event) {
                graph.zoomOut();
            })
        );
        toolbar.current.appendChild(
            mxHelper.mxUtils.button("restore", function (evt: Event) {
                graph.zoomActual();
                const zoom = { zoomFactor: 1.2 };
                // setGraph(graph);
                setZoom(zoom.zoomFactor);

                // that.setState({
                //   graph: { ...graph, ...zoom }
                // });
            })
        );

        var undoManager = new mxHelper.mxUndoManager();
        var listener = function (sender: any, evt: any) {
            undoManager.undoableEditHappened(evt.getProperty("edit"));
        };
        graph.getModel().addListener(mxHelper.mxEvent.UNDO, listener);
        graph.getView().addListener(mxHelper.mxEvent.UNDO, listener);

        toolbar.current.appendChild(
            mxHelper.mxUtils.button("undo", function () {
                undoManager.undo();
            })
        );

        toolbar.current.appendChild(
            mxHelper.mxUtils.button("redo", function () {
                undoManager.redo();
            })
        );
        toolbar.current.appendChild(
            mxHelper.mxUtils.button("Automatic layout", function () {
                graph.getModel().beginUpdate();
                try {
                    layout.execute(graph.getDefaultParent());
                } catch (e) {
                    throw e;
                } finally {
                    graph.getModel().endUpdate();
                }
            })
        );

        toolbar.current.appendChild(
            mxHelper.mxUtils.button("view XML", function () {
                var encoder = new mxHelper.mxCodec();
                var node = encoder.encode(graph.getModel());
                mxHelper.mxUtils.popup(mxHelper.mxUtils.getXml(node), true);
            })
        );
        toolbar.current.appendChild(
            mxHelper.mxUtils.button("view JSON", function () {
                const jsonNodes = getJsonModel(graph);
                let jsonStr = stringifyWithoutCircular(jsonNodes);
                localStorage.setItem("json", jsonStr);
                setJson(jsonStr);
                // that.setState({
                //   json: jsonStr
                // });
                console.log(jsonStr);
            })
        );
        toolbar.current.appendChild(
            mxHelper.mxUtils.button("render JSON", function () {
                renderJSON(JSON.parse(json), graph);
            })
        );
    };


    const getData = () => {
        if (!graph || !layout) return;
        initToolbar(graph, layout);
    };


    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="toolbar" ref={toolbar} />
    )

}

export default Toolbar