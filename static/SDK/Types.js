class LatLong {
    constructor(data, long) {
        this.__Type = "LatLong";
        if (isFinite(data) && isFinite(long)) {
            this.lat = data;
            this.long = long;
            wrapLatLong(this);
        }
        else {
            Object.assign(this, data);
        }
    }
    toStringFloat() {
        return this.lat.toFixed(6) + ", " + this.long.toFixed(6);
    }
    toString() {
        return "lat " + this.lat.toFixed(2) + ", long " + this.long.toFixed(2);
    }
    static fromStringFloat(_str) {
        var lwrStr = _str.toLowerCase();
        var splits = lwrStr.split(",");
        if (splits.length >= 3) {
            var lat = parseFloat(splits[0]);
            var long = parseFloat(splits[1]);
            var alt = parseFloat(splits[2]);
            return new LatLongAlt(lat, long, alt);
        }
        else if (splits.length >= 2) {
            var lat = parseFloat(splits[0]);
            var long = parseFloat(splits[1]);
            return new LatLong(lat, long);
        }
        return null;
    }
    latToDegreeString() {
        let tmpLat = Math.min(90, Math.max(-90, this.lat));
        let ns = "N";
        if (tmpLat < 0) {
            ns = "S";
            tmpLat *= -1;
        }
        let latDegree = Math.floor(tmpLat);
        tmpLat -= latDegree;
        let latMinutes = Math.floor(tmpLat * 60);
        tmpLat -= latMinutes / 60;
        let latSeconds = Math.floor(tmpLat * 600);
        return latDegree.toString().padStart(2, "0") +
            latMinutes.toString().padStart(2, "0") + "." +
            latSeconds.toString() + ns;
    }
    longToDegreeString() {
        let tmpLong = this.long;
        while (tmpLong > 180) {
            tmpLong -= 360;
        }
        while (tmpLong < -180) {
            tmpLong += 360;
        }
        let we = "E";
        if (tmpLong < 0) {
            we = "W";
            tmpLong *= -1;
        }
        let longDegree = Math.floor(tmpLong);
        tmpLong -= longDegree;
        let longMinutes = Math.floor(tmpLong * 60);
        tmpLong -= longMinutes / 60;
        let longSeconds = Math.floor(tmpLong * 600);
        return longDegree.toString().padStart(3, "0") +
            longMinutes.toString().padStart(2, "0") + "." +
            longSeconds.toString() + we;
    }
    toDegreeString() {
        let tmpLat = Math.min(90, Math.max(-90, this.lat));
        let ns = "N";
        if (tmpLat < 0) {
            ns = "S";
            tmpLat *= -1;
        }
        let latDegree = Math.floor(tmpLat);
        tmpLat -= latDegree;
        let latMinutes = Math.floor(tmpLat * 60);
        tmpLat -= latMinutes / 60;
        let latSeconds = Math.floor(tmpLat * 600);
        let tmpLong = this.long;
        while (tmpLong > 180) {
            tmpLong -= 360;
        }
        while (tmpLong < -180) {
            tmpLong += 360;
        }
        let we = "E";
        if (tmpLong < 0) {
            we = "W";
            tmpLong *= -1;
        }
        let longDegree = Math.floor(tmpLong);
        tmpLong -= longDegree;
        let longMinutes = Math.floor(tmpLong * 60);
        tmpLong -= longMinutes / 60;
        let longSeconds = Math.floor(tmpLong * 600);
        return ns + latDegree.toString().padStart(2, "0") + "??" +
            latMinutes.toString().padStart(2, "0") + "." +
            latSeconds.toString() + " " +
            we + longDegree.toFixed(0).padStart(3, "0") + "??" +
            longMinutes.toString().padStart(2, "0") + "." +
            longSeconds.toString();
    }
    toShortDegreeString() {
        let tmpLat = Math.min(90, Math.max(-90, this.lat));
        let ns = "N";
        if (tmpLat < 0) {
            ns = "S";
            tmpLat *= -1;
        }
        let latDegree = Math.floor(tmpLat);
        tmpLat -= latDegree;
        let latMinutes = Math.floor(tmpLat * 60);
        tmpLat -= latMinutes / 60;
        let latSeconds = Math.floor(tmpLat * 600);
        let tmpLong = this.long;
        while (tmpLong > 180) {
            tmpLong -= 360;
        }
        while (tmpLong < -180) {
            tmpLong += 360;
        }
        let we = "E";
        if (tmpLong < 0) {
            we = "W";
            tmpLong *= -1;
        }
        let longDegree = Math.floor(tmpLong);
        tmpLong -= longDegree;
        let longMinutes = Math.floor(tmpLong * 60);
        tmpLong -= longMinutes / 60;
        let longSeconds = Math.floor(tmpLong * 600);
        return latDegree.toString().padStart(2, "0") +
            latMinutes.toString().padStart(2, "0") + "." +
            latSeconds.toString() + ns +
            longDegree.toFixed(0).padStart(3, "0") +
            longMinutes.toString().padStart(2, "0") + "." +
            longSeconds.toString() + we;
    }
}
class LatLongAlt {
    constructor(data, long, alt) {
        this.alt = 0;
        this.__Type = "LatLongAlt";
        if (isFinite(data) && isFinite(long)) {
            this.lat = data;
            this.long = long;
            if (isFinite(alt)) {
                this.alt = alt;
            }
            wrapLatLong(this);
        }
        else {
            Object.assign(this, data);
        }
    }
    toLatLong() {
        return new LatLong(this.lat, this.long);
    }
    toStringFloat() {
        var res = this.lat.toFixed(6) + ", " + this.long.toFixed(6) + ", ";
        if (isFinite(this.alt))
            res += this.alt.toFixed(1);
        else
            res += "NaN";
        return res;
    }
    toString() {
        var res = "lat " + this.lat.toFixed(2) + ", long " + this.long.toFixed(2) + ", alt ";
        if (isFinite(this.alt))
            res += this.alt.toFixed(2);
        else
            res += "NaN";
        return res;
    }
    latToDegreeString() {
        let tmpLat = Math.min(90, Math.max(-90, this.lat));
        let ns = "N";
        if (tmpLat < 0) {
            ns = "S";
            tmpLat *= -1;
        }
        let latDegree = Math.floor(tmpLat);
        tmpLat -= latDegree;
        let latMinutes = Math.floor(tmpLat * 60);
        tmpLat -= latMinutes / 60;
        let latSeconds = Math.floor(tmpLat * 600);
        return latDegree.toString().padStart(2, "0") +
            latMinutes.toString().padStart(2, "0") + "." +
            latSeconds.toString() + ns;
    }
    longToDegreeString() {
        let tmpLong = this.long;
        while (tmpLong > 180) {
            tmpLong -= 360;
        }
        while (tmpLong < -180) {
            tmpLong += 360;
        }
        let we = "E";
        if (tmpLong < 0) {
            we = "W";
            tmpLong *= -1;
        }
        let longDegree = Math.floor(tmpLong);
        tmpLong -= longDegree;
        let longMinutes = Math.floor(tmpLong * 60);
        tmpLong -= longMinutes / 60;
        let longSeconds = Math.floor(tmpLong * 600);
        return longDegree.toString().padStart(3, "0") +
            longMinutes.toString().padStart(2, "0") + "." +
            longSeconds.toString() + we;
    }
    toDegreeString() {
        let tmpLat = Math.min(90, Math.max(-90, this.lat));
        let ns = "N";
        if (tmpLat < 0) {
            ns = "S";
            tmpLat *= -1;
        }
        let latDegree = Math.floor(tmpLat);
        tmpLat -= latDegree;
        let latMinutes = Math.floor(tmpLat * 60);
        tmpLat -= latMinutes / 60;
        let latSeconds = Math.floor(tmpLat * 600);
        let tmpLong = this.long;
        while (tmpLong > 180) {
            tmpLong -= 360;
        }
        while (tmpLong < -180) {
            tmpLong += 360;
        }
        let we = "E";
        if (tmpLong < 0) {
            we = "W";
            tmpLong *= -1;
        }
        let longDegree = Math.floor(tmpLong);
        tmpLong -= longDegree;
        let longMinutes = Math.floor(tmpLong * 60);
        tmpLong -= longMinutes / 60;
        let longSeconds = Math.floor(tmpLong * 600);
        return ns + latDegree.toString().padStart(2, "0") + "??" +
            latMinutes.toString().padStart(2, "0") + "." +
            latSeconds.toString() + " " +
            we + longDegree.toFixed(0).padStart(3, "0") + "??" +
            longMinutes.toString().padStart(2, "0") + "." +
            longSeconds.toString();
    }
}
function wrapLatLong(_latLong) {
    if (_latLong.long > 180 || _latLong.long < -180) {
        let old = _latLong.long;
        while (_latLong.long > 180 || _latLong.long < -180) {
            if (_latLong.long > 180)
                _latLong.long = 360 - _latLong.long;
            if (_latLong.long < -180)
                _latLong.long = -360 - _latLong.long;
        }
        console.warn("Longitude wrapped from " + old + " to " + _latLong.long);
    }
    if (_latLong.lat > 90 || _latLong.lat < -90) {
        let old = _latLong.lat;
        while (_latLong.lat > 90 || _latLong.lat < -90) {
            if (_latLong.lat > 90)
                _latLong.lat = 180 - _latLong.lat;
            if (_latLong.lat < -90)
                _latLong.lat = -180 - _latLong.lat;
        }
        console.warn("Latitude wrapped from " + old + " to " + _latLong.lat);
    }
}
class PitchBankHeading {
    constructor(data) {
        this.__Type = "PitchBankHeading";
        Object.assign(this, data);
    }
    toString() {
        return "p " + this.pitchDegree.toFixed(2) + ", b " + this.bankDegree.toFixed(2) + ", h " + this.headingDegree.toFixed(2);
    }
}
class LatLongAltPBH {
    constructor(data) {
        this.__Type = "LatLongAltPBH";
        this.lla = new LatLongAlt(data.lla);
        this.pbh = new PitchBankHeading(data.pbh);
    }
    toString() {
        return "lla " + this.lla.toString() + ", pbh " + this.pbh.toString();
    }
}
class PID_STRUCT {
    constructor(data) {
        Object.assign(this, data);
    }
    toString() {
        return "pid_p " + this.pid_p.toFixed(2)
            + ", pid_i " + this.pid_i.toFixed(2)
            + ", pid_i2 " + this.pid_i2.toFixed(2)
            + ", pid_d " + this.pid_d.toFixed(2)
            + ", i_boundary " + this.i_boundary.toFixed(2)
            + ", i2_boundary " + this.i2_boundary.toFixed(2)
            + ", d_boundary " + this.d_boundary.toFixed(2);
    }
}
class XYZ {
    constructor(data) {
        this.__Type = "XYZ";
        Object.assign(this, data);
    }
    toString() {
        return "x " + this.x.toFixed(2) + ", y " + this.y.toFixed(2) + ", z " + this.z.toFixed(2);
    }
}
class DataDictionaryEntry {
    constructor(data) {
        this.__Type = "DataDictionaryEntry";
        Object.assign(this, data);
    }
    toString() {
        return "key: " + this.key + ", data: " + this.data;
    }
}
class POIInfo {
    constructor(data) {
        this.__Type = "POIInfo";
        Object.assign(this, data);
    }
    toString() {
        return "Distance: " + this.distance + ", angle: " + this.angle + ", selected: " + this.isSelected;
    }
}
;
class KeyActionParams {
    constructor(json = null) {
        this.bReversed = false;
        if (json) {
            Object.assign(this, JSON.parse(json));
        }
    }
}
KeyActionParams.sKeyDelimiter = "|";
class Simvar {
    constructor() {
        this.__Type = "Simvar";
    }
}
class Attribute {
    constructor() {
        this.__Type = "Attribute";
    }
}
//# sourceMappingURL=Types.js.map