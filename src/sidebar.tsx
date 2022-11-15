import { mxCell, mxGraph } from "mxgraph";
import { useCallback, useEffect, useRef, useState } from "react";
import mxHelper from './_helpers/mxgraph';
// import './sidebar.less';                 // <- import values from factory()
// const { Panel } = Collapse;

const SIDEBAR_BASIC_SHAPES = [
    {
        name: 'rectangle',
        key: 'Rectangle',
        logo: 'https://img.alicdn.com/tfs/TB19O8OokvoK1RjSZFNXXcxMVXa-33-26.svg',
        width: 120,
        height: 60,
    },
    {
        name: 'rounded rectangle',
        key: 'Rounded Rectangle',
        logo: 'https://img.alicdn.com/tfs/TB1rzVHojDpK1RjSZFrXXa78VXa-33-26.svg',
        width: 120,
        height: 60,
    },
    {
        name: 'trapezoid',
        key: 'Trapezoid',
        logo: 'https://img.alicdn.com/tfs/TB1nEXPokvoK1RjSZPfXXXPKFXa-33-26.svg',
        width: 120,
        height: 60,
    },
    {
        name: 'circle',
        key: 'Circle',
        logo: 'https://img.alicdn.com/tfs/TB15iXQogHqK1RjSZFkXXX.WFXa-38-38.svg',
        width: 80,
        height: 80,
    },
    {
        name: 'triangle',
        key: 'Triangle',
        logo: 'https://img.alicdn.com/tfs/TB1cxNKohTpK1RjSZR0XXbEwXXa-38-38.svg',
        width: 80,
        height: 80,
    },
    {
        name: 'line',
        key: 'Line',
        logo: 'https://img.alicdn.com/tfs/TB1LOxPoirpK1RjSZFhXXXSdXXa-38-38.svg',
        width: 80,
        height: 80,
    },
    {
        name: 'text',
        key: 'Text',
        logo: '',
        width: 60,
        height: 20,
    }
];


