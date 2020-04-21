import "./styles.css";
import 'antd/dist/antd.css';
import React, { useState } from "react";
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

function Example() {
  const [visible, setVisible] = useState(false);
  const [defaultTab, setDefaultTab] = useState("structures");

  return (
    <div>
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

const rootElement = document.getElementById("root");
ReactDOM.render(<Example />, rootElement);
