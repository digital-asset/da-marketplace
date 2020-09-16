import React, { useEffect, useRef } from 'react'

type IntervalCallback = () => void | Promise<void>;

export function useInterval(name: string, callback: IntervalCallback, delay: number) {
    const inCallback = useRef<boolean>(false);

    useEffect(() => {
         if (delay === null) {
            return;
        }

        const runCallback = () => {
            if (!callback) {
                return;
            }

            if (inCallback.current) {
                return;
            }

            let cbRetval = null;
            const beginT = getCurrentUTCTimeInMilliseconds();

            const finishCallback = () => {
                const endT = getCurrentUTCTimeInMilliseconds();
                inCallback.current = false;
            }

            try {
                inCallback.current = true;
                cbRetval = callback();
            } catch (ex) {
            } finally {
                if (cbRetval instanceof Promise) {
                    cbRetval
                        .then(() => finishCallback())
                        .catch(() => finishCallback());
                } else {
                    finishCallback();
                }
            }
        };

        const id = setInterval(runCallback, delay);
        setTimeout(runCallback, 0);

        return () => clearInterval(id);
    }, [ callback, delay, name ]);
}

export function getCurrentUTCTimeInMilliseconds() {
    return new Date().getTime();
}