const Sidebar = (props: { graph: mxGraph | undefined, setCreateVisible: any, setCurrentNode: any, setCurrentTask: any }) => {
    const { graph, setCreateVisible, setCurrentNode, setCurrentTask } = props;
    const [dragElt, setDragElt] = useState<HTMLDivElement>();

    const mxSidebar = useRef<HTMLUListElement>(null);

    const addOverlays = (graph: mxGraph, cell: mxCell) => {
        var overlay = new mxHelper.mxCellOverlay(
            new mxHelper.mxImage(
                "https://uploads.codesandbox.io/uploads/user/4bf4b6b3-3aa9-4999-8b70-bbc1b287a968/jEU_-add.png",
                16,
                16
            ),
            "load more"
        );
        console.log("overlay");
        overlay.cursor = "hand";
        overlay.align = mxHelper.mxConstants.ALIGN_CENTER;
        overlay.offset = new mxHelper.mxPoint(0, 10);
        overlay.addListener(
            mxHelper.mxEvent.CLICK,
            mxHelper.mxUtils.bind(this, function (sender: any, evt: any) {
                console.log("load more");
                // addChild(graph, cell);
            })
        );

        graph.addCellOverlay(cell, overlay);
    };

    const selectionChanged = (graph: mxGraph, value: any) => {
        console.log("visible");
        setCreateVisible(true);
        setCurrentNode(graph.getSelectionCell());
        setCurrentTask(value);
    };


    const selectionChange = (sender: any, evt: any) => {
        // console.log(sender)
    };

    const getEditPreview = () => {
        let dragElt = document.createElement("div");
        dragElt.style.border = "dashed black 1px";
        dragElt.style.width = "120px";
        dragElt.style.height = "40px";
        return dragElt;
    };

    // An mxGraph object, as a drop target or a function that 
    // receives mouse events and returns the current mxGraph.
    const graphF = (evt: MouseEvent | TouchEvent) => {
        if (!graph) return null;
        var x = mxHelper.mxEvent.getClientX(evt);
        var y = mxHelper.mxEvent.getClientY(evt);
        let elt: any = document.elementFromPoint(x, y);
        if (mxHelper.mxUtils.isAncestorNode(graph.container, elt)) {
            return graph;
        }
        return graph;
    };

    const funct = (graph: mxGraph, evt: any, target: any, x: any, y: any, value: any) => {

        if (null === graph) return;

        var doc = mxHelper.mxUtils.createXmlDocument();
        var obj = doc.createElement("TaskObject");
        obj.setAttribute("label", value);
        obj.setAttribute("text", "");
        obj.setAttribute("desc", "");

        var parent = graph.getDefaultParent();
        let cell = graph.insertVertex(
            parent,
            target,
            obj,
            x,
            y,
            150,
            60,
            "strokeColor=#000000;strokeWidth=1;fillColor=white"
        );
        addOverlays(graph, cell);
        graph.setSelectionCell(cell);
        selectionChanged(graph, value);

        // if (cells != null && cells.length > 0)
        // {
        // 	graph.scrollCellToVisible(cells[0]);
        // 	graph.setSelectionCells(cells);
        // }
    };

    const createDragElement = (graph: mxGraph) => {

        if (null === mxSidebar.current) return;

        const tasksDrag = mxSidebar.current.querySelectorAll(".task");
        Array.prototype.slice.call(tasksDrag).forEach(ele => {
            const value = ele.getAttribute("data-value");

            // TODO we are not passing graphF (as in the sample)
            let ds = mxHelper.mxUtils.makeDraggable(
                ele,
                graph,
                (graph: mxGraph, evt: Event, target: mxCell, x: number, y: number) =>
                    funct(graph, evt, target, x, y, value),
                dragElt,
                undefined,
                undefined,
                graph.autoScroll,
                true
            );
            // let ds = mxHelper.mxUtils.makeDraggable(
            //   ele,
            //   graphF,
            //   (graph: mxGraph, evt: Event, target: mxCell, x: number, y: number) =>
            //     funct(graph, evt, target, x, y, value),
            //   dragElt,
            //   undefined,
            //   undefined,
            //   graph.autoScroll,
            //   true
            // );
            ds.isGuidesEnabled = function () {
                return graph.graphHandler.guidesEnabled;
            };
            ds.createDragElement = mxHelper.mxDragSource.prototype.createDragElement;
        });
    };

    function handleSidebarItems() {

        const sidebarItems = document.querySelectorAll('.sidebar');

        SIDEBAR_BASIC_SHAPES.map((item: any) =>
            mxSidebar.current?.appendChild(mxHelper.mxUtils.button(item.name, function (evt: Event) {

            })
            ));
        // const newSidebarItems = Array.from(sidebarItems).filter((item) => {
        //     if (!item.classList.contains('has-inited')) {
        //         item.classList.add('has-inited');
        //         return true;
        //     }
        //     return false;
        // });

        // editor.initSidebar(newSidebarItems);
    }

    const getData = () => {
        if (!graph) return;

        // handleSidebarItems();
        createDragElement(graph);
        setDragElt(getEditPreview);
    }


    useEffect(() => {
        getData();
    }, []);

    return (
        <ul className="sidebar" ref={mxSidebar}>
            <li className="title" data-title="Task node" data-value="Task node">
                Task node
            </li>
            <li
                className="task"
                data-title="Kafka->HDFS"
                data-value="Channel task"
            >
                rectangle
            </li>
            <li
                className="task"
                data-title="A/B test task"
                data-value="A/B test task"
            >
                A/Btest task
            </li>
            <li
                className="task"
                data-title="Hive->Email"
                data-value="Report task"
            >
                Report task
            </li>
            <li className="task" data-title="Hive->Hive" data-value="HSQL task">
                HSQL task
            </li>
            <li className="task" data-title="Shell task" data-value="Shell task">
                Shell task
            </li>
            <li id="layout123">layout</li>
        </ul>
    )

}

export default Sidebar