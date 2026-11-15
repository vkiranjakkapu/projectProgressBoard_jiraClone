import { UserPlusIcon } from "@heroicons/react/24/outline";
import ActionButton from "../ActionButtonComponent";

type NavbarComponentProps = {
    className?: string;
    handleLoginClick?: () => void;
};

export default function NavbarComponent({
    className,
    handleLoginClick,
}: NavbarComponentProps) {
    return (
        <nav
            className={`flex flex-row justify-center flex-wrap gap-3 ${className}`}
        >
            <ActionButton
                icon={UserPlusIcon}
                text={"Login"}
                onClick={handleLoginClick}
                className={`primary rounded-full text-sm`}
            />
        </nav>
    );
}
