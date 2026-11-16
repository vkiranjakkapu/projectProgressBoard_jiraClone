import SelectComponent from "../../components/formelements/SelectComponent";
import SectionLayoutComponent from "../../components/layout/SectionLayoutComponent";

import DividerComponent from "../../components/DividerComponent";
import MemberAvatarComponent from "../../components/MemberAvatarComponent";
import useAuthContext from "../../context/useAuthContext";

export default function ProgressBoard() {
    const { profile } = useAuthContext();

    return (
        <SectionLayoutComponent
            greetings={{ title: "Welcome,", description: profile.name }}
        >
            <div className="flex flex-wrap items-center divide-y md:divide-x md:divide-y-0 justify-between gap-3 *:pb-3 md:*:pb-2 md:gap-4 *:md:not-last:pr-4 inherit-section-theme">
                <div className="flex-1 space-y-0.5">
                    <h3 className="text-md font-bold uppercase">Board</h3>
                    <SelectComponent id="board-selection" options={[]} />
                </div>
                <div className="w-full md:w-auto md:flex-1 space-y-0.5">
                    <h3 className="text-md font-bold uppercase">Sprint</h3>
                    <p className="text-xs italic">
                        (1st Nov, 2026 - 15th Nov, 2026)
                    </p>
                    <p>
                        <b className="text-xs uppercase">Days remaining:</b> 3
                        days
                    </p>
                </div>
                <div className="flex-1 space-y-0.5">
                    <h3 className="text-md font-bold uppercase">Team</h3>
                    <div className="flex flex-wrap gap-4 *:space-y-1">
                        <div>
                            <DividerComponent text={`Manager`} />
                            <MemberAvatarComponent
                                title="Avatar-1"
                                className="cursor-pointer mx-auto"
                                gender="female"
                            />
                        </div>
                        <div>
                            <DividerComponent text={`Participants (3)`} />
                            <div className="flex flex-wrap *:not-first:-ml-3 *:hover:not-last:mr-2">
                                <MemberAvatarComponent
                                    title="Avatar-1"
                                    className="cursor-pointer"
                                />
                                <MemberAvatarComponent
                                    title="Avatar-2"
                                    className="cursor-pointer"
                                />
                                <MemberAvatarComponent
                                    title="Avatar-3"
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h2>Welcome</h2>
            </div>
        </SectionLayoutComponent>
    );
}
