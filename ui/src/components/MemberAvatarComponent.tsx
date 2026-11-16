import type { ImgHTMLAttributes } from "react";

const maleModules = import.meta.glob("/src/assets/avatars/male/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
});
const femaleModules = import.meta.glob("/src/assets/avatars/female/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
});

const AVATAR_URLS: Record<"male" | "female", string[]> = {
    male: Object.values(maleModules) as string[],
    female: Object.values(femaleModules) as string[],
};

function getRandomAvatar(gender?: "male" | "female") {
    const list = gender
        ? AVATAR_URLS[gender]
        : [...AVATAR_URLS.male, ...AVATAR_URLS.female];
    return list[Math.floor(Math.random() * list.length)];
}

type MemberAvatarComponentProps = ImgHTMLAttributes<HTMLImageElement> & {
    gender?: "male" | "female";
};

export default function MemberAvatarComponent({
    gender,
    ...props
}: MemberAvatarComponentProps) {
    return (
        <img
            {...props}
            src={props.src ?? getRandomAvatar(gender)}
            alt={props.alt ?? "Avatar"}
            className={`size-10 rounded-full outline outline-current/30 shadow-sm bg-background-light ${props.className ?? ""}`}
        />
    );
}
