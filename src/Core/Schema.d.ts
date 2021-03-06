import { ApplicationContainer } from "bfg-js/src/Support/Application";
export interface anyObject {
    [key: string]: any;
}
export interface ruleObject {
    id?: string;
    e: string;
    a: anyObject;
    c: anyObject;
    v: anyObject;
    m: Array<string>;
}
export declare class Schema {
    protected app: ApplicationContainer;
    constructor(app: ApplicationContainer);
    rules(element: HTMLElement): ruleObject;
    build(element: HTMLElement, rules: ruleObject): HTMLElement;
    apply_content(content: Array<HTMLElement>): any[];
    insert(element: HTMLElement, data: any): void;
    content(data: any): void;
    context(context: any, maker?: Function | null): any;
}
