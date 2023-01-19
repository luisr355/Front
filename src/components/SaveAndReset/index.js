import React, { useState, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextUpdaterNode from './TextUpdaterNode.js';
import './text-updater-node.css';

import './index.css';

const flowKey = 'example-flow';


const getNodeId = () => `randomnode_${+new Date()}`;

const handleSubmit = async (event) => {

    const data = { // Aquí iría la data que quieres enviar en la petición
        rol_id: null,
        nombre_rol: "Sin asignar",
    };

    try {
        const res = await fetch('http://localhost:8000/api/nodo/create', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', },
        });
        const json = await res.json();
        console.log(json);
    } catch (error) {
        console.log(error);
    }
};

const getData = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/nodo/index');
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
}

const nodeTypes = { textUpdater: TextUpdaterNode };

const initialNodes = [];

const initialEdges = [];

const SaveRestore = () => {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const { setViewport } = useReactFlow();


    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        console.log(JSON.parse(localStorage.getItem(flowKey)));
        const restoreFlow = async () => {
            const flow = JSON.parse(localStorage.getItem(flowKey));

            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            }
        };
        restoreFlow();
    }, [setNodes, setViewport]);


    const onAdd = useCallback(() => {
        handleSubmit().then(() => {
            getData().then(data => {
                console.log(data)
                data.map((item) => {
                    //console.log(item?.id)
                    const newNode = {
                        id: item?.id,
                        type: 'textUpdater',
                        data: { value: item?.nombre_rol, label : 'Rol'},
                        position: {
                            x: Math.random() * window.innerWidth - 100,
                            y: Math.random() * window.innerHeight,
                        },
                    };
                    setNodes((nds) => nds.concat(newNode));
                })
            });

        });

    }, [setNodes]);

    return (

        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
        >

            <div className="save__controls">
                <button onClick={onSave}>save</button>
                <button onClick={onRestore}>restore</button>
                <button onClick={onAdd}>add node</button>
            </div>
        </ReactFlow>
    );
};

export default () => (
    <ReactFlowProvider>
        <SaveRestore />
    </ReactFlowProvider>
);