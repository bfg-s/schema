import {ApplicationContainer} from "bfg-js/src/Support/Application";

export interface anyObject {
    [key: string]: any;
}

export interface ruleObject {
    id?: string         // ID
    e: string           // Element name
    a: anyObject        // Attributes
    c: anyObject        // Contents
    v: anyObject        // Variables
    m: Array<string>    // Methods
}

export class Schema {

    constructor(
        protected app: ApplicationContainer
    ) {
    }

    rules (element: HTMLElement): ruleObject {

        return this.app.get_schema_rules(element);
    }

    build (element: HTMLElement, rules: ruleObject) {

        let node: HTMLElement = document.createElement(element.nodeName);

        let content = this.app.schema.apply_content(
            Object.assign([], element.childNodes)
        );

        this.app.obj.each(rules.a, (item: string, key: string) => {
            node.setAttribute(key, item);
        });

        this.app.obj.each(rules.c, (item: any, key: string) => {
            let appEnd: Node;
            if (typeof item === 'string') {
                appEnd = document.createRange().createContextualFragment(item);
            } else {
                appEnd = this.build(node, item);
            }
            node.appendChild(appEnd);
        });

        node.append(...content);

        return node;
    }

    apply_content (content: Array<HTMLElement>) {

        return content.map((element: HTMLElement) => {

            return this.app.is_schema_element(element) ? this.app.schema.build(
                element,
                this.app.schema.rules(
                    element
                )
            ) : element;
        });
    }

    insert (element: HTMLElement, data: any) {

        if (element.parentNode) {

            element.parentNode.replaceChild(data, element);
        }
    }

    content (data: any) {

        let container: string|null = this.app.server.container;

        let component: HTMLElement = container ?
            document.getElementById(container) : document.body;

        component.append(this.app.str.to_nodes(data));
    }

    context (context: any, maker: Function|null = null) {

        return this.app.components.context(
            context, maker
        );
    }
}