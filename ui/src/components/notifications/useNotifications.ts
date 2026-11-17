import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type SetStateAction,
} from "react";
import type { NotificationProps } from "./Notification";

export type AllNotifications = Record<string, NotificationProps | null>;

export function useNotifications<T extends string>(services: T[]) {
    const [notifications, updateNotifications] = useState<AllNotifications>(
        () =>
            services.reduce((acc, service) => {
                acc[service] = null;
                return acc;
            }, {} as AllNotifications),
    );

    const timeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        const currentTimers = timeouts.current;
        return () => {
            Object.values(currentTimers).forEach(clearTimeout);
        };
    }, []);
    const setNotifications = useCallback(
        <K extends T>(
            belongs: K,
            value: SetStateAction<NotificationProps | null>,
            /** if set to `0`, autoClose will be disabled. */
            duration: number = 5,
        ) => {
            if (timeouts.current[belongs]) {
                clearTimeout(timeouts.current[belongs]);
                delete timeouts.current[belongs];
            }

            updateNotifications((prev) => {
                const resolvedNextValue =
                    typeof value === "function" ? value(prev[belongs]) : value;

                if (resolvedNextValue !== null && duration !== 0) {
                    timeouts.current[belongs] = setTimeout(() => {
                        updateNotifications((p) => ({
                            ...p,
                            [belongs]: null,
                        }));
                        delete timeouts.current[belongs];
                    }, duration * 1000);
                }

                return {
                    ...prev,
                    [belongs]: resolvedNextValue,
                };
            });
        },
        [],
    );

    const resetNotifications = useCallback((item?: T) => {
        if (!item) {
            Object.values(timeouts.current).forEach(clearTimeout);
            timeouts.current = {};

            updateNotifications((prev) =>
                Object.keys(prev).reduce((acc, key) => {
                    acc[key] = null;
                    return acc;
                }, {} as AllNotifications),
            );
        } else {
            if (timeouts.current[item]) {
                clearTimeout(timeouts.current[item]);
                delete timeouts.current[item];
            }

            updateNotifications((prev) => ({
                ...prev,
                [item]: null,
            }));
        }
    }, []);

    return { notifications, setNotifications, resetNotifications } as const;
}
