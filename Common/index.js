/*
 * Models block
 */

const Broker = require("./src/models/containers/broker")
const Profile = require("./src/models/containers/profile")
const AbstractRequests = require("./src/models/containers/requests")
const Server = require("./src/models/containers/server")

const Device = require("./src/models/protocol/entities/device")
const Action = require("./src/models/protocol/entities/action")
const Sensor = require("./src/models/protocol/entities/sensor")
const Message = require("./src/models/protocol/entities/message")

const Actions = require("./src/models/protocol/enums/actions")
const Sensors = require("./src/models/protocol/enums/sensors")

const ActionDeviceRequestData = require("./src/models/protocol/data/request.action.device")
const ActionSensorRequestData = require("./src/models/protocol/data/request.action.sensor")
const RegisterRequestData = require("./src/models/protocol/data/request.register")
const ActionDeviceResponseData = require("./src/models/protocol/data/response.action.device")
const ActionSensorResponseData = require("./src/models/protocol/data/response.action.sensor")
const RegisterResponseData = require("./src/models/protocol/data/response.register")
const SensorData = require("./src/models/protocol/data/response.sensor")

const ActionDeviceRequest = require("./src/models/protocol/messages/request.action.device")
const ActionSensorRequest = require("./src/models/protocol/messages/request.action.sensor")
const RegisterRequest = require("./src/models/protocol/messages/request.register")
const ActionDeviceResponse = require("./src/models/protocol/messages/response.action.device")
const ActionSensorResponse = require("./src/models/protocol/messages/response.action.sensor")
const RegisterResponse = require("./src/models/protocol/messages/response.register")
const SensorDataResponse = require("./src/models/protocol/messages/response.sensor")

/*
 * Utils block
 */

const lowdb = require("./src/utils/database/lowdb")

const notImplementedErrors = require("./src/utils/errors/implementation")

const logs = require("./src/utils/logging/logger")

const ConfigurationProfile = require("./src/utils/profile/config")

const AbstractServer = require("./src/utils/protocol/server")
const AbstractDevice = require("./src/utils/protocol/device")

const launcher = require("./src/utils/web/launcher")

/*
 * Exports block
 */

module.exports = {
    "models": {
        "containers": {
            "Broker": Broker,
            "Profile": Profile,
            "AbstractRequests": AbstractRequests,
            "Server": Server
        },
        "protocol": {
            "entities": {
                "Device": Device,
                "Action": Action,
                "Sensor": Sensor,
                "Message": Message
            },
            "enums": {
                "Actions": Actions,
                "Sensors": Sensors
            },
            "data": {
                "ActionDeviceRequestData": ActionDeviceRequestData,
                "ActionSensorRequestData": ActionSensorRequestData,
                "RegisterRequestData": RegisterRequestData,
                "ActionDeviceResponseData": ActionDeviceResponseData,
                "ActionSensorResponseData": ActionSensorResponseData,
                "RegisterResponseData": RegisterResponseData,
                "SensorData": SensorData
            },
            "messages": {
                "ActionDeviceRequest": ActionDeviceRequest,
                "ActionSensorRequest": ActionSensorRequest,
                "RegisterRequest": RegisterRequest,
                "ActionDeviceResponse": ActionDeviceResponse,
                "ActionSensorResponse": ActionSensorResponse,
                "RegisterResponse": RegisterResponse,
                "SensorDataResponse": SensorDataResponse
            }
        }
    },
    "utils": {
        "database": {
            "lowdb": lowdb
        },
        "errors": {
            "AbstractNotImplementedError": notImplementedErrors.AbstractNotImplementedError,
            "StaticNotImplementedError": notImplementedErrors.StaticNotImplementedError
        },
        "logging": {
            "logger": logs.logger,
            "stream": logs.stream
        },
        "profile": {
            "ConfigurationProfile": ConfigurationProfile
        },
        "protocol": {
            "AbstractServer": AbstractServer,
            "AbstractDevice": AbstractDevice
        },
        "web": {
            "launcher": launcher
        }
    }
}