import type { HTMLAttributes } from "react";
import Logo from "/favicon.png";

type HeaderLogoComponentProps = HTMLAttributes<HTMLDivElement> & {
    customise?: string;
    textClassName?: string;
};

export default function HeaderLogoComponent({
    customise,
    textClassName,
    ...props
}: HeaderLogoComponentProps) {
    return (
        <div
            {...props}
            className={`p-1 bg-linear outline outline-current/20 shadow-lg rounded ${props.className}`}
        >
            <div
                className={`flex items-center gap-2 bg-white/50 dark:bg-background-dark/50 p-1 rounded ${customise}`}
            >
                <img
                    src={Logo}
                    alt="Kanban board Logo"
                    className="size-12 shadow-xl rounded-xl"
                />
                <div className={`${textClassName ?? ""}`}>
                    <p className="text-lg  font-black">
                        Progress Board
                    </p>
                    <p className="text-sm capitalize">Track your project</p>
                </div>
            </div>
        </div>
    );
}
