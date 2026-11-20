import type { CircuitProject } from "@icm/model";
import type { SymbolResolver } from "@icm/symbols";
import type { ProjectConnectivityIndex } from "./connectivity-index.js";
import { type ObjectLocator } from "./object-locator.js";
/**
 * Deterministic project-wide search index (Net connectivity rationale).
 * Case-insensitive exact/prefix/substring matching over instances (ID,
 * Reference, symbol ID, the component name people see, parameters) and nets,
 * returning `ObjectLocator`s ranked exact > prefix > substring with no
 * fuzzy ranking. Pure backend consumed by search and hierarchy navigation.
 */
export type SearchObjectKind = "instance" | "net";
export type SearchObjectLocator = ObjectLocator & {
    kind: SearchObjectKind;
};
export type SearchField = "instance-id" | "symbol" | "component-name" | "netlist-reference" | "property" | "net-name" | "net-id";
export type MatchType = "exact" | "prefix" | "substring";
export interface SearchResult {
    locator: SearchObjectLocator;
    label: string;
    field: SearchField;
    matchType: MatchType;
}
export interface ProjectSearchIndex {
    search(query: string): readonly SearchResult[];
}
export declare function buildProjectSearchIndex(project: CircuitProject, options?: {
    connectivityIndex?: ProjectConnectivityIndex;
    /** Names built-in and Cell symbols as the Library does. */
    resolver?: SymbolResolver;
}): ProjectSearchIndex;
