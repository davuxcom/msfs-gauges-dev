var VCockpitExternal;

function CreateVCockpitExternal() {
  VCockpitExternal = this;

  function installShims() {
    // BUG: fastToFixed returns .-07 in Chrome, but not Coherent.
    function normalToFixed(num, p) { return num.toFixed(p); }
    window.fastToFixed = normalToFixed;

    // Needed to mock this thing.
    window.top["g_nameZObject"] = {
      GetNameZ: function(inputStr) {
        return {"__Type":"Name_Z",
        "idLow":1737084232,
        "idHigh":3154515155,
        "str":"13548539427198455112"}
      }
    };

    BaseInstrument.allInstrumentsLoaded = true;
    SimVar.IsReady = SimVarBridge.IsReady;  
  }

  function CreatePanel() {
    var vpanel = document.createElement('vcockpit-panel');
    vpanel.setAttribute('id', 'panel');
    document.getElementById('main_panel').appendChild(vpanel);
  }

  setTimeout(()=> {
  let qs = new URLSearchParams(window.location.search);
  let width = qs.get("width");
  let height = qs.get("height");
    var allInstruments = [{
      sUrl: "../" + qs.get("name") + ".html?index=" + qs.get("index"),
      iGUId: "1",
      vPosAndSize: { x: 0, y: 0, w: height, z: width },
    }];

    let selectedId = 0;
    let selectedInstrument = allInstruments[selectedId];
    selectedInstrument.pixel_size_x = selectedInstrument.vPosAndSize.x;
    selectedInstrument.pixel_size_y = selectedInstrument.vPosAndSize.y;
    selectedInstrument.size_mm_x = selectedInstrument.vPosAndSize.x;
    selectedInstrument.size_mm_y = selectedInstrument.vPosAndSize.y;
    if (!selectedInstrument) {
      alert("Id is not valid");
    }

    window.globalPanelData = {
      sName: "HX2-sName",
      vDisplaySize: { x: selectedInstrument.pixel_size_x, y: selectedInstrument.pixel_size_y },
      vLogicalSize: { x: selectedInstrument.size_mm_x, y: selectedInstrument.size_mm_y },
      sConfigFile: "/foo/bar/panel.cfg",
      daInstruments: [selectedInstrument],
      daAttributes: [],
    };

    installShims();
    CreatePanel();
  }, 1000);
}
VCockpitExternal = new CreateVCockpitExternal();