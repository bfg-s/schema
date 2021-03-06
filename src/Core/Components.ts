import {ApplicationContainer} from "bfg-js/src/Support/Application";
interface anyObject {
    [key: string]: any;
}

export class Components {

    protected items: anyObject = {};

    constructor(
        protected app: ApplicationContainer
    ) {
    }

    get (name: string) {

        return this.items[name];
    }

    all () {

        return this.items;
    }

    register (name: string, component: any) {

        this.items[name] = component;

        if (this.app.event.has('register_component')) {

            this.app.event.register_component(name, component);
        }

        return this;
    }

    new (componentClass: any) {

        if (componentClass && 'name' in componentClass) {

            this.app.components.register(componentClass.name, componentClass)
        }
    }

    has (name: string) {

        return name in this.items;
    }

    names () {

        return Object.keys(this.items);
    }

    context (context: any, maker: Function|null = null) {

        context.keys().forEach((file: any) => {
            let obj = context(file).default;
            let obj_make = typeof maker === 'function' ? maker(obj) : null;
            this.app.components.new(obj_make ? obj_make : obj);
        });
    }
}