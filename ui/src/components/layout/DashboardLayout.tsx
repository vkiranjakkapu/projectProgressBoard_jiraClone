import {
    Bars3Icon,
    ComputerDesktopIcon,
    MoonIcon,
    SunIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, type ReactNode } from "react";
import ActionButton from "../ActionButtonComponent";
import SidebarComponent, { LogoHeadComponent } from "./SidebarComponent";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const [theme, setTheme] = useState<"dark" | "light" | "system">(() => {
        const theme = localStorage.getItem("theme") as
            | "dark"
            | "light"
            | "system"
            | null;
        if (theme === null) {
            return "system";
        }
        return theme;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            if (theme === "system") {
                document.documentElement.classList.toggle(
                    "dark",
                    mediaQuery.matches,
                );
            } else {
                document.documentElement.classList.toggle(
                    "dark",
                    theme === "dark",
                );
            }
        };

        applyTheme();

        if (theme === "system") {
            mediaQuery.addEventListener("change", applyTheme);

            return () => {
                mediaQuery.removeEventListener("change", applyTheme);
            };
        }
    }, [theme]);

    function toggleTheme(theme: "dark" | "light" | "system") {
        localStorage.setItem("theme", theme);
        setTheme(theme);
    }

    return (
        <main
            className={`relative flex gap-1 h-screen ${openMenu ? "[&>.sidebar]:translate-x-0" : "[&>.sidebar]:-translate-x-full lg:[&>.sidebar]:translate-x-0"}`}
        >
            <div
                className={`absolute z-1000 inset-0 backdrop-blur-xs bg-primary/20 dark:bg-slate-600/40 lg:opacity-0 lg:pointer-events-none ${openMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} duration-150`}
                onClick={() => setOpenMenu(false)}
            ></div>
            <SidebarComponent theme={theme} toggleTheme={toggleTheme} />
            <div className="h-full overflow-y-scroll overflow-x-clip flex-1">
                <header className="bg-theme lg:hidden p-4 lg:p-5 flex flex-wrap justify-between items-center bg-section-theme shadow-lg">
                    <LogoHeadComponent textClassName="pr-4" />
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                            <ActionButton
                                icon={theme !== "light" ? MoonIcon : SunIcon}
                                className={`p-1.5 rounded-full ${theme !== "system" && "primary "}`}
                                onClick={() => {
                                    toggleTheme(
                                        theme == "dark" ? "light" : "dark",
                                    );
                                }}
                            />
                            <ActionButton
                                icon={ComputerDesktopIcon}
                                className={`p-1.5 rounded-full ${theme === "system" && "primary "}`}
                                onClick={() => {
                                    toggleTheme("system");
                                }}
                            />
                        </div>
                        <ActionButton
                            icon={openMenu ? XMarkIcon : Bars3Icon}
                            className={`p-1.5 rounded ${openMenu ? "primary" : ""}`}
                            onClick={() => {
                                setOpenMenu(!openMenu);
                            }}
                        />
                    </div>
                </header>
                <div className="my-1 mx-1 lg:ml-0">{children}</div>
            </div>
        </main>
    );
}
