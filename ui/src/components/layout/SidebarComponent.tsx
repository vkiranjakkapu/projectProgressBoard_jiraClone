import {
    ArrowLeftStartOnRectangleIcon,
    ClipboardDocumentListIcon,
    CogIcon,
    ComputerDesktopIcon,
    MoonIcon,
    PuzzlePieceIcon,
    QueueListIcon,
    Squares2X2Icon,
    SunIcon,
    UserGroupIcon,
    UserIcon,
    ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuthContext, { RoleType } from "../../context/useAuthContext";
import { RoutePaths } from "../../routes/RoutePaths";
import type { IconProps } from "../commons";
import DividerComponent from "../DividerComponent";
import HeaderLogoComponent from "./HeaderLogoComponent";

type SidebarComponentProps = {
    theme: "dark" | "light" | "system";
    toggleTheme: (theme: "dark" | "light" | "system") => void;
};

type NavItemProps = {
    page: string;
    uri: string;
    variants?: string[];
    icon: IconProps;
    roles?: RoleType[];
};

export default function SidebarComponent({
    theme,
    toggleTheme,
}: SidebarComponentProps) {
    const { profile, logout } = useAuthContext();

    const navigate = useNavigate();

    const navItems: NavItemProps[] = [
        {
            page: "Kanban",
            uri: RoutePaths.DASHBOARD,
            icon: ViewColumnsIcon,
        },
        {
            page: "My Tasks",
            uri: RoutePaths.MYTASKS,
            icon: QueueListIcon,
            roles: [RoleType.MANAGER, RoleType.USER],
        },
        {
            page: "Sprint Planning",
            uri: RoutePaths.SPRINT,
            icon: ClipboardDocumentListIcon,
            roles: [RoleType.MANAGER],
        },
    ];

    const menuItems: NavItemProps[] = [
        {
            page: "Projects",
            uri: RoutePaths.PROJECTS,
            icon: PuzzlePieceIcon,
            roles: [RoleType.MANAGER],
        },
        {
            page: "Users",
            uri: RoutePaths.USERS,
            icon: UserGroupIcon,
            roles: [RoleType.MANAGER, RoleType.ADMIN],
        },
    ];

    return (
        <aside
            className={`bg-theme sidebar text-md flex flex-col gap-5 justify-between p-3 fixed z-49 lg:sticky bg-section-theme shadow-lg h-full min-w-68 duration-150 *:space-y-3`}
        >
            <div className="flex-1">
                <HeaderLogoComponent />
                <hr />
                <ul className="nav-menu space-y-1">
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
                            <li
                                key={idx}
                                onClick={() => {
                                    navigate(item.uri);
                                }}
                                className={`${active && "active-menu-item"}`}
                            >
                                <Icon className="size-4" />
                                {item.page}
                            </li>
                        );
                    })}
                </ul>
            </div>
            {menuItems.filter(
                (ni) => !ni.roles || ni.roles.includes(profile.roles[0]),
            ).length > 0 && (
                <div className="flex-1">
                    <DividerComponent icon={Squares2X2Icon} text="Menu" />
                    <hr />
                    <ul className="nav-menu flex flex-col gap-0 space-y-1">
                        {menuItems.map((item, idx) => {
                            if (item.roles) {
                                if (!item.roles.includes(profile.roles[0])) {
                                    return null;
                                }
                            }
                            const isCurrentPath =
                                location.pathname === item.uri ||
                                location.pathname.startsWith(`${item.uri}/`);
                            const hasMatchingVariant = item.variants?.some(
                                (vr) => {
                                    const regexPattern =
                                        "^" +
                                        vr.replace(/:\w+/g, "[^/]+") +
                                        "$";
                                    return new RegExp(regexPattern).test(
                                        location.pathname,
                                    );
                                },
                            );
                            const active = isCurrentPath || hasMatchingVariant;
                            const Icon = item.icon;
                            return (
                                <li
                                    key={idx}
                                    onClick={() => {
                                        navigate(item.uri);
                                    }}
                                    className={`${active && "active-menu-item"}`}
                                >
                                    <Icon className="size-4" />
                                    {item.page}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            <div>
                <DividerComponent icon={CogIcon} text="Manage" />
                <hr />
                <ul className="nav-menu">
                    <li
                        onClick={() => {
                            navigate(RoutePaths.PROFILE);
                        }}
                        className={`${location.pathname == RoutePaths.PROFILE && "active-menu-item"}`}
                    >
                        <UserIcon className="size-4" />
                        <span>Profile</span>
                    </li>
                    <li
                        onClick={logout}
                        className={`p-2 cursor-pointer flex items-center gap-1.5 flex-1 rounded hover:bg-rose-200/50 hover:dark:bg-rose-600/15`}
                    >
                        <ArrowLeftStartOnRectangleIcon className="size-4 text-rose-400" />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
            <div>
                <hr />
                <ul className="space-y-1!">
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
                            <span
                                className={`${theme !== "dark" && "opactiy-40"}`}
                            >
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
                </ul>
            </div>
        </aside>
    );
}
