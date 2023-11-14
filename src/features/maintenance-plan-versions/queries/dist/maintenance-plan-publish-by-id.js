"use strict";
exports.__esModule = true;
exports.usePublishMaintenancePlan = exports.usePublishMaintenancePlanVersionAsync = void 0;
var react_query_1 = require("@tanstack/react-query");
var api_client_1 = require("@thor-frontend/common/api-client");
var publishMaintenancePlan = function (maintenancePlanId) {
    return api_client_1["default"].patch("/maintenance-plan-versions/" + maintenancePlanId + "/publish");
};
exports.usePublishMaintenancePlanVersionAsync = function () {
    return react_query_1.useMutation({
        mutationFn: function (maintenancePlanId) {
            return publishMaintenancePlan(maintenancePlanId).then(function (x) {
                return x.data;
            });
        }
    });
};
exports.usePublishMaintenancePlan = function (maintenancePlanId) {
    return react_query_1.useQuery(['publish-maintenance-plan-by-id'], function () { return publishMaintenancePlan(maintenancePlanId).then(function (x) { return x.data; }); }, {
        enabled: !!maintenancePlanId,
        placeholderData: null
    });
};
