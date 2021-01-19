import {ApplicationContainer, ServiceProvider} from "bfg-js";
import {Components} from "./Core/Components";
import {Schema} from "./Core/Schema";
import Helpers from "./Core/Helpers";

interface anyObject {
    [key: string]: any
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
        this.app.bind('server', configs);
        this.app.bind('head', document.head);
        this.app.bind('body', document.body);
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