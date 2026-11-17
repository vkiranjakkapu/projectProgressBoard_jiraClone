import {
    CheckCircleIcon,
    EnvelopeIcon,
    FaceSmileIcon,
    GlobeAltIcon,
    PencilIcon,
    PlusCircleIcon,
    TrashIcon,
    UserIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, type SubmitEvent } from "react";
import ActionButton from "../../components/ActionButtonComponent";
import type { BadgeProps } from "../../components/BadgeComponent";
import DividerComponent from "../../components/DividerComponent";
import InputComponent from "../../components/formelements/InputComponent";
import SelectComponent from "../../components/formelements/SelectComponent";
import ModalComponent from "../../components/ModalComponent";
import Notification from "../../components/notifications/Notification";
import { useNotifications } from "../../components/notifications/useNotifications";
import usePagination from "../../components/pagination/usePagination";
import TableComponent from "../../components/TableComponent";
import useAuthContext, {
    RoleType,
    UserGender,
    type UserProfile,
} from "../../context/useAuthContext";
import UserService from "../../services/UserService";

export default function UsersPage() {
    const { profile, isManager } = useAuthContext();
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

    const { notifications, setNotifications } = useNotifications([
        "info",
        "modal",
    ]);
    const infoNotifications = notifications["info"] ?? null;
    const modalNotifications = notifications["modal"] ?? null;

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        UserService.getAllUsers<UserProfile[]>(
            isManager ? RoleType.USER : undefined,
        )
            .then((resp) => {
                setAllUsers(
                    resp.data
                        .filter((user) => user.id !== profile.id)
                        .map((usr) => ({
                            ...usr,
                            name: `${usr.firstName} ${usr.lastName}`,
                        })),
                );
            })
            .catch((e) => {
                setNotifications("info", {
                    type: "error",
                    messages: e,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isManager, profile, setNotifications]);

    const pagination = usePagination(allUsers, 10);

    const [modalType, setModalType] = useState<"create" | "update" | null>(
        null,
    );
    const [actionProgress, setActionProgress] = useState<
        "modal" | "delete" | null
    >(null);

    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    const handleFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setActionProgress("modal");

        const formData = new FormData(e.currentTarget);
        const payload = {
            email: formData.get("email"),
            phone: formData.get("phone"),
            role: formData.get("role"),
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            gender: formData.get("gender"),
        };
        const promise =
            modalType === "create"
                ? UserService.createUser<UserProfile>(payload)
                : UserService.updateProfile<UserProfile>(
                      selectedUser!.id,
                      payload,
                  );

        promise
            .then((resp) => {
                setNotifications("modal", {
                    type: "success",
                    messages: `User account(${resp.data.email}) ${modalType === "create" ? "created" : "updated"} successfully.`,
                });
                setAllUsers((prev) => {
                    return modalType === "create"
                        ? [resp.data, ...prev]
                        : prev.map((u) =>
                              u.id === resp.data.id
                                  ? {
                                        ...resp.data,
                                        name: `${resp.data.firstName} ${resp.data.lastName}`,
                                    }
                                  : u,
                          );
                });
            })
            .catch((e) => {
                setNotifications(
                    "modal",
                    {
                        type: "error",
                        messages: e,
                    },
                    0,
                );
            })
            .finally(() => {
                setActionProgress(null);
            });
    };

    const handleUserDelete = (user: UserProfile) => {
        if (!window.confirm(`You sure delete @${user.email} account?`)) {
            return;
        }

        setActionProgress("delete");
        UserService.deleteProfile(user.id)
            .then(() => {
                setNotifications("info", {
                    type: "success",
                    messages: "User deleted successfully.",
                });
                setAllUsers((users) => users.filter((u) => u.id != user.id));
            })
            .catch((e) => {
                setNotifications("info", {
                    type: "error",
                    messages: e,
                });
            })
            .finally(() => {
                setActionProgress(null);
            });
    };

    return (
        <>
            <TableComponent
                title="Manage Users"
                description="Manage users from this page."
                spinner={{ isLoading: loading, text: "Fetching Users..." }}
                notifications={infoNotifications ?? undefined}
                actionButtons={[
                    {
                        icon: PlusCircleIcon,
                        text: "Add User",
                        className: "primary",
                        onClick() {
                            setModalType("create");
                        },
                    },
                ]}
                body={pagination.currentItems}
                columns={[
                    { key: "email" },
                    { key: "name" },
                    { key: "phone" },
                    {
                        key: "roles",
                        alias: "role",
                        renderType: "badge",
                        renderColumn(roles) {
                            const role = (roles as RoleType[])[0];
                            const isAdminRole = role === RoleType.ADMIN;
                            const isManagerRole = role === RoleType.MANAGER;
                            return {
                                value: role,
                                icon: isAdminRole ? GlobeAltIcon : undefined,
                                type: isAdminRole
                                    ? "warning"
                                    : isManagerRole
                                      ? "success"
                                      : undefined,
                            } as BadgeProps;
                        },
                    },
                ]}
                actionEvents={[
                    {
                        title: "Manage",
                        className: "text-end justify-end",
                        clickEvents: [
                            {
                                icon: PencilIcon,
                                className: "p-1.5! rounded-full!",
                                onClick(user) {
                                    setModalType("update");
                                    setSelectedUser(user);
                                },
                            },
                            {
                                icon: TrashIcon,
                                className: "theme-danger p-1.5! rounded-full!",
                                onClick(user) {
                                    handleUserDelete(user);
                                },
                            },
                        ],
                    },
                ]}
                pagination={pagination}
            />
            <ModalComponent
                icon={modalType === "create" ? UserPlusIcon : PencilIcon}
                title={
                    modalType === "create"
                        ? "Create User"
                        : `Updating ${selectedUser?.name ?? "User"}'s Profile`
                }
                isOpen={modalType !== null}
                onClose={() => {
                    setModalType(null);
                    setSelectedUser(null);
                    setNotifications("modal", null);
                }}
                maxWidthClass="max-w-2xl"
            >
                <form
                    onSubmit={handleFormSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                    {modalNotifications && (
                        <Notification {...modalNotifications} />
                    )}
                    <DividerComponent
                        text="Role"
                        className="col-span-full my-0"
                    />
                    <SelectComponent
                        id="role"
                        name="role"
                        label={{ icon: GlobeAltIcon }}
                        emptyOption="Select Role"
                        options={
                            isManager
                                ? [{ value: RoleType.USER }]
                                : Object.keys(RoleType).map((role) => ({
                                      value: role,
                                  }))
                        }
                        defaultValue={selectedUser?.roles[0] ?? ""}
                        required
                    />
                    <DividerComponent
                        text="Details"
                        className="col-span-full my-0"
                    />
                    <InputComponent
                        id="email"
                        type="email"
                        name="email"
                        label={{ icon: EnvelopeIcon }}
                        placeholder="User Email"
                        defaultValue={selectedUser?.email ?? ""}
                        required
                    />
                    <InputComponent
                        id="phone"
                        name="phone"
                        label={{ icon: EnvelopeIcon }}
                        placeholder="Phone"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        onKeyDown={(e) => {
                            if (["e", "E", "-", "+", ".", ","].includes(e.key))
                                e.preventDefault();
                        }}
                        pattern="\d*"
                        min="1"
                        step="1"
                        maxLength={12}
                        defaultValue={selectedUser?.phone ?? ""}
                        required
                    />
                    <InputComponent
                        id="firstName"
                        name="firstName"
                        label={{ icon: UserIcon }}
                        placeholder="First Name"
                        defaultValue={selectedUser?.firstName ?? ""}
                        required
                    />
                    <InputComponent
                        id="lastName"
                        name="lastName"
                        label={{ icon: UserIcon }}
                        placeholder="Last Name"
                        defaultValue={selectedUser?.lastName ?? ""}
                        required
                    />
                    <SelectComponent
                        id="gender"
                        name="gender"
                        label={{ icon: FaceSmileIcon }}
                        emptyOption="Select Gender"
                        options={Object.keys(UserGender).map((gender) => ({
                            value: gender,
                        }))}
                        defaultValue={selectedUser?.gender ?? ""}
                        required
                    />
                    <hr className="col-span-full" />
                    <div className="col-span-full ">
                        <ActionButton
                            className="primary ml-auto"
                            icon={CheckCircleIcon}
                            text={modalType === "create" ? "Create" : "Update"}
                            spinner={{ isLoading: actionProgress === "modal" }}
                            type="submit"
                        />
                    </div>
                </form>
            </ModalComponent>
        </>
    );
}
