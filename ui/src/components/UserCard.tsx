import type { UserProfile } from "../context/useAuthContext";

type UserCardProps = {
    user: UserProfile;
};

export default function UserCard({ user }: UserCardProps) {
    return JSON.stringify(user);
}
