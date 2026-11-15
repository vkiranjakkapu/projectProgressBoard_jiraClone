import {
    Bars3Icon,
    ComputerDesktopIcon,
    EnvelopeIcon,
    KeyIcon,
    LockClosedIcon,
    MoonIcon,
    SunIcon,
    UserPlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, type SubmitEvent } from "react";
import type { ErrorResponse } from "../../api/api";
import ActionButton from "../../components/ActionButtonComponent";
import DividerComponent from "../../components/DividerComponent";
import LoadingPortalComponent from "../../components/LoadingPortalComponent";
import ModalComponent from "../../components/ModalComponent";
import InputComponent from "../../components/formelements/InputComponent";
import NavbarComponent from "../../components/layout/NavbarComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import useAuthContext, { AuthStatus } from "../../context/useAuthContext";

export default function LandingPage() {
    const { status, login } = useAuthContext();

    const { notifications, setNotifications } = useNotifications(["login"]);
    const modalNotifications = notifications["login"] ?? null;

    const [loginModal, setLoginModal] = useState<"login" | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
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

    function authenticateUser(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        login(String(formData.get("email")), String(formData.get("password")))
            .catch((e: ErrorResponse) => {
                if (e.errorCode === "500") {
                    setNotifications("login", {
                        type: "error",
                        messages: e,
                    });
                    return;
                }

                setNotifications("login", {
                    type: "error",
                    messages:
                        e.validationErrors.length > 0
                            ? e.validationErrors.map(
                                  (ve) => `${ve.field} ${ve.message}`,
                              )
                            : [e.errorMessage],
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <main
            className={`relative flex flex-col gap-3 h-screen ${openMenu ? "[&>.sidebar]:translate-x-0" : "[&>.sidebar]:-translate-x-full lg:[&>.sidebar]:translate-x-0"}`}
        >
            <header className="bg-theme shadow-lg p-4 lg:p-5">
                <div className="section-width flex flex-wrap justify-between gap-3">
                    <div className="flex items-center gap-2 font-semibold capitalize">
                        <div className="logo flex items-center gap-2">
                            <img
                                src="/favicon.png"
                                alt="Project Progress Tracker"
                                className="size-12 object-cover"
                            />
                            <div className="">
                                <span className="block text-lg">
                                    Kanban Board
                                </span>
                                <DividerComponent text="Project Progress Tracker" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center ml-auto gap-4">
                        <NavbarComponent
                            className="hidden md:flex"
                            handleLoginClick={() => setLoginModal("login")}
                        />
                        <div className="flex items-center gap-0.5">
                            <ActionButton
                                icon={theme !== "light" ? MoonIcon : SunIcon}
                                className={`p-1.5 rounded-full ${theme !== "system" && "primary"}`}
                                onClick={() => {
                                    toggleTheme(
                                        theme == "dark" ? "light" : "dark",
                                    );
                                }}
                                title={`Switch to ${theme !== "light" && theme !== "system" ? "Light" : "Dark"} Mode`}
                            />
                            <ActionButton
                                icon={ComputerDesktopIcon}
                                className={`p-1.5 rounded-full ${theme === "system" && "primary"}`}
                                onClick={() => {
                                    toggleTheme("system");
                                }}
                                title="Follow System Theme"
                            />
                        </div>
                        <ActionButton
                            icon={openMenu ? XMarkIcon : Bars3Icon}
                            className="p-1.5 rounded md:hidden"
                            onClick={() => {
                                setOpenMenu(!openMenu);
                            }}
                        />
                    </div>
                    <NavbarComponent
                        className={`w-full border-t mt-3 pt-3 md:hidden ${openMenu ? `` : `hidden`}`}
                        handleLoginClick={() => setLoginModal("login")}
                    />
                </div>
            </header>
            <div className="section-width p-4 lg:p-5">
                <h1>Welcome</h1>
            </div>

            <ModalComponent
                title={loginModal + ""}
                isOpen={loginModal != null}
                onClose={() => setLoginModal(null)}
                icon={loginModal === "login" ? LockClosedIcon : UserPlusIcon}
            >
                <form onSubmit={authenticateUser} className="space-y-3 p-1">
                    {modalNotifications && (
                        <Notification {...modalNotifications} />
                    )}

                    <InputComponent
                        label={{
                            icon: EnvelopeIcon,
                        }}
                        type="email"
                        placeholder="Email"
                        name="email"
                        id="email"
                        required
                    />

                    <InputComponent
                        label={{
                            icon: KeyIcon,
                        }}
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="password"
                        required
                    />

                    <ActionButton
                        type="submit"
                        className="primary w-full justify-center rounded-full capitalize"
                        text="Login"
                        spinner={{ isLoading }}
                        icon={KeyIcon}
                        disabled={isLoading}
                    />
                </form>
            </ModalComponent>

            <LoadingPortalComponent
                isLoading={status === AuthStatus.INITIALIZING}
                message="Preparing your session."
            />
        </main>
    );
}
