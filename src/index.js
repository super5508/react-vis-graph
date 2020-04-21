import "./styles.css";
import 'antd/dist/antd.css';
import React, {Fragment, useState} from "react";
import vis from "vis";
import ReactDOM from "react-dom";
import ResizeObserver from "resize-observer-polyfill";
import { AnimatePresence } from "framer-motion";
import { ToggleLayer } from "react-laag";
import { Drawer, Tabs } from 'antd';

/**
 * Icons
 */

import { Layer, ListUl, Play } from "styled-icons/boxicons-regular";

/**
 * Components
 */

import Button from "./button";
import Menu from "./menu";

const { TabPane } = Tabs;
/**
 * Main
 */

function Example({style}) {
  const [visible, setVisible] = useState(false);
  const [defaultTab, setDefaultTab] = useState("structures");

  return (
    <div style={style}>
      <ToggleLayer
        ResizeObserver={ResizeObserver}
        placement={{
          anchor: "CENTER"
        }}
        renderLayer={({ isOpen, layerProps, close }) => {
          return (
            <AnimatePresence>
              {isOpen && (
                <Menu
                  {...layerProps}
                  close={close}
                  items={[
                    { Icon: Layer, value: "structures", label: "Structures" },
                    { Icon: ListUl, value: "attributes", label: "Attributes" },
                    { Icon: Play, value: "commands", label: "Commands" },
                  ]}
                  menuClick={value => {
                    setVisible(true)
                    setDefaultTab(value)
                  }}
                />
              )}
            </AnimatePresence>
          );
        }}
      >
        {({ triggerRef, toggle, isOpen }) => (
          <Button ref={triggerRef} onClick={toggle} isOpen={isOpen} />
        )}
      </ToggleLayer>
      <Drawer
        title="Provisioning Drawer"
        placement="right"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
        width={350}
      >
        <Tabs activeKey={defaultTab}>
          <TabPane tab="STRUCTURE" key="structures">
            <p>Structures go below.</p>
            <p>Structures go below.</p>
            <p>Structures go below.</p>
            <p>Structures go below.</p>
            <p>Structures go below.</p>
          </TabPane>
          <TabPane tab="ATTRIBUTES" key="attributes">
            <p>Attributes go below.</p>
            <p>Attributes go below.</p>
            <p>Attributes go below.</p>
            <p>Attributes go below.</p>
            <p>Attributes go below.</p>
          </TabPane>
          <TabPane tab="COMMANDS" key="commands">
            <p>Commands go below.</p>
            <p>Commands go below.</p>
            <p>Commands go below.</p>
            <p>Commands go below.</p>
            <p>Commands go below.</p>
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
    }
  }

  componentDidMount() {
    this.network = createNetwork();

    this.network.on("hoverNode", (params) => {
      console.log(params);
      console.log(this.network);
      this.setState({x: params.pointer.DOM.x, y: params.pointer.DOM.y, show: true})
    });

    this.network.on("blurNode", (params) => {
      this.setState({x: params.pointer.DOM.x, y: params.pointer.DOM.y})
    });
  }

  componentWillUnmount() {
    if(this.network) {
      this.network.destroy();
    }
  }

  render() {
    const {height, width, x, y, show} = this.state;
    return (
      <div style={{position: 'relative'}}>
        <div style={{height, width, position: 'relative', border: '1px solid #ccc'}} id="provisioning-network">
        </div>
        {show && (
          <Example style={{
            position: 'absolute',
            top: `${y}px`,
            left: `${x}px`,
          }}/>
        )}
      </div>
    )
  }
}

const rootElement = document.getElementById("root");
// ReactDOM.render(<Example />, rootElement);
ReactDOM.render(<ProvisioningChartWrapper />, rootElement);
