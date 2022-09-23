import { useEffect, useRef } from "react";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import { a, useSpring, animated } from "@react-spring/web";

const useGesture = createUseGesture([dragAction, pinchAction]);

export const usePinchGesture = () => {
    const parentRef = useRef(null);
    const target = useRef(null);
    const [style, api] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
        rotateZ: 0,
    }));

    useEffect(() => {
        const handler = (event) => event.preventDefault();
        document.addEventListener("gesturestart", handler);
        document.addEventListener("gesturechange", handler);
        document.addEventListener("gestureend", handler);
        return () => {
            document.removeEventListener("gesturestart", handler);
            document.removeEventListener("gesturechange", handler);
            document.removeEventListener("gestureend", handler);
        };
    }, []);

    useGesture(
        {
            onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
                if (pinching) return cancel();
                api.start({ x, y });
            },
            onPinch: ({ memo, ...pinchProps }) => {
                console.log("onPinch():");
                console.log(pinchProps);
                const {
                    origin: [ox, oy],
                    first,
                    movement: [ms],
                    offset: [s, a],
                    ...rest
                } = pinchProps;
                if (first) {
                    const { width, height, x, y } =
                        target.current.getBoundingClientRect();
                    const tx = ox - (x + width / 2);
                    const ty = oy - (y + height / 2);
                    memo = [style.x.get(), style.y.get(), tx, ty];
                }

                const x = memo[0] - (ms - 1) * memo[2];
                const y = memo[1] - (ms - 1) * memo[3];
                api.start({ scale: s, rotateZ: a, x, y });
                return memo;
            },
        },
        {
            target,
            drag: {
                from: () => [style.x.get(), style.y.get()],
                bounds: parentRef,
            },
            pinch: {
                scaleBounds: { min: 0.5, max: 2 },
                bounds: { top: 0, left: 0 },
            },
        }
    );

    return {
        animated,
        target,
        parentRef,
        style,
    };
};
