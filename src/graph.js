import React, {Fragment, useState, useEffect, useRef} from "react";
import vis from "vis";

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

export const ProvisioningChart = () => {

  let network = null;

  const [state, setState] = useState({
    height: Math.round(window.innerHeight * 0.75),
    width: Math.round(window.innerWidth * 0.8)
  });

  const updateDimensions = () => {
    let update_width = Math.round(window.innerWidth * 0.8);
    let update_height = Math.round(window.innerHeight * 0.75);
    setState({ height: update_height, width: update_width });
  }

  useEffect(() => {
    network = createNetwork();
  }, []);

  useEffect(() => {
    return () => {
      if(network) {
        network.destroy();
      }
      window.removeEventListener("resize", updateDimensions);
    }
  });

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
    });
  };

  return (
    <div style={{height: state.height, width: state.width, position: 'relative', border: '1px solid #ccc'}} id="provisioning-network">
    </div>
  )
}
