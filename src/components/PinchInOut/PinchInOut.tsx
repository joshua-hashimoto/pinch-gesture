import React from "react";
import { usePinchGesture } from "./hooks";
import styles from "./styles.module.css";

const PinchInOut: React.FC = () => {
    const { animated, target, parentRef, style } = usePinchGesture();

    return (
        <div className="container" ref={parentRef}>
            <animated.div
                ref={target}
                className={styles.drag}
                style={{ scale: style.scale, x: style.x, y: style.y }}>
                <div>
                    <div>child3</div>
                </div>
                <div>child2</div>
            </animated.div>
        </div>
    );
};

export default PinchInOut;
