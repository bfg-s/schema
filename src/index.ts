//import {ApplicationContainer, ServiceProvider} from "bfg-js";
import {Components} from "./Core/Components";
import {Schema} from "./Core/Schema";
import Helpers from "./Core/Helpers";
import {Doc} from "./Core/Doc";


interface anyObject {
    [key: string]: any
}

export type ApplicationContainer = import('bfg-js').ApplicationContainer;

export interface ServiceProviderInterface<T> {
    app: T
    register? (): void
    boot? (): void
}

export interface ServiceProviderConstructor {
    new <T extends ApplicationContainer>(app?: T): ServiceProvider<T>;
}

export class ServiceProvider<T extends ApplicationContainer> implements ServiceProviderInterface<T> {

    name?: string|Function

    require?: Array<string>

    constructor(
        public app: T
    ) {}
}

export default class SchemaProvider extends ServiceProvider<ApplicationContainer> {

    name: string = 'schema';

    register() {

        let configsMetas = document.querySelectorAll('meta[name]');
        let configs: anyObject = {};
        Object.assign([], configsMetas).map((i: HTMLMetaElement) => {
            let content: any = i.content;
            if (String(content).toLowerCase() === 'null') content = null;
            else if (String(content).toLowerCase() === 'true') content = true;
            else if (String(content).toLowerCase() === 'false') content = false;
            configs[i.name] = content
        });

        this.app.inject(new Helpers());
        this.app.bind('doc', new Doc(this.app));
        this.app.bind('server', configs);
        this.app.bind('schema_class', Schema);
        this.app.singleton('schema_build', () => this.build());
        this.app.singleton('schema', () => new (this.app.schema_class)(this.app));
        this.app.singleton('components', () => new Components(this.app));
        this.app.singleton('elements', () => {
            return document.querySelectorAll('[data-er]')
        });
    }

    boot() {

        if (this.app.schema_build) {

            this.app.execute('schema_built');
        }

        Object.values(document.querySelectorAll('[data-bfg-call]')).map((e: HTMLElement) => {
            let json = this.app.json.decode(e.innerText);
            if (json) { this.app.call(json); }
        });
    }

    private build() {

        let elements: any = this.app.elements;

        let engine_map: string|boolean = 'map' in elements ? 'map' : ('forEach' in elements ? 'forEach' : false);

        if (engine_map !== false) {

            elements[engine_map]((element: HTMLElement) => {

                this.app.schema.insert(
                    element,
                    this.app.schema.build(
                        element,
                        this.app.schema.rules(
                            element
                        )
                    )
                );
            });

            return true;
        }

        return false;
    }
}