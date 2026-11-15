import {
    ArrowLeftStartOnRectangleIcon,
    BellAlertIcon,
    CogIcon,
    ComputerDesktopIcon,
    MoonIcon,
    SunIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuthContext, { RoleType } from "../../context/useAuthContext";
import { RoutePaths } from "../../routes/RoutePaths";
import type { IconProps } from "../commons";
import Logo from "/favicon.png";

type SidebarComponentProps = {
    theme: "dark" | "light" | "system";
    toggleTheme: (theme: "dark" | "light" | "system") => void;
};

export default function SidebarComponent({
    theme,
    toggleTheme,
}: SidebarComponentProps) {
    const { profile, logout } = useAuthContext();

    const navigate = useNavigate();

    const navItems: {
        page: string;
        uri: string;
        variants?: string[];
        icon: IconProps;
        roles?: RoleType[];
    }[] = [
        {
            page: "Dashboard",
            uri: RoutePaths.DASHBOARD,
            icon: BellAlertIcon,
        },
    ];

    return (
        <aside
            className={`bg-theme sidebar flex flex-col justify-between p-4 lg:p-5 fixed z-1000 lg:sticky bg-section-theme shadow-lg h-full min-w-68 duration-150 *:space-y-3`}
        >
            <div className="divide-y">
                <div className="pb-4 lg:pb-5 flex items-center gap-2 font-semibold">
                    <img
                        src={Logo}
                        alt="Kanban board Logo"
                        className="size-14 shadow-lg rounded-xl"
                    />
                    <div className="flex flex-col justify-center">
                        <div className="text-lg">Kanban Board</div>
                        <span className="text-sm capitalize">
                            Track your project
                        </span>
                    </div>
                </div>
                <nav className="flex flex-col gap-0 text-md">
                    {navItems.map((item, idx) => {
                        if (item.roles) {
                            if (!item.roles.includes(profile.roles[0])) {
                                return null;
                            }
                        }

                        const isCurrentPath =
                            location.pathname === item.uri ||
                            location.pathname.startsWith(`${item.uri}/`);

                        const hasMatchingVariant = item.variants?.some((vr) => {
                            const regexPattern =
                                "^" + vr.replace(/:\w+/g, "[^/]+") + "$";
                            return new RegExp(regexPattern).test(
                                location.pathname,
                            );
                        });

                        const active = isCurrentPath || hasMatchingVariant;

                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    navigate(item.uri);
                                }}
                                className={`p-2 cursor-pointer flex items-center gap-1.5 flex-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 ${active && "bg-primary/10 dark:bg-slate-800 text-slate-900 dark:text-current hover:bg-primary/10! dark:hover:bg-slate-800!"}`}
                            >
                                <Icon className="size-4" />
                                {item.page}
                            </div>
                        );
                    })}
                </nav>
            </div>
            <div className="text-md space-y-1!">
                <div
                    onClick={() => {
                        navigate(RoutePaths.PROFILE);
                    }}
                    className={`p-2 cursor-pointer flex items-center gap-1.5 flex-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 ${location.pathname == RoutePaths.PROFILE && "bg-primary/10 dark:bg-slate-800 text-slate-900 dark:text-current hover:bg-primary/10! dark:hover:bg-slate-800!"}`}
                >
                    <CogIcon className="size-4" />
                    <span>Manage Account</span>
                </div>
                <div
                    onClick={logout}
                    className={`p-2 cursor-pointer flex items-center gap-1.5 flex-1 rounded hover:bg-rose-200/50 hover:dark:bg-rose-600/15`}
                >
                    <ArrowLeftStartOnRectangleIcon className="size-4 text-rose-400" />
                    <span>Logout</span>
                </div>
                <hr className="border-t my-1.5! mb-3!" />
                <div
                    className="border rounded-full p-1 mx-auto dark:bg-slate-800 bg-slate-100 flex justify-around
                    text-sm
                    *:cursor-pointer *:flex *:gap-1 *:items-center *:m-px *:px-2 *:py-1 *:rounded-full
                    "
                >
                    <div
                        className={`${theme === "light" && "bg-primary dark:bg-slate-900 text-white dark:text-current"}`}
                        onClick={() => {
                            toggleTheme("light");
                        }}
                    >
                        <SunIcon className="size-4" />
                        <span
                            className={`${theme !== "light" && "opactiy-40"}`}
                        >
                            Light
                        </span>
                    </div>
                    <div
                        className={`${theme === "dark" && "bg-primary dark:bg-slate-900 text-white dark:text-current"}`}
                        onClick={() => {
                            toggleTheme("dark");
                        }}
                    >
                        <MoonIcon className="size-4" />
                        <span className={`${theme !== "dark" && "opactiy-40"}`}>
                            Dark
                        </span>
                    </div>
                    <div
                        className={`${theme === "system" && "bg-primary dark:bg-slate-900 text-white dark:text-current"}`}
                        onClick={() => {
                            toggleTheme("system");
                        }}
                    >
                        <ComputerDesktopIcon className="size-4" />
                        <span
                            className={`${theme !== "system" && "opactiy-40"}`}
                        >
                            System
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
