class Spinner {
    constructor(api, elementToBeFilled, loader, options) {
        this.api = api;
        this.elementToBeFilled = this.getElement(elementToBeFilled);
        this.loader = this.getElement(loader);

        // Options
        this.options = options || {
            typeElement: undefined,
        };

        this.init();
    }

    async init() {
        const jsonResult = await this.getApiData(this.api);

        const typeElement = this.options.typeElement;
        if (typeElement === "table") {
            this.drawTable(jsonResult);
        } else if (typeElement === "card") {
            this.drawCard(jsonResult);
        } else if (typeElement === "cards") {
            this.drawCards(jsonResult);
        }
    }

    /**
     * Return string or element as HTML element
     * 
     * @param  {String} element 
     */
    getElement(element) {
        return typeof element === 'string' ? document.querySelector(element) : element;
    }

    /**
     * Get API data as JSON
     * 
     * @param  {String} url
     * 
     * @return {object}  Data as JSON
     */
    async getApiData(url) {

        // Storing response
        const response = await fetch(url);

        // Storing data in form of JSON
        const jsonData = await response.json();

        // Hide loader
        if (response && this.loader) {
            hideloader();
        }

        return jsonData;
    }

    /**
     *  Function to define innerHTML for HTML table
     * 
     * @param  {object} jsonData
     */
    drawTable(jsonData) {
        let tab = `<thead>
                        <tr>
                            <th>Name</th>
                            <th>Office</th>
                        </tr>
                    </thead>`;

        // Loop to access all rows 
        for (let r of jsonData) {
            tab += `<tr> 
                        <td>${r.title} </td>
                        <td>${r.userId}</td>
                    </tr>`;
        }

        // Setting innerHTML as tab variable
        this.innerHTMLElement(tab);
    }

    /**
     *  Function to define innerHTML for HTML card
     * 
     * @param  {object} jsonData
     */
    templateCard(jsonData) {

        let content = `
            <div class="col-12 col-md-6">
                <div class="card shadow py-2 placeholder-glow" id="cardbody">
                    <div class="card-body d-flex align-items-center">
                        <img src="${jsonData.avatar}" class="rounded-pill" alt="avatar">
                        <div class="px-4">
                            <h1 class="fs-3">${jsonData.username}</h1>
                            <p class="card-text">
                                ${jsonData.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return content;
    }

    drawCard(jsonData) {
        const self = this;
        this.innerHTMLElement(self.templateCard(jsonData));
    }

    drawCards(jsonData) {
        const self = this;

        // Replacing placeholder elements with first api element
        this.innerHTMLElement(self.templateCard(jsonData.pop()));

        // Adding other api elements
        for (let r of jsonData) {
            this.innerHTMLElements(self.templateCard(r));
        }
    }

    innerHTMLElement(content) {
        this.elementToBeFilled.innerHTML = content;
    }

    innerHTMLElements(content) {
        this.elementToBeFilled.innerHTML += content;
    }

    /**
     * Hide spinner loader from template
     * 
     */
    hideloader() {
        this.loader.style.display = 'none';
    }
}