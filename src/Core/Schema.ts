import {ApplicationContainer} from "bfg-js/src/Support/Application";

export interface anyObject {
    [key: string]: any;
}

export interface ruleObject {
    id?: number|string  // ID
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

            let special = element.dataset && 'schemaChild' in element.dataset ?
                true : (
                    element.dataset &&
                    'schemaChildId' in element.dataset &&
                    element.dataset.schemaChildId in this.app.data
                );

            return special ? this.app.schema.build(
                element,
                this.app.schema.rules(
                    element
                )
            ) : element;
        });
    }

    insert (element: HTMLElement, data: any) {

        element.parentNode.replaceChild(data, element);
    }
}