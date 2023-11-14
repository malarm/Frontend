"use strict";
exports.__esModule = true;
exports.useEditMaintenancePlanVersionAsync = exports.editMaintenancePlanVersion = void 0;
var react_query_1 = require("@tanstack/react-query");
var api_client_1 = require("@thor-frontend/common/api-client");
exports.editMaintenancePlanVersion = function (data) {
    return api_client_1["default"].patch("/maintenance-plan-versions/" + data.planId, data.dto);
};
exports.useEditMaintenancePlanVersionAsync = function () {
    return react_query_1.useMutation({
        mutationFn: function (data) {
            return exports.editMaintenancePlanVersion(data).then(function (x) {
                return x.data;
            });
        }
    });
};
