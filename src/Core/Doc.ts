import {ApplicationContainer} from "../index";

export class Doc {

    [key: string]: any;

    constructor(
       protected app: ApplicationContainer
    ) {
        if (this.is_support_spa()) {

            window.history.replaceState({url: location.href}, document.title);

            window.setTimeout(() => {
                window.addEventListener('popstate', (event: PopStateEvent) => {
                    //console.log(event, event.cancelable);
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.state.url) {
                        this.location(event.state.url, false);
                    }
                });
            }, 1000);

            // window.onpopstate = (event: PopStateEvent) => {
            //     console.log(event, event.cancelable);
            //     event.preventDefault();
            //     event.stopPropagation();
            //     if (event.state.url) {
            //         this.location(event.state.url, false);
            //     }
            // };
        }
    }

    reload () {

        window.location.reload();
    }

    location (url: string, only_load:boolean = true) {

        if (this.app.doc.is_support_spa()) {

            let container: string|null = this.app.server.container;

            let component: HTMLElement = container ?
                document.getElementById(container) : document.body;

            if (component) {
                this.app.request({
                    url: url,
                    headers: {
                        'BFG-CONTENT-REQUEST': 'true'
                    }
                }).then(({data, xhr}: any) => {
                    if (xhr.getResponseHeader('BFG-CONTENT-RESPONSE')) {
                        if (only_load) {
                            this.app.doc.set_url(url);
                        }
                        this.app.schema.content(data, component);
                    } else {
                        window.location.href = url;
                    }
                }).catch((e: any) => {
                    if (only_load) {
                        this.app.doc.set_url(url);
                    }
                    if (e.status === 401 && e.statusText === 'Unauthorized') {
                        let data = this.app.json.decode(e.responseText);
                        if (data && 'message' in data && data.message === 'Unauthenticated.') {
                            this.app.doc.reload();
                            return ;
                        }
                    }
                    this.app.schema.content(e.responseText, component);
                });
            } else {
                window.location.href = url;
            }
        } else {
            window.location.href = url;
        }
    }

    set_url (url: string, title: string|null = null) {

        if (this.app.doc.is_support_spa()) {

            window.history.replaceState({url: location.href}, document.title);
            window.history.pushState({url: location.href}, document.title, url);
            window.history.replaceState({url: location.href}, document.title);
        }
    }

    is_support_spa () {
        return window.history && window.history.pushState && window.history.replaceState &&
            !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)
    }

    is_descendant(parent: HTMLElement, child: HTMLElement) {
        let node = child.parentNode;
        while (node != null) {
            if (node == parent) { return true; }
            node = node.parentNode;
        }
        return false;
    }
}