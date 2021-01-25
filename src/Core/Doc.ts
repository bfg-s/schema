import {ApplicationContainer} from "../index";

export class Doc {

    constructor(
        protected app: ApplicationContainer
    ) {}

    reload () {

        window.location.reload();
    }

    redirect (url: string) {
        if (this.app.server.container) {
            let component = document.getElementById(this.app.server.container);
            if (component) {
                this.app.request({
                    url: url,
                    body: {},
                    headers: {
                        'BFG-CONTENT-REQUEST': 'true'
                    }
                }).then(({data}: any) => {
                    this.app.schema.redirected(data, component);
                });
            } else {
                window.location.href = url;
            }
        } else {
            window.location.href = url;
        }
    }

    location (url: string) {

        this.redirect(url);
    }

    set_url (url: string, title: string|null = null, state: any = {}) {

        window.history.pushState(state, title, url);
    }
}