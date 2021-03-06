import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ResizeObserver from "resize-observer-polyfill";
import {
  ITEM_SIZE,
  RADIUS,
  BORDER,
  TEXT,
  PRIMARY,
  CONTAINER_SIZE
} from "./const";
import { ToggleLayer, useHover } from "react-laag";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Positioning Stuff
 */

function getTransform(progress, radius, index) {
  const value = (index / 8) * progress;

  const x = radius * Math.cos(Math.PI * 2 * (value - 0.5)) - 28;
  const y = radius * Math.sin(Math.PI * 2 * (value - 0.5)) - 28;

  const scale = progress / 2 + 0.5;

  return `translate(${x}px, ${y}px) scale(${scale})`;
}

/**
 * MenuItem
 */

const TooltipBox = styled(motion.div)`
  background-color: #333;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  line-height: 1.15;
  border-radius: 3px;
`;

const Circle = styled(motion.div)`
  position: absolute;
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${BORDER};
  box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out, border 0.15s ease-in-out;
  color: ${TEXT};
  pointer-events: all;
  will-change: transform;

  & svg {
    transition: 0.15s ease-in-out;
  }

  &:hover {
    box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.15);
    color: ${PRIMARY};

    & svg {
      transform: scale(1.15);
    }
  }
`;

function MenuItem({
  style,
  className,
  Icon,
  onClick,
  label,
  index,
  totalItems,
  scale,
}) {
  const [isOpen, bind] = useHover({ delayEnter: 300, delayLeave: 100 });

  return (
    <ToggleLayer
      ResizeObserver={ResizeObserver}
      isOpen={isOpen}
      fixed
      placement={{
        anchor: "TOP_CENTER",
        autoAdjust: true,
        scrollOffset: 16,
        triggerOffset: 6
      }}
      renderLayer={({ isOpen, layerProps }) => {
        return (
          <AnimatePresence>
            {isOpen && (
              <TooltipBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...layerProps}
              >
                {label}
              </TooltipBox>
            )}
          </AnimatePresence>
        );
      }}
    >
      {({ triggerRef }) => (
        <Circle
          ref={triggerRef}
          className={className}
          style={style}
          onClick={onClick}
          {...bind}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 1, opacity: 1 }}
          exit={{ x: 0, opacity: 0 }}
          transformTemplate={({ x }) => {
            const value = parseFloat(x.replace("px", ""));
            return getTransform(value, RADIUS, index, scale);
          }}
          transition={{
            delay: index * 0.025,
            type: "spring",
            stiffness: 600,
            damping: 50,
            mass: 1
          }}
        >
          {React.createElement(Icon, { size: 20 })}
        </Circle>
      )}
    </ToggleLayer>
  );
}

/**
 * Menu
 */

const MenuBase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${CONTAINER_SIZE}px;
  height: ${CONTAINER_SIZE}px;
  pointer-events: none;
  border-radius: 50%;
`;

const Menu = React.forwardRef(function Menu({ style, close, items, menuClick, scale }, ref) {
  const [rotate, setRotate] = useState(45);
  const [opacity, setOpacity] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setRotate(rotate => rotate < 135 ? rotate + 5 : 135);
      setOpacity(opacity => opacity + 0.1);
    }, 1);
    return () => clearInterval(interval);
  }, []);

  return (
    <MenuBase ref={ref} style={style} onClick={close}>
      <div style={{
        width: 150 * scale,
        height: 150 * scale,
        position: 'absolute',
        top: -50 * scale,
        left: -50 * scale,
        transform: `rotate(${rotate}deg)`,
        opacity: opacity,
      }}>
        <img src="back.svg" alt="back" style={{width: '100%'}}/>
      </div>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          Icon={item.Icon}
          label={item.label}
          onClick={() => menuClick(item.value)}
          index={index}
          totalItems={items.length}
          scale={scale}
        />
      ))}
    </MenuBase>
  );
});

export default Menu;
