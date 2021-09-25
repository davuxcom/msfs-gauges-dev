 function diffAndSet(_element, _newValue) {
  if (_element && _element.innerHTML != _newValue) {
      _element.innerHTML = _newValue;
  }
}

function diffAndSetAttribute(_element, _attribute, _newValue) {
  if (_element && _element.getAttribute(_attribute) != _newValue) {
      _element.setAttribute(_attribute, _newValue);
  }
}

export class BaseInstrumentEx extends BaseInstrument {
    get templateID() { return this.constructor.name; }
    get IsGlassCockpit() { return true; }
    get isInteractive() { return false; }
  
    constructor() {
        super();
        window.BASE = this;
    }
    
    connectedCallback() {
        super.connectedCallback();
        this.Connected();
    }

    onFlightStart() {
      super.onFlightStart();
      this.FlightStarted();
    }

    Connected() {}
    FlightStarted() {}

    ensureElement(elementName) {
        if (!this[elementName]) this[elementName] = this.querySelectorH("#" + elementName);
        if (!this[elementName]) console.log("ensureElement: can't find " + elementName);
    }

    setText(elementName, attributeValue) {
        this.ensureElement(elementName);
        diffAndSet(this[elementName], attributeValue);
    };

    setAutoAttribute(elementName, attributeName, attributeValue) {
        this.ensureElement(elementName);
        diffAndSetAttribute(this[elementName], attributeName, attributeValue);
    };
}