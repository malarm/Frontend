"use strict";
exports.__esModule = true;
var ui_1 = require("@project/ui");
var get_id_1 = require("@project/ui/dropdown-menu/get-id");
var thor_button_1 = require("@thor-frontend/common/thor-button/thor-button");
var auto_save_spinner_1 = require("@thor-frontend/features/maintenance-plan-versions/components/auto-save-spinner");
var maintenance_plan_get_bdk_by_version_1 = require("@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-bdk-by-version");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var MaintenancePlanSingleBDKNavigation = function (props) {
    var _a, _b;
    // Hooks
    var history = react_router_dom_1.useHistory();
    var planId = ui_1.usePathParam('planId')[0];
    var getBDKbyVersion = maintenance_plan_get_bdk_by_version_1.useMaintenancePlanBDKbyVersionId(planId);
    var _c = ui_1.useDropdown(), currentId = _c.currentId, setCurrentId = _c.setCurrentId;
    var id = react_1.useState(get_id_1.getId())[0];
    var _d = react_1.useState(false), cardIsHovered = _d[0], setCardIsHovered = _d[1];
    function openHandler(e) {
        e.stopPropagation();
        setCurrentId(currentId != id ? id : -1);
    }
    var open = currentId === id;
    // Functions
    var findIndexInArrayOfObjects = function (array, id) {
        for (var i = 0; i < array.length; i++) {
            if (array[i]._id === id) {
                return i;
            }
        }
        return -1; // Return -1 if no match is found
    };
    var getNewBDKRoute = function (id) {
        return history.location.pathname
            .split('/')
            .slice(0, -1)
            .join('/') + "/" + id;
    };
    var nextBDKHandler = function () {
        // Find Next in Array
        var index = findIndexInArrayOfObjects(getBDKbyVersion.data, props.item._id);
        // If End of Array go to start
        if (index + 1 === getBDKbyVersion.data.length) {
            index = 0;
        }
        else {
            index++;
        }
        history.push(getNewBDKRoute(getBDKbyVersion.data[index]._id));
    };
    var previousBDKHandler = function () {
        // Find Previous in Array
        var index = findIndexInArrayOfObjects(getBDKbyVersion.data, props.item._id);
        // If Start of Array go to End
        if (index === 0) {
            index = getBDKbyVersion.data.length - 1;
        }
        else {
            index--;
        }
        history.push(getNewBDKRoute(getBDKbyVersion.data[index]._id));
    };
    var goBack = function () {
        var route = history.location.pathname.split('/').slice(0, -1).join('/');
        history.push(route);
    };
    var dropdownItems = function () {
        return getBDKbyVersion.data.map(function (x) {
            return {
                title: x.number.toString().padStart(2, '0') + " " + x.name,
                action: function () { return history.push(getNewBDKRoute(x._id)); }
            };
        });
    };
    return (React.createElement("div", { className: "border-slate-200 border-b sticky top-0 bg-white z-50" },
        React.createElement("div", { className: "flex justify-between py-4 w-full px-4 xl:px-0 xl:w-[1118px] xl:ml-32" },
            React.createElement("div", { className: "flex" },
                React.createElement(thor_button_1["default"], { onClick: goBack, text: "Oversigt", iconPlacement: "left", color: "whiteBorder", remixIcon: "ri-arrow-left-line" }),
                React.createElement(auto_save_spinner_1["default"], { loading: props.autoSaving })),
            React.createElement("div", { onClick: function (e) { return openHandler(e); }, className: "flex cursor-pointer px-4 rounded hover:bg-neutral-50 relative" },
                React.createElement("p", { className: "text-black text-xl font-medium mt-1.5" }, (_a = props.item) === null || _a === void 0 ? void 0 :
                    _a.number.toString().padStart(2, '0'),
                    " ", (_b = props.item) === null || _b === void 0 ? void 0 :
                    _b.name),
                React.createElement("i", { className: "ri-expand-up-down-line text-2xl mt-1 ml-2" }),
                React.createElement(ui_1.DropDownCardV2, { data: dropdownItems(), setOpen: function (isOpen) {
                        return !isOpen ? setCurrentId(-1) : setCurrentId(id);
                    }, open: open, align: 'right', onHoverStateChange: setCardIsHovered, className: "absolute top-12 w-96 max-h-72 overflow-y-scroll" })),
            React.createElement("div", { className: "flex" },
                React.createElement(thor_button_1["default"], { color: "whiteBorder", remixIcon: "ri-arrow-left-line", className: "mr-4", onClick: previousBDKHandler }),
                React.createElement(thor_button_1["default"], { color: "whiteBorder", onClick: nextBDKHandler, remixIcon: "ri-arrow-right-line" })))));
};
exports["default"] = MaintenancePlanSingleBDKNavigation;
