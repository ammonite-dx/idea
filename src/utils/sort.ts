import { Power, Item, Dlois, Elois } from "@/types/types";

export function sortPowers(
    powers: Power[],
): Power[] {
    return [...powers].sort((a, b) => {
        if (a.supplement_order !== b.supplement_order) {return a.supplement_order - b.supplement_order}
        if (a.category_order !== b.category_order) {return a.category_order - b.category_order}
        if (a.type_restrict_order !== b.type_restrict_order) {return a.type_restrict_order - b.type_restrict_order}
        if (a.additional_order !== b.additional_order) {return a.additional_order - b.additional_order}
        if (a.ruby !== b.ruby) {return a.ruby.localeCompare(b.ruby)}
        return 0;
    });
};

export function sortItems(
    items: Item[],
): Item[] {
    return [...items].sort((a, b) => {
        if (a.supplement_order !== b.supplement_order) {return a.supplement_order - b.supplement_order}
        if (a.category_order !== b.category_order) {return a.category_order - b.category_order}
        if (a.type_order !== b.type_order) {return a.type_order - b.type_order}
        if (a.cost_order !== b.cost_order) {return a.cost_order - b.cost_order}
        if (a.additional_order !== b.additional_order) {return a.additional_order - b.additional_order}
        if (a.ruby !== b.ruby) {return a.ruby.localeCompare(b.ruby)}
        return 0;
    });
};

export function sortDlois(
    dlois: Dlois[],
): Dlois[] {
    return [...dlois].sort((a, b) => {
        if (a.supplement_order !== b.supplement_order) {return a.supplement_order - b.supplement_order}
        if (a.type_order !== b.type_order) {return a.type_order - b.type_order}
        if (a.restrict_order !== b.restrict_order) {return a.restrict_order - b.restrict_order}
        if (a.additional_order !== b.additional_order) {return a.additional_order - b.additional_order}
        if (a.no !== b.no) {return a.no.localeCompare(b.no)}
        return 0;
    });
}

export function sortElois(
    elois: Elois[],
): Elois[] {
    return [...elois].sort((a, b) => {
        if (a.supplement_order !== b.supplement_order) {return a.supplement_order - b.supplement_order}
        if (a.urge_order !== b.urge_order) {return a.urge_order - b.urge_order}
        if (a.type_order !== b.type_order) {return a.type_order - b.type_order}
        if (a.additional_order !== b.additional_order) {return a.additional_order - b.additional_order}
        return 0;
    });
}