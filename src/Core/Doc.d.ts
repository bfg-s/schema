import { ApplicationContainer } from "../index";
export declare class Doc {
    protected app: ApplicationContainer;
    constructor(app: ApplicationContainer);
    reload(): void;
    redirect(url: string): void;
    location(url: string): void;
    set_url(url: string, title?: string | null, state?: any): void;
}
