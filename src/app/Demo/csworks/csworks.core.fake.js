(function($, undefined) {
    $.csworks_core = {};

    // DataItem
    function DataItem(id, dataSourceName, templateName, templateParameterString) {
        // Public attributes
        this.value = ko.observable("?");
        this.status = ko.observable(0);
        this.hasFocus = ko.observable(false); // this is not good: focus is a pure UI trait, not viewmodel's. But there is no other good way to do that.

        // Immutable/internal attributes
        this.m_dataManager = null; //Assigned by LiveDataManager::addDataItem()
        this.m_id = id;
        this.m_dataSourceName = dataSourceName;
        this.m_templateName = templateName;
        this.m_templateParameters = new Array(); // array of "key"/"value" pairs
        // TODO: support ; and = escaping
        var pairs = templateParameterString.split(";");
        for (pairIdx = 0; pairIdx < pairs.length; pairIdx++) {
            var pair = pairs[pairIdx].split("=");
            if (pair.length > 1) // Not empty pair?
            {
                this.m_templateParameters.push({ key: pair[0], value: pair[1] });
            }
        }
        this.m_subscriberControls = new Array();
    }
    DataItem.prototype = {
        normalizeValue: function(value) {
            return value;
        },

        // Called by LiveDataManager on updates and from app code if needed
        updateValue: function(value) {
            this.value(this.normalizeValue(value));
            //console.log("Normalized " + value + " to " + this.value());
        },

        // Called by LiveDataManager on updates and from app code if needed
        updateStatus: function(status) {
            this.status(status);
        },

        // Called by BaseCtrl::notifyWritableDataItems() or from the app code
        writeValue: function(value) {
            this.value(this.normalizeValue(value));
            if (this.m_dataManager != null) {
                this.m_dataManager.onDataItemWritten(this);
            }
        },

    };

    function FloatDataItem(id, dataSourceName, templateName, templateParameterString, precision) {
        this.value = ko.observable(0.0);
        this.m_precision = precision;
        return DataItem.call(this, id, dataSourceName, templateName, templateParameterString);
    };
    $.extend(FloatDataItem.prototype, DataItem.prototype, {
        normalizeValue: function(value) {
            return parseFloat(parseFloat(value.toString()).toFixed(this.m_precision != null ? this.m_precision : 0));
        }
    });
    $.csworks_core.FloatDataItem = FloatDataItem;

    function IntDataItem(id, dataSourceName, templateName, templateParameterString) {
        this.value = ko.observable(0);
        return DataItem.call(this, id, dataSourceName, templateName, templateParameterString);
    };
    $.extend(IntDataItem.prototype, DataItem.prototype, {
        normalizeValue: function(value) {
            return parseInt(value.toString());
        }
    });
    $.csworks_core.IntDataItem = IntDataItem;

    function BoolDataItem(id, dataSourceName, templateName, templateParameterString) {
        this.value = ko.observable(false);
        return DataItem.call(this, id, dataSourceName, templateName, templateParameterString);
    };
    $.extend(BoolDataItem.prototype, DataItem.prototype, {
        normalizeValue: function(value) {
            return value.toString().toLowerCase() == "true";
        }
    });
    $.csworks_core.BoolDataItem = BoolDataItem;

    function StringDataItem(id, dataSourceName, templateName, templateParameterString) {
        this.value = ko.observable("");
        return DataItem.call(this, id, dataSourceName, templateName, templateParameterString);
    };
    $.extend(StringDataItem.prototype, DataItem.prototype, {
        normalizeValue: function(value) {
            return value.toString();
        }
    });
    $.csworks_core.StringDataItem = StringDataItem;

    // GuidGen
    function NewGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // LiveDataManager
    function LiveDataManager(batchId, interval, subscriptionLifeSpan, serviceUrl, updateHandler, errorHandler) {
        this.m_batchId = batchId; // guid
        this.m_interval = 1000; // simulation, ms
        this.m_subscriptionLifeSpan = subscriptionLifeSpan; // ms
        this.m_serviceUrl = serviceUrl; // pointer to LiveData service ../CSWorksRest/LiveData
        this.m_updateHandler = updateHandler; // caller-provided function updateHandler(responseItems)
        this.m_errorHandler = errorHandler; // caller-provided function errorHandler(msg, httpStatus)

        // simulation
        this.m_mixingPhaseTitles = {};
        this.m_mixingPhaseTitles[0] = "Waiting for both lines";
        this.m_mixingPhaseTitles[1] = "Filling";
        this.m_mixingPhaseTitles[2] = "Mixing (slow)";
        this.m_mixingPhaseTitles[3] = "Mixing (fast)";
        this.m_mixingPhaseTitles[4] = "Draining";
        this.m_mixingPhaseTitles[5] = "Unknown";

        this.m_startMixing = new Date();
        this.m_tagMap = {};
        this.m_forceOverwrite = false;

        this.initLadderLogic();

        return this;
    }

    LiveDataManager.prototype = {
        m_dataItems: new Array(),
        m_timer: null,
        m_checkPoints: null,


        addDataItem: function(dataItem) {
            this.m_dataItems.push(dataItem);
            dataItem.m_dataManager = this; // callback for write events
        },

        start: function() {
            this.m_clientId = NewGuid(); // session guid
            this.m_checkPoints = null;
            var self = this;
            this.m_timer = setInterval(function() { self.getLiveData(); }, this.m_interval);
        },

        stop: function() {
            clearInterval(this.m_timer);
        },

        clearDataItems: function() {
            this.m_dataItems = newArray();
        },

        getLiveData: function() {
            // simulation
            this.onLiveDataSuccess(this.doLadderLogic(), "OK");
        },

        typedValueToValue: function(typedValue) {
            switch (typedValue.TypeCode) {
                case 0:
                case 2:
                    return null;
                case 3:
                    return typedValue.BoolValue;
                case 5:
                case 7:
                case 9:
                    return typedValue.Int32Value;
                case 6:
                case 8:
                case 10:
                    return typedValue.UInt32Value;
                case 11:
                    return typedValue.Int64Value;
                case 12:
                    return typedValue.UInt64Value;
                case 13:
                case 14:
                    return typedValue.DoubleValue;
                case 18:
                    return typedValue.StringValue;
                default:
                    return null;
            }
        },

        onLiveDataSuccess: function(data, httpStatus) {
            if (data.Status == 2) {
                // Re-send definitions
                this.m_checkPoints = null;
            } else if (data.Status == 0) {
                this.m_checkPoints = data.CheckPoints;
                if (data.Status == 0 && data.ResponseItems.length > 0) {
                    for (riIdx = 0; riIdx < data.ResponseItems.length; riIdx++) {
                        var responseItem = data.ResponseItems[riIdx];

                        // Find correspondent data item
                        for (diIdx = 0; diIdx < this.m_dataItems.length; diIdx++) {
                            if (this.m_dataItems[diIdx].m_id == responseItem.Id) {
                                if (responseItem.ItemStatus == 1 || responseItem.ItemStatus == 3) // good or goodwitherror
                                {
                                    if (responseItem.Value != null) {
                                        this.m_dataItems[diIdx].updateValue(this.typedValueToValue(responseItem.Value));
                                    }
                                }
                                this.m_dataItems[diIdx].updateStatus(responseItem.ItemStatus);
                                break;
                            }
                        } //for di
                    } // for ri
                } // if any response items
                this.m_updateHandler(data.ResponseItems);
            } // if good status
            else {
                if (this.m_errorHandler != null) {
                    this.m_errorHandler("Cannot get live data, status:" + this.responseStatusToString(data.Status), httpStatus);
                }
            }
        },

        responseStatusToString: function(status) {
            switch (status) {
                case 0:
                    return "Success";
                    break;
                case 1:
                    return "Not configured";
                    break;
                case 2:
                    return "Re-send item definitions";
                    break;
                case 3:
                    return "Configuration failure";
                    break;
                case 4:
                    return "Communication failure";
                    break;
                case 5:
                    return "Operation failure";
                    break;
                case 6:
                    return "Access denied";
                    break;
                default:
                    return "Unknown";
            }
        },

        onLiveDataError: function(httpStatus) {
            if (this.m_errorHandler != null) {
                this.m_errorHandler(null, httpStatus);
            }
        },

        onDataItemWritten: function(dataItem) {
            var tagPath = "";
            if (dataItem.m_id == "123867dd-56e8-42b4-abc8-d561d75073f3") {
                tagPath = "storage.bool.reg05";
            } else if (dataItem.m_id == "dcd3a543-fac1-4a80-811c-427ecb2de163") {
                tagPath = "storage.bool.reg06";
            } else if (dataItem.m_id == "9162a414-b6e2-4818-b19b-cc762bce7d28") {
                tagPath = "storage.bool.reg07";
            } else if (dataItem.m_id == "df9de481-56bc-44d6-a7e2-dbdc254a1b72") {
                tagPath = "storage.bool.reg08";
            } else if (dataItem.m_id == "3d72740c-a1fb-4b80-a628-caa1ae15bbe3") {
                tagPath = "storage.numeric.reg06";
            }

            var timestampString = "/Date(" + (new Date().getTime()).toString() + ")/";
            if (tagPath.indexOf("storage.bool") == 0) {
                this.m_tagMap[tagPath] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: dataItem.value() }, Timestamp: timestampString };
            } else if (tagPath.indexOf("storage.numeric") == 0) {
                this.m_tagMap[tagPath] = { Id: "", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: dataItem.value() }, Timestamp: timestampString };
            }
        },

        onWriteSuccess: function(data, httpStatus) {
            // TODO: read immediately to update the appearance with the actual value.
            // We need the for two reasons:
            // - what if something went wrong with the write;
            // - we don't want to wait for the next periodic update (interval may be long).

            // TODO: notify calling app
        },

        onWriteError: function(data, httpStatus) {
            // TODO: notify calling app
        },


        initLadderLogic: function() {
            var timestampString = "/Date(" + (new Date().getTime()).toString() + ")/";
            this.m_tagMap["storage.bool.reg01"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg02"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg03"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg04"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };

            this.m_tagMap["storage.numeric.reg01"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: 50.0 }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg02"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: 50.0 }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg03"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: 50.0 }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg04"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: 50.0 }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg05"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: true }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg06"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: true }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg07"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: true }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg08"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: true }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg09"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg10"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg11"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg12"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg13"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg14"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg15"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg16"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg17"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg18"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };

            this.m_tagMap["storage.numeric.reg05"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: 0.0 }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg06"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: 0.0 }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg07"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: 0.0 }, Timestamp: timestampString };
            this.m_tagMap["storage.string.reg01"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 18, StringValue: "Unknown" }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg19"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg20"] = { Id: "", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: false }, Timestamp: timestampString };
        },

        doLadderLogic: function() {
            var valves;
            var tanks;
            var autoValves;
            var mixingFill;
            var mixingSpeed;
            var mixingPhase;
            var drainAutoValve;

            valves = [
                this.m_tagMap["storage.bool.reg05"].Value.BoolValue,
                this.m_tagMap["storage.bool.reg06"].Value.BoolValue,
                this.m_tagMap["storage.bool.reg07"].Value.BoolValue,
                this.m_tagMap["storage.bool.reg08"].Value.BoolValue
            ];

            tanks = [
                this.m_tagMap["storage.numeric.reg01"].Value.DoubleValue,
                this.m_tagMap["storage.numeric.reg02"].Value.DoubleValue,
                this.m_tagMap["storage.numeric.reg03"].Value.DoubleValue,
                this.m_tagMap["storage.numeric.reg04"].Value.DoubleValue
            ];

            autoValves = [
                this.m_tagMap["storage.bool.reg15"].Value.BoolValue,
                this.m_tagMap["storage.bool.reg16"].Value.BoolValue
            ];

            mixingFill = this.m_tagMap["storage.numeric.reg05"].Value.DoubleValue;
            mixingSpeed = this.m_tagMap["storage.numeric.reg06"].Value.DoubleValue;
            mixingPhase = this.m_tagMap["storage.numeric.reg07"].Value.DoubleValue;
            drainAutoValve = this.m_tagMap["storage.bool.reg19"].Value.BoolValue;

            // Intakes
            intakes = [false, false, false, false];
            for (var tankIdx = 0; tankIdx < intakes.length; tankIdx++) {
                intakes[tankIdx] = (tanks[tankIdx] < 100);
            }

            // Tanks
            for (var tankIdx = 0; tankIdx < tanks.length; tankIdx++) {
                if (intakes[tankIdx]) {
                    tanks[tankIdx] += 1;

                    if (tanks[tankIdx] > 100) {
                        tanks[tankIdx] = 100.0;
                    }
                }

                if (valves[tankIdx] && autoValves[Math.floor(tankIdx / 2)]) {
                    tanks[tankIdx] -= 2.0;
                    if (tanks[tankIdx] < 0) {
                        tanks[tankIdx] = 0.0;
                    }
                }
            }

            // Valve fills
            var valveFills = [false, false, false, false];
            var autoValveFills = [false, false];
            for (var tankIdx = 0; tankIdx < tanks.length; tankIdx++) {
                valveFills[tankIdx] = (tanks[tankIdx] > 0 && valves[tankIdx]);
            }

            // Lines
            var lines = [false, false];
            for (var lineIdx = 0; lineIdx < lines.length; lineIdx++) {
                if (lineIdx == 0) {
                    lines[lineIdx] = (valves[0] && valveFills[0] || valves[1] && valveFills[1]);
                } else {
                    lines[lineIdx] = (valves[2] && valveFills[2] || valves[3] && valveFills[3]);
                }
            }

            // Auto valves cutoff
            if (!lines[0] && !lines[1]) {
                autoValves[0] = autoValves[1] = false;
            }

            // Auto valve fills
            for (var lineIdx = 0; lineIdx < lines.length; lineIdx++) {
                autoValveFills[lineIdx] = (autoValves[lineIdx] && lines[lineIdx]);
            }

            // Mixer
            switch (mixingPhase) {
                case 0: //Waiting:
                    if (lines[0] && lines[1]) {
                        mixingPhase = 1; //Filling;
                    }
                    break;

                case 1: //Filling:
                    if (lines[0] && lines[1]) {
                        autoValves[0] = autoValves[1] = true;
                        mixingFill += 2;
                    } else {
                        autoValveFills[0] = autoValveFills[1] = false;
                    }

                    if (mixingFill >= 100) {
                        autoValves[0] = autoValves[1] = false;
                        mixingPhase = 2; //MixingSlow;
                        mixingSpeed = 9 + parseFloat((Math.random() * 2).toFixed(2));
                        this.m_startMixing = new Date();
                    } else {
                        if (!autoValveFills[0] || !autoValveFills[1]) {
                            mixingPhase = 0; //Waiting;
                        }
                    }
                    break;

                case 2: //MixingSlow:
                    var now = new Date();
                    if (now.getTime() - this.m_startMixing.getTime() >= 1000 * 10) {
                        mixingPhase = 3; //MixingFast;
                        mixingSpeed = (78 + parseFloat(Math.random() * 4).toFixed(2));
                        this.m_startMixing = new Date();
                    }
                    break;

                case 3: //MixingFast:
                    var now = new Date();
                    if (now.getTime() - this.m_startMixing.getTime() >= 1000 * 10) {
                        mixingPhase = 4; //Draining;
                        mixingSpeed = 0;
                    }
                    break;

                case 4: //Draining:
                    if (mixingFill > 0) {
                        mixingFill -= 2;
                        if (mixingFill < 0) {
                            mixingFill = 0;
                        }

                        drainAutoValve = (mixingFill > 0);
                    } else {
                        mixingPhase = 0; //Waiting;
                        drainAutoValve = false;
                    }
                    break;

                default:
                    // Nothing
                    //TraceUtil.Warning("Unknown mixing phase {0}", (int)mixingPhase);
                    break;
            }

            var drainFill = drainAutoValve;

            var mixingPhaseTitle = this.m_mixingPhaseTitles[Math.round(mixingPhase)];

            // Pump speeds
            var leftPumpSpeed = (autoValves[0] && lines[0] ? 120 + parseFloat((40 * Math.random()).toFixed(2)) : 0);
            var rightPumpSpeed = (autoValves[0] && lines[1] ? 120 + parseFloat((40 * Math.random()).toFixed(2)) : 0);
            var drainPumpSpeed = (drainFill ? 40 + parseFloat((20 * Math.random()).toFixed(2)) : 0);

            var data = new Object();
            data.Status = 0;
            data.CheckPoints = null;
            data.ResponseItems = [];
            var itemIdx = 0;
            var timestampString = "/Date(" + (new Date().getTime()).toString() + ")/";

            this.m_tagMap["storage.bool.reg01"] = data.ResponseItems[itemIdx++] = { Id: "a00d357f-bcaa-4041-b637-11dd925fbc5f", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: intakes[0] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg02"] = data.ResponseItems[itemIdx++] = { Id: "1b07f19c-6bb3-48ff-a137-592714294461", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: intakes[1] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg03"] = data.ResponseItems[itemIdx++] = { Id: "8f0f16d9-c7f8-4113-b019-a0d44a8822d0", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: intakes[2] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg04"] = data.ResponseItems[itemIdx++] = { Id: "da394ce8-3dc2-472f-b16e-2616d5979900", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: intakes[3] }, Timestamp: timestampString };

            this.m_tagMap["storage.numeric.reg01"] = data.ResponseItems[itemIdx++] = { Id: "c29119d3-5e8b-4d72-b886-4dfc970debb0", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: tanks[0] }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg02"] = data.ResponseItems[itemIdx++] = { Id: "7f536f9f-03fd-443b-939f-d3b1abbb1853", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: tanks[1] }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg03"] = data.ResponseItems[itemIdx++] = { Id: "452cf714-2c37-4361-888f-5c8cb0b20f1d", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: tanks[2] }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg04"] = data.ResponseItems[itemIdx++] = { Id: "a7413a09-b863-4750-a174-775091dc646a", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: tanks[3] }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg05"] = data.ResponseItems[itemIdx++] = { Id: "123867dd-56e8-42b4-abc8-d561d75073f3", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: valves[0] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg06"] = data.ResponseItems[itemIdx++] = { Id: "dcd3a543-fac1-4a80-811c-427ecb2de163", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: valves[1] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg07"] = data.ResponseItems[itemIdx++] = { Id: "9162a414-b6e2-4818-b19b-cc762bce7d28", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: valves[2] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg08"] = data.ResponseItems[itemIdx++] = { Id: "df9de481-56bc-44d6-a7e2-dbdc254a1b72", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: valves[3] }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg09"] = data.ResponseItems[itemIdx++] = { Id: "a90496ba-3191-40e9-b50f-dd3e37a43c90", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: valveFills[0] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg10"] = data.ResponseItems[itemIdx++] = { Id: "f13cd4c7-296a-4791-9fbf-2fb7d291ea56", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: valveFills[1] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg11"] = data.ResponseItems[itemIdx++] = { Id: "09325242-0877-4cb7-a186-bc193fc3cfc7", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: valveFills[2] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg12"] = data.ResponseItems[itemIdx++] = { Id: "e3e6cb78-1bb5-40ad-bdda-5ff6a361d390", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: valveFills[3] }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg13"] = data.ResponseItems[itemIdx++] = { Id: "441062d0-089b-4d49-8a15-6e3d28479567", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: lines[0] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg14"] = data.ResponseItems[itemIdx++] = { Id: "3cd0d353-021d-4ed3-a377-7013a0dd94a1", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: lines[1] }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg15"] = data.ResponseItems[itemIdx++] = { Id: "bce44eb6-f18c-4aaa-abdc-31cb0ff06af1", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: autoValves[0] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg16"] = data.ResponseItems[itemIdx++] = { Id: "7ce13f51-d6ce-44ef-a03b-9ee5859ae40e", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: autoValves[1] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg17"] = data.ResponseItems[itemIdx++] = { Id: "0a893c4b-7b91-4706-a0a5-d343bfd8e40b", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: autoValveFills[0] }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg18"] = data.ResponseItems[itemIdx++] = { Id: "435de601-e389-4b13-80b0-03bd15421fda", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: autoValveFills[1] }, Timestamp: timestampString };

            this.m_tagMap["storage.numeric.reg05"] = data.ResponseItems[itemIdx++] = { Id: "fa689180-c686-45f9-bc5f-04a98faabed9", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: mixingFill }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg06"] = data.ResponseItems[itemIdx++] = { Id: "3d72740c-a1fb-4b80-a628-caa1ae15bbe3", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: mixingSpeed }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg07"] = data.ResponseItems[itemIdx++] = { Id: "63e9a601-30f9-448f-b284-2fd4faa278e0", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: mixingPhase }, Timestamp: timestampString };
            this.m_tagMap["storage.string.reg01"] = data.ResponseItems[itemIdx++] = { Id: "60b66445-b047-42bd-b498-3bad6dbb9d59", ItemStatus: 1, Value: { TypeCode: 18, StringValue: mixingPhaseTitle }, Timestamp: timestampString };

            this.m_tagMap["storage.numeric.reg08"] = data.ResponseItems[itemIdx++] = { Id: "593fcbbc-b4c9-43cb-a37b-44751720f188", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: leftPumpSpeed }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg09"] = data.ResponseItems[itemIdx++] = { Id: "4181700a-7f28-43fd-8a1f-f7874804c71d", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: rightPumpSpeed }, Timestamp: timestampString };
            this.m_tagMap["storage.numeric.reg10"] = data.ResponseItems[itemIdx++] = { Id: "c951cd96-545a-47b3-a72c-f769752600af", ItemStatus: 1, Value: { TypeCode: 14, DoubleValue: drainPumpSpeed }, Timestamp: timestampString };

            this.m_tagMap["storage.bool.reg19"] = data.ResponseItems[itemIdx++] = { Id: "50be71ad-7206-44dc-add6-668ac4f28a11", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: drainAutoValve }, Timestamp: timestampString };
            this.m_tagMap["storage.bool.reg20"] = data.ResponseItems[itemIdx++] = { Id: "13d2a3d0-cdb1-4538-8af6-6886337472d5", ItemStatus: 1, Value: { TypeCode: 3, BoolValue: drainFill }, Timestamp: timestampString };

            return data;
        }

    };
    $.csworks_core.LiveDataManager = LiveDataManager;


})(jQuery);