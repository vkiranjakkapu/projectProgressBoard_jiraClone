import type { HTMLAttributes, ReactNode } from "react";
import type { ActionButtonProps } from "../ActionButtonComponent";
import ActionButton from "../ActionButtonComponent";
import InputComponent, {
    type InputComponentProps,
} from "../formelements/InputComponent";
import {
    PaginationButtons,
    type PaginationButtonsProps,
} from "../pagination/PaginationButtons";
import type { SpinnerComponentProps } from "../SpinnerComponent";
import SpinnerComponent from "../SpinnerComponent";

export type SectionLayoutComponentProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    title?: string;
    description?: string;
    greetings?: { title?: string; description?: string };
    actionButtons?: ActionButtonProps[];
    pagination?: PaginationButtonsProps;
    masterSearch?: InputComponentProps;
    contentSearch?: InputComponentProps;
    spinner?: SpinnerComponentProps;
    customise?: string;
};

export default function SectionLayoutComponent({
    children,
    title,
    description,
    greetings,
    actionButtons,
    pagination,
    masterSearch,
    contentSearch,
    spinner,
    customise,
    ...props
}: SectionLayoutComponentProps) {
    return (
        <section
            {...props}
            className={`*:p-4 bg-theme rounded divide-y ${customise}`}
        >
            {(title || description || greetings || actionButtons) && (
                <div className="flex flex-wrap items-center justify-between sm:gap-4 md:gap-8">
                    {!greetings ? (
                        <div>
                            {(title || description) && (
                                <>
                                    <h1 className="text-xl font-semibold">
                                        {title}
                                    </h1>
                                    <p className="text-sm capitalize">
                                        {description}
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div>
                            <>
                                {greetings.title && (
                                    <p className="text-sm capitalize">
                                        {greetings.title}
                                    </p>
                                )}
                                {greetings.description && (
                                    <h4 className="text-lg font-semibold">
                                        {greetings.description}
                                    </h4>
                                )}
                            </>
                        </div>
                    )}
                    {masterSearch && (
                        <div className="flex-1">
                            {(() => {
                                const { resultsLabel, ...props } = masterSearch;
                                return (
                                    <div className={`flex flex-col gap-2`}>
                                        <InputComponent
                                            {...props}
                                            label={{
                                                ...props.label,
                                                iconSize:
                                                    props.label?.iconSize ??
                                                    "size-5",
                                            }}
                                            className={`py-2 px-2.5 ${props.className}`}
                                            customise={`pl-4 ${props.customise}`}
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
                    )}
                    {actionButtons && (
                        <div className="flex items-center gap-3">
                            {actionButtons.map((btn, idx) => (
                                <ActionButton key={idx} {...btn} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {((pagination && pagination.totalPages > 1) || contentSearch) && (
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex-1">
                        {contentSearch &&
                            (() => {
                                const { resultsLabel, ...props } =
                                    contentSearch;
                                return (
                                    <div className="w-full md:w-3/5 flex flex-col gap-2">
                                        <InputComponent {...props} />
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
            {spinner && spinner.isLoading ? (
                <SpinnerComponent {...spinner} />
            ) : (
                <div
                    className={`p-0! *:px-4 ${props.className ?? "divide-y *:only:py-4 *:not-only:py-2"}`}
                >
                    {children || ""}
                </div>
            )}
        </section>
    );
}
