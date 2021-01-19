import {anyObject, ruleObject} from "./Schema";

export default class Helpers implements anyObject {

    asset (path: string = "") {
        let str = (this as any).str;
        let url = str.trim((this as any).server.asset, '/');
        return url + (path !== '' ? '/' + str.trim(path, '/') : '');
    }

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

            let cdata = String(data_prop).split('\\');
            let e = cdata[0];
            let num = cdata[1];
            let c = (element.dataset.c ? (this as any).json.decode(element.dataset.c) : {});
            let a: any = (element.dataset.a ? (this as any).json.decode(element.dataset.a) : {});
            let classes = element.getAttribute('class');
            if (classes) a.class = classes;

            element.querySelectorAll(`[data-sf='${num}']`).forEach((slotElement: HTMLElement) => {
                let slot = slotElement.dataset.s;
                if (slot) { c[slot] = Object.assign([], slotElement.childNodes); }
                slotElement.remove();
            });

            return {
                id: data_prop, e, a, c,
                v: (element.dataset.v ? (this as any).json.decode(element.dataset.v) : {}),
                m: (element.dataset.m ? String(element.dataset.m).split(';') : []),
            };
        }

        return null;
    }

    get_element_dataset (name: string, defaultData: any = null) {

    }
}