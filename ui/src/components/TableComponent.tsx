import {
    type ReactNode,
    type TableHTMLAttributes,
    type TdHTMLAttributes,
} from "react";

import type { ActionButtonProps } from "./ActionButtonComponent";
import ActionButton from "./ActionButtonComponent";
import type { BadgeProps } from "./BadgeComponent";
import BadgeComponent from "./BadgeComponent";
import type { InputComponentProps } from "./formelements/InputComponent";
import InputComponent from "./formelements/InputComponent";
import {
    PaginationButtons,
    type PaginationButtonsProps,
} from "./pagination/PaginationButtons";
import SpinnerComponent, {
    type SpinnerComponentProps,
} from "./SpinnerComponent";

/**
 * Props for the {@link TableComponent}.
 * Extends standard HTML `<table>` attributes.
 *
 * @template T - The type of each data item object rendered in the table rows.
 */
export type TableComponentProps<T> = TableHTMLAttributes<HTMLTableElement> & {
    /** Main heading displayed in the top-left of the table card. */
    title?: string;

    /** Subtitle or helper text displayed underneath the `title`. */
    description?: string;

    /**
     * Column configuration array defining keys, headers, and custom renderers.
     * If omitted or empty, columns are automatically inferred from the object keys of `body`.
     */
    columns?: HeaderAlias<T>[];

    /**
     * Controls visibility of the `<thead>` table header row.
     * Note: When `false` (default), the header is rendered; when `true`, the header is hidden.
     * @default false
     */
    enableHeader?: boolean;

    /** Array of data objects to display as table rows. */
    body: T[];

    /** Additional CSS/Tailwind classes applied directly to the `<table>` element. */
    tableClassName?: string;

    /** Top-level action buttons rendered on the top-right of the table header section. */
    actionButtons?: ActionButtonProps[];

    /** Fallback message displayed when `body` is empty. @default "No Data to display" */
    emptyDataMessage?: string;

    /**
     * Configuration for row-level interactive action columns (e.g., Edit, Delete buttons).
     */
    actionEvents?: {
        /** Column header title for the actions column. */
        title: string;

        /** If `true`, renders clickable text spans instead of `ActionButton` components. */
        useText?: boolean;

        /** List of interactive actions available for each row item. */
        clickEvents: (Omit<ActionButtonProps, "onClick"> & {
            /** Callback triggered when the action is clicked, receiving the current row item. */
            onClick?: (item: T) => void;
        })[];

        /** Optional CSS classes applied to both the action `<th>` and `<td>` cells. */
        className?: string;
    }[];

    /** Controls loading state and customization for the table's loading spinner. */
    spinner?: SpinnerComponentProps;

    /** Configuration props for the search input rendered above the table. */
    search?: InputComponentProps;

    /** Configuration props for pagination controls rendered when `totalPages > 1`. */
    pagination?: PaginationButtonsProps;
};

/**
 * Configuration object for an individual table column.
 *
 * @template T - The type of each data item object in the table.
 */
export type HeaderAlias<T> = {
    /** Property key from data type `T` used to extract the cell value. */
    key: keyof T;

    /** Display text for the column header (`<th>`). Defaults to `String(key)` if omitted. */
    alias?: string;

    /**
     * Custom CSS classes applied to the column's `<td>` cells.
     * If `"line-clamp"` is included, text truncation with a bottom fade overlay is automatically applied.
     */
    className?: string;

    /** Function returning dynamic HTML attributes/props to spread onto the `<td>` element. */
    props?: (row?: T) => TdHTMLAttributes<HTMLElement>;

    /**
     * Custom cell value transformer.
     * @param val - Raw value of `item[key]`.
     * @param row - The full data object for the current row.
     * @returns A formatted string, `BadgeProps` (when `renderType="badge"`), or `ReactNode` (when `renderType="html"`).
     */
    renderColumn?: (val: unknown, row?: T) => string | BadgeProps | ReactNode;

    /**
     * Determines how the cell content (or `renderColumn` return value) is rendered.
     * - `"string"`: Renders as plain string (default).
     * - `"badge"`: Renders a {@link BadgeComponent} using the value as `BadgeProps`.
     * - `"html"`: Renders raw JSX / `ReactNode`.
     */
    renderType?: "string" | "badge" | "html";
};


