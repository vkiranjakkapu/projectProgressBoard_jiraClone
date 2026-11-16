import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SectionLayoutComponent from "../../components/layout/SectionLayoutComponent";

export default function ProgressBoard() {
    return (
        <SectionLayoutComponent
            title="Board"
            description="project tickets below"
            masterSearch={{
                id: "search",
                label: {
                    icon: MagnifyingGlassIcon,
                },
                placeholder: "search",
            }}
        >
            <></>
        </SectionLayoutComponent>
    );
}
