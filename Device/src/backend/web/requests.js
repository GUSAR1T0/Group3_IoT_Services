const common = require("common")
const AbstractRequests = common.models.containers.AbstractRequests
const ActionsEnums = common.models.protocol.enums.Actions
const SensorsEnums = common.models.protocol.enums.Sensors
const MessagesEnum = common.models.protocol.enums.Messages
const Device = common.models.protocol.entities.Device
const Sensor = common.models.protocol.entities.Sensor
const logger = common.utils.logging.logger

function getActions(array, actionsEnums) {
    return [].concat(array).map(action => {
        for (var defAction in actionsEnums.Common) {
            if (defAction === action) {
                return { id: action, name: actionsEnums.Common[action] }
            }
        }
        for (var defAction in actionsEnums.Custom) {
            if (defAction === action) {
                return { id: action, name: actionsEnums.Custom[action] }
            }
        }
    })
}

class Requests extends AbstractRequests {
    constructor(protocol, configurationProfile) {
        super()
        this.protocol = protocol
        this.configurationProfile = configurationProfile
    }

    prepare() {
        var profile = this.configurationProfile.get()
        if (profile.active) {
            this.protocol.initializeSensors(profile)
            this.protocol.initialize(profile)
        }
    }

    get(app) {
        app.get("/", (req, res) => {
            res.render("main", {
                profile: this.configurationProfile.get(),
                Actions: ActionsEnums,
                Sensors: SensorsEnums
            })
        })
        app.get("/messages", (req, res) => {
            var messages = {
                "titles": Object.keys(MessagesEnum).map(key => MessagesEnum[key]),
                "data": Object.keys(MessagesEnum).map(key => this.protocol.messages.get(MessagesEnum[key]))
            }
            res.render("messages", {
                messages: messages
            }, (err, html) => {
                if (err) {
                    logger.error(err)
                    throw err
                } else {
                    res.send(html)
                }
            })
        })
    }

    post(app) {
        app.post("/profile/device", (req, res) => {
            var profile = this.configurationProfile.get()
            profile.active = req.body["active"]
            profile.device = new Device(req.body["device[id]"], req.body["device[name]"], [])
            if (req.body["device[actions][]"] !== "null") {
                profile.device.actions = getActions(req.body["device[actions][]"], ActionsEnums.Device)
            } else {
                profile.device.actions = []
            }
            this.protocol.initialize(profile)
            this.configurationProfile.update(profile)
            res.send()
        })
        app.post("/profile/sensor", (req, res) => {
            var profile = this.configurationProfile.get()
            var sensor = new Sensor(req.body["sensor[id]"], req.body["sensor[type]"])
            if (req.body["sensor[actions][]"] !== "null") {
                sensor.actions = getActions(req.body["sensor[actions][]"], ActionsEnums.Sensor)
            } else {
                sensor.actions = []
            }
            profile.device.sensors.push(sensor)
            this.protocol.initializeSensors(profile)
            this.protocol.initialize(profile)
            this.configurationProfile.update(profile)
            res.send()
        })
    }