/**
 * Generic and reusable table component.
 *
 * The component supports:
 *
 * - Generic row types through `T`
 * - Automatic column discovery
 * - Explicit column configuration
 * - Column aliases
 * - Optional table header
 * - Row-level actions
 * - custom cell renderers (badges, HTML, line-clamping)
 * - Search configuration
 * - Pagination configuration
 * - Horizontal scrolling for wide tables
 * - Generic cell-value rendering
 * - Empty-state handling
 *
 * When `headers` are not supplied, the component determines the table
 * columns automatically by inspecting the row containing the greatest
 * number of properties. This allows the component to handle data where
 * individual rows may contain different properties.
 *
 * @template T
 * The type of each row in the table.
 *
 * @param props
 * Component configuration and standard HTML table attributes.
 *
 * @returns A reusable table wrapped inside {@link SectionLayoutComponent}.
 *
 * @example
 * Basic usage with automatic headers:
 *
 * ```tsx
 * type User = {
 *     id: number;
 *     name: string;
 *     email: string;
 * };
 *
 * const users: User[] = [
 *     {
 *         id: 1,
 *         name: "Venkat",
 *         email: "venkat@example.com",
 *     },
 * ];
 *
 * <TableComponent<User>
 *     title="Users"
 *     description="Registered users"
 *     body={users}
 * />
 * ```
 *
 * @example
 * Usage with explicit headers:
 *
 * ```tsx
 * <TableComponent<User>
 *     title="Users"
 *     body={users}
 *     headers={[
 *         { key: "id", alias: "ID" },
 *         { key: "name", alias: "Name" },
 *         { key: "email", alias: "Email" },
 *     ]}
 * />
 * ```
 *
 * @example
 * Usage with row actions:
 *
 * ```tsx
 * <TableComponent<User>
 *     title="Users"
 *     body={users}
 *     actionEvents={[
 *         {
 *             title: "Actions",
 *             navigation: {
 *                 text: "View",
 *                 onClick: (user) => {
 *                     console.log("Selected user:", user);
 *                 },
 *             },
 *         },
 *     ]}
 * />
 * ```
 * 
* @example
 * Advanced usage with custom column rendering, badges, and formatting:
 *
 * ```tsx
 * <TableComponent<Transaction>
 *     title="Recent Transactions"
 *     description="Only the recent transactions were shown below."
 *     emptyDataMessage="No transactions recorded this month."
 *     className="bg-theme rounded-xl border hover:shadow-md"
 *     body={dashboard.recentTransactions}
 *     columns={[
 *         {
 *             key: "description",
 *         },
 *         {
 *             key: "categoryName",
 *             alias: "category",
 *         },
 *         {
 *             key: "transactionDate",
 *             alias: "Date",
 *             renderColumn(val) {
 *                 return DateFormatter.toFormattedDate(
 *                     String(val),
 *                     {
 *                         dateStyle: "medium",
 *                     },
 *                 );
 *             },
 *         },
 *         {
 *             key: "amount",
 *             renderType: "html",
 *             renderColumn(val, transaction) {
 *                 return (
 *                     <span
 *                         className={`${
 *                             transaction?.type === "INCOME"
 *                                 ? "text-emerald-600"
 *                                 : "text-danger"
 *                         }`}
 *                     >
 *                         {transaction?.type === "INCOME" ? "+" : "-"}
 *                         {formatCurrency(Number(val))}
 *                     </span>
 *                 );
 *             },
 *         },
 *     ]}
 * />
 * ```
 * 
 */
