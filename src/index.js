import "./styles.css";
import 'antd/dist/antd.css';
import React, {Fragment, useState, useEffect} from "react";
import vis from "vis";
import ReactDOM from "react-dom";
import { AnimatePresence } from "framer-motion";
import { Drawer, Tabs, Checkbox, Modal, Button } from 'antd';

/**
 * Icons
 */

import { ListUl } from "styled-icons/boxicons-regular";
import { SettingsInputHdmi as Connect } from 'styled-icons/material-twotone';
import { ListSettings as Configure } from 'styled-icons/remix-line';

/**
 * Components
 */

import Menu from "./menu";

const { confirm } = Modal;
const { TabPane } = Tabs;
/**
 * Main
 */

const interfaceData = [
  [],
  [
    {id: 0, name: 'Interface 1', to: null, connected: false},
    {id: 1, name: 'Interface 2', to: null, connected: false},
    {id: 2, name: 'Interface 3', to: null, connected: false},
    {id: 3, name: 'Interface 4', to: null, connected: false},
  ],
  [
    {id: 0, name: 'Interface 1', to: null, connected: false},
    {id: 1, name: 'Interface 2', to: null, connected: false},
    {id: 2, name: 'Interface 3', to: null, connected: false},
    {id: 3, name: 'Interface 4', to: null, connected: false},
  ],
  [
    {id: 0, name: 'Interface 1', to: null, connected: false},
    {id: 1, name: 'Interface 2', to: null, connected: false},
    {id: 2, name: 'Interface 3', to: null, connected: false},
    {id: 3, name: 'Interface 4', to: null, connected: false},
  ],
  [
    {id: 0, name: 'Interface 1', to: null, connected: false},
    {id: 1, name: 'Interface 2', to: null, connected: false},
    {id: 2, name: 'Interface 3', to: null, connected: false},
    {id: 3, name: 'Interface 4', to: null, connected: false},
  ],
  [
    {id: 0, name: 'Interface 1', to: null, connected: false},
    {id: 1, name: 'Interface 2', to: null, connected: false},
    {id: 2, name: 'Interface 3', to: null, connected: false},
    {id: 3, name: 'Interface 4', to: null, connected: false},
  ],
  [
    {id: 0, name: 'Interface 1', to: null, connected: false},
    {id: 1, name: 'Interface 2', to: null, connected: false},
    {id: 2, name: 'Interface 3', to: null, connected: false},
    {id: 3, name: 'Interface 4', to: null, connected: false},
  ],
];

let pickedTime = 0;
let removable = false;
let removeInterface = {
  nodeId: null,
  interfaceId: null,
};

let pickedInterface = [
  {
    nodeId: null,
    interfaceId: null,
  },
  {
    nodeId: null,
    interfaceId: null,
  }
];

const getInterfaces = curNode => {
  return interfaceData[curNode];
}

function Example({style, open, selectedNode, scale, updateEdge, drawer, updateDrawer}) {
  const [defaultTab, setDefaultTab] = useState("configure");
  const [interfaces, setInterfaces] = useState([]);
  const [selectedInterfaces, setSelectedInterfaces] = useState(interfaceData[selectedNode.id]);

  const onChangeInterfaceStatus = (event, id) => {
    const checked = event.target.checked;
    if (checked === false) {
      confirm({
        title: 'Do you Want to remove this connection?',
        content: 'Content goes here',
        onOk() {
          interfaces[id].connected = checked;
          setInterfaces([...interfaces]);
          removable = true;
          removeInterface = {nodeId: selectedNode.id, interfaceId: id};
          updateEdge();
        },
        onCancel() {
          return;
        },
      });
    } else {
      interfaces[id].connected = checked;
      pickedInterface[pickedTime] = {nodeId: selectedNode.id, interfaceId: id};
      pickedTime += 1;
      if (pickedTime === 2) {
        updateEdge();
        pickedTime = 0;
      }
      updateDrawer(false);
    }
    setInterfaces([...interfaces]);
  }

  const addInterface = () => {
    setSelectedInterfaces([
      ...selectedInterfaces,
      {id: interfaceData[selectedNode.id].length, name: `Interface ${interfaceData[selectedNode.id].length + 1}`, to: null, connected: false}
    ]);
    interfaceData[selectedNode.id].push({id: interfaceData[selectedNode.id].length, name: `Interface ${interfaceData[selectedNode.id].length + 1}`, to: null, connected: false});
  }

  useEffect(() => {
    setInterfaces(getInterfaces(selectedNode.id));
  }, [selectedNode]);

  return (
    <div style={style}>
      <AnimatePresence>
        {open && (
          <Menu
            items={[
              { Icon: Configure, value: "configure", label: "Configure" },
              { Icon: ListUl, value: "attributes", label: "Attributes" },
              { Icon: Connect, value: "connect", label: "Connect" },
            ]}
            menuClick={value => {
              updateDrawer(true)
              setDefaultTab(value)
            }}
            scale={scale}
            style={{
              position: 'relative'
            }}
          />
        )}
      </AnimatePresence>
      <Drawer
        title="Provisioning Drawer"
        placement="right"
        closable={true}
        onClose={() => updateDrawer(false)}
        visible={drawer}
        width={350}
      >
        <Tabs activeKey={defaultTab}>
          <TabPane tab="CONFIGURE" key="configure">
            <p>{selectedNode.options.label}</p>
          </TabPane>
          <TabPane tab="ATTRIBUTES" key="attributes">
            <p>{selectedNode.options.label}</p>
          </TabPane>
          <TabPane tab="CONNECT" key="connect">
            <p>{selectedNode.options.label}</p>
            <div>
              <Button onClick={() => addInterface()}>Add Interface</Button>
            </div>
            <br/>
            {
              selectedInterfaces.map(item => <div key={item.name}><Checkbox onChange={e => onChangeInterfaceStatus(e, item.id)} checked={item.connected}>{item.name}</Checkbox></div>)
            }
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
}

let graphData = (data) => {
  if(data == null) return { nodes: [], edges: [] };

  let nodes = new vis.DataSet(
    [
      {id: 0, image: `/react.png`, shape: 'image', level: 0},
      ...data.map((d) => ({id: d.id, label: d.name, image: d.image, shape: 'image', level: 1}))
    ]
  );

  let edges = new vis.DataSet(
    [
      ...data.map((d) => ({from: d.id, to: 0, color: { color: "#c4ef9f", highlight: "c4ef9f"}}))
    ]
  );

  return { nodes, edges };
};

const visData = [
  {id: 1, image: '/react.png', name: 'Provisioning 1'},
  {id: 2, image: '/react.png', name: 'Provisioning 2'},
  {id: 3, image: '/react.png', name: 'Provisioning 3'},
  {id: 4, image: '/react.png', name: 'Provisioning 4'},
  {id: 5, image: '/react.png', name: 'Provisioning 5'},
  {id: 6, image: '/react.png', name: 'Provisioning 6'},
]

export const ProvisioningChartWrapper = () => {
  return (
    <Fragment>
      <ProvisioningChart/>
    </Fragment>
  )
}

const createNetwork = () => {
  return new vis.Network(document.getElementById('provisioning-network'), graphData(visData), {
    layout: {
      randomSeed: 541964,
      improvedLayout:true,
      hierarchical: {
        enabled: false,
        sortMethod: 'hubsize',
        edgeMinimization: true,
        blockShifting: true,
        parentCentralization: true,
        levelSeparation: 250,
        nodeSpacing: 55,
        treeSpacing: 200,
      }
    },
    edges:{
      smooth: {
        type: "cubicBezier",
        roundness: 0.4
      },
      width: 3,
    },
    physics: {
      enabled: true,
      barnesHut: {
        gravitationalConstant: -2000,
        centralGravity: 0.1,
        springLength: 200,
        springConstant: 0.01,
        damping: 0.09,
        avoidOverlap: 0.1
      },
      hierarchicalRepulsion: {
        nodeDistance: 120,
        centralGravity: 0.1,
        springLength: 200,
        springConstant: 0.01,
        damping: 0.09
      },
    },
    interaction: {
      hover: true
    }
  });
};

export class ProvisioningChart extends React.Component {

  network = null;

  constructor() {
    super();
    this.state = {
      height: Math.round(window.innerHeight * 0.75),
      width: Math.round(window.innerWidth * 0.8),
      x: 0,
      y: 0,
      show: false,
      curNode: null,
      scale: 1,
      drawer: false,
    }
  }

  componentDidMount() {
    this.network = createNetwork();

    this.network.on("selectNode", (params) => {
      const x = this.network.body.view.translation.x + (this.network.body.nodes[params.nodes[0]].x - 28) * this.state.scale;
      const y = this.network.body.view.translation.y + (this.network.body.nodes[params.nodes[0]].y - 28) * this.state.scale;
      this.setState({x, y, show: true, curNode: this.network.body.nodes[params.nodes[0]]});
    });

    this.network.on("deselectNode", () => {
      this.setState({show: false})
    });

    this.network.on("dragStart", () => {
      this.setState({show: false})
    });

    this.network.on("zoom", (param) => {
      const scale = param.scale;
      this.setState({scale});
      if (this.state.curNode) {
        const x = this.network.body.view.translation.x + (this.state.curNode.x - 28) * this.state.scale;
        const y = this.network.body.view.translation.y + (this.state.curNode.y - 28) * this.state.scale;
        this.setState({x, y});
      }
    });
  }

  addEdge() {
    if (this.network) {
      if (removable) {
        interfaceData.forEach((singleInterface, index) => {
          const find = singleInterface.find(inter => inter.to === removeInterface.nodeId);
          if (find) {
            const edges = this.network.body.data.edges._data;
            let id = null;
            Object.keys(edges).forEach((key, idx) => {
              if ((edges[key].from === index && edges[key].to === find.to) || (edges[key].to === index && edges[key].from === find.to)) {
                id = key;
              }
            });
            this.network.body.data.edges.remove([id]);
            find.connected = false;
          }
        })
      } else {
        if (!interfaceData[pickedInterface[0].nodeId][pickedInterface[0].interfaceId].to && !interfaceData[pickedInterface[1].nodeId][pickedInterface[1].interfaceId].to) {
          interfaceData[pickedInterface[0].nodeId][pickedInterface[0].interfaceId].to = pickedInterface[1].nodeId;
          interfaceData[pickedInterface[1].nodeId][pickedInterface[1].interfaceId].to = pickedInterface[0].nodeId;
          this.network.body.data.edges.add([{from: pickedInterface[0].nodeId, to: pickedInterface[1].nodeId}]);
        } else if (interfaceData[pickedInterface[0].nodeId][pickedInterface[0].interfaceId].to) {
          
        }
      }
    }
  }

  componentWillUnmount() {
    if(this.network) {
      this.network.destroy();
    }
  }

  render() {
    const {height, width, x, y, show, curNode, scale, drawer} = this.state;
    return (
      <div style={{position: 'relative'}}>
        <div style={{height, width, position: 'relative', border: '1px solid #ccc'}} id="provisioning-network">
        </div>
        {show && (
          <Example 
            open={show}
            style={{
              position: 'absolute',
              top: `${y}px`,
              left: `${x}px`,
            }}
            selectedNode={curNode}
            scale={scale}
            drawer={drawer}
            updateDrawer={value => this.setState({drawer: value})}
            updateEdge={() => this.addEdge()}
          />
        )}
      </div>
    )
  }
}

const rootElement = document.getElementById("root");
// ReactDOM.render(<Example />, rootElement);
ReactDOM.render(<ProvisioningChartWrapper />, rootElement);
