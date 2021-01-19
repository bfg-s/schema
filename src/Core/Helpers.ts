import {anyObject, ruleObject} from "./Schema";

export default class Helpers {

    is_schema_root_element (element: HTMLElement) {

        return element && 'er' in element.dataset;

    }

    is_schema_child_element (element: HTMLElement) {

        return element && 'ec' in element.dataset;

    }

    is_schema_element (element: HTMLElement) {

        return this.is_schema_child_element(element) ||
            this.is_schema_root_element(element);
    }

    get_schema_rules (element: HTMLElement): ruleObject|null {

        if (this.is_schema_element(element)) {

            let data_prop: string = '';

            if (this.is_schema_child_element(element)) {

                data_prop = element.dataset.ec;
            }

            else if (this.is_schema_root_element(element)) {

                data_prop = element.dataset.er;
            }

            let a: any = (element.dataset.a ? (this as any).json.decode(element.dataset.a) : {});
            let classes = element.getAttribute('class');
            if (classes) a.class = classes;

            return {
                id: data_prop,
                e: String(data_prop).split('#')[0], a,
                c: (element.dataset.c ? (this as any).json.decode(element.dataset.c) : {}),
                v: (element.dataset.v ? (this as any).json.decode(element.dataset.v) : {}),
                m: (element.dataset.m ? (this as any).json.decode(element.dataset.m) : []),
            };
        }

        return null;
    }

    get_element_dataset (name: string, defaultData: any = null) {

    }
}