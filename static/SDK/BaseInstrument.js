class BaseInstrument extends TemplateElement {
    constructor() {
        super();
        this.urlConfig = new URLConfig();
        this.frameCount = 0;
        this.highlightList = [];
        this.backgroundList = [];
        this._lastTime = 0;
        this._deltaTime = 0;
        this._frameLastTime = 0;
        this._frameDeltaTime = 0;
        this._isConnected = false;
        this._isInitialized = false;
        this._quality = Quality.high;
        this._gameState = GameState.ingame;
        this._alwaysUpdate = false;
        this._alwaysUpdateList = new Array();
        this._pendingCalls = [];
        this.dataMetaManager = new DataReadMetaManager();
    }
    get initialized() { return this._isInitialized; }
    get instrumentIdentifier() { return this._instrumentId; }
    get instrumentIndex() { return (this.urlConfig.index != null) ? this.urlConfig.index : 1; }
    get isInteractive() { return false; }
    get IsGlassCockpit() { return false; }
    get isPrimary() { return (this.urlConfig.index == null || this.urlConfig.index == 1); }
    get deltaTime() { return this._deltaTime; }
    get flightPlanManager() { return null; }
    get facilityLoader() {
        if (!this._facilityLoader)
            this._facilityLoader = new FacilityLoader(this);
        return this._facilityLoader;
    }
    connectedCallback() {
        super.connectedCallback();
        this.electricity = this.getChildById("Electricity");
        this.highlightSvg = this.getChildById("highlight");
        this.loadDocumentAttributes();
        this.loadURLAttributes();
        this.loadXMLConfig();
        window.document.addEventListener("OnVCockpitPanelAttributesChanged", this.loadDocumentAttributes.bind(this));
        this.startTime = Date.now();
        if (this.getGameState() != GameState.mainmenu) {
            console.log("LOOP");
            this.createMainLoop();
        } else {
            console.log("DELAY GAME LOOP");
            setTimeout(() => {
                this.createMainLoop();
                this.onFlightStart();
            }, 1000);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._isConnected = false;
    }
    Init() {
        this._isInitialized = true;
        if (this.xmlConfig)
            this.parseXMLConfig();
      //  this.initTransponder();
    }
    setInstrumentIdentifier(_identifier) {
        if (_identifier && _identifier != "" && _identifier != this.instrumentIdentifier) {
            this._instrumentId = _identifier;
            var guid = this.getAttribute("Guid");
            if (guid != undefined) {
                LaunchFlowEvent("ON_VCOCKPIT_INSTRUMENT_INITIALIZED", guid, this.instrumentIdentifier, this.isInteractive, this.IsGlassCockpit);
            }
        }
    }
    setConfigFile(_file) {
        this._xmlConfigFile = _file;
    }
    getChildById(_selector) {
        if (_selector == "")
            return null;
        if (!_selector.startsWith("#") && !_selector.startsWith("."))
            _selector = "#" + _selector;
        var child = this.querySelector(_selector.toString());
        return child;
    }
    getChildrenById(_selector) {
        if (_selector == "")
            return null;
        if (!_selector.startsWith("#") && !_selector.startsWith("."))
            _selector = "#" + _selector;
        var children = this.querySelectorAll(_selector.toString());
        return children;
    }
    getChildrenByClassName(_selector) {
        return this.getElementsByClassName(_selector);
    }
    startHighlight(_id) {
        let elem = this.getChildById(_id);
        if (elem) {
            let highlight = new HighlightedElement();
            highlight.elem = elem;
            highlight.style = elem.style.cssText;
            this.highlightList.push(highlight);
        }
        let elems = this.getChildrenByClassName(_id);
        for (let i = 0; i < elems.length; i++) {
            let highlight = new HighlightedElement();
            highlight.elem = elems[i];
            highlight.style = elems[i].style.cssText;
            this.highlightList.push(highlight);
        }
        this.updateHighlightElements();
    }
    stopHighlight(_id) {
        let elem = this.getChildById(_id);
        if (elem) {
            for (let i = 0; i < this.highlightList.length; i++) {
                if (this.highlightList[i].elem == elem) {
                    elem.style.cssText = this.highlightList[i].style;
                    this.highlightList.splice(i, 1);
                }
            }
        }
        let elems = this.getChildrenByClassName(_id);
        for (let i = 0; i < elems.length; i++) {
            for (let j = 0; j < this.highlightList.length; j++) {
                if (this.highlightList[j].elem == elems[i]) {
                    elems[i].style.cssText = this.highlightList[j].style;
                    this.highlightList.splice(j, 1);
                }
            }
        }
        this.updateHighlightElements();
    }
    clearHighlights() {
        this.highlightList = [];
        this.updateHighlightElements();
    }
    updateHighlightElements() {
        for (let i = 0; i < this.backgroundList.length; i++) {
            this.backgroundList[i].remove();
        }
        this.backgroundList = [];
        if (this.highlightList.length > 0) {
            this.highlightSvg.setAttribute("active", "true");
            let elems = "";
            for (let i = 0; i < this.highlightList.length; i++) {
                let rect = this.highlightList[i].elem.getBoundingClientRect();
                if (this.highlightList[i] instanceof HTMLElement) {
                    let bg = document.createElement("div");
                    bg.style.backgroundColor = "rgba(0,0,0,0.9)";
                    bg.style.zIndex = "-1";
                    bg.style.left = this.highlightList[i].elem.offsetLeft.toString() + "px";
                    bg.style.top = this.highlightList[i].elem.offsetTop.toString() + "px";
                    bg.style.width = rect.width.toString() + "px";
                    bg.style.height = rect.height.toString() + "px";
                    bg.style.position = "absolute";
                    this.highlightList[i].elem.parentElement.appendChild(bg);
                    this.backgroundList.push(bg);
                }
                if (i > 0) {
                    elems += ";";
                }
                elems += rect.left + " ";
                elems += rect.top + " ";
                elems += rect.right + " ";
                elems += rect.bottom;
            }
            this.highlightSvg.setAttribute("elements", elems);
        }
        else {
            this.highlightSvg.setAttribute("active", "false");
        }
    }
    onInteractionEvent(_args) {
    }
    onSoundEnd(_event) {
    }
    getQuality() {
        if (this._alwaysUpdate && this._quality != Quality.disabled) {
            return Quality.high;
        }
        return this._quality;
    }
    getGameState() {
        return this._gameState;
    }
    reboot() {
        console.log("Rebooting Instrument...");
        this.startTime = Date.now();
        this.frameCount = 0;
      //  this.initTransponder();
        this.dispatchEvent(new Event('Reboot'));
    }
    onFlightStart() {
        console.log("Flight Starting...");
        SimVar.SetSimVarValue("L:HUD_AP_SELECTED_SPEED", "Number", 0);
        SimVar.SetSimVarValue("L:HUD_AP_SELECTED_ALTITUDE", "Number", 0);
        this.dispatchEvent(new Event('FlightStart'));
    }
    onQualityChanged(_quality) {
        this._quality = _quality;
    }
    onGameStateChanged(_oldState, _newState) {
        if (_newState != GameState.mainmenu) {
            this.createMainLoop();
            if (_oldState == GameState.loading && (_newState == GameState.ingame || _newState == GameState.briefing)) {
                this.reboot();
            }
            else if (_oldState == GameState.briefing && _newState == GameState.ingame) {
                this.onFlightStart();
            }
        }
        else {
            this.killMainLoop();
        }
        this._gameState = _newState;
    }
    loadDocumentAttributes() {
        var attr = undefined;
        if (document.body.hasAttribute("quality"))
            attr = document.body.getAttribute("quality");
        else if (window.parent && window.parent.document.body.hasAttribute("quality"))
            attr = window.parent.document.body.getAttribute("quality");
        if (attr != undefined) {
            var quality = Quality[attr];
            if (quality != undefined && this._quality != quality) {
                this.onQualityChanged(quality);
            }
        }
        if (document.body.hasAttribute("gamestate"))
            attr = document.body.getAttribute("gamestate");
        else if (window.parent && window.parent.document.body.hasAttribute("gamestate"))
            attr = window.parent.document.body.getAttribute("gamestate");
        if (attr != undefined) {
            var state = GameState[attr];
            if (state != undefined && this._gameState != state) {
                this.onGameStateChanged(this._gameState, state);
            }
        }
    }
    parseXMLConfig() {
        if (this.instrumentXmlConfig) {
            let electric = this.instrumentXmlConfig.getElementsByTagName("Electric");
            if (electric.length > 0) {
                this.electricalLogic = new CompositeLogicXMLElement(this, electric[0]);
            }
            let alwaysUpdate = this.instrumentXmlConfig.getElementsByTagName("AlwaysUpdate");
            if (alwaysUpdate.length > 0) {
                if (alwaysUpdate[0].textContent.toLowerCase() == "true") {
                    this._alwaysUpdate = true;
                }
            }
        }
    }
    parseURLAttributes() {
        var instrumentID = this.templateID;
        if (this.urlConfig.index)
            instrumentID += "_" + this.urlConfig.index;
        this.setInstrumentIdentifier(instrumentID);
        if (this.urlConfig.style)
            this.setAttribute("instrumentstyle", this.urlConfig.style);
    }
    beforeUpdate() {
        let curTime = Date.now();
        this._frameDeltaTime = curTime - this._frameLastTime;
        this._frameLastTime = curTime;
    }
    Update() {
        this.updateElectricity();
        this.updateHighlight();
        if (this.dataMetaManager) {
            this.dataMetaManager.UpdateAll();
        }
        if (this._facilityLoader) {
            this._facilityLoader.update();
        }
    }
    afterUpdate() {
        this.frameCount++;
        if (this.frameCount >= Number.MAX_SAFE_INTEGER)
            this.frameCount = 0;
    }
    doUpdate() {
        this.beforeUpdate();
        if (this.canUpdate()) {
            let curTime = Date.now();
            this._deltaTime = curTime - this._lastTime;
            this._lastTime = curTime;
            this.updatePendingCalls();
            this.Update();
        }
        else {
            this.updateAlwaysList();
        }
        this.afterUpdate();
    }
    CanUpdate() {
        console.warn("Deprecated - You should not be calling this function anymore");
        return false;
    }
    canUpdate() {
        var quality = this.getQuality();
        if (quality == Quality.ultra) {
            return true;
        }
        else if (quality == Quality.high) {
            if ((this.frameCount % 2) != 0) {
                return false;
            }
        }
        else if (quality == Quality.medium) {
            if ((this.frameCount % 4) != 0) {
                return false;
            }
        }
        else if (quality == Quality.low) {
            if ((this.frameCount % 32) != 0) {
                return false;
            }
        }
        else if (quality == Quality.hidden) {
            if ((this.frameCount % 128) != 0) {
                return false;
            }
        }
        else if (quality == Quality.disabled) {
            return false;
        }
        return true;
    }
    updateElectricity() {
        if (this.electricity) {
            if (this.isElectricityAvailable())
                this.electricity.setAttribute("state", "on");
            else
                this.electricity.setAttribute("state", "off");
        }
    }
    isElectricityAvailable() {
        if (this.electricalLogic) {
            return this.electricalLogic.getValue() != 0;
        }
        return SimVar.GetSimVarValue("CIRCUIT AVIONICS ON", "Bool");
    }
    playInstrumentSound(soundId) {
        if (this.isElectricityAvailable() && this.getGameState() == GameState.ingame) {
            Coherent.call("PLAY_INSTRUMENT_SOUND", soundId);
            return true;
        }
        return false;
    }
    createMainLoop() {
        if (this._isConnected)
            return;
        this._lastTime = Date.now();
        let updateLoop = () => {
            if (!this._isConnected) {
                console.log("Exiting MainLoop...");
                return;
            }
            try {
              //  if (BaseInstrument.allInstrumentsLoaded && SimVar.IsReady()) {
                    if (!this._isInitialized)
                        this.Init();
                    this.doUpdate();
             //   }
            }
            catch (Error) {
                console.error(this.instrumentIdentifier + " : " + Error, Error.stack);
            }
            setTimeout(updateLoop, 30);
        };
        this._isConnected = true;
        console.log("MainLoop created");
        requestAnimationFrame(updateLoop);
    }
    killMainLoop() {
        this._isConnected = false;
    }
    loadXMLConfig() {
        let xmlParser = new DOMParser();
        this.xmlConfig = xmlParser.parseFromString(this._xmlConfigFile, "application/xml");
        if (this.xmlConfig) {
            let instruments = this.xmlConfig.getElementsByTagName("Instrument");
            for (let i = 0; i < instruments.length; i++) {
                let name = instruments[i].getElementsByTagName("Name")[0].textContent;
                if (name == this.instrumentIdentifier) {
                    this.instrumentXmlConfig = instruments[i];
                }
            }
        }
    }
    loadURLAttributes() {
        var parsedUrl = new URL(this.getAttribute("Url").toLowerCase());
        this.urlConfig.style = parsedUrl.searchParams.get("style");
        let index = parsedUrl.searchParams.get("index");
        this.urlConfig.index = index == null ? null : parseInt(index);
        this.urlConfig.wasmModule = parsedUrl.searchParams.get("wasm_module");
        this.urlConfig.wasmGauge = parsedUrl.searchParams.get("wasm_gauge");
        this.parseURLAttributes();
    }
    getTimeSinceStart() {
        return Date.now() - this.startTime;
    }
    getAspectRatio() {
        var vpRect = this.getBoundingClientRect();
        if (vpRect) {
            var vpWidth = vpRect.width;
            var vpHeight = vpRect.height;
            var aspectRatio = vpWidth / vpHeight;
            return aspectRatio;
        }
        return 1.0;
    }
    isComputingAspectRatio() { return false; }
    isAspectRatioForced() { return false; }
    getForcedScreenRatio() { return 1.0; }
    getForcedAspectRatio() { return 1.0; }
    updateHighlight() {
    }
    highlightGetState(_valueMin, _valueMax, _period) {
        let time = new Date().getTime();
        let size = _valueMax - _valueMin;
        let middle = _valueMin + size / 2;
        return middle + (Math.sin((time % _period / _period * Math.PI * 2)) * (size / 2));
    }
    wasTurnedOff() {
        return false;
    }
    initTransponder() {
        let transponderCode = ("0000" + SimVar.GetSimVarValue("TRANSPONDER CODE:1", "number")).slice(-4);
        if (transponderCode) {
            let currentCode = parseInt(transponderCode);
            if (currentCode == 0) {
                Simplane.setTransponderToRegion();
            }
        }
    }
    requestCall(_func) {
        this._pendingCalls.push(_func);
    }
    updatePendingCalls() {
        let length = this._pendingCalls.length;
        for (let i = 0; i < length; i++) {
            this._pendingCalls[i]();
        }
        this._pendingCalls.splice(0, length);
    }
    clearPendingCalls() {
        this._pendingCalls.splice(0, length);
    }
    alwaysUpdate(_element, _val) {
        for (var i = 0; i < this._alwaysUpdateList.length; i++) {
            if (this._alwaysUpdateList[i] == _element) {
                if (!_val)
                    this._alwaysUpdateList.splice(i, 1);
                return;
            }
        }
        if (_val)
            this._alwaysUpdateList.push(_element);
    }
    updateAlwaysList() {
        for (var i = 0; i < this._alwaysUpdateList.length; i++) {
            this._alwaysUpdateList[i].onUpdate(this._frameDeltaTime);
        }
    }
    clearAlwaysList() {
        this._alwaysUpdateList.splice(0, this._alwaysUpdateList.length);
    }
}
BaseInstrument.allInstrumentsLoaded = false;
BaseInstrument.useSvgImages = false;
class URLConfig {
}
var Quality;
(function (Quality) {
    Quality[Quality["ultra"] = 0] = "ultra";
    Quality[Quality["high"] = 1] = "high";
    Quality[Quality["medium"] = 2] = "medium";
    Quality[Quality["low"] = 3] = "low";
    Quality[Quality["hidden"] = 4] = "hidden";
    Quality[Quality["disabled"] = 5] = "disabled";
})(Quality || (Quality = {}));
var GameState;
(function (GameState) {
    GameState[GameState["mainmenu"] = 0] = "mainmenu";
    GameState[GameState["loading"] = 1] = "loading";
    GameState[GameState["briefing"] = 2] = "briefing";
    GameState[GameState["ingame"] = 3] = "ingame";
})(GameState || (GameState = {}));
class HighlightedElement {
}
class Updatable {
}
customElements.define("base-instrument", BaseInstrument);
checkAutoload();
//# sourceMappingURL=BaseInstrument.js.map