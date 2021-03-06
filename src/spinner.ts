import DataFetch from "./data-fetch";

export default class Spinner {
  api: string;
  elementToBeFilled: HTMLElement;
  loader: HTMLElement;
  template: Function;
  skeleton: Function;
  options: { numberOfSkeletons: number; contextFunction: Function };

  dataFetch: DataFetch;

  constructor(
    api: string,
    elementToBeFilled: string,
    loader: string,
    template: Function,
    skeleton: Function,
    options: { numberOfSkeletons: number; contextFunction: Function }
  ) {
    this.api = api;
    this.elementToBeFilled = this.getElement(elementToBeFilled);
    this.loader = this.getElement(loader);
    this.template = template;
    this.dataFetch = new DataFetch();

    this.skeleton = skeleton;
  
    // Options
    this.options = options || {
      numberOfSkeletons: 1,
      contextFunction: undefined,
    };

    this.init();
  }

  async init() {
    // Draw skelenton
    if (this.skeleton && this.options.numberOfSkeletons > 1) {
      this.drawElements(this.skeleton);
    } else if (this.skeleton) {
      this.drawElement(this.skeleton);
    }

    const jsonResult = await this.dataFetch.getApiData(this.api);

    // Draw elements or element
    Array.isArray(jsonResult) ? this.drawElements(this.template, jsonResult) :
      this.drawElement(this.template, jsonResult);
  }

  /**
   * Return string or element as HTML element
   *
   * @param  {String} element
   */
  getElement(element: string): any {
    const result = document.querySelector(element);
    return result;
  }


  drawElement(template: Function, jsonData?: string | JSON) {
    this.innerHTMLElement(template(jsonData));

    if (this.options.contextFunction) {
      this.options.contextFunction(jsonData);
    }
  }

  drawElements(template: Function, jsonData?: Array<string>) {
    if (jsonData) {
      // Replacing placeholder elements with first api element
      this.innerHTMLElement(template(jsonData[0]));
      // Adding other api elements
      for (let i = 1; i < jsonData.length; i++) {
        this.innerHTMLElements(template(jsonData[i]));
      }
    } else {
      for (let i = 0; i < this.options.numberOfSkeletons; i++) {
        this.innerHTMLElements(template());
      }
    }
    if (this.options.contextFunction) {
      this.options.contextFunction(jsonData);
    }
  }

  innerHTMLElement(content: string) {
    this.elementToBeFilled.innerHTML = content;
  }

  innerHTMLElements(content: string) {
    this.elementToBeFilled.innerHTML += content;
  }

  /**
   * Hide spinner loader from template
   *
   */
  hideloader() {
    this.loader.style.display = "none";
  }
}