export default function TableComponent<T>({
    title,
    description,
    columns: headers,
    enableHeader = false,
    body,
    actionButtons,
    actionEvents,
    spinner,
    search,
    pagination,
    tableClassName,
    emptyDataMessage,
    ...props
}: TableComponentProps<T>) {
    // Infer columns from the row with the maximum number of keys if `columns` prop is not provided
    const cols =
        body.length != 0
            ? !headers || headers.length == 0
                ? Object.keys(
                      body.reduce(
                          (maxRow, currentRow) =>
                              Object.keys(currentRow as object).length >
                              Object.keys(maxRow as object).length
                                  ? currentRow
                                  : maxRow,
                          body[0],
                      ) as object,
                  ).map((key) => ({ key }) as HeaderAlias<T>)
                : headers
            : [];

    return (
        <section
            className={`rounded divide-y dark:bg-background-dark ${props.className}`}
        >
            {/* Header Section: Title, Description, and Top-Right Action Buttons */}
            {(title || description || actionButtons) && (
                <div className="p-5! flex flex-wrap items-center justify-between">
                    <div className="space-y-1">
                        {(title || description) && (
                            <>
                                <h1 className="text-lg font-semibold">
                                    {title}
                                </h1>
                                <p className="text-sm text-current/70">
                                    {description}
                                </p>
                            </>
                        )}
                    </div>
                    {actionButtons && (
                        <div>
                            {actionButtons.map((btn, idx) => (
                                <ActionButton key={idx} {...btn} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Controls Bar: Search Input and Pagination */}
            {((pagination && pagination.totalPages > 1) || search) && (
                <div className="px-5! py-2 flex flex-wrap items-center justify-between">
                    <div className="flex-1">
                        {search &&
                            (() => {
                                const { resultsLabel, ...props } = search;
                                return (
                                    <div className="flex flex-col gap-2 w-full md:w-3/5">
                                        <InputComponent
                                            {...props}
                                            className={`mx-0 ${props.className}`}
                                        />
                                        {resultsLabel && (
                                            <span className="text-sm">
                                                {resultsLabel}
                                            </span>
                                        )}
                                    </div>
                                );
                            })()}
                    </div>
                    <div className="flex-1">
                        {pagination && (
                            <PaginationButtons
                                {...pagination}
                                className={`ml-auto ${pagination.className}`}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Main Content Area: Loading Spinner, Data Table, or Empty State */}
            {spinner && spinner.isLoading ? (
                <SpinnerComponent
                    {...spinner}
                    customize={`my-2 ${spinner.customize}`}
                />
            ) : (
                <div className="overflow-x-auto overflow-y-clip ">
                    {body.length > 0 ? (
                        <table
                            {...props}
                            className={`w-full min-w-max text-left text-sm
                                [&_th,td]:px-5 [&_th]:py-3 [&_td]:py-4
                                ${tableClassName}
                            `}
                        >
                            {/* Table Header */}
                            {!enableHeader && body.length > 0 && (
                                <thead className="bg-primary/40 text-xs uppercase dark:bg-background-dark-secondary/80 text-current/70">
                                    <tr>
                                        {cols.map((column, idx) => (
                                            <th scope="col" key={"th" + idx}>
                                                {String(
                                                    column.alias ?? column.key,
                                                )}
                                            </th>
                                        ))}
                                        {actionEvents &&
                                            actionEvents.map((action, idx) => (
                                                <th
                                                    key={"ae" + idx}
                                                    className={action.className}
                                                >
                                                    {action.title}
                                                </th>
                                            ))}
                                    </tr>
                                </thead>
                            )}

                            {/* Table Body */}
                            <tbody
                                className={`
                                divide-y divide-current/12 transition-colors
                                *:transition-colors
                            `}
                            >
                                {body.map((item, idx) => (
                                    <tr
                                        key={"tb" + idx}
                                        className="group text-current"
                                    >
                                        {cols.map((column) => {
                                            const hasLineClamp =
                                                column.className?.includes(
                                                    "line-clamp",
                                                );
                                            const value = item[column.key];
                                            const tdVal = column.renderColumn
                                                ? column.renderColumn(
                                                      value,
                                                      item as T,
                                                  )
                                                : value;
                                            return (
                                                <td
                                                    key={String(column.key)}
                                                    className={`relative overflow-hidden ${column.className}`}
                                                    {...(() => {
                                                        if (column.props) {
                                                            return column.props(
                                                                column as T,
                                                            );
                                                        }
                                                    })()}
                                                >
                                                    {hasLineClamp ? (
                                                        <>
                                                            <div
                                                                className={
                                                                    column.className
                                                                }
                                                            >
                                                                {String(tdVal)}
                                                            </div>
                                                            <div className="absolute inset-x-0 bottom-0 h-5 bg-linear-to-t from-white dark:from-transparent group-hover:from-transparent to-transparent pointer-events-none transition-colors" />
                                                        </>
                                                    ) : (
                                                        (() => {
                                                            const renderType =
                                                                column.renderType;
                                                            if (renderType) {
                                                                if (
                                                                    renderType ===
                                                                    "badge"
                                                                ) {
                                                                    return (
                                                                        <BadgeComponent
                                                                            {...(tdVal as BadgeProps)}
                                                                        />
                                                                    );
                                                                } else if (
                                                                    renderType ===
                                                                    "html"
                                                                ) {
                                                                    return tdVal as ReactNode;
                                                                }
                                                            }
                                                            return String(
                                                                tdVal,
                                                            );
                                                        })()
                                                    )}
                                                </td>
                                            );
                                        })}

                                        {/* Row-level Action Events */}
                                        {actionEvents &&
                                            actionEvents.map(
                                                (action, actionIdx) => {
                                                    const clickEvents =
                                                        action.clickEvents;
                                                    return (
                                                        <td
                                                            key={
                                                                "act" +
                                                                actionIdx
                                                            }
                                                            className={`flex gap-2 items-center ${action.className}`}
                                                        >
                                                            {clickEvents &&
                                                                clickEvents.map(
                                                                    (
                                                                        ev,
                                                                        idx,
                                                                    ) => {
                                                                        return action.useText ? (
                                                                            <span
                                                                                key={
                                                                                    "clickEvent-" +
                                                                                    idx
                                                                                }
                                                                                onClick={() => {
                                                                                    ev.onClick?.(
                                                                                        item,
                                                                                    );
                                                                                }}
                                                                                className={`cursor-pointer flex flex-row items-center gap-1 ${ev.className}`}
                                                                            >
                                                                                {
                                                                                    ev.text
                                                                                }
                                                                                {ev.icon && (
                                                                                    <ev.icon
                                                                                        className={`${ev.text != undefined ? "size-4" : "size-5 mx-auto"}`}
                                                                                    />
                                                                                )}
                                                                            </span>
                                                                        ) : (
                                                                            <ActionButton
                                                                                {...ev}
                                                                                key={
                                                                                    "clickEvent-" +
                                                                                    idx
                                                                                }
                                                                                className={`p-2 rounded-lg ${ev.className}`}
                                                                                onClick={() => {
                                                                                    ev.onClick?.(
                                                                                        item,
                                                                                    );
                                                                                }}
                                                                            />
                                                                        );
                                                                    },
                                                                )}
                                                        </td>
                                                    );
                                                },
                                            )}
                                    </tr>
                                ))}
                                {body.length == 0 && (
                                    <tr>
                                        <td className="fullSpan capitalize text-center">
                                            No Data to display
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-sm p-5!">
                            {emptyDataMessage ?? `No Data to display`}
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}
