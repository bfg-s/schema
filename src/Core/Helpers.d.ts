import { ruleObject } from "./Schema";
export default class Helpers {
    is_schema_root_element(element: HTMLElement): boolean;
    is_schema_child_element(element: HTMLElement): boolean;
    is_schema_element(element: HTMLElement): boolean;
    get_schema_rules(element: HTMLElement): ruleObject | null;
    get_element_dataset(name: string, defaultData?: any): void;
}
