import { ApplicationContainer, ServiceProvider } from "bfg-js";
export default class SchemaProvider extends ServiceProvider<ApplicationContainer> {
    name: string;
    register(): void;
    boot(): void;
    private build;
}
