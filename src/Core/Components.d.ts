import { ApplicationContainer } from "bfg-js/src/Support/Application";
interface anyObject {
    [key: string]: any;
}
export declare class Components {
    protected app: ApplicationContainer;
    protected items: anyObject;
    constructor(app: ApplicationContainer);
    get(name: string): any;
    all(): anyObject;
    register(name: string, component: any): this;
    new(componentClass: any): void;
    has(name: string): boolean;
    names(): string[];
}
export {};
