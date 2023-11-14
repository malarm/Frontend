"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Condition = void 0;
var use_bdk_section_observer_1 = require("@thor-frontend/features/maintenance-plan-versions/hooks/use-bdk-section-observer");
var react_1 = require("react");
var use_path_param_1 = require("@project/ui/hooks/use-path-param");
var react_query_1 = require("@tanstack/react-query");
var real_estate_card_by_id_1 = require("@thor-frontend/features/real-estate-cards/queries/real-estate-card-by-id");
var update_real_estate_card_1 = require("@thor-frontend/features/real-estate-cards/queries/update-real-estate-card");
var classnames_1 = require("classnames");
var condition_item_1 = require("@thor-frontend/features/real-estate-cards/components/condition-item");
var maintenance_plan_get_bdk_by_version_1 = require("@thor-frontend/features/maintenance-plan-versions/queries/maintenance-plan-get-bdk-by-version");
/**
 * The "Tilstand" section of the real estate card details view
 */
exports.Condition = react_1.forwardRef(function (props, ref) {
    var _a, _b;
    var bdkSection = use_bdk_section_observer_1.useBDKSectionObserver(props.sectionId, ref);
    // console.log(bdkSection);
    var updateRealEstateCard = update_real_estate_card_1.useUpdateRealEstateCard();
    var realEstateCardId = use_path_param_1.usePathParam('bdkId')[0];
    var planId = use_path_param_1.usePathParam('planId')[0];
    var realEstateCardById = real_estate_card_by_id_1.useRealEstateCardById(realEstateCardId);
    var getBDKbyVersion = maintenance_plan_get_bdk_by_version_1.useMaintenancePlanBDKbyVersionId(planId);
    var getConditionText = function (value) {
        switch (value) {
            case 0:
                return 'Meget god';
            case 1:
                return 'Acceptabel';
            case 2:
                return 'Mindre god';
            case 3:
                return 'Kritisk';
            default:
                return '';
        }
    };
    var value = getConditionText((_b = (_a = realEstateCardById.data) === null || _a === void 0 ? void 0 : _a.operationInformation) === null || _b === void 0 ? void 0 : _b.condition);
    var client = react_query_1.useQueryClient();
    var updateCondition = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // optimistic (local) update
                    client.setQueryData(real_estate_card_by_id_1.useRealEstateCardById.key(realEstateCardId), function (old) { return (__assign(__assign({}, old), { operationInformation: __assign(__assign({}, old.operationInformation), { condition: value }) })); });
                    return [4 /*yield*/, updateRealEstateCard.mutateAsync({
                            realEstateCardId: realEstateCardId,
                            body: {
                                operationInformation: {
                                    condition: value
                                }
                            }
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getBDKbyVersion.refetch()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { id: props.sectionId, ref: ref, className: "pb-8 border-b border-slate" },
        react_1["default"].createElement("h2", { className: "text-xl text-black mb-6" }, "Tilstand"),
        react_1["default"].createElement("div", { className: "flex flex-row gap-2" },
            react_1["default"].createElement(condition_item_1.CondititonItem, { icon: classnames_1["default"]('ri-home-smile-2-line group-hover:text-green-500', value === 'Meget god' ? 'text-green-500' : 'text-neutral-500'), conditionName: 'Meget god', onClick: function () { return updateCondition(0); }, checked: value === 'Meget god', colorClassName: "bg-green-100", className: "w-[237px] group" }),
            react_1["default"].createElement(condition_item_1.CondititonItem, { icon: classnames_1["default"]('ri-home-smile-2-line group-hover:text-amber-500', value === 'Acceptabel' ? 'text-amber-500' : 'text-neutral-500'), conditionName: 'Acceptabel', onClick: function () { return updateCondition(1); }, checked: value === 'Acceptabel', colorClassName: "bg-amber-100", className: "w-[237px] group" }),
            react_1["default"].createElement(condition_item_1.CondititonItem, { icon: classnames_1["default"]('ri-home-6-line group-hover:text-orange-500', value === 'Mindre god' ? 'text-orange-500' : 'text-neutral-500'), conditionName: 'Mindre god', onClick: function () { return updateCondition(2); }, checked: value === 'Mindre god', colorClassName: "bg-orange-100", className: "w-[237px] group" }),
            react_1["default"].createElement(condition_item_1.CondititonItem, { icon: classnames_1["default"]('ri-home-smile-2-line group-hover:text-rose-500', value === 'Kritisk' ? 'text-rose-500' : 'text-neutral-500'), conditionName: 'Kritisk', onClick: function () { return updateCondition(3); }, checked: value === 'Kritisk', colorClassName: "bg-rose-100", className: "w-[237px] group" }))));
});
