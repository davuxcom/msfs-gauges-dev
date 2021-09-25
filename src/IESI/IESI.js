import '@/css/global.scss'
import './IESI.scss'

import { BaseInstrumentEx } from '@/lib/BaseInstrumentEx';

export class HX2_IESI extends BaseInstrumentEx {
  get templateID() { return "HX2_IESI"; }

  isElectricityAvailable() {
    // Add a correct circuit check for when inside the sim.
    return SimVar.GetSimVarValue("CIRCUIT ON:" + 1, "Bool") || window.VCockpitExternal;
  }

  onInteractionEvent(args) {
    let name = args[0];
    console.log("onInteractionEvent: " + name);
  }

  Connected() {
    console.log("hello world");
  }
  
  Update() {
    super.Update();

    this.setText("time_div", new Date());
  }
}

registerInstrument("hx2-instrument", HX2_IESI);