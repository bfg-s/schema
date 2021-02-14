import { ApplicationContainer } from "../index";
export declare class Doc {
    protected app: ApplicationContainer;
    [key: string]: any;
    constructor(app: ApplicationContainer);
    reload(): void;
    location(url: string, only_load?: boolean): void;
    set_url(url: string, title?: string | null): void;
    is_support_spa(): boolean;
    is_descendant(parent: HTMLElement, child: HTMLElement): boolean;
}