    put(app) {
        app.put("/profile", (req, res) => {
            var reSetupSensors = false
            var reSetupProtocolHandler = false

            var profile = this.configurationProfile.get()
            for (var key in req.body) {
                switch (key) {
                    case "backendId":
                        if (!reSetupProtocolHandler && profile.backendId !== req.body[key]) {
                            reSetupProtocolHandler = true
                        }
                        profile.backendId = req.body[key]
                        break
                    case "broker[host]":
                        if (!reSetupProtocolHandler && profile.broker.host !== req.body[key]) {
                            reSetupProtocolHandler = true
                        }
                        profile.broker.host = req.body[key]
                        break
                    case "broker[port]":
                        if (!reSetupProtocolHandler && profile.broker.port !== req.body[key]) {
                            reSetupProtocolHandler = true
                        }
                        profile.broker.port = req.body[key]
                        break
                    case "device[id]":
                        if (!reSetupProtocolHandler && profile.device.id !== req.body[key]) {
                            reSetupProtocolHandler = true
                        }
                        profile.device.id = req.body[key]
                        break
                    case "device[name]":
                        if (!reSetupProtocolHandler && profile.device.name !== req.body[key]) {
                            reSetupProtocolHandler = true
                        }
                        profile.device.name = req.body[key]
                        break
                    case "device[actions][]":
                        if (req.body[key] !== "null") {
                            var actions = getActions(req.body[key], ActionsEnums.Device)

                            if (actions.length === profile.device.actions.length) {
                                for (var i = 0; i < actions.length; i++) {
                                    if (!reSetupProtocolHandler && (actions[i].id !== profile.device.actions[i].id ||
                                        actions[i].name !== profile.device.actions[i].name)) {
                                        reSetupProtocolHandler = true
                                    }
                                }
                            } else {
                                reSetupProtocolHandler = true
                            }

                            profile.device.actions = actions
                        } else {
                            if (!reSetupProtocolHandler && profile.device.actions.length !== 0) {
                                reSetupProtocolHandler = true
                            }
                            profile.device.actions = []
                        }
                        break
                    case "sensor[id]":
                        var index = parseInt(req.body["sensor[index]"])
                        if (profile.device.sensors[index].id !== req.body[key]) {
                            reSetupSensors = true
                            reSetupProtocolHandler = true
                        }
                        profile.device.sensors[index].id = req.body[key]
                        break
                    case "sensor[type]":
                        var index = parseInt(req.body["sensor[index]"])
                        if (profile.device.sensors[index].type !== req.body[key]) {
                            reSetupSensors = true
                            reSetupProtocolHandler = true
                        }
                        profile.device.sensors[index].type = req.body[key]
                        break
                    case "sensor[actions][]":
                        var index = parseInt(req.body["sensor[index]"])
                        if (req.body[key] !== "null") {
                            var actions = getActions(req.body[key], ActionsEnums.Sensor)

                            if (actions.length === profile.device.sensors[index].actions.length) {
                                for (var i = 0; i < actions.length; i++) {
                                    if (actions[i].id !== profile.device.sensors[index].actions[i].id ||
                                        actions[i].name !== profile.device.sensors[index].actions[i].name) {
                                        reSetupSensors = true
                                        reSetupProtocolHandler = true
                                    }
                                }
                            } else {
                                reSetupSensors = true
                                reSetupProtocolHandler = true
                            }

                            profile.device.sensors[index].actions = actions
                        } else {
                            if (profile.device.sensors[index].actions.length !== 0) {
                                reSetupSensors = true
                                reSetupProtocolHandler = true
                            }
                            profile.device.sensors[index].actions = []
                        }
                        break
                }
            }

            if (profile.active) {
                if (reSetupSensors) {
                    this.protocol.initializeSensors(profile)
                }
                if (reSetupProtocolHandler) {
                    this.protocol.initialize(profile)
                }
            }

            this.configurationProfile.update(profile)
            res.send()
        })
        app.put("/active", (req, res) => {
            var profile = this.configurationProfile.get()

            var changeProtocolHandlerState = profile.active !== (req.body["active"] === "true")
            profile.active = req.body["active"] === "true"

            if (changeProtocolHandlerState) {
                if (profile.active) {
                    this.protocol.initialize(profile)
                } else {
                    this.protocol.end()
                }
            }

            this.configurationProfile.update(profile)
            res.send()
        })
    }

    delete(app) {
        app.delete("/profile/device", (req, res) => {
            var profile = this.configurationProfile.get()
            profile.device = null
            this.protocol.initializeSensors(profile)
            this.protocol.initialize(profile)
            this.configurationProfile.update(profile)
            res.send()
        })
        app.delete("/profile/sensor/:index", (req, res) => {
            var profile = this.configurationProfile.get()
            profile.device.sensors.splice(req.params.index, 1)
            this.protocol.initializeSensors(profile)
            this.protocol.initialize(profile)
            this.configurationProfile.update(profile)
            res.send()
        })
    }
}

module.exports = Requests
