var SimVarBridge;

function CreateSimVarBridge() {
    let ALL = {};
    let keys_list = [];
    let keys_data = [];
    let ws = null;

    this.AllData = ALL;

    function doSend(data) {
        if (!ws || ws.readyState != 1) return;

        try {
            ws.send(JSON.stringify(data));
        } catch (ex) {
            console.log("WS: Send failed: " + ex);
        }
    }

    function doConnect() {
        ws = new WebSocket("ws://" + window.location.host + "/ws");
        ws.onopen = () => {
            console.log("WS: Connected");
            doSend({type:"hello", values: keys_data});
        };
        ws.onmessage = (msgEvent) => {
            let msg = JSON.parse(msgEvent.data);
            if (msg.type === "data")
            {
                for (var v in msg.values) {
                    var v = msg.values[v];

                 //   if (v.name.includes("BRIDGE")) {
                  //      if (ALL[v.name] !== v.value)
                 //           console.log(v.name + ": " + v.value);
                 //   }

                    ALL[v.name] = v.value;
                }
            } else {
                console.log("WS: Unknown message: " + msg.type);
            }
        };
        ws.onclose = () => {
            console.log("WS: Disconnected. Reconnecting in 10 seconds...");
            setTimeout(doConnect, 10 * 1000);
        };
    }
    
    function AdviseSimVar(name, unit) {
        var key = name + "#" + unit;
        if (!keys_list.includes(key)) {
            keys_data.push({name, unit});
            keys_list.push(key);

            doSend({type:"read", values: [ {name, unit} ]});
        }
    }
    
    function GetSimVarValue(name, unit, dataSource = "") 
    {
        name = SanitizeName(name);
        unit = SanitizeUnit(unit);

        AdviseSimVar(name, unit);

       // console.log("SimVar.Get: " + name);

        switch (unit.toLowerCase()) {
            case "latlonalt":
            case "latlonaltpbh":
            case "pbh":
            case "pid_struct":
            case "xyz":
                console.log("### GetSimVarValue datatype ERR: " + name)
                break;
        }

        if (name.startsWith("C:")) {
         //   return fs9gps.GetSimVarValue(name, unit);
        } else if (name in ALL) {
            if (unit == "bool") {
                return !!(ALL[name]);
            }
            return ALL[name];
        }
        return 0;
    }

    function SetSimVarValue(name, unit, value, dataSource = "") {
        name = SanitizeName(name);
        unit = SanitizeUnit(unit);

        if (name.startsWith("C:")) {
          //  return fs9gps.SetSimVarValue(name, unit, value);
        } else {
            if (!name.startsWith("K:")) {
                // Keys aren't read and need to be sent immediately
                ALL[name] = value;

                if (name == "L:ROTOR_MODE") {
                    console.log('wtf');
                }
            }
            doSend({type:"write", values: [ {name, unit, value: value} ]});
        }


        return new Promise(function (resolve, reject) { resolve(); });
    }

    function SanitizeName(name) {
        name = name.toUpperCase();
        if (name.startsWith("A:")) {
            name = name.substring(2);
        }
        return name;
    }

    function SanitizeUnit(unit) {
        unit = unit.toLowerCase();
        if (unit.toLowerCase() === "boolean")
        {
            unit = "bool";
        }
        return unit;
    }

    function GetGameVarValue(name, unit, param1 = 0, param2 = 0) {
        name = SanitizeName(name);
        unit = SanitizeUnit(unit);

        if (!name && unit === "glasscockpitsettings") {
            return {
                AirSpeed: {
                    Initialized: true,
                    ...VCockpitExternal.cockpitCfg
                },
                FlapsLevels: {
                    initialised: false,
                }
            };
        }

        // Need to plumb this through
        if (name == "AIRCRAFT FLAPS HANDLE ANGLE") {
            return param2 * 10;
        }
        else if (name == "FLIGHT NAVDATA DATE RANGE") {
            return ""; // from sim debug.
        }
/*
        for (let gameVar of InGameRelay.GameVars) {
            if (gameVar[0] == name && gameVar[1] == unit) {
                if (Array.isArray(gameVar[2])) {
                    var ret = {};
                    for (var key of gameVar[2]) {
                        ret[key] = SimVarBridge.GetSimVarValue("L:GV_" + name + "_" + unit + "_" + key, "Number");
                    }
                    return ret;
                } else {
                    return SimVarBridge.GetSimVarValue("L:GV_" + name + "_" + unit, "Number");
                }
            }
        }

        // Fix by adding to the list in InGameRelay.
        console.log('### GetGameVarValue: ' + name + ' ' + unit);
        */
        return 0;
    }

    function GetGlobalVarValue(name, unit) {
        name = SanitizeName(name);
        unit = SanitizeUnit(unit);
        return GetSimVarValue(name, unit);

        /*
        for (let gameVar of InGameRelay.GlobalVars) {
            if (gameVar[0] == name && gameVar[1] == unit) {
                return SimVarBridge.GetSimVarValue("L:GLOB_" + name + "_" + unit, "Number");
            }
        }
        */

        // Fix by adding to the list in InGameRelay.
        console.log('### GetGlobalVarValue: ' + name + " unit=" + unit);
        return null;
    }

    function SetGameVarValue(name, unit, value) {
        console.log('### SetGameVarValue: ' + name);
        return new Promise(function (resolve, reject) {
            resolve();
        });
    }

    function GetSimVarArrayValues(simvars, callback, dataSource = "") {
        return fs9gps.GetSimVarArrayValues(simvars, callback);
    }
    

    this.GetSimVarValue = GetSimVarValue;
    this.SetSimVarValue = SetSimVarValue;
    this.GetGameVarValue = GetGameVarValue;
    this.GetGlobalVarValue = GetGlobalVarValue;
    this.SetGameVarValue = SetGameVarValue;
    this.GetSimVarArrayValues = GetSimVarArrayValues;
    this.IsReady = function() { return false; }

    // Using only shared features from InGameRelay, prevent the relay from starting.
  //  InGameRelay.IsRunningExternally = true;
   // setTimeout(doConnect, 0);
}

SimVarBridge = new CreateSimVarBridge();