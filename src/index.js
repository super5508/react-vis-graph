import "./styles.css";
import 'antd/dist/antd.css';
import React, {Fragment, useState} from "react";
import vis from "vis";
import ReactDOM from "react-dom";
import { AnimatePresence } from "framer-motion";
import { Drawer, Tabs } from 'antd';

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

const { TabPane } = Tabs;
/**
 * Main
 */

function Example({style, open, selectedNode, scale}) {
  const [visible, setVisible] = useState(false);
  const [defaultTab, setDefaultTab] = useState("configure");
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
              setVisible(true)
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
        onClose={() => setVisible(false)}
        visible={visible}
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
        enabled: true,
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

  componentWillUnmount() {
    if(this.network) {
      this.network.destroy();
    }
  }

  render() {
    const {height, width, x, y, show, curNode, scale} = this.state;
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
          />
        )}
      </div>
    )
  }
}

const rootElement = document.getElementById("root");
// ReactDOM.render(<Example />, rootElement);
ReactDOM.render(<ProvisioningChartWrapper />, rootElement);
