var Coherent;

function CreateCoherentBridge() {
    Coherent = this;
    window.engine = this;

    let m_sender = null;
    let m_callbacks = {};
    let m_lastCallbackId = 0;
    let m_toSend = [];
    let m_inflightCalls = {};

    const SerializeCallback = (callbackFn) => {
        m_callbacks[++m_lastCallbackId] = callbackFn;
        return { id: m_lastCallbackId };
    }

    const send = (toSend) => {
        /*
        if (m_sender) {
            m_sender.send(toSend);
        } else {
            m_toSend.push(toSend);
        }
        */
    };

    this.on = function (eventName, callback) {
      //  console.log("coherent.on " + eventName);
        return;
        send({
            c: 'c_o',
            a: [eventName, SerializeCallback(callback)]
        });
        // callback: _sender, _event
        //  console;.log("coherent.on " + eventName);
    }


    this.off = function (eventName, callback) {
    //    console.log("coherent.on " + eventName);
        return;
        send({
            c: 'c_o',
            a: [eventName, SerializeCallback(callback)]
        });
        // callback: _sender, _event
        //  console;.log("coherent.on " + eventName);
    }
    this.trigger = function () {
       // console.log("coherent.trigger " + arguments[0]);
       return;
        send({
            c: 'c_t',
            a: Array.prototype.slice.call(arguments)
        });
    };

    this.call = (...args) => {
          
          return new Promise((a, r) => {});

        const eventName = args[0];
        if (m_inflightCalls[eventName]) {
            return new Promise((a, r) => { });
        }
        
      //  console.log("coherent.call " + eventName);
        m_inflightCalls[eventName] = true;
        return m_sender.send({
            c: 'c_c',
            a: Array.prototype.slice.call(args)
        }).then((ret) => {
          //  console.log("coherent.call[" + eventName + "] " + JSON.stringify(ret));
            m_inflightCalls[eventName] = false;
            return ret;
        });
    };

    this.translate = (txt) => txt;

    this.GetSimVarArrayValues = function (simvars, callback) {
        return;
        // console.log("GetSimVarArrayValues " + simvars);
        
          send({
              c: 'gsa',
              a: [simvars, SerializeCallback(callback)]
          });
          // callback: _sender, _event
          //  console;.log("coherent.on " + eventName);
      }


    let onCallback = (msg) => {
        console.log("coherent.onCallback " + JSON.stringify(msg));
        m_callbacks[msg.id].apply(m_callbacks[msg.id], msg.args);
    };

    this.Initialize = function (sender, receiver) {
        m_sender = sender;
        receiver.on('msg', (data) => {
            try {
                var msg = JSON.parse(data);
                if (!msg) { return; }

                if (msg.cb) {
                    onCallback(msg);
                }
            } catch (ex) {
                return;
            }
        });
        console.log("create coherent bridge");

        m_toSend.forEach((m) => m_sender.send(m));
        m_toSend = [];

    }
}

Coherent = new CreateCoherentBridge();