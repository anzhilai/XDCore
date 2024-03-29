/*!
 * TOAST UI Grid
 * @version 4.21.2 | Thu Jan 18 2024
 * @author NHN Cloud. FE Development Lab
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Grid"] = factory();
	else
		root["tui"] = root["tui"] || {}, root["tui"]["Grid"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 60);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getLongestText = exports.pixelToNumber = exports.isBetween = exports.silentSplice = exports.convertDataToText = exports.convertTextToData = exports.endsWith = exports.startsWith = exports.uniqByProp = exports.uniq = exports.pick = exports.omit = exports.pruneObject = exports.debounce = exports.convertToNumber = exports.fromArray = exports.isEmpty = exports.isNil = exports.isString = exports.isNumber = exports.isBoolean = exports.isNull = exports.isUndefined = exports.isBlank = exports.last = exports.range = exports.clamp = exports.setDefaultProp = exports.encodeHTMLEntity = exports.hasOwnProp = exports.forEachObject = exports.isObject = exports.isFunction = exports.createMapFromArray = exports.removeArrayItem = exports.assign = exports.deepCopy = exports.deepCopyArray = exports.deepMergedCopy = exports.mapProp = exports.findOffsetIndex = exports.findPrevIndex = exports.findIndexes = exports.findPropIndex = exports.findIndex = exports.someProp = exports.some = exports.findProp = exports.find = exports.includes = exports.pipe = exports.sum = exports.arrayEqual = exports.shallowEqual = void 0;
var tslib_1 = __webpack_require__(1);
var CUSTOM_LF_SUBCHAR = '___tui_grid_lf___';
var CUSTOM_CR_SUBCHAR = '___tui_grid_cr___';
var LF = '\n';
var CR = '\r';
var CUSTOM_LF_REGEXP = new RegExp(CUSTOM_LF_SUBCHAR, 'g');
var CUSTOM_CR_REGEXP = new RegExp(CUSTOM_CR_SUBCHAR, 'g');
function shallowEqual(o1, o2) {
    for (var key in o1) {
        if (o1[key] !== o2[key]) {
            return false;
        }
    }
    for (var key in o2) {
        if (!(key in o1)) {
            return false;
        }
    }
    return true;
}
exports.shallowEqual = shallowEqual;
function arrayEqual(a1, a2) {
    if (a1.length !== a2.length) {
        return false;
    }
    for (var i = 0, len = a1.length; i < len; i += 1) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
}
exports.arrayEqual = arrayEqual;
function sum(nums) {
    return nums.reduce(function (acc, num) { return acc + num; }, 0);
}
exports.sum = sum;
function pipe(initVal) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return args.reduce(function (acc, fn) { return fn(acc); }, initVal);
}
exports.pipe = pipe;
function includes(arr, searchItem, searchIndex) {
    if (typeof searchIndex === 'number' && arr[searchIndex] !== searchItem) {
        return false;
    }
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var item = arr_1[_i];
        if (item === searchItem) {
            return true;
        }
    }
    return false;
}
exports.includes = includes;
// eslint-disable-next-line consistent-return
function find(predicate, arr) {
    for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
        var item = arr_2[_i];
        if (predicate(item)) {
            return item;
        }
    }
}
exports.find = find;
function findProp(propName, value, arr) {
    return find(function (item) { return item[propName] === value; }, arr);
}
exports.findProp = findProp;
function some(predicate, arr) {
    return !!find(predicate, arr);
}
exports.some = some;
function someProp(propName, value, arr) {
    return !!findProp(propName, value, arr);
}
exports.someProp = someProp;
function findIndex(predicate, arr) {
    for (var i = 0, len = arr.length; i < len; i += 1) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
function findPropIndex(propName, value, arr) {
    return findIndex(function (item) { return item[propName] === value; }, arr);
}
exports.findPropIndex = findPropIndex;
function findIndexes(predicate, arr) {
    return arr.reduce(function (acc, v, idx) { return (predicate(v) ? tslib_1.__spreadArrays(acc, [idx]) : acc); }, []);
}
exports.findIndexes = findIndexes;
function findPrevIndex(arr, predicate) {
    var index = findIndex(predicate, arr);
    var positiveIndex = index <= 0 ? 0 : index - 1;
    return index >= 0 ? positiveIndex : arr.length - 1;
}
exports.findPrevIndex = findPrevIndex;
function findOffsetIndex(offsets, targetOffset) {
    return findPrevIndex(offsets, function (offset) { return offset > targetOffset; });
}
exports.findOffsetIndex = findOffsetIndex;
function mapProp(propName, arr) {
    return arr.map(function (item) { return item[propName]; });
}
exports.mapProp = mapProp;
function deepMergedCopy(targetObj, obj) {
    var resultObj = tslib_1.__assign({}, targetObj);
    Object.keys(obj).forEach(function (prop) {
        if (isObject(resultObj[prop])) {
            if (Array.isArray(obj[prop])) {
                resultObj[prop] = deepCopyArray(obj[prop]);
            }
            else if (resultObj.hasOwnProperty(prop)) {
                resultObj[prop] = deepMergedCopy(resultObj[prop], obj[prop]);
            }
            else {
                resultObj[prop] = deepCopy(obj[prop]);
            }
        }
        else {
            resultObj[prop] = obj[prop];
        }
    });
    return resultObj;
}
exports.deepMergedCopy = deepMergedCopy;
function deepCopyArray(items) {
    return items.map(function (item) {
        if (isObject(item)) {
            return Array.isArray(item) ? deepCopyArray(item) : deepCopy(item);
        }
        return item;
    });
}
exports.deepCopyArray = deepCopyArray;
function deepCopy(obj) {
    var resultObj = {};
    var keys = Object.keys(obj);
    if (!keys.length) {
        return obj;
    }
    keys.forEach(function (prop) {
        if (isObject(obj[prop])) {
            resultObj[prop] = Array.isArray(obj[prop]) ? deepCopyArray(obj[prop]) : deepCopy(obj[prop]);
        }
        else {
            resultObj[prop] = obj[prop];
        }
    });
    return resultObj;
}
exports.deepCopy = deepCopy;
function assign(targetObj, obj) {
    Object.keys(obj).forEach(function (prop) {
        if (targetObj.hasOwnProperty(prop) && typeof targetObj[prop] === 'object') {
            if (Array.isArray(obj[prop])) {
                targetObj[prop] = obj[prop];
            }
            else {
                assign(targetObj[prop], obj[prop]);
            }
        }
        else {
            targetObj[prop] = obj[prop];
        }
    });
}
exports.assign = assign;
function removeArrayItem(targetItem, arr) {
    var targetIdx = findIndex(function (item) { return item === targetItem; }, arr);
    if (targetIdx !== -1) {
        arr.splice(targetIdx, 1);
    }
    return arr;
}
exports.removeArrayItem = removeArrayItem;
function createMapFromArray(arr, propName) {
    var resultMap = {};
    arr.forEach(function (item) {
        var key = String(item[propName]);
        resultMap[key] = item;
    });
    return resultMap;
}
exports.createMapFromArray = createMapFromArray;
function isFunction(obj) {
    return typeof obj === 'function';
}
exports.isFunction = isFunction;
function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}
exports.isObject = isObject;
function forEachObject(fn, obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            fn(obj[key], key, obj);
        }
    }
}
exports.forEachObject = forEachObject;
function hasOwnProp(obj, key) {
    return obj.hasOwnProperty(key);
}
exports.hasOwnProp = hasOwnProp;
function encodeHTMLEntity(html) {
    var entities = {
        '"': 'quot',
        '&': 'amp',
        '<': 'lt',
        '>': 'gt',
        "'": '#39',
    };
    return html.replace(/[<>&"']/g, function (match) { return "&" + entities[match] + ";"; });
}
exports.encodeHTMLEntity = encodeHTMLEntity;
function setDefaultProp(obj, key, defValue) {
    if (isUndefined(obj[key]) || isNull(obj[key])) {
        obj[key] = defValue;
    }
}
exports.setDefaultProp = setDefaultProp;
/**
 * Returns a number whose value is limited to the given range.
 * @param value - A number to force within given min-max range
 * @param min - The lower boundary of the output range
 * @param max - The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @example
 *      // limit the output of this computation to between 0 and 255
 *      value = clamp(value, 0, 255);
 */
function clamp(value, min, max) {
    var _a;
    if (min > max) {
        _a = [min, max], max = _a[0], min = _a[1];
    }
    return Math.max(min, Math.min(value, max));
}
exports.clamp = clamp;
function range(end) {
    var arr = [];
    for (var i = 0; i < end; i += 1) {
        arr.push(i);
    }
    return arr;
}
exports.range = range;
function last(arr) {
    return arr[arr.length - 1];
}
exports.last = last;
function isBlank(value) {
    if (typeof value === 'string') {
        return !value.length;
    }
    return typeof value === 'undefined' || value === null;
}
exports.isBlank = isBlank;
function isUndefined(value) {
    return typeof value === 'undefined';
}
exports.isUndefined = isUndefined;
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
function isNumber(value) {
    return typeof value === 'number';
}
exports.isNumber = isNumber;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isNil(value) {
    return isUndefined(value) || isNull(value);
}
exports.isNil = isNil;
/**
 * check the emptiness(included null) of object or array. if obj parameter is null or undefind, return true
 * @param obj - target object or array
 * @returns the emptiness of obj
 */
function isEmpty(obj) {
    return (isNull(obj) ||
        isUndefined(obj) ||
        (!isUndefined(obj.length) && obj.length === 0) ||
        Object.keys(obj).length === 0);
}
exports.isEmpty = isEmpty;
function fromArray(value) {
    return Array.prototype.slice.call(value);
}
exports.fromArray = fromArray;
function convertToNumber(value) {
    if (typeof value === 'number' || isNaN(value) || isBlank(value)) {
        return value;
    }
    return Number(value);
}
exports.convertToNumber = convertToNumber;
function debounce(fn, wait, immediate) {
    if (immediate === void 0) { immediate = false; }
    var timeout = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var later = function () {
            timeout = -1;
            if (!immediate) {
                fn.apply(void 0, args);
            }
        };
        var callNow = immediate && !timeout;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(later, wait);
        if (callNow) {
            fn.apply(void 0, args);
        }
    };
}
exports.debounce = debounce;
function pruneObject(obj) {
    var pruned = {};
    forEachObject(function (value, key) {
        if (!isUndefined(value) && !isNull(value)) {
            pruned[key] = value;
        }
    }, obj);
    return pruned;
}
exports.pruneObject = pruneObject;
function omit(obj) {
    var propNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        propNames[_i - 1] = arguments[_i];
    }
    var resultMap = {};
    Object.keys(obj).forEach(function (key) {
        if (!includes(propNames, key)) {
            resultMap[key] = obj[key];
        }
    });
    return resultMap;
}
exports.omit = omit;
function pick(obj) {
    var propNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        propNames[_i - 1] = arguments[_i];
    }
    var resultMap = {};
    Object.keys(obj).forEach(function (key) {
        if (includes(propNames, key)) {
            resultMap[key] = obj[key];
        }
    });
    return resultMap;
}
exports.pick = pick;
function uniq(arr) {
    return arr.filter(function (name, index) { return arr.indexOf(name) === index; });
}
exports.uniq = uniq;
function uniqByProp(propName, arr) {
    return arr.filter(function (obj, index) { return findPropIndex(propName, obj[propName], arr) === index; });
}
exports.uniqByProp = uniqByProp;
function startsWith(str, targetStr) {
    return targetStr.slice(0, str.length) === str;
}
exports.startsWith = startsWith;
function endsWith(str, targetStr) {
    var index = targetStr.lastIndexOf(str);
    return index !== -1 && index + str.length === targetStr.length;
}
exports.endsWith = endsWith;
function removeDoubleQuotes(text) {
    if (text.match(CUSTOM_LF_REGEXP)) {
        return text.substring(1, text.length - 1).replace(/""/g, '"');
    }
    return text;
}
function replaceNewlineToSubchar(text) {
    return text.replace(/"([^"]|"")*"/g, function (value) {
        return value.replace(LF, CUSTOM_LF_SUBCHAR).replace(CR, CUSTOM_CR_SUBCHAR);
    });
}
function convertTextToData(text) {
    // Each newline cell data is wrapping double quotes in the text and
    // newline characters should be replaced with substitution characters temporarily
    // before spliting the text by newline characters.
    text = replaceNewlineToSubchar(text);
    return text
        .split(/\r?\n/)
        .map(function (row) {
        return row
            .split('\t')
            .map(function (column) {
            return removeDoubleQuotes(column).replace(CUSTOM_LF_REGEXP, LF).replace(CUSTOM_CR_REGEXP, CR);
        });
    });
}
exports.convertTextToData = convertTextToData;
function convertDataToText(data, delimiter) {
    return data.map(function (row) { return "\"" + row.join("\"" + delimiter + "\"") + "\""; }).join('\n');
}
exports.convertDataToText = convertDataToText;
function silentSplice(arr, start, deleteCount) {
    var _a;
    var items = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        items[_i - 3] = arguments[_i];
    }
    return (_a = Array.prototype.splice).call.apply(_a, tslib_1.__spreadArrays([arr, start, deleteCount], items));
}
exports.silentSplice = silentSplice;
function isBetween(value, start, end) {
    return start <= value && value <= end;
}
exports.isBetween = isBetween;
function pixelToNumber(pixelString) {
    var regExp = new RegExp(/[0-9]+px/);
    return regExp.test(pixelString) ? parseInt(pixelString.replace('px', ''), 10) : 0;
}
exports.pixelToNumber = pixelToNumber;
function getLongestText(texts) {
    return texts.reduce(function (acc, text) { return (text.length > acc.length ? text : acc); }, '');
}
exports.getLongestText = getLongestText;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getComputedFontStyle = exports.getTextWidth = exports.setClipboardSelection = exports.isSupportWindowClipboardData = exports.convertTableToData = exports.getCoordinateWithOffset = exports.setCursorStyle = exports.appendStyleElement = exports.getCellAddress = exports.isParentExistWithClassNames = exports.findParentByClassName = exports.findParentByTagName = exports.hasClass = exports.isDatePickerElement = exports.cls = exports.dataAttr = void 0;
var common_1 = __webpack_require__(0);
var CLS_PREFIX = 'tui-grid-';
exports.dataAttr = {
    ROW_KEY: 'data-row-key',
    COLUMN_NAME: 'data-column-name',
    COLUMN_INDEX: 'data-column-index',
    GRID_ID: 'data-grid-id',
};
function cls() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        names[_i] = arguments[_i];
    }
    var result = [];
    for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
        var name = names_1[_a];
        var className = void 0;
        if (Array.isArray(name)) {
            className = name[0] ? name[1] : null;
        }
        else {
            className = name;
        }
        if (className) {
            result.push("" + CLS_PREFIX + className);
        }
    }
    return result.join(' ');
}
exports.cls = cls;
function isSvgElement(el) {
    var _a;
    return ((_a = el.namespaceURI) === null || _a === void 0 ? void 0 : _a.indexOf('svg')) !== -1;
}
function isDatePickerElement(el) {
    var currentEl = el;
    if (isSvgElement(el)) {
        return false;
    }
    while (currentEl && currentEl.className.split(' ').indexOf('tui-datepicker') === -1) {
        currentEl = currentEl.parentElement;
    }
    return !!currentEl;
}
exports.isDatePickerElement = isDatePickerElement;
function hasClass(el, className) {
    return !isSvgElement(el) && el.className.split(' ').indexOf(cls(className)) !== -1;
}
exports.hasClass = hasClass;
function findParentByTagName(el, tagName) {
    var currentEl = el;
    while (currentEl && currentEl.tagName.toLowerCase() !== tagName) {
        currentEl = currentEl.parentElement;
    }
    return currentEl;
}
exports.findParentByTagName = findParentByTagName;
function findParentByClassName(el, className) {
    var currentEl = el;
    while (currentEl && !hasClass(currentEl, className)) {
        currentEl = currentEl.parentElement;
    }
    return currentEl;
}
exports.findParentByClassName = findParentByClassName;
function isParentExistWithClassNames(el, classNames) {
    return classNames.some(function (className) { return !common_1.isNull(findParentByClassName(el, className)); });
}
exports.isParentExistWithClassNames = isParentExistWithClassNames;
function getCellAddress(el) {
    var cellElement = findParentByTagName(el, 'td');
    if (!cellElement) {
        return null;
    }
    var rowKey = cellElement.getAttribute(exports.dataAttr.ROW_KEY);
    var columnName = cellElement.getAttribute(exports.dataAttr.COLUMN_NAME);
    if (common_1.isNull(rowKey)) {
        return null;
    }
    // xuedan
    return {
        rowKey: rowKey,
        columnName: columnName,
    };
}
exports.getCellAddress = getCellAddress;
/**
 * create style element and append it into the head element.
 * @param {String} id - element id
 * @param {String} cssString - css string
 */
function appendStyleElement(id, cssString) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = id;
    style.appendChild(document.createTextNode(cssString));
    document.getElementsByTagName('head')[0].appendChild(style);
}
exports.appendStyleElement = appendStyleElement;
function setCursorStyle(type) {
    document.body.style.cursor = type;
}
exports.setCursorStyle = setCursorStyle;
function getCoordinateWithOffset(pageX, pageY) {
    var pageXWithOffset = pageX - window.pageXOffset;
    var pageYWithOffset = pageY - window.pageYOffset;
    return [pageXWithOffset, pageYWithOffset];
}
exports.getCoordinateWithOffset = getCoordinateWithOffset;
function setDataInSpanRange(value, data, colspanRange, rowspanRange) {
    var startColspan = colspanRange[0], endColspan = colspanRange[1];
    var startRowspan = rowspanRange[0], endRowspan = rowspanRange[1];
    for (var rowIdx = startRowspan; rowIdx < endRowspan; rowIdx += 1) {
        for (var columnIdx = startColspan; columnIdx < endColspan; columnIdx += 1) {
            data[rowIdx][columnIdx] = startRowspan === rowIdx && startColspan === columnIdx ? value : ' ';
        }
    }
}
function convertTableToData(rows) {
    var data = [];
    var colspanRange, rowspanRange;
    for (var index = 0; index < rows.length; index += 1) {
        data[index] = [];
    }
    common_1.fromArray(rows).forEach(function (tr, rowIndex) {
        var columnIndex = 0;
        common_1.fromArray(tr.cells).forEach(function (td) {
            var text = td.textContent || td.innerText;
            while (data[rowIndex][columnIndex]) {
                columnIndex += 1;
            }
            colspanRange = [columnIndex, columnIndex + (td.colSpan || 1)];
            rowspanRange = [rowIndex, rowIndex + (td.rowSpan || 1)];
            setDataInSpanRange(text, data, colspanRange, rowspanRange);
            columnIndex = colspanRange[1];
        });
    });
    return data;
}
exports.convertTableToData = convertTableToData;
function isSupportWindowClipboardData() {
    return !!window.clipboardData;
}
exports.isSupportWindowClipboardData = isSupportWindowClipboardData;
function setClipboardSelection(node) {
    if (node) {
        var range = document.createRange();
        var selection = window.getSelection();
        selection.removeAllRanges();
        range.selectNodeContents(node);
        selection.addRange(range);
    }
}
exports.setClipboardSelection = setClipboardSelection;
function getTextWidth(text, bodyArea) {
    if (!bodyArea) {
        return 0;
    }
    var tdForMeasure = document.createElement('td');
    tdForMeasure.className = cls('cell', 'cell-has-input');
    tdForMeasure.style.position = 'absolute';
    var cellForMeasure = document.createElement('div');
    cellForMeasure.textContent = text;
    cellForMeasure.className = cls('cell-content');
    tdForMeasure.appendChild(cellForMeasure);
    bodyArea.appendChild(tdForMeasure);
    var width = cellForMeasure.clientWidth;
    bodyArea.removeChild(tdForMeasure);
    return Math.ceil(width);
}
exports.getTextWidth = getTextWidth;
function getComputedFontStyle(selector) {
    var firstCellNode = document.querySelector("." + cls(selector));
    var walker = document.createTreeWalker(firstCellNode, 4);
    var node = firstCellNode;
    while (walker.nextNode()) {
        node = walker.currentNode;
        if (node.nodeType === 3) {
            node = node.parentElement;
            break;
        }
    }
    var compStyle = getComputedStyle(node);
    var fontSize = compStyle.getPropertyValue('font-size');
    var fontWeight = compStyle.getPropertyValue('font-weight');
    var fontFamily = compStyle.getPropertyValue('font-family');
    return fontWeight + " " + fontSize + " " + fontFamily;
}
exports.getComputedFontStyle = getComputedFontStyle;


/***/ }),
/* 3 */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneElement", function() { return cloneElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRef", function() { return createRef; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return Component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rerender", function() { return rerender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return options; });
var VNode = function VNode() {};

var options = {};

var stack = [];

var EMPTY_CHILDREN = [];

function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }return obj;
}

function applyRef(ref, value) {
  if (ref) {
    if (typeof ref == 'function') ref(value);else ref.current = value;
  }
}

var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
  return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p;
	while (p = items.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {} else if (name === 'ref') {
		applyRef(old, null);
		applyRef(value, node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		try {
			node[name] = value == null ? '' : value;
		} catch (e) {}
		if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

var mounts = [];

var diffLevel = 0;

var isSvgMode = false;

var hydrating = false;

function flushMounts() {
	var c;
	while (c = mounts.shift()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	if (!diffLevel++) {
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	if (! --diffLevel) {
		hydrating = false;

		if (!componentRoot) flushMounts();
	}

	return ret;
}

function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	if (typeof vnode === 'string' || typeof vnode === 'number') {
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			}
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	} else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	diffAttributes(out, vnode.attributes, props);

	isSvgMode = prevSvgMode;

	return out;
}

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			} else if (min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		unmountComponent(component);
	} else {
		if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

function diffAttributes(dom, attrs, old) {
	var name;

	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

var recyclerComponents = [];

function createComponent(Ctor, props, context) {
	var inst,
	    i = recyclerComponents.length;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	while (i--) {
		if (recyclerComponents[i].constructor === Ctor) {
			inst.nextBase = recyclerComponents[i].nextBase;
			recyclerComponents.splice(i, 1);
			return inst;
		}
	}

	return inst;
}

function doRender(props, state, context) {
	return this.constructor(props, context);
}

function setComponentProps(component, props, renderMode, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	component.__ref = props.ref;
	component.__key = props.key;
	delete props.ref;
	delete props.key;

	if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
		if (!component.base || mountAll) {
			if (component.componentWillMount) component.componentWillMount();
		} else if (component.componentWillReceiveProps) {
			component.componentWillReceiveProps(props, context);
		}
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (renderMode !== 0) {
		if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	applyRef(component.__ref, component);
}

function renderComponent(component, renderMode, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    snapshot = previousContext,
	    rendered,
	    inst,
	    cbase;

	if (component.constructor.getDerivedStateFromProps) {
		state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
		component.state = state;
	}

	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		if (isUpdate && component.getSnapshotBeforeUpdate) {
			snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || renderMode === 1) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.push(component);
	} else if (!skip) {

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, snapshot);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	while (component._renderCallbacks.length) {
		component._renderCallbacks.pop().call(component);
	}if (!diffLevel && !isChild) flushMounts();
}

function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;

			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);

		component.nextBase = base;

		removeNode(base);
		recyclerComponents.push(component);

		removeChildren(base);
	}

	applyRef(component.__ref, null);
}

function Component(props, context) {
	this._dirty = true;

	this.context = context;

	this.props = props;

	this.state = this.state || {};

	this._renderCallbacks = [];
}

extend(Component.prototype, {
	setState: function setState(state, callback) {
		if (!this.prevState) this.prevState = this.state;
		this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
		if (callback) this._renderCallbacks.push(callback);
		enqueueRender(this);
	},
	forceUpdate: function forceUpdate(callback) {
		if (callback) this._renderCallbacks.push(callback);
		renderComponent(this, 2);
	},
	render: function render() {}
});

function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

function createRef() {
	return {};
}

var preact = {
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	createRef: createRef,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options
};

/* harmony default export */ __webpack_exports__["default"] = (preact);

//# sourceMappingURL=preact.mjs.map


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var observable_1 = __webpack_require__(5);
function connect(selector, forceUpdate) {
    return function (WrappedComponent) {
        var _a;
        return _a = /** @class */ (function (_super) {
                tslib_1.__extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_1.prototype.setStateUsingSelector = function (ownProps) {
                    if (selector) {
                        this.setState(selector(this.context.store, ownProps));
                        if (forceUpdate) {
                            this.forceUpdate();
                        }
                    }
                };
                class_1.prototype.componentWillMount = function () {
                    var _this = this;
                    if (selector) {
                        this.unobserve = observable_1.observe(function () {
                            _this.setStateUsingSelector(_this.props);
                        });
                    }
                };
                class_1.prototype.componentWillReceiveProps = function (nextProps) {
                    this.setStateUsingSelector(nextProps);
                };
                class_1.prototype.componentWillUnmount = function () {
                    if (this.unobserve) {
                        this.unobserve();
                    }
                };
                class_1.prototype.render = function () {
                    var _a = this, props = _a.props, state = _a.state;
                    var dispatch = this.context.dispatch;
                    return preact_1.h(WrappedComponent, tslib_1.__assign({}, props, state, { dispatch: dispatch }));
                };
                return class_1;
            }(preact_1.Component)),
            _a.displayName = "Connect:" + WrappedComponent.name,
            _a;
    };
}
exports.connect = connect;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncInvokeObserver = exports.batchObserver = exports.unobservedInvoke = exports.getOriginObject = exports.notify = exports.observable = exports.partialObservable = exports.makeObservableData = exports.observe = exports.isObservable = exports.getRunningObservers = exports.observerInfoMap = void 0;
var common_1 = __webpack_require__(0);
var array_1 = __webpack_require__(63);
var generateObserverId = (function () {
    var lastId = 0;
    return function () {
        lastId += 1;
        return "@observer" + lastId;
    };
})();
// store all observer info
exports.observerInfoMap = {};
// observerId stack for managing recursive observing calls
var observerIdStack = [];
var queue = [];
var observerIdMap = {};
var pending = false;
var paused = false;
function batchUpdate(observerId) {
    if (!observerIdMap[observerId]) {
        observerIdMap[observerId] = true;
        queue.push(observerId);
    }
    if (!pending) {
        flush();
    }
}
function clearQueue() {
    queue = [];
    observerIdMap = {};
    pending = false;
}
function getRunningObservers() {
    return queue.map(function (id) { return exports.observerInfoMap[id].name; }).filter(function (name) { return name; });
}
exports.getRunningObservers = getRunningObservers;
function callObserver(observerId) {
    observerIdStack.push(observerId);
    exports.observerInfoMap[observerId].fn(exports.observerInfoMap[observerId].key);
    observerIdStack.pop();
    delete exports.observerInfoMap[observerId].key;
}
function flush() {
    pending = true;
    for (var index = 0; index < queue.length; index += 1) {
        var observerId = queue[index];
        observerIdMap[observerId] = false;
        callObserver(observerId);
    }
    clearQueue();
}
function run(observerId, key) {
    var sync = exports.observerInfoMap[observerId].sync;
    exports.observerInfoMap[observerId].key = key;
    if (sync) {
        callObserver(observerId);
    }
    else {
        batchUpdate(observerId);
    }
}
function setValue(storage, resultObj, observerIdSet, key, value) {
    if (storage[key] !== value) {
        if (Array.isArray(value)) {
            array_1.patchArrayMethods(value, resultObj, key);
        }
        storage[key] = value;
        Object.keys(observerIdSet).forEach(function (observerId) {
            run(observerId, 'setValue');
        });
    }
}
function isObservable(resultObj) {
    return common_1.isObject(resultObj) && common_1.hasOwnProp(resultObj, '__storage__');
}
exports.isObservable = isObservable;
function observe(fn, sync, name) {
    if (sync === void 0) { sync = false; }
    if (name === void 0) { name = ''; }
    var observerId = generateObserverId();
    exports.observerInfoMap[observerId] = { fn: fn, targetObserverIdSets: [], sync: sync, name: name };
    run(observerId, 'observe');
    // return unobserve function
    return function () {
        exports.observerInfoMap[observerId].targetObserverIdSets.forEach(function (idSet) {
            delete idSet[observerId];
        });
        delete exports.observerInfoMap[observerId];
    };
}
exports.observe = observe;
// eslint-disable-next-line max-params
function makeObservableData(obj, resultObj, key, storage, propObserverIdSetMap, sync) {
    var getter = (Object.getOwnPropertyDescriptor(obj, key) || {}).get;
    var observerIdSet = (propObserverIdSetMap[key] = {});
    Object.defineProperty(resultObj, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            var observerId = common_1.last(observerIdStack);
            if (!paused && observerId && !observerIdSet[observerId]) {
                observerIdSet[observerId] = true;
                exports.observerInfoMap[observerId].targetObserverIdSets.push(observerIdSet);
            }
            return storage[key];
        },
    });
    if (common_1.isFunction(getter)) {
        observe(function () {
            var value = getter.call(resultObj);
            setValue(storage, resultObj, observerIdSet, key, value);
        }, sync);
    }
    else {
        // has to add 'as' type assertion and refer the below typescript issue
        // In general, the constraint Record<string, XXX> doesn't actually ensure that an argument has a string index signature,
        // it merely ensures that the properties of the argument are assignable to type XXX.
        // So, in the example above you could effectively pass any object and the function could write to any property without any checks.
        // https://github.com/microsoft/TypeScript/issues/31661
        storage[key] = obj[key];
        if (Array.isArray(storage[key])) {
            array_1.patchArrayMethods(storage[key], resultObj, key);
        }
        Object.defineProperty(resultObj, key, {
            set: function (value) {
                setValue(storage, resultObj, observerIdSet, key, value);
            },
        });
    }
}
exports.makeObservableData = makeObservableData;
function partialObservable(obj, key) {
    var storage = obj.__storage__;
    var propObserverIdSetMap = obj.__propObserverIdSetMap__;
    makeObservableData(obj, obj, key, storage, propObserverIdSetMap);
}
exports.partialObservable = partialObservable;
function observable(obj, sync) {
    if (sync === void 0) { sync = false; }
    if (Array.isArray(obj)) {
        throw new Error('Array object cannot be Reactive');
    }
    if (isObservable(obj)) {
        return obj;
    }
    var storage = {};
    var propObserverIdSetMap = {};
    var resultObj = {};
    Object.defineProperties(resultObj, {
        __storage__: { value: storage },
        __propObserverIdSetMap__: { value: propObserverIdSetMap },
    });
    Object.keys(obj).forEach(function (key) {
        makeObservableData(obj, resultObj, key, storage, propObserverIdSetMap, sync);
    });
    return resultObj;
}
exports.observable = observable;
function notifyUnit(obj, key) {
    Object.keys(obj.__propObserverIdSetMap__[key]).forEach(function (observerId) {
        run(observerId, key.toString());
    });
}
function notify(obj) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    if (isObservable(obj)) {
        keys.forEach(function (key) { return notifyUnit(obj, key); });
    }
}
exports.notify = notify;
function getOriginObject(obj) {
    var result = {};
    common_1.forEachObject(function (value, key) {
        result[key] = isObservable(value) ? getOriginObject(value) : value;
    }, obj.__storage__);
    return common_1.isEmpty(result) ? obj : result;
}
exports.getOriginObject = getOriginObject;
function unobservedInvoke(fn) {
    paused = true;
    fn();
    paused = false;
}
exports.unobservedInvoke = unobservedInvoke;
function batchObserver(fn) {
    pending = true;
    fn();
    pending = false;
}
exports.batchObserver = batchObserver;
var asyncTimer = null;
function asyncInvokeObserver(fn) {
    if (common_1.isNull(asyncTimer)) {
        asyncTimer = setTimeout(function () {
            fn();
            asyncTimer = null;
        });
    }
}
exports.asyncInvokeObserver = asyncInvokeObserver;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRawDataToOriginDataForTree = exports.getOmittedInternalProp = exports.createChangeInfo = exports.getFormattedValue = exports.getRowKeyByIndexWithPageRange = exports.getRowIndexPerPage = exports.isClientPagination = exports.isScrollPagination = exports.getMaxRowKey = exports.isFiltered = exports.isSorted = exports.getCreatedRowInfo = exports.getRemovedClassName = exports.getAddedClassName = exports.getLoadingState = exports.getRowHeight = exports.isInitialSortState = exports.isSortable = exports.getUniqColumnData = exports.findRowByRowKey = exports.findIndexByRowKey = exports.getConditionalRows = exports.getRemoveRowInfoList = exports.getCheckedRowInfoList = exports.isEditableCell = exports.getCellAddressByIndex = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var instance_1 = __webpack_require__(8);
var column_1 = __webpack_require__(12);
var data_1 = __webpack_require__(15);
var data_2 = __webpack_require__(23);
var data_3 = __webpack_require__(14);
var validation_1 = __webpack_require__(27);
var observable_1 = __webpack_require__(5);
function getCellAddressByIndex(_a, rowIndex, columnIndex) {
    var data = _a.data, column = _a.column;
    return {
        rowKey: data.filteredViewData[rowIndex].rowKey,
        columnName: column.visibleColumns[columnIndex].name,
    };
}
exports.getCellAddressByIndex = getCellAddressByIndex;
function isEditableCell(store, rowIndex, columnName) {
    var data = store.data, column = store.column;
    var filteredIndex = data.filteredIndex, filteredViewData = data.filteredViewData;
    if (filteredIndex && common_1.isNil(filteredIndex[rowIndex])) {
        return false;
    }
    // get index based on whole data(not filtered data)
    var index = filteredIndex ? filteredIndex[rowIndex] : rowIndex;
    data_3.makeObservable(store, index, true);
    var _a = filteredViewData[rowIndex].valueMap[columnName], disabled = _a.disabled, editable = _a.editable;
    return !column_1.isHiddenColumn(column, columnName) && editable && !disabled;
}
exports.isEditableCell = isEditableCell;
function getCheckedRowInfoList(store) {
    if (!store) {
        return {
            rowIndices: [],
            rows: [],
            nextRows: [],
        };
    }
    var data = store.data;
    var targetRows = {
        rowIndices: [],
        rows: [],
        nextRows: [],
    };
    data.rawData.reduce(function (acc, row, index) {
        if (row._attributes.checked) {
            acc.rowIndices.push(index);
            acc.rows.push(row);
            acc.nextRows.push(data.rawData[index + 1]);
        }
        return acc;
    }, targetRows);
    return targetRows;
}
exports.getCheckedRowInfoList = getCheckedRowInfoList;
function getRemoveRowInfoList(_a, rowKeys) {
    var data = _a.data;
    var targetRows = {
        rowIndices: [],
        rows: [],
        nextRows: [],
    };
    data.rawData.reduce(function (acc, row, index) {
        var rowKeyIndex = rowKeys.indexOf(row.rowKey);
        if (rowKeyIndex !== -1) {
            acc.rowIndices.push(index);
            acc.rows.push(row);
            acc.nextRows.push(data.rawData[index + 1]);
            rowKeys.splice(rowKeyIndex, 1);
        }
        return acc;
    }, targetRows);
    return targetRows;
}
exports.getRemoveRowInfoList = getRemoveRowInfoList;
function getConditionalRows(_a, conditions) {
    var data = _a.data;
    var rawData = data.rawData;
    if (common_1.isFunction(conditions)) {
        return rawData.filter(conditions);
    }
    var result = rawData;
    Object.keys(conditions).forEach(function (key) {
        result = result.filter(function (row) { return row[key] === conditions[key]; });
    });
    return result;
}
exports.getConditionalRows = getConditionalRows;
function findIndexByRowKey(data, column, id, rowKey, filtered) {
    if (filtered === void 0) { filtered = true; }
    if (common_1.isNil(rowKey)) {
        return -1;
    }
    var filteredRawData = data.filteredRawData, rawData = data.rawData;
    var targetData = filtered ? filteredRawData : rawData;
    var dataManager = instance_1.getDataManager(id);
    var modified = dataManager ? dataManager.isMixedOrder() : false;
    if (isSorted(data) || column.keyColumnName || modified) {
        return common_1.findPropIndex('rowKey', rowKey, targetData);
    }
    var start = 0;
    var end = targetData.length - 1;
    while (start <= end) {
        var mid = Math.floor((start + end) / 2);
        var comparedRowKey = targetData[mid].rowKey;
        if (rowKey > comparedRowKey) {
            start = mid + 1;
        }
        else if (rowKey < comparedRowKey) {
            end = mid - 1;
        }
        else {
            return mid;
        }
    }
    return -1;
}
exports.findIndexByRowKey = findIndexByRowKey;
function findRowByRowKey(data, column, id, rowKey, filtered) {
    if (filtered === void 0) { filtered = true; }
    var targetData = filtered ? data.filteredRawData : data.rawData;
    return targetData[findIndexByRowKey(data, column, id, rowKey, filtered)];
}
exports.findRowByRowKey = findRowByRowKey;
function getUniqColumnData(targetData, column, columnName) {
    var columnInfo = column.allColumnMap[columnName];
    var uniqColumnData = common_1.uniqByProp(columnName, targetData.map(function (data) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, data), (_a = {}, _a[columnName] = common_1.isNil(data[columnName]) ? '' : data[columnName], _a)));
    }));
    return uniqColumnData.map(function (row) {
        var value = row[columnName];
        var formatterProps = {
            row: row,
            value: value,
            column: columnInfo,
        };
        var relationListItems = row._relationListItemMap[columnName];
        return data_2.getFormattedValue(formatterProps, columnInfo.formatter, value, relationListItems);
    });
}
exports.getUniqColumnData = getUniqColumnData;
function isSortable(sortState, column, columnName) {
    if (columnName === 'sortKey') {
        return true;
    }
    var _a = column.allColumnMap[columnName], sortable = _a.sortable, hidden = _a.hidden;
    return sortState.useClient && !hidden && sortable;
}
exports.isSortable = isSortable;
function isInitialSortState(_a) {
    var columns = _a.columns;
    return columns.length === 1 && columns[0].columnName === 'sortKey';
}
exports.isInitialSortState = isInitialSortState;
function getRowHeight(row, defaultRowHeight) {
    var _a = row._attributes, height = _a.height, tree = _a.tree;
    var rowHeight = tree && tree.hidden ? 0 : height;
    return common_1.isNumber(rowHeight) ? rowHeight : defaultRowHeight;
}
exports.getRowHeight = getRowHeight;
function getLoadingState(rawData) {
    return rawData.length ? 'DONE' : 'EMPTY';
}
exports.getLoadingState = getLoadingState;
function getAddedClassName(className, prevClassNames) {
    var classNames = className.split(' ');
    var columnClassNames = prevClassNames ? prevClassNames : [];
    return common_1.uniq(tslib_1.__spreadArrays(classNames, columnClassNames));
}
exports.getAddedClassName = getAddedClassName;
function getRemovedClassName(className, prevClassNames) {
    var classNames = className.split(' ');
    var removedClassNames = prevClassNames;
    classNames.forEach(function (clsName) {
        common_1.removeArrayItem(clsName, removedClassNames);
    });
    return removedClassNames;
}
exports.getRemovedClassName = getRemovedClassName;
function getCreatedRowInfo(store, rowIndex, row, rowKey) {
    data_1.generateDataCreationKey();
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData;
    var prevRow = rawData[rowIndex - 1];
    var options = { prevRow: prevRow, lazyObservable: true };
    if (!common_1.isUndefined(rowKey)) {
        row.rowKey = rowKey;
    }
    var index = getMaxRowKey(data);
    var rawRow = data_1.createRawRow(id, tslib_1.__assign(tslib_1.__assign({}, column.emptyRow), row), index, column, options);
    var viewRow = { rowKey: row.rowKey, sortKey: row.sortKey, uniqueKey: row.uniqueKey };
    return { rawRow: rawRow, viewRow: viewRow, prevRow: prevRow };
}
exports.getCreatedRowInfo = getCreatedRowInfo;
function isSorted(data) {
    return data.sortState.columns[0].columnName !== 'sortKey';
}
exports.isSorted = isSorted;
function isFiltered(data) {
    return !common_1.isNull(data.filters);
}
exports.isFiltered = isFiltered;
function getMaxRowKey(data) {
    return Math.max.apply(Math, tslib_1.__spreadArrays([-1], common_1.mapProp('rowKey', data.rawData))) + 1;
}
exports.getMaxRowKey = getMaxRowKey;
function isScrollPagination(_a, useClient) {
    var pageOptions = _a.pageOptions;
    if (common_1.isUndefined(useClient)) {
        return pageOptions.type === 'scroll';
    }
    return useClient && pageOptions.type === 'scroll';
}
exports.isScrollPagination = isScrollPagination;
function isClientPagination(_a) {
    var pageOptions = _a.pageOptions;
    return !common_1.isEmpty(pageOptions) && pageOptions.useClient && pageOptions.type === 'pagination';
}
exports.isClientPagination = isClientPagination;
function getRowIndexPerPage(data, rowIndex) {
    return isClientPagination(data) ? rowIndex % data.pageOptions.perPage : rowIndex;
}
exports.getRowIndexPerPage = getRowIndexPerPage;
function getRowKeyByIndexWithPageRange(data, rowIndex) {
    var _a;
    if (isClientPagination(data)) {
        rowIndex += data.pageRowRange[0];
    }
    return (_a = data.filteredRawData[rowIndex]) === null || _a === void 0 ? void 0 : _a.rowKey;
}
exports.getRowKeyByIndexWithPageRange = getRowKeyByIndexWithPageRange;
function getFormattedValue(store, rowKey, columnName) {
    var data = store.data, column = store.column, id = store.id;
    var rowIndex = findIndexByRowKey(data, column, id, rowKey, false);
    var viewData = data.viewData;
    if (rowIndex !== -1) {
        data_3.makeObservable(store, rowIndex);
        var viewCell = viewData[rowIndex].valueMap[columnName];
        return viewCell ? viewCell.formattedValue : null;
    }
    return null;
}
exports.getFormattedValue = getFormattedValue;
function createChangeInfo(store, row, columnName, pastingValue, index) {
    var id = store.id, column = store.column;
    var rowKey = row.rowKey;
    var prevChange = { rowKey: rowKey, columnName: columnName, value: row[columnName], nextValue: pastingValue };
    var nextChange = { rowKey: rowKey, columnName: columnName, prevValue: row[columnName], value: pastingValue };
    var changeValue = function () {
        var value = prevChange.value, nextValue = prevChange.nextValue;
        validation_1.replaceColumnUniqueInfoMap(id, column, {
            rowKey: rowKey,
            columnName: columnName,
            prevValue: value,
            value: nextValue,
        });
        nextChange.value = nextValue;
        row[columnName] = nextValue;
        return index;
    };
    return { prevChange: prevChange, nextChange: nextChange, changeValue: changeValue };
}
exports.createChangeInfo = createChangeInfo;
function getOmittedInternalProp(row) {
    var additaional = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        additaional[_i - 1] = arguments[_i];
    }
    return common_1.omit.apply(void 0, tslib_1.__spreadArrays([observable_1.getOriginObject(row), 'sortKey',
        'uniqueKey',
        'rowSpanMap',
        '_relationListItemMap',
        '_disabledPriority'], additaional));
}
exports.getOmittedInternalProp = getOmittedInternalProp;
function changeRowToOriginRowForTree(row) {
    var originRow = getOmittedInternalProp(row, 'rowKey', '_attributes');
    if (originRow._children) {
        originRow._children = originRow._children.map(function (childRow) {
            return changeRowToOriginRowForTree(childRow);
        });
    }
    return originRow;
}
function changeRawDataToOriginDataForTree(rawData) {
    return rawData
        .filter(function (row) { var _a, _b; return common_1.isNil((_b = (_a = row._attributes) === null || _a === void 0 ? void 0 : _a.tree) === null || _b === void 0 ? void 0 : _b.parentRowKey); })
        .map(function (row) { return changeRowToOriginRowForTree(row); });
}
exports.changeRawDataToOriginDataForTree = changeRawDataToOriginDataForTree;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventBus = exports.createEventBus = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var instance_1 = __webpack_require__(8);
var eventBusMap = {};
function createEventBus(id) {
    var listenersMap = {};
    eventBusMap[id] = {
        on: function (eventName, func) {
            this.off(eventName, func);
            var listeners = listenersMap[eventName];
            listenersMap[eventName] = listeners ? tslib_1.__spreadArrays(listeners, [func]) : [func];
        },
        off: function (eventName, func) {
            var listeners = listenersMap[eventName];
            if (listeners) {
                if (func) {
                    listenersMap[eventName] = common_1.removeArrayItem(func, listeners);
                }
                else {
                    delete listenersMap[eventName];
                }
            }
        },
        // xuedan
        trigger: function (eventName, gridEvent) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var instance, funcs, i;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!listenersMap[eventName]) return [3 /*break*/, 4];
                            instance = instance_1.getInstance(id);
                            gridEvent.setInstance(instance);
                            funcs = listenersMap[eventName];
                            if (!(funcs.length > 0)) return [3 /*break*/, 4];
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < funcs.length)) return [3 /*break*/, 4];
                            return [4 /*yield*/, funcs[i](gridEvent)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
    };
    return eventBusMap[id];
}
exports.createEventBus = createEventBus;
function getEventBus(id) {
    return eventBusMap[id];
}
exports.getEventBus = getEventBus;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationManager = exports.getDataManager = exports.getDataProvider = exports.getInstance = exports.registerDataSources = exports.register = void 0;
var common_1 = __webpack_require__(0);
var currentId = 0;
var instanceMap = {};
function generateId() {
    currentId += 1;
    return currentId;
}
function register(instance) {
    var id = generateId();
    if (!common_1.isObject(instanceMap[id])) {
        instanceMap[id] = {};
    }
    instanceMap[id].grid = instance;
    return id;
}
exports.register = register;
function registerDataSources(id, dataProvider, dataManager, paginationManager) {
    instanceMap[id].dataProvider = dataProvider;
    instanceMap[id].dataManager = dataManager;
    instanceMap[id].paginationManager = paginationManager;
}
exports.registerDataSources = registerDataSources;
function getInstance(id) {
    return instanceMap[id].grid;
}
exports.getInstance = getInstance;
function getDataProvider(id) {
    return instanceMap[id].dataProvider;
}
exports.getDataProvider = getDataProvider;
function getDataManager(id) {
    return instanceMap[id].dataManager;
}
exports.getDataManager = getDataManager;
function getPaginationManager(id) {
    return instanceMap[id].paginationManager;
}
exports.getPaginationManager = getPaginationManager;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
var column_1 = __webpack_require__(11);
function getTargetInfo(nativeEvent) {
    var targetType = 'etc';
    var target = nativeEvent.target;
    var cell = dom_1.findParentByTagName(target, 'td');
    var rowKey, columnName;
    if (cell) {
        var address = dom_1.getCellAddress(cell);
        if (address) {
            rowKey = address.rowKey;
            columnName = address.columnName;
            targetType = column_1.isRowHeader(address.columnName) ? 'rowHeader' : 'cell';
        }
        else {
            targetType = 'dummy';
        }
    }
    else {
        cell = dom_1.findParentByTagName(target, 'th');
        if (cell) {
            columnName = cell.getAttribute(dom_1.dataAttr.COLUMN_NAME);
            targetType = 'columnHeader';
        }
    }
    return common_1.pruneObject({
        nativeEvent: nativeEvent,
        targetType: targetType,
        rowKey: rowKey,
        columnName: columnName,
    });
}
/**
 * Event class for public event of Grid
 * @module event/gridEvent
 * @param {Object} data - Event data for handler
 */
var GridEvent = /** @class */ (function () {
    function GridEvent(_a) {
        if (_a === void 0) { _a = {}; }
        var event = _a.event, props = tslib_1.__rest(_a, ["event"]);
        this.stopped = false;
        if (event) {
            this.assignData(getTargetInfo(event));
        }
        if (props) {
            this.assignData(props);
        }
    }
    /**
     * Stops propogation of this event.
     * @memberof event/gridEvent
     */
    GridEvent.prototype.stop = function () {
        this.stopped = true;
    };
    GridEvent.prototype.isStopped = function () {
        return this.stopped;
    };
    GridEvent.prototype.assignData = function (data) {
        common_1.assign(this, data);
    };
    GridEvent.prototype.setInstance = function (instance) {
        common_1.assign(this, { instance: instance });
    };
    return GridEvent;
}());
exports.default = GridEvent;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.OCCUPIED_HEIGHT_BY_CELL_LAYOUY = exports.DEFAULT_SUB_CONTEXT_MENU_TOP = exports.HORIZONTAL_PADDING_OF_CELL = exports.DISABLED_PRIORITY_COLUMN = exports.DISABLED_PRIORITY_ROW = exports.DISABLED_PRIORITY_CELL = exports.DISABLED_PRIORITY_NONE = exports.DEFAULT_PER_PAGE = exports.RIGHT_MOUSE_BUTTON = exports.TREE_CELL_HORIZONTAL_PADDING = exports.TREE_INDENT_WIDTH = exports.FILTER_DEBOUNCE_TIME = void 0;
exports.FILTER_DEBOUNCE_TIME = 50;
exports.TREE_INDENT_WIDTH = 22;
exports.TREE_CELL_HORIZONTAL_PADDING = 19;
exports.RIGHT_MOUSE_BUTTON = 2;
exports.DEFAULT_PER_PAGE = 20;
exports.DISABLED_PRIORITY_NONE = 'NONE';
exports.DISABLED_PRIORITY_CELL = 'CELL';
exports.DISABLED_PRIORITY_ROW = 'ROW';
exports.DISABLED_PRIORITY_COLUMN = 'COLUMN';
exports.HORIZONTAL_PADDING_OF_CELL = 10;
exports.DEFAULT_SUB_CONTEXT_MENU_TOP = -6;
exports.OCCUPIED_HEIGHT_BY_CELL_LAYOUY = 9;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isDragColumn = exports.isCheckboxColumn = exports.isRowNumColumn = exports.isRowHeader = void 0;
var common_1 = __webpack_require__(0);
function isRowHeader(columnName) {
    return common_1.includes(['_number', '_checked', '_draggable'], columnName);
}
exports.isRowHeader = isRowHeader;
function isRowNumColumn(columnName) {
    return columnName === '_number';
}
exports.isRowNumColumn = isRowNumColumn;
function isCheckboxColumn(columnName) {
    return columnName === '_checked';
}
exports.isCheckboxColumn = isCheckboxColumn;
function isDragColumn(columnName) {
    return columnName === '_draggable';
}
exports.isDragColumn = isDragColumn;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isDraggableColumn = exports.isDisabledColumn = exports.isAllColumnsVisible = exports.getColumnSide = exports.getChildHeaderCount = exports.getHierarchyMaxRowCount = exports.convertHierarchyToData = exports.getComplexColumnsHierarchy = exports.getRemovedHiddenChildColumns = exports.getColumnHierarchy = exports.isComplexHeader = exports.isEnableFocusColumn = exports.isHiddenColumn = exports.isParentColumnHeader = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var tree_1 = __webpack_require__(20);
function isParentColumnHeader(complexColumnHeaders, name) {
    return !!complexColumnHeaders.length && common_1.some(function (item) { return item.name === name; }, complexColumnHeaders);
}
exports.isParentColumnHeader = isParentColumnHeader;
function isHiddenColumn(column, columnName) {
    return column.allColumnMap[columnName].hidden;
}
exports.isHiddenColumn = isHiddenColumn;
// xuedan modify by xd
function isEnableFocusColumn(column, columnName) {
    return column.allColumnMap[columnName].enableFocus;
}
exports.isEnableFocusColumn = isEnableFocusColumn;
function isComplexHeader(column, columnName) {
    return common_1.some(function (_a) {
        var name = _a.name, hideChildHeaders = _a.hideChildHeaders, childNames = _a.childNames;
        return !!(name === columnName || (hideChildHeaders && common_1.includes(childNames, columnName)));
    }, column.complexColumnHeaders);
}
exports.isComplexHeader = isComplexHeader;
function getColumnHierarchy(column, complexColumnHeaders, mergedComplexColumns) {
    var complexColumns = mergedComplexColumns || [];
    if (column) {
        complexColumns.push(column);
        if (complexColumnHeaders) {
            complexColumnHeaders.forEach(function (complexColumnHeader) {
                if (common_1.includes(complexColumnHeader.childNames, column.name)) {
                    getColumnHierarchy(complexColumnHeader, complexColumnHeaders, complexColumns);
                }
            });
        }
    }
    return complexColumns;
}
exports.getColumnHierarchy = getColumnHierarchy;
function getRemovedHiddenChildColumns(hierarchies) {
    return hierarchies.map(function (columns) {
        if (columns.length > 1) {
            // The hideChildHeaders option always exists in the second column to last.
            var hideChildHeaders = columns[columns.length - 2].hideChildHeaders;
            if (hideChildHeaders) {
                columns.pop();
            }
        }
        return columns;
    });
}
exports.getRemovedHiddenChildColumns = getRemovedHiddenChildColumns;
function getComplexColumnsHierarchy(columns, complexColumnHeaders) {
    return getRemovedHiddenChildColumns(columns.map(function (column) { return getColumnHierarchy(column, complexColumnHeaders).reverse(); }));
}
exports.getComplexColumnsHierarchy = getComplexColumnsHierarchy;
function convertHierarchyToData(hierarchy) {
    var maxRowCount = getHierarchyMaxRowCount(hierarchy);
    var data = [];
    hierarchy.forEach(function (colunms) {
        for (var i = 0; i < maxRowCount; i += 1) {
            if (!Array.isArray(data[i])) {
                data.push([]);
            }
            var colInfo = colunms[i < colunms.length ? i : colunms.length - 1];
            data[i].push(colInfo.header);
        }
    });
    return data;
}
exports.convertHierarchyToData = convertHierarchyToData;
function getHierarchyMaxRowCount(hierarchies) {
    return Math.max.apply(Math, tslib_1.__spreadArrays([0], common_1.mapProp('length', hierarchies)));
}
exports.getHierarchyMaxRowCount = getHierarchyMaxRowCount;
function getChildHeaderCount(columns, complexColumns, name) {
    var count = 0;
    var leafColumn = common_1.someProp('name', name, columns);
    if (!leafColumn) {
        var complexColumn = common_1.findProp('name', name, complexColumns);
        if (complexColumn) {
            complexColumn.childNames.forEach(function (childName) {
                var leafChildColumn = common_1.someProp('name', childName, columns);
                count += leafChildColumn ? 1 : getChildHeaderCount(columns, complexColumns, childName);
            });
        }
    }
    return count;
}
exports.getChildHeaderCount = getChildHeaderCount;
function getColumnSide(column, columnName) {
    return common_1.someProp('name', columnName, column.visibleColumnsBySideWithRowHeader.R) ? 'R' : 'L';
}
exports.getColumnSide = getColumnSide;
function isAllColumnsVisible(column) {
    var columnsWithoutRowHeader = column.columnsWithoutRowHeader, visibleColumns = column.visibleColumns;
    return columnsWithoutRowHeader.length === visibleColumns.length;
}
exports.isAllColumnsVisible = isAllColumnsVisible;
function isDisabledColumn(column, columnName) {
    var targetColumn = common_1.find(function (_a) {
        var name = _a.name;
        return name === columnName;
    }, column.allColumns);
    return !!(targetColumn === null || targetColumn === void 0 ? void 0 : targetColumn.disabled);
}
exports.isDisabledColumn = isDisabledColumn;
function isDraggableColumn(store, columnName) {
    var column = store.column;
    return (column.draggable &&
        isAllColumnsVisible(column) &&
        column.complexColumnHeaders.length === 0 &&
        !tree_1.isTreeColumnName(column, columnName) &&
        !isDisabledColumn(column, columnName));
}
exports.isDraggableColumn = isDraggableColumn;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRowSpanOfColumn2 = exports.getRowSpanOfColumn = exports.isRowSpanEnabled = exports.getMaxRowSpanCount = exports.getRowSpanByRowKey = exports.getRowSpanBottomIndex = exports.getRowSpanTopIndex = exports.getRowSpan = exports.getVerticalPosWithRowSpan = exports.getRowRangeWithRowSpan = exports.getMaxRowSpanRange = void 0;
var common_1 = __webpack_require__(0);
var selection_1 = __webpack_require__(21);
function getMainRowSpan(columnName, rowSpan, data) {
    var mainRow = rowSpan.mainRow, mainRowKey = rowSpan.mainRowKey;
    if (mainRow) {
        return rowSpan;
    }
    var mainRowIndex = common_1.findPropIndex('rowKey', mainRowKey, data);
    return data[mainRowIndex].rowSpanMap[columnName];
}
function getRowSpanRange(rowRange, colRange, visibleColumns, data) {
    var startColumnIndex = colRange[0], endColumnIndex = colRange[1];
    var startRowIndex = rowRange[0], endRowIndex = rowRange[1];
    for (var index = startColumnIndex; index <= endColumnIndex; index += 1) {
        var filteredRawData = data.filteredRawData;
        if (!filteredRawData[startRowIndex] || !filteredRawData[endRowIndex]) {
            continue;
        }
        var startRowSpanMap = filteredRawData[startRowIndex].rowSpanMap;
        var endRowSpanMap = filteredRawData[endRowIndex].rowSpanMap;
        var columnName = visibleColumns[index].name;
        // get top row index of topmost rowSpan
        if (startRowSpanMap[columnName]) {
            var mainRowKey = startRowSpanMap[columnName].mainRowKey;
            var topRowSpanIndex = common_1.findPropIndex('rowKey', mainRowKey, filteredRawData);
            startRowIndex = startRowIndex > topRowSpanIndex ? topRowSpanIndex : startRowIndex;
        }
        // get bottom row index of bottommost rowSpan
        if (endRowSpanMap[columnName]) {
            var _a = endRowSpanMap[columnName], mainRowKey = _a.mainRowKey, spanCount = _a.spanCount;
            var bottomRowSpanIndex = common_1.findPropIndex('rowKey', mainRowKey, filteredRawData) + spanCount - 1;
            endRowIndex = endRowIndex < bottomRowSpanIndex ? bottomRowSpanIndex : endRowIndex;
        }
    }
    return startRowIndex !== rowRange[0] || endRowIndex !== rowRange[1]
        ? getRowSpanRange([startRowIndex, endRowIndex], colRange, visibleColumns, data)
        : [startRowIndex, endRowIndex];
}
function getMaxRowSpanRange(rowRange, colRange, visibleColumns, focusRowIndex, data) {
    var sortedColRange = selection_1.getSortedRange(colRange);
    var endRowIndex = rowRange[1];
    var startRowIndex = rowRange[0];
    // if start row index is different from focused index,
    // change start row index to focused row index for getting proper row range
    startRowIndex =
        !common_1.isNull(focusRowIndex) && startRowIndex !== focusRowIndex ? focusRowIndex : startRowIndex;
    var sortedRowRange = selection_1.getSortedRange([startRowIndex, endRowIndex]);
    var _a = getRowSpanRange(sortedRowRange, sortedColRange, visibleColumns, data), startRowSpanIndex = _a[0], endRowSpanIndex = _a[1];
    return startRowIndex > endRowIndex
        ? [endRowSpanIndex, startRowSpanIndex]
        : [startRowSpanIndex, endRowSpanIndex];
}
exports.getMaxRowSpanRange = getMaxRowSpanRange;
function getRowRangeWithRowSpan(rowRange, colRange, column, rowIndex, data) {
    if (isRowSpanEnabled(data.sortState, column)) {
        return getMaxRowSpanRange(rowRange, colRange, column.visibleColumnsWithRowHeader, rowIndex, data);
    }
    return rowRange;
}
exports.getRowRangeWithRowSpan = getRowRangeWithRowSpan;
function getVerticalPosWithRowSpan(columnName, rowSpan, rowCoords, data) {
    var mainRowSpan = getMainRowSpan(columnName, rowSpan, data);
    var mainRowIndex = common_1.findPropIndex('rowKey', mainRowSpan.mainRowKey, data);
    var spanCount = mainRowSpan.spanCount;
    var top = rowCoords.offsets[mainRowIndex];
    var bottom = top;
    for (var count = 0; count < spanCount; count += 1) {
        bottom += rowCoords.heights[mainRowIndex + count];
    }
    return [top, bottom];
}
exports.getVerticalPosWithRowSpan = getVerticalPosWithRowSpan;
function getRowSpan(rowIndex, columnName, data) {
    var rowSpanMap = data[rowIndex].rowSpanMap;
    return rowSpanMap[columnName];
}
exports.getRowSpan = getRowSpan;
/*
 * get top row index of specific rowSpan cell
 */
function getRowSpanTopIndex(rowIndex, columnName, data) {
    var rowSpan = getRowSpan(rowIndex, columnName, data);
    if (!rowSpan) {
        return rowIndex;
    }
    return common_1.findPropIndex('rowKey', rowSpan.mainRowKey, data);
}
exports.getRowSpanTopIndex = getRowSpanTopIndex;
/*
 * get bottom row index of specific rowSpan cell
 */
function getRowSpanBottomIndex(rowIndex, columnName, data) {
    var rowSpan = getRowSpan(rowIndex, columnName, data);
    if (!rowSpan) {
        return rowIndex;
    }
    var mainRowIndex = common_1.findPropIndex('rowKey', rowSpan.mainRowKey, data);
    return mainRowIndex + rowSpan.spanCount - 1;
}
exports.getRowSpanBottomIndex = getRowSpanBottomIndex;
function getRowSpanByRowKey(rowKey, columnName, data) {
    var rowIndex = common_1.findPropIndex('rowKey', rowKey, data);
    if (rowIndex === -1) {
        return null;
    }
    return getRowSpan(rowIndex, columnName, data) || null;
}
exports.getRowSpanByRowKey = getRowSpanByRowKey;
/*
 * get max rowSpan count in all columns that have rowSpan
 */
function getMaxRowSpanCount(rowIndex, data) {
    var _a;
    var rowSpanMap = (_a = data[rowIndex]) === null || _a === void 0 ? void 0 : _a.rowSpanMap;
    if (common_1.isEmpty(rowSpanMap)) {
        return 0;
    }
    return Object.keys(rowSpanMap).reduce(function (acc, columnName) { return Math.max(acc, rowSpanMap[columnName].spanCount); }, 0);
}
exports.getMaxRowSpanCount = getMaxRowSpanCount;
function isRowSpanEnabled(sortState, column) {
    return (sortState.columns[0].columnName === 'sortKey' || !!(column === null || column === void 0 ? void 0 : column.visibleRowSpanEnabledColumns.length));
}
exports.isRowSpanEnabled = isRowSpanEnabled;
function getRowSpanOfColumn(data, columnName, perPage) {
    var rowSpanOfColumn = {};
    var rowSpan = {};
    var mainRowKey = null;
    var mainRowValue = null;
    data.forEach(function (_a, index) {
        var rowKey = _a.rowKey, _b = columnName, value = _a[_b];
        var isRowInNextPage = perPage && index !== 0 && index % perPage === 0;
        if (mainRowValue !== value || isRowInNextPage) {
            if (!common_1.isNull(mainRowKey) && rowSpan[columnName] !== 1) {
                rowSpanOfColumn[mainRowKey] = rowSpan;
            }
            rowSpan = {};
            rowSpan[columnName] = 1;
            mainRowKey = rowKey;
            mainRowValue = value;
        }
        else {
            rowSpan[columnName] += 1;
        }
    });
    if (!common_1.isNull(mainRowKey) && rowSpan[columnName] !== 1) {
        rowSpanOfColumn[mainRowKey] = rowSpan;
    }
    return rowSpanOfColumn;
}
exports.getRowSpanOfColumn = getRowSpanOfColumn;
// modify by xd
function getRowSpanOfColumn2(data, col, perPage) {
    var rowSpanOfColumn = {};
    var rowSpan = {};
    var mainRowKey = null;
    var mainRow = null;
    var mainRowValue = null;
    var columnName = col.name;
    data.forEach(function (row, index) {
        var _a = row, rowKey = _a.rowKey, _b = columnName, value = _a[_b];
        var isRowInNextPage = perPage && index !== 0 && index % perPage === 0;
        var validate = mainRowValue !== value || isRowInNextPage;
        if (col.rowSpanCompare) {
            validate = !col.rowSpanCompare(mainRow, row);
        }
        if (validate) {
            if (!common_1.isNull(mainRowKey) && rowSpan[columnName] !== 1) {
                rowSpanOfColumn[mainRowKey] = rowSpan;
            }
            rowSpan = {};
            rowSpan[columnName] = 1;
            mainRowKey = rowKey;
            mainRowValue = value;
            mainRow = row;
        }
        else {
            rowSpan[columnName] += 1;
        }
    });
    if (!common_1.isNull(mainRowKey) && rowSpan[columnName] !== 1) {
        rowSpanOfColumn[mainRowKey] = rowSpan;
    }
    return rowSpanOfColumn;
}
exports.getRowSpanOfColumn2 = getRowSpanOfColumn2;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRows = exports.appendRows = exports.scrollToNext = exports.moveRow = exports.setRow = exports.updateRowNumber = exports.setCheckedAllRows = exports.setLoadingState = exports.removeColumnClassName = exports.addColumnClassName = exports.removeCellClassName = exports.addCellClassName = exports.removeRowClassName = exports.addRowClassName = exports.resetData = exports.clearData = exports.removeRow = exports.appendRow = exports.setRowCheckDisabled = exports.setCellDisabled = exports.setColumnDisabled = exports.setRowDisabled = exports.setDisabled = exports.setDisabledAllCheckbox = exports.uncheckAll = exports.checkAll = exports.setCheckboxBetween = exports.setCheckboxRowKeys = exports.uncheck = exports.check = exports.setColumnValues = exports.setAllRowAttribute = exports.setRowsAttributeInRange = exports.setRowAttribute = exports.isUpdatableRowAttr = exports.setValue = exports.makeObservable = exports.updateHeights = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var data_1 = __webpack_require__(15);
var observable_1 = __webpack_require__(5);
var selection_1 = __webpack_require__(16);
var eventBus_1 = __webpack_require__(7);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var instance_1 = __webpack_require__(8);
var tree_1 = __webpack_require__(32);
var rowSpan_1 = __webpack_require__(13);
var focus_1 = __webpack_require__(17);
var tree_2 = __webpack_require__(19);
var sort_1 = __webpack_require__(30);
var data_2 = __webpack_require__(6);
var summary_1 = __webpack_require__(26);
var filter_1 = __webpack_require__(35);
var viewport_1 = __webpack_require__(25);
var column_1 = __webpack_require__(11);
var pagination_1 = __webpack_require__(36);
var rowSpan_2 = __webpack_require__(24);
var lazyObservable_1 = __webpack_require__(29);
var validation_1 = __webpack_require__(27);
var column_2 = __webpack_require__(33);
var renderState_1 = __webpack_require__(48);
var constant_1 = __webpack_require__(10);
function getIndexRangeOfCheckbox(_a, startRowKey, targetRowKey) {
    var data = _a.data, column = _a.column, id = _a.id;
    var filtered = data_2.isFiltered(data);
    var from = data_2.findIndexByRowKey(data, column, id, startRowKey, filtered);
    var to = data_2.findIndexByRowKey(data, column, id, targetRowKey, filtered);
    return from < to ? [from, to + 1] : [to, from + 1];
}
function updateHeightsWithFilteredData(store) {
    var data = store.data, focus = store.focus;
    var filteredRawData = data.filteredRawData;
    var rowKey = focus.rowKey;
    if (!filteredRawData.some(function (row) { return row.rowKey === rowKey; })) {
        focus_1.initFocus(store);
    }
    updateHeights(store);
}
function updateHeights(store) {
    var data = store.data, rowCoords = store.rowCoords, dimension = store.dimension;
    var pageOptions = data.pageOptions, pageRowRange = data.pageRowRange, filteredRawData = data.filteredRawData;
    var rowHeight = dimension.rowHeight;
    rowCoords.heights = pageOptions.useClient
        ? filteredRawData.slice.apply(filteredRawData, pageRowRange).map(function (row) { return data_2.getRowHeight(row, rowHeight); })
        : filteredRawData.map(function (row) { return data_2.getRowHeight(row, rowHeight); });
}
exports.updateHeights = updateHeights;
function makeObservable(store, rowIndex, silent) {
    if (silent === void 0) { silent = false; }
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData, viewData = data.viewData;
    var treeColumnName = column.treeColumnName;
    var rawRow = rawData[rowIndex];
    if (observable_1.isObservable(rawRow)) {
        return;
    }
    if (treeColumnName) {
        var parentRow = data_2.findRowByRowKey(data, column, id, rawRow._attributes.tree.parentRowKey);
        rawData[rowIndex] = tree_2.createTreeRawRow(id, rawRow, parentRow || null, column);
    }
    else {
        rawData[rowIndex] = data_1.createRawRow(id, rawRow, rowIndex, column);
    }
    viewData[rowIndex] = data_1.createViewRow(id, rawData[rowIndex], rawData, column);
    if (!silent) {
        observable_1.notify(data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
    }
}
exports.makeObservable = makeObservable;
function setValue(store, rowKey, columnName, value, checkCellState) {
    if (checkCellState === void 0) { checkCellState = false; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var gridEvent, column, data, id, eventBus, rawData, viewData, sortState, allColumnMap, columnsWithoutRowHeader, rowIndex, targetRow, _a, disabled, editable, targetColumn, orgValue, change, rowSpanMap, columns, index, obj, storage, propObserverIdSetMap, spanCount, count;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    column = store.column, data = store.data, id = store.id;
                    eventBus = eventBus_1.getEventBus(id);
                    rawData = data.rawData, viewData = data.viewData, sortState = data.sortState;
                    allColumnMap = column.allColumnMap, columnsWithoutRowHeader = column.columnsWithoutRowHeader;
                    rowIndex = data_2.findIndexByRowKey(data, column, id, rowKey, false);
                    targetRow = rawData[rowIndex];
                    if (!targetRow || targetRow[columnName] === value) {
                        return [2 /*return*/];
                    }
                    if (checkCellState) {
                        makeObservable(store, rowIndex);
                        _a = viewData[rowIndex].valueMap[columnName], disabled = _a.disabled, editable = _a.editable;
                        if (disabled || !editable) {
                            return [2 /*return*/];
                        }
                    }
                    rowSpan_2.resetRowSpan(store);
                    targetColumn = common_1.findProp('name', columnName, columnsWithoutRowHeader);
                    orgValue = targetRow[columnName];
                    // @TODO: 'onBeforeChange' event is deprecated. This event will be replaced with 'beforeChange' event
                    if (targetColumn && targetColumn.onBeforeChange) {
                        gridEvent = new gridEvent_1.default({ rowKey: rowKey, columnName: columnName, value: orgValue, nextValue: value });
                        targetColumn.onBeforeChange(gridEvent);
                        if (gridEvent.isStopped()) {
                            rowSpan_2.updateRowSpan(store);
                            return [2 /*return*/];
                        }
                    }
                    change = { rowKey: rowKey, columnName: columnName, value: orgValue, nextValue: value };
                    gridEvent = new gridEvent_1.default({ origin: 'cell', changes: [change] });
                    /**
                     * Occurs before one or more cells is changed
                     * @event Grid#beforeChange
                     * @property {string} origin - The type of change('paste', 'delete', 'cell')
                     * @property {Array.<object>} changes - rowKey, column name, original values and next values before changing the values
                     * @property {Grid} instance - Current grid instance
                     */
                    return [4 /*yield*/, eventBus.trigger('beforeChange', gridEvent)];
                case 1:
                    /**
                     * Occurs before one or more cells is changed
                     * @event Grid#beforeChange
                     * @property {string} origin - The type of change('paste', 'delete', 'cell')
                     * @property {Array.<object>} changes - rowKey, column name, original values and next values before changing the values
                     * @property {Grid} instance - Current grid instance
                     */
                    _b.sent();
                    if (gridEvent.isStopped()) {
                        rowSpan_2.updateRowSpan(store);
                        return [2 /*return*/];
                    }
                    value = change.nextValue;
                    rowSpanMap = targetRow.rowSpanMap;
                    columns = sortState.columns;
                    index = common_1.findPropIndex('columnName', columnName, columns);
                    validation_1.replaceColumnUniqueInfoMap(id, column, { rowKey: rowKey, columnName: columnName, prevValue: orgValue, value: value });
                    if (columnName in targetRow) {
                        targetRow[columnName] = value;
                    }
                    else { //update by tangbin
                        obj = targetRow;
                        storage = obj.__storage__;
                        propObserverIdSetMap = obj.__propObserverIdSetMap__;
                        observable_1.makeObservableData(obj, targetRow, columnName, storage, propObserverIdSetMap, false);
                        targetRow[columnName] = value;
                    }
                    data_1.setRowRelationListItems(targetRow, allColumnMap);
                    if (index !== -1) {
                        sort_1.sort(store, columnName, columns[index].ascending, true, false);
                    }
                    setTimeout(function () {
                        updateHeightsWithFilteredData(store);
                    });
                    summary_1.updateSummaryValueByCell(store, columnName, { orgValue: orgValue, value: value });
                    instance_1.getDataManager(id).push('UPDATE', targetRow);
                    if (!common_1.isEmpty(rowSpanMap) && rowSpanMap[columnName] && rowSpan_1.isRowSpanEnabled(sortState, column)) {
                        spanCount = rowSpanMap[columnName].spanCount;
                        // update sub rows value
                        for (count = 1; count < spanCount; count += 1) {
                            rawData[rowIndex + count][columnName] = value;
                            summary_1.updateSummaryValueByCell(store, columnName, { orgValue: orgValue, value: value });
                            instance_1.getDataManager(id).push('UPDATE', rawData[rowIndex + count]);
                        }
                    }
                    column_2.setAutoResizingColumnWidths(store);
                    // @TODO: 'onAfterChange' event is deprecated. This event will be replaced with 'afterChange' event
                    if (targetColumn && targetColumn.onAfterChange) {
                        gridEvent = new gridEvent_1.default({ rowKey: rowKey, columnName: columnName, value: value, prevValue: orgValue });
                        targetColumn.onAfterChange(gridEvent);
                    }
                    gridEvent = new gridEvent_1.default({
                        origin: 'cell',
                        changes: [{ rowKey: rowKey, columnName: columnName, value: value, prevValue: orgValue }],
                    });
                    /**
                     * Occurs after one or more cells is changed
                     * @event Grid#afterChange
                     * @property {string} origin - The type of change('paste', 'delete', 'cell')
                     * @property {Array.<object>} changes - rowKey, column name, previous values and changed values after changing the values
                     * @property {Grid} instance - Current grid instance
                     */
                    return [4 /*yield*/, eventBus.trigger('afterChange', gridEvent)];
                case 2:
                    /**
                     * Occurs after one or more cells is changed
                     * @event Grid#afterChange
                     * @property {string} origin - The type of change('paste', 'delete', 'cell')
                     * @property {Array.<object>} changes - rowKey, column name, previous values and changed values after changing the values
                     * @property {Grid} instance - Current grid instance
                     */
                    _b.sent();
                    rowSpan_2.updateRowSpan(store);
                    return [2 /*return*/];
            }
        });
    });
}
exports.setValue = setValue;
function isUpdatableRowAttr(name, checkDisabled) {
    return !(name === 'checked' && checkDisabled);
}
exports.isUpdatableRowAttr = isUpdatableRowAttr;
function setRowAttribute(_a, rowKey, attrName, value) {
    var data = _a.data, column = _a.column, id = _a.id;
    var targetRow = data_2.findRowByRowKey(data, column, id, rowKey, false);
    // https://github.com/microsoft/TypeScript/issues/34293
    if (targetRow && isUpdatableRowAttr(attrName, targetRow._attributes.checkDisabled)) {
        targetRow._attributes[attrName] = value;
    }
}
exports.setRowAttribute = setRowAttribute;
function setRowsAttributeInRange(store, attrName, value, range) {
    var _a;
    (_a = store.data.filteredRawData).slice.apply(_a, range).forEach(function (row) {
        if (isUpdatableRowAttr(attrName, row._attributes.checkDisabled)) {
            row._attributes[attrName] = value;
        }
    });
}
exports.setRowsAttributeInRange = setRowsAttributeInRange;
function setAllRowAttribute(_a, attrName, value, allPage) {
    var data = _a.data;
    if (allPage === void 0) { allPage = true; }
    var filteredRawData = data.filteredRawData;
    var range = allPage ? [0, filteredRawData.length] : data.pageRowRange;
    filteredRawData.slice.apply(filteredRawData, range).forEach(function (row) {
        if (isUpdatableRowAttr(attrName, row._attributes.checkDisabled)) {
            // https://github.com/microsoft/TypeScript/issues/34293
            row._attributes[attrName] = value;
        }
    });
}
exports.setAllRowAttribute = setAllRowAttribute;
function setColumnValues(store, columnName, value, checkCellState) {
    if (checkCellState === void 0) { checkCellState = false; }
    if (checkCellState) {
        // @TODO: find more practical way to make observable
        lazyObservable_1.createObservableData(store, true);
    }
    var id = store.id, data = store.data, column = store.column;
    data.rawData.forEach(function (targetRow, index) {
        var valid = true;
        if (checkCellState) {
            var _a = data.viewData[index].valueMap[columnName], disabled = _a.disabled, editable = _a.editable;
            valid = !disabled && editable;
        }
        if (targetRow[columnName] !== value && valid) {
            validation_1.replaceColumnUniqueInfoMap(id, column, {
                rowKey: targetRow.rowKey,
                columnName: columnName,
                prevValue: targetRow[columnName],
                value: value,
            });
            targetRow[columnName] = value;
            instance_1.getDataManager(id).push('UPDATE', targetRow);
        }
    });
    summary_1.updateSummaryValueByColumn(store, columnName, { value: value });
    validation_1.forceValidateUniquenessOfColumn(data.rawData, column, columnName);
    column_2.setAutoResizingColumnWidths(store);
    rowSpan_2.updateRowSpan(store);
}
exports.setColumnValues = setColumnValues;
function check(store, rowKey) {
    var id = store.id, column = store.column, data = store.data;
    var allColumnMap = column.allColumnMap, _a = column.treeColumnName, treeColumnName = _a === void 0 ? '' : _a;
    var eventBus = eventBus_1.getEventBus(id);
    var gridEvent = new gridEvent_1.default({ rowKey: rowKey });
    data.clickedCheckboxRowkey = rowKey;
    setRowAttribute(store, rowKey, 'checked', true);
    if (allColumnMap[treeColumnName]) {
        tree_1.changeTreeRowsCheckedState(store, rowKey, true);
    }
    observable_1.asyncInvokeObserver(function () {
        setCheckedAllRows(store);
    });
    /**
     * Occurs when a checkbox in row header is checked
     * @event Grid#check
     * @property {number | string} rowKey - rowKey of the checked row
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('check', gridEvent);
}
exports.check = check;
function uncheck(store, rowKey) {
    var id = store.id, column = store.column, data = store.data;
    var allColumnMap = column.allColumnMap, _a = column.treeColumnName, treeColumnName = _a === void 0 ? '' : _a;
    var eventBus = eventBus_1.getEventBus(id);
    var gridEvent = new gridEvent_1.default({ rowKey: rowKey });
    data.clickedCheckboxRowkey = rowKey;
    setRowAttribute(store, rowKey, 'checked', false);
    if (allColumnMap[treeColumnName]) {
        tree_1.changeTreeRowsCheckedState(store, rowKey, false);
    }
    observable_1.asyncInvokeObserver(function () {
        setCheckedAllRows(store);
    });
    /**
     * Occurs when a checkbox in row header is unchecked
     * @event Grid#uncheck
     * @property {number | string} rowKey - rowKey of the unchecked row
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('uncheck', gridEvent);
}
exports.uncheck = uncheck;
//update by tangbin
function setCheckboxRowKeys(store, rowKeys, value) {
    var data = store.data;
    if (!rowKeys || rowKeys.length == 0) {
        return;
    }
    data.clickedCheckboxRowkey = rowKeys[rowKeys.length - 1];
    var attrName = "checked";
    store.data.filteredRawData.forEach(function (row) {
        if (isUpdatableRowAttr(attrName, row._attributes.checkDisabled)) {
            if (rowKeys.indexOf(row.rowKey) >= 0) {
                row._attributes[attrName] = value;
            }
            else {
                row._attributes[attrName] = !value;
            }
        }
    });
    setCheckedAllRows(store);
}
exports.setCheckboxRowKeys = setCheckboxRowKeys;
function setCheckboxBetween(store, value, startRowKey, endRowKey) {
    var data = store.data;
    var clickedCheckboxRowkey = data.clickedCheckboxRowkey;
    var targetRowKey = endRowKey || clickedCheckboxRowkey;
    data.clickedCheckboxRowkey = startRowKey;
    if (common_1.isNil(targetRowKey)) {
        if (value) {
            check(store, startRowKey);
        }
        else {
            uncheck(store, startRowKey);
        }
        return;
    }
    var range = getIndexRangeOfCheckbox(store, startRowKey, targetRowKey);
    setRowsAttributeInRange(store, 'checked', value, range);
    setCheckedAllRows(store);
}
exports.setCheckboxBetween = setCheckboxBetween;
function checkAll(store, allPage) {
    var id = store.id;
    setAllRowAttribute(store, 'checked', true, allPage);
    setCheckedAllRows(store);
    observable_1.notify(store.data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
    var eventBus = eventBus_1.getEventBus(id);
    var gridEvent = new gridEvent_1.default();
    /**
     * Occurs when a checkbox in header is checked(checked all checkbox in row header)
     * @event Grid#checkAll
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('checkAll', gridEvent);
}
exports.checkAll = checkAll;
function uncheckAll(store, allPage) {
    var id = store.id;
    setAllRowAttribute(store, 'checked', false, allPage);
    setCheckedAllRows(store);
    observable_1.notify(store.data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
    var eventBus = eventBus_1.getEventBus(id);
    var gridEvent = new gridEvent_1.default();
    /**
     * Occurs when a checkbox in header is unchecked(unchecked all checkbox in row header)
     * @event Grid#uncheckAll
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('uncheckAll', gridEvent);
}
exports.uncheckAll = uncheckAll;
function setDisabledAllCheckbox(_a) {
    var data = _a.data;
    var rawData = data.rawData;
    data.disabledAllCheckbox =
        !!rawData.length && rawData.every(function (row) { return row._attributes.checkDisabled; });
}
exports.setDisabledAllCheckbox = setDisabledAllCheckbox;
function setRowOrColumnDisabled(target, disabled) {
    if (target.disabled === disabled) {
        observable_1.notify(target, 'disabled');
    }
    else {
        target.disabled = disabled;
    }
}
// @TODO consider the client pagination with disabled
function setDisabled(store, disabled) {
    var data = store.data, column = store.column;
    data.rawData.forEach(function (row) {
        row._disabledPriority = {};
        setAllRowAttribute(store, 'disabled', disabled);
        setAllRowAttribute(store, 'checkDisabled', disabled);
    });
    column.columnsWithoutRowHeader.forEach(function (columnInfo) {
        columnInfo.disabled = disabled;
    });
    data.disabledAllCheckbox = disabled;
}
exports.setDisabled = setDisabled;
function setRowDisabled(store, disabled, rowKey, withCheckbox) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_2.findRowByRowKey(data, column, id, rowKey, false);
    if (row) {
        var _attributes = row._attributes, _disabledPriority_1 = row._disabledPriority;
        column.allColumns.forEach(function (columnInfo) {
            _disabledPriority_1[columnInfo.name] = constant_1.DISABLED_PRIORITY_ROW;
        });
        if (withCheckbox) {
            _attributes.checkDisabled = disabled;
            setDisabledAllCheckbox(store);
        }
        setRowOrColumnDisabled(_attributes, disabled);
    }
}
exports.setRowDisabled = setRowDisabled;
function setColumnDisabled(_a, disabled, columnName) {
    var data = _a.data, column = _a.column;
    if (column_1.isRowHeader(columnName)) {
        return;
    }
    data.rawData.forEach(function (row) {
        row._disabledPriority[columnName] = constant_1.DISABLED_PRIORITY_COLUMN;
    });
    setRowOrColumnDisabled(column.allColumnMap[columnName], disabled);
}
exports.setColumnDisabled = setColumnDisabled;
function setCellDisabled(store, disabled, rowKey, columnName) {
    var data = store.data, column = store.column, id = store.id;
    if (column_1.isRowNumColumn(columnName) || column_1.isDragColumn(columnName)) {
        return;
    }
    var row = data_2.findRowByRowKey(data, column, id, rowKey, false);
    if (row) {
        var _attributes = row._attributes, _disabledPriority = row._disabledPriority;
        _disabledPriority[columnName] = disabled ? constant_1.DISABLED_PRIORITY_CELL : constant_1.DISABLED_PRIORITY_NONE;
        if (column_1.isCheckboxColumn(columnName)) {
            _attributes.checkDisabled = disabled;
            setDisabledAllCheckbox(store);
        }
        observable_1.notify(row, '_disabledPriority');
    }
}
exports.setCellDisabled = setCellDisabled;
function setRowCheckDisabled(store, disabled, rowKey) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_2.findRowByRowKey(data, column, id, rowKey, false);
    if (row) {
        row._attributes.checkDisabled = disabled;
        setDisabledAllCheckbox(store);
    }
}
exports.setRowCheckDisabled = setRowCheckDisabled;
function appendRow(store, row, options) {
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData, viewData = data.viewData, sortState = data.sortState, pageOptions = data.pageOptions;
    var _a = options.at, at = _a === void 0 ? rawData.length : _a, extendPrevRowSpan = options.extendPrevRowSpan;
    var _b = data_2.getCreatedRowInfo(store, at, row), rawRow = _b.rawRow, viewRow = _b.viewRow, prevRow = _b.prevRow;
    var inserted = at !== rawData.length;
    common_1.silentSplice(rawData, at, 0, rawRow);
    common_1.silentSplice(viewData, at, 0, viewRow);
    makeObservable(store, at);
    pagination_1.updatePageOptions(store, { totalCount: pageOptions.totalCount + 1 });
    updateHeights(store);
    if (inserted) {
        sort_1.updateSortKey(data, at);
    }
    sort_1.sortByCurrentState(store);
    if (rowSpan_1.isRowSpanEnabled(sortState, column)) {
        if (prevRow) {
            rowSpan_2.updateRowSpanWhenAppending(rawData, prevRow, extendPrevRowSpan || false);
        }
        rowSpan_2.updateRowSpan(store);
    }
    instance_1.getDataManager(id).push('CREATE', rawRow, inserted);
    summary_1.updateSummaryValueByRow(store, rawRow, { type: 'APPEND' });
    postUpdateAfterManipulation(store, at, 'DONE', [rawRow]);
}
exports.appendRow = appendRow;
function removeRow(store, rowKey, options) {
    var data = store.data, id = store.id, focus = store.focus, column = store.column;
    var rawData = data.rawData, viewData = data.viewData, sortState = data.sortState;
    var rowIndex = data_2.findIndexByRowKey(data, column, id, rowKey, false);
    if (rowIndex === -1) {
        return;
    }
    var removedRow = {};
    var nextRow = rawData[rowIndex + 1];
    pagination_1.updatePageWhenRemovingRow(store, 1);
    validation_1.removeUniqueInfoMap(id, rawData[rowIndex], column);
    observable_1.batchObserver(function () {
        removedRow = rawData.splice(rowIndex, 1)[0];
    });
    viewData.splice(rowIndex, 1);
    updateHeights(store);
    if (!common_1.someProp('rowKey', focus.rowKey, rawData)) {
        focus_1.initFocus(store);
    }
    selection_1.initSelection(store);
    if (nextRow && rowSpan_1.isRowSpanEnabled(sortState, column)) {
        rowSpan_2.updateRowSpanWhenRemoving(rawData, removedRow, nextRow, options.keepRowSpanData || false);
    }
    if (rowIndex !== rawData.length) {
        sort_1.updateSortKey(data, removedRow.sortKey + 1, false);
    }
    instance_1.getDataManager(id).push('DELETE', removedRow);
    summary_1.updateSummaryValueByRow(store, removedRow, { type: 'REMOVE' });
    postUpdateAfterManipulation(store, rowIndex, data_2.getLoadingState(rawData));
}
exports.removeRow = removeRow;
function clearData(store) {
    var data = store.data, id = store.id, rowCoords = store.rowCoords;
    validation_1.createNewValidationMap(id);
    viewport_1.initScrollPosition(store);
    focus_1.initFocus(store);
    selection_1.initSelection(store);
    sort_1.initSortState(data);
    filter_1.initFilter(store);
    rowCoords.heights = [];
    data.rawData = [];
    data.viewData = [];
    pagination_1.updatePageOptions(store, { totalCount: 0, page: 1 }, true);
    summary_1.updateAllSummaryValues(store);
    setLoadingState(store, 'EMPTY');
    setCheckedAllRows(store);
    instance_1.getDataManager(id).clearAll();
}
exports.clearData = clearData;
function resetData(store, inputData, options) {
    var data = store.data, column = store.column, id = store.id;
    var sortState = options.sortState, filterState = options.filterState, pageState = options.pageState;
    validation_1.createNewValidationMap(id);
    var _a = data_1.createData(id, inputData, column, { lazyObservable: true }), rawData = _a.rawData, viewData = _a.viewData;
    var eventBus = eventBus_1.getEventBus(id);
    var gridEvent = new gridEvent_1.default();
    viewport_1.initScrollPosition(store);
    focus_1.initFocus(store);
    selection_1.initSelection(store);
    sort_1.resetSortState(store, sortState);
    filter_1.resetFilterState(store, filterState);
    pagination_1.resetPageState(store, rawData.length, pageState);
    data.rawData = rawData;
    data.viewData = viewData;
    updateHeights(store);
    summary_1.updateAllSummaryValues(store);
    setLoadingState(store, data_2.getLoadingState(rawData));
    setCheckedAllRows(store);
    instance_1.getDataManager(id).setOriginData(inputData);
    instance_1.getDataManager(id).clearAll();
    column_2.setColumnWidthsByText(store);
    rowSpan_2.updateRowSpan(store);
    setTimeout(function () {
        /**
         * Occurs when the grid data is updated and the grid is rendered onto the DOM
         * The event occurs only in the following API as below.
         * 'resetData', 'restore', 'reloadData', 'readData', 'setPerPage' with 'dataSource', using 'dataSource'
         * @event Grid#onGridUpdated
         * @property {Grid} instance - Current grid instance
         */
        eventBus.trigger('onGridUpdated', gridEvent);
    });
}
exports.resetData = resetData;
function addRowClassName(store, rowKey, className) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_2.findRowByRowKey(data, column, id, rowKey, false);
    if (row) {
        var rowClassMap = row._attributes.className.row;
        var isExist = common_1.includes(rowClassMap, className);
        if (!isExist) {
            rowClassMap.push(className);
            observable_1.notify(row._attributes, 'className');
        }
    }
}
exports.addRowClassName = addRowClassName;
function removeRowClassName(store, rowKey, className) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_2.findRowByRowKey(data, column, id, rowKey, false);
    if (row) {
        common_1.removeArrayItem(className, row._attributes.className.row);
        observable_1.notify(row._attributes, 'className');
    }
}
exports.removeRowClassName = removeRowClassName;
function addClassNameToAttribute(row, columnName, className) {
    var columnClassNames = row._attributes.className.column[columnName];
    row._attributes.className.column[columnName] = data_2.getAddedClassName(className, columnClassNames);
    observable_1.notify(row._attributes, 'className');
}
function removeClassNameToAttribute(row, columnName, className) {
    var columnClassNames = row._attributes.className.column[columnName];
    if (columnClassNames) {
        row._attributes.className.column[columnName] = data_2.getRemovedClassName(className, columnClassNames);
    }
    observable_1.notify(row._attributes, 'className');
}
function addCellClassName(store, rowKey, columnName, className) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_2.findRowByRowKey(data, column, id, rowKey, false);
    if (row) {
        addClassNameToAttribute(row, columnName, className);
    }
}
exports.addCellClassName = addCellClassName;
function removeCellClassName(store, rowKey, columnName, className) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_2.findRowByRowKey(data, column, id, rowKey);
    if (row) {
        removeClassNameToAttribute(row, columnName, className);
    }
}
exports.removeCellClassName = removeCellClassName;
function addColumnClassName(_a, columnName, className) {
    var data = _a.data;
    var rawData = data.rawData;
    rawData.forEach(function (row) {
        addClassNameToAttribute(row, columnName, className);
    });
}
exports.addColumnClassName = addColumnClassName;
function removeColumnClassName(_a, columnName, className) {
    var data = _a.data;
    var rawData = data.rawData;
    rawData.forEach(function (row) {
        removeClassNameToAttribute(row, columnName, className);
    });
}
exports.removeColumnClassName = removeColumnClassName;
function setLoadingState(_a, state) {
    var data = _a.data;
    data.loadingState = state;
}
exports.setLoadingState = setLoadingState;
function setCheckedAllRows(_a) {
    var data = _a.data;
    var filteredRawData = data.filteredRawData, pageRowRange = data.pageRowRange;
    var result = false;
    if (filteredRawData.length) {
        var enableCheckRows = filteredRawData
            .slice.apply(filteredRawData, pageRowRange).filter(function (row) { return !row._attributes.checkDisabled; });
        result = !!enableCheckRows.length && enableCheckRows.every(function (row) { return row._attributes.checked; });
    }
    data.checkedAllRows = result;
    observable_1.notify(data, 'filteredViewData');
}
exports.setCheckedAllRows = setCheckedAllRows;
function updateRowNumber(_a, startIndex) {
    var data = _a.data;
    var rawData = data.rawData;
    for (var idx = startIndex; idx < rawData.length; idx += 1) {
        rawData[idx]._attributes.rowNum = idx + 1;
    }
}
exports.updateRowNumber = updateRowNumber;
function setRow(store, rowIndex, row) {
    var data = store.data, id = store.id, column = store.column;
    var rawData = data.rawData, viewData = data.viewData, sortState = data.sortState;
    var orgRow = rawData[rowIndex];
    if (!orgRow) {
        return;
    }
    validation_1.removeUniqueInfoMap(id, orgRow, column);
    row.sortKey = orgRow.sortKey;
    var _a = data_2.getCreatedRowInfo(store, rowIndex, row, orgRow.rowKey), rawRow = _a.rawRow, viewRow = _a.viewRow, prevRow = _a.prevRow;
    common_1.silentSplice(rawData, rowIndex, 1, rawRow);
    common_1.silentSplice(viewData, rowIndex, 1, viewRow);
    makeObservable(store, rowIndex);
    sort_1.sortByCurrentState(store);
    if (prevRow && rowSpan_1.isRowSpanEnabled(sortState, column)) {
        rowSpan_2.updateRowSpanWhenAppending(rawData, prevRow, false);
    }
    instance_1.getDataManager(id).push('UPDATE', rawRow);
    setTimeout(function () {
        updateHeightsWithFilteredData(store);
    });
    summary_1.updateSummaryValueByRow(store, rawRow, { type: 'SET', orgRow: orgRow });
    postUpdateAfterManipulation(store, rowIndex, 'DONE');
    rowSpan_2.updateRowSpan(store);
}
exports.setRow = setRow;
function moveRow(store, rowKey, targetIndex) {
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData, viewData = data.viewData;
    if (!rawData[targetIndex] || data_2.isSorted(data) || data_2.isFiltered(data)) {
        return;
    }
    var currentIndex = data_2.findIndexByRowKey(data, column, id, rowKey, false);
    if (currentIndex === -1) {
        return;
    }
    var minIndex = Math.min(currentIndex, targetIndex);
    var rawRow = common_1.silentSplice(rawData, currentIndex, 1)[0];
    var viewRow = common_1.silentSplice(viewData, currentIndex, 1)[0];
    observable_1.batchObserver(function () {
        rawData.splice(targetIndex, 0, rawRow);
    });
    viewData.splice(targetIndex, 0, viewRow);
    renderState_1.fitRowHeightWhenMovingRow(store, currentIndex, targetIndex);
    sort_1.resetSortKey(data, minIndex);
    updateRowNumber(store, minIndex);
    instance_1.getDataManager(id).push('UPDATE', rawRow, true);
}
exports.moveRow = moveRow;
function scrollToNext(store) {
    var data = store.data, id = store.id;
    var _a = data.pageOptions, page = _a.page, totalCount = _a.totalCount, perPage = _a.perPage, useClient = _a.useClient;
    if (data_2.isScrollPagination(data)) {
        if (useClient) {
            data.pageOptions.page += 1;
            observable_1.notify(data, 'pageOptions');
            sort_1.sortByCurrentState(store);
            updateHeights(store);
            setCheckedAllRows(store);
        }
        else if (page * perPage < totalCount) {
            data.pageOptions.page += 1;
            instance_1.getDataProvider(id).readData(data.pageOptions.page);
        }
    }
}
exports.scrollToNext = scrollToNext;
function appendRows(store, inputData) {
    var data = store.data, column = store.column, id = store.id;
    var startIndex = data.rawData.length;
    var _a = data_1.createData(id, inputData, column, { lazyObservable: true }), rawData = _a.rawData, viewData = _a.viewData;
    if (!column.keyColumnName) {
        var rowKey_1 = data_2.getMaxRowKey(data);
        rawData.forEach(function (row, index) {
            row.rowKey = rowKey_1 + index;
        });
        viewData.forEach(function (row, index) {
            row.rowKey = rowKey_1 + index;
        });
    }
    var newRawData = data.rawData.concat(rawData);
    var newViewData = data.viewData.concat(viewData);
    data.rawData = newRawData;
    data.viewData = newViewData;
    sort_1.resetSortKey(data, startIndex);
    sort_1.sortByCurrentState(store);
    updateHeights(store);
    rawData.forEach(function (rawRow) { return instance_1.getDataManager(id).push('CREATE', rawRow); });
    postUpdateAfterManipulation(store, startIndex, 'DONE', rawData);
    rowSpan_2.updateRowSpan(store);
}
exports.appendRows = appendRows;
function removeRows(store, targetRows) {
    var data = store.data, id = store.id, focus = store.focus, column = store.column;
    var sortState = data.sortState, viewData = data.viewData, rawData = data.rawData;
    var rowIndexes = targetRows.rowIndices, rows = targetRows.rows, nextRows = targetRows.nextRows;
    var deletedCount = rowIndexes.length;
    pagination_1.updatePageWhenRemovingRow(store, deletedCount);
    rowIndexes.forEach(function (rowIndex, i) {
        var nextRow = nextRows[i];
        var removedRow = common_1.silentSplice(rawData, rowIndex - i, 1)[0];
        common_1.silentSplice(viewData, rowIndex - i, 1);
        validation_1.removeUniqueInfoMap(id, removedRow, column);
        if (nextRow) {
            if (rowSpan_1.isRowSpanEnabled(sortState, column)) {
                rowSpan_2.updateRowSpanWhenRemoving(rawData, removedRow, nextRow, false);
            }
        }
        instance_1.getDataManager(id).push('DELETE', removedRow);
        sort_1.updateSortKey(data, removedRow.sortKey + 1, false);
    });
    observable_1.notify(data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
    updateHeights(store);
    if (common_1.someProp('rowKey', focus.rowKey, rows)) {
        focus_1.initFocus(store);
    }
    selection_1.initSelection(store);
    summary_1.updateAllSummaryValues(store);
    postUpdateAfterManipulation(store, rowIndexes[0], data_2.getLoadingState(rawData));
}
exports.removeRows = removeRows;
function postUpdateAfterManipulation(store, rowIndex, state, rows) {
    setLoadingState(store, state);
    updateRowNumber(store, rowIndex);
    setDisabledAllCheckbox(store);
    setCheckedAllRows(store);
    validation_1.forceValidateUniquenessOfColumns(store.data.rawData, store.column);
    column_2.setAutoResizingColumnWidths(store, rows);
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.createData = exports.createRawRow = exports.setRowRelationListItems = exports.createViewRow = exports.createRowSpan = exports.generateDataCreationKey = void 0;
var tslib_1 = __webpack_require__(1);
var observable_1 = __webpack_require__(5);
var column_1 = __webpack_require__(11);
var common_1 = __webpack_require__(0);
var tree_1 = __webpack_require__(19);
var validation_1 = __webpack_require__(27);
var data_1 = __webpack_require__(6);
var data_2 = __webpack_require__(23);
var constant_1 = __webpack_require__(10);
var dataCreationKey = '';
function generateDataCreationKey() {
    dataCreationKey = "@dataKey" + Date.now();
    return dataCreationKey;
}
exports.generateDataCreationKey = generateDataCreationKey;
function getRelationCbResult(fn, relationParams) {
    var result = common_1.isFunction(fn) ? fn(relationParams) : null;
    return common_1.isUndefined(result) ? null : result;
}
function getEditable(fn, relationParams) {
    var result = getRelationCbResult(fn, relationParams);
    return result === null ? true : result;
}
function getDisabled(fn, relationParams) {
    var result = getRelationCbResult(fn, relationParams);
    return result === null ? false : result;
}
function getListItems(fn, relationParams) {
    return getRelationCbResult(fn, relationParams) || [];
}
function getRowHeaderValue(row, columnName) {
    if (column_1.isRowNumColumn(columnName)) {
        return row._attributes.rowNum;
    }
    if (column_1.isCheckboxColumn(columnName)) {
        return row._attributes.checked;
    }
    return '';
}
function createRowSpan(mainRow, rowKey, count, spanCount) {
    return { mainRow: mainRow, mainRowKey: rowKey, count: count, spanCount: spanCount };
}
exports.createRowSpan = createRowSpan;
function createViewCell(id, row, column, _a) {
    var _b = _a.isDataModified, isDataModified = _b === void 0 ? false : _b, prevInvalidStates = _a.prevInvalidStates, _c = _a.relationInfo, relationInfo = _c === void 0 ? {} : _c;
    var _d = relationInfo.relationMatched, relationMatched = _d === void 0 ? true : _d, relationListItems = relationInfo.relationListItems;
    var name = column.name, formatter = column.formatter, editor = column.editor, validation = column.validation, defaultValue = column.defaultValue;
    var value = column_1.isRowHeader(name) ? getRowHeaderValue(row, name) : row[name];
    if (common_1.isNil(value) && !common_1.isNil(defaultValue)) {
        value = defaultValue;
    }
    if (!relationMatched) {
        value = '';
    }
    var formatterProps = { row: row, column: column, value: value };
    var _e = row._attributes, disabled = _e.disabled, checkDisabled = _e.checkDisabled, classNameAttr = _e.className;
    var columnDisabled = !!column.disabled;
    var rowDisabled = column_1.isCheckboxColumn(name) ? checkDisabled : disabled;
    var columnClassName = common_1.isUndefined(classNameAttr.column[name]) ? [] : classNameAttr.column[name];
    var className = tslib_1.__spreadArrays(classNameAttr.row, columnClassName).join(' ');
    var _disabledPriority = row._disabledPriority[name];
    var cellDisabled = rowDisabled || columnDisabled;
    if (_disabledPriority === constant_1.DISABLED_PRIORITY_CELL) {
        cellDisabled = true;
    }
    else if (_disabledPriority === constant_1.DISABLED_PRIORITY_NONE) {
        cellDisabled = false;
    }
    else if (_disabledPriority === constant_1.DISABLED_PRIORITY_COLUMN) {
        cellDisabled = columnDisabled;
    }
    else if (_disabledPriority === constant_1.DISABLED_PRIORITY_ROW) {
        cellDisabled = rowDisabled;
    }
    var usePrevInvalidStates = !isDataModified && !common_1.isNil(prevInvalidStates);
    var invalidStates = usePrevInvalidStates
        ? prevInvalidStates
        : validation_1.getValidationCode({ id: id, value: row[name], row: row, validation: validation, columnName: name });
    return {
        editable: !!editor,
        className: className,
        disabled: cellDisabled,
        invalidStates: invalidStates,
        formattedValue: data_2.getFormattedValue(formatterProps, formatter, value, relationListItems),
        value: value,
    };
}
function createRelationViewCell(id, name, row, _a) {
    var columnMap = _a.columnMap, valueMap = _a.valueMap;
    var _b = valueMap[name], editable = _b.editable, disabled = _b.disabled, value = _b.value;
    var _c = columnMap[name].relationMap, relationMap = _c === void 0 ? {} : _c;
    Object.keys(relationMap).forEach(function (targetName) {
        var _a = relationMap[targetName], editableCallback = _a.editable, disabledCallback = _a.disabled, listItemsCallback = _a.listItems;
        var relationCbParams = { value: value, editable: editable, disabled: disabled, row: row };
        var targetEditable = getEditable(editableCallback, relationCbParams);
        var targetDisabled = getDisabled(disabledCallback, relationCbParams);
        var targetListItems = getListItems(listItemsCallback, relationCbParams);
        var targetValue = row[targetName];
        var targetEditor = columnMap[targetName].editor;
        var targetEditorOptions = targetEditor === null || targetEditor === void 0 ? void 0 : targetEditor.options;
        var relationMatched = common_1.isFunction(listItemsCallback)
            ? common_1.someProp('value', targetValue, targetListItems)
            : true;
        var cellData = createViewCell(id, row, columnMap[targetName], {
            relationInfo: {
                relationMatched: relationMatched,
                relationListItems: targetListItems,
            },
        });
        if (!targetEditable) {
            cellData.editable = false;
        }
        if (targetDisabled) {
            cellData.disabled = true;
        }
        // should set the relation list to relationListItemMap for preventing to share relation list in other rows
        if (targetEditorOptions) {
            targetEditorOptions.relationListItemMap = targetEditorOptions.relationListItemMap || {};
            targetEditorOptions.relationListItemMap[row.rowKey] = targetListItems;
        }
        valueMap[targetName] = cellData;
    });
}
function createViewRow(id, row, rawData, column) {
    var rowKey = row.rowKey, sortKey = row.sortKey, rowSpanMap = row.rowSpanMap, uniqueKey = row.uniqueKey;
    var columnMap = column.columnMapWithRelation;
    var treeColumnName = column.treeColumnName, _a = column.treeIcon, treeIcon = _a === void 0 ? true : _a, treeIndentWidth = column.treeIndentWidth;
    var initValueMap = {};
    Object.keys(columnMap).forEach(function (name) {
        initValueMap[name] = null;
    });
    var cachedValueMap = {};
    var valueMap = observable_1.observable(initValueMap);
    var __unobserveFns__ = [];
    Object.keys(columnMap).forEach(function (name) {
        var _a = columnMap[name], related = _a.related, relationMap = _a.relationMap, className = _a.className;
        if (className) {
            row._attributes.className.column[name] = className.split(' ');
        }
        // add condition expression to prevent to call watch function recursively
        if (!related) {
            __unobserveFns__.push(observable_1.observe(function (calledBy) {
                var _a;
                var isDataModified = calledBy !== 'className';
                cachedValueMap[name] = createViewCell(id, row, columnMap[name], {
                    isDataModified: isDataModified,
                    prevInvalidStates: (_a = cachedValueMap[name]) === null || _a === void 0 ? void 0 : _a.invalidStates,
                });
                valueMap[name] = cachedValueMap[name];
            }));
        }
        if (relationMap && Object.keys(relationMap).length) {
            __unobserveFns__.push(observable_1.observe(function () {
                createRelationViewCell(id, name, row, { columnMap: columnMap, valueMap: valueMap });
            }));
        }
    });
    return tslib_1.__assign({ rowKey: rowKey,
        sortKey: sortKey,
        uniqueKey: uniqueKey,
        rowSpanMap: rowSpanMap,
        valueMap: valueMap,
        __unobserveFns__: __unobserveFns__ }, (treeColumnName && {
        treeInfo: tree_1.createTreeCellInfo(rawData, row, treeIndentWidth, treeIcon),
    }));
}
exports.createViewRow = createViewRow;
function getAttributes(row, index, lazyObservable, disabled) {
    var defaultAttr = {
        rowNum: index + 1,
        checked: false,
        disabled: disabled,
        checkDisabled: disabled,
        className: {
            row: [],
            column: {},
        },
    };
    if (row._attributes) {
        if (common_1.isBoolean(row._attributes.disabled) && common_1.isUndefined(row._attributes.checkDisabled)) {
            row._attributes.checkDisabled = row._attributes.disabled;
        }
        if (!common_1.isUndefined(row._attributes.className)) {
            row._attributes.className = tslib_1.__assign({ row: [], column: {} }, row._attributes.className);
        }
    }
    var attributes = tslib_1.__assign(tslib_1.__assign({}, defaultAttr), row._attributes);
    return lazyObservable ? attributes : observable_1.observable(attributes);
}
function createRelationListItems(name, row, columnMap) {
    var _a = columnMap[name], _b = _a.relationMap, relationMap = _b === void 0 ? {} : _b, editor = _a.editor;
    var _c = row._attributes, checkDisabled = _c.checkDisabled, rowDisabled = _c.disabled;
    var editable = !!editor;
    var disabled = column_1.isCheckboxColumn(name) ? checkDisabled : rowDisabled;
    var value = row[name];
    var relationCbParams = { value: value, editable: editable, disabled: disabled, row: row };
    var relationListItemMap = {};
    Object.keys(relationMap).forEach(function (targetName) {
        relationListItemMap[targetName] = getListItems(relationMap[targetName].listItems, relationCbParams);
    });
    return relationListItemMap;
}
function setRowRelationListItems(row, columnMap) {
    var relationListItemMap = tslib_1.__assign({}, row._relationListItemMap);
    Object.keys(columnMap).forEach(function (name) {
        common_1.assign(relationListItemMap, createRelationListItems(name, row, columnMap));
    });
    row._relationListItemMap = relationListItemMap;
}
exports.setRowRelationListItems = setRowRelationListItems;
function createMainRowSpanMap(rowSpan, rowKey) {
    var mainRowSpanMap = {};
    if (!rowSpan) {
        return mainRowSpanMap;
    }
    Object.keys(rowSpan).forEach(function (columnName) {
        var spanCount = rowSpan[columnName];
        mainRowSpanMap[columnName] = createRowSpan(true, rowKey, spanCount, spanCount);
    });
    return mainRowSpanMap;
}
function createSubRowSpan(prevRowSpanMap) {
    var subRowSpanMap = {};
    Object.keys(prevRowSpanMap).forEach(function (columnName) {
        var prevRowSpan = prevRowSpanMap[columnName];
        var mainRowKey = prevRowSpan.mainRowKey, count = prevRowSpan.count, spanCount = prevRowSpan.spanCount;
        if (spanCount > 1 - count) {
            var subRowCount = count >= 0 ? -1 : count - 1;
            subRowSpanMap[columnName] = createRowSpan(false, mainRowKey, subRowCount, spanCount);
        }
    });
    return subRowSpanMap;
}
function createRowSpanMap(row, rowSpan, prevRow) {
    var rowKey = row.rowKey;
    var mainRowSpanMap = {};
    var subRowSpanMap = {};
    if (!common_1.isEmpty(rowSpan)) {
        mainRowSpanMap = createMainRowSpanMap(rowSpan, rowKey);
    }
    if (prevRow) {
        var prevRowSpanMap = prevRow.rowSpanMap;
        if (!common_1.isEmpty(prevRowSpanMap)) {
            subRowSpanMap = createSubRowSpan(prevRowSpanMap);
        }
    }
    return tslib_1.__assign(tslib_1.__assign({}, mainRowSpanMap), subRowSpanMap);
}
function createRawRow(id, row, index, column, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    // this rowSpan variable is attribute option before creating rowSpanDataMap
    var rowSpan = (_a = row._attributes) === null || _a === void 0 ? void 0 : _a.rowSpan;
    var prevRow = options.prevRow, _c = options.lazyObservable, lazyObservable = _c === void 0 ? false : _c, _d = options.disabled, disabled = _d === void 0 ? false : _d;
    var keyColumnName = options.keyColumnName;
    if (!keyColumnName) {
        keyColumnName = column.keyColumnName;
    }
    if (keyColumnName) {
        row.rowKey = row[keyColumnName];
    }
    else if (common_1.isUndefined(row.rowKey)) {
        row.rowKey = index;
    }
    row.sortKey = common_1.isNumber(row.sortKey) ? row.sortKey : index;
    row.uniqueKey = dataCreationKey + "-" + row.rowKey;
    row._attributes = getAttributes(row, index, lazyObservable, disabled);
    row._attributes.rowSpan = rowSpan;
    row._disabledPriority = row._disabledPriority || {};
    row.rowSpanMap = (_b = row.rowSpanMap) !== null && _b !== void 0 ? _b : createRowSpanMap(row, rowSpan, prevRow);
    setRowRelationListItems(row, column.columnMapWithRelation);
    if (column.autoResizingColumn.length) {
        data_2.setMaxTextMap(column, row);
    }
    if (lazyObservable) {
        validation_1.addUniqueInfoMap(id, row, column);
    }
    return (lazyObservable ? row : observable_1.observable(row));
}
exports.createRawRow = createRawRow;
function createData(id, data, column, _a) {
    var _b = _a.lazyObservable, lazyObservable = _b === void 0 ? false : _b, prevRows = _a.prevRows, _c = _a.disabled, disabled = _c === void 0 ? false : _c;
    generateDataCreationKey();
    var keyColumnName = column.keyColumnName, _d = column.treeColumnName, treeColumnName = _d === void 0 ? '' : _d;
    var rawData;
    // Notify when using deprecated option "_attribute.rowSpan".
    var isUseRowSpanOption = data.some(function (row) { var _a; return (_a = row._attributes) === null || _a === void 0 ? void 0 : _a.rowSpan; });
    if (isUseRowSpanOption) {
        // eslint-disable-next-line no-console
        console.warn('The option "_attribute.rowSpan" is deprecated. Please use rowSpan option of column.\nFollow example: http://nhn.github.io/tui.grid/latest/tutorial-example29-dynamic-row-span');
    }
    if (treeColumnName) {
        rawData = tree_1.createTreeRawData({
            id: id,
            data: data,
            column: column,
            keyColumnName: keyColumnName,
            lazyObservable: lazyObservable,
            disabled: disabled,
        }, null);
    }
    else {
        rawData = data.map(function (row, index, rows) {
            return createRawRow(id, row, index, column, {
                keyColumnName: keyColumnName,
                prevRow: prevRows ? prevRows[index] : rows[index - 1],
                lazyObservable: lazyObservable,
                disabled: disabled,
            });
        });
    }
    var viewData = rawData.map(function (row) {
        return lazyObservable
            ? { rowKey: row.rowKey, sortKey: row.sortKey, uniqueKey: row.uniqueKey }
            : createViewRow(id, row, rawData, column);
    });
    return { rawData: rawData, viewData: viewData };
}
exports.createData = createData;
var cachedFilteredIndex = {};
function applyFilterToRawData(rawData, filters, columnMap) {
    var data = rawData;
    cachedFilteredIndex = {};
    if (filters) {
        data = filters.reduce(function (acc, filter) {
            var conditionFn = filter.conditionFn, columnName = filter.columnName;
            var formatter = columnMap[columnName].formatter;
            return acc.filter(function (row, index) {
                var value = row[columnName];
                var relationListItems = row._relationListItemMap[columnName];
                var formatterProps = { row: row, column: columnMap[columnName], value: value };
                var filtered = conditionFn(data_2.getFormattedValue(formatterProps, formatter, value, relationListItems));
                // cache the filtered index for performance
                if (acc === rawData && filtered) {
                    cachedFilteredIndex[row.rowKey] = index;
                }
                else if (!filtered) {
                    cachedFilteredIndex[row.rowKey] = null;
                }
                return filtered;
            });
        }, rawData);
    }
    return data;
}
function createPageOptions(userPageOptions, rawData) {
    var pageOptions = (common_1.isEmpty(userPageOptions)
        ? {}
        : tslib_1.__assign(tslib_1.__assign({ useClient: false, page: 1, perPage: constant_1.DEFAULT_PER_PAGE, type: 'pagination' }, userPageOptions), { totalCount: userPageOptions.useClient ? rawData.length : userPageOptions.totalCount }));
    if (pageOptions.type === 'pagination') {
        pageOptions.position = pageOptions.position || 'bottom';
        pageOptions.visiblePages = pageOptions.visiblePages || 10;
    }
    return pageOptions;
}
function create(_a) {
    var data = _a.data, column = _a.column, userPageOptions = _a.pageOptions, useClientSort = _a.useClientSort, disabled = _a.disabled, id = _a.id;
    var _b = createData(id, data, column, { lazyObservable: true, disabled: disabled }), rawData = _b.rawData, viewData = _b.viewData;
    var sortState = {
        useClient: useClientSort,
        columns: [
            {
                columnName: 'sortKey',
                ascending: true,
            },
        ],
    };
    var pageOptions = createPageOptions(userPageOptions, rawData);
    return observable_1.observable({
        rawData: rawData,
        viewData: viewData,
        sortState: sortState,
        pageOptions: pageOptions,
        checkedAllRows: rawData.length ? !rawData.some(function (row) { return !row._attributes.checked; }) : false,
        disabledAllCheckbox: disabled,
        filters: null,
        loadingState: rawData.length ? 'DONE' : 'EMPTY',
        clickedCheckboxRowkey: null,
        get filteredRawData() {
            var _a;
            if (this.filters) {
                // should filter the sliced data which is displayed in viewport in case of client infinite scrolling
                var targetData = data_1.isScrollPagination(this, true)
                    ? (_a = this.rawData).slice.apply(_a, this.pageRowRange) : this.rawData;
                return applyFilterToRawData(targetData, this.filters, column.allColumnMap);
            }
            return this.rawData;
        },
        get filteredIndex() {
            var _a = this, filteredRawData = _a.filteredRawData, filters = _a.filters;
            return filters
                ? filteredRawData
                    .filter(function (row) { return !common_1.isNull(cachedFilteredIndex[row.rowKey]); })
                    .map(function (row) { return cachedFilteredIndex[row.rowKey]; })
                : null;
        },
        get filteredViewData() {
            var _this = this;
            return this.filters
                ? this.filteredIndex.map(function (index) { return _this.viewData[index]; })
                : this.viewData;
        },
        get pageRowRange() {
            var _a = this.pageOptions, useClient = _a.useClient, type = _a.type, page = _a.page, perPage = _a.perPage;
            var start = 0;
            // should calculate the range through all rawData in case of client infinite scrolling
            var end = data_1.isScrollPagination(this, true) ? this.rawData.length : this.filteredViewData.length;
            if (useClient) {
                var pageRowLastIndex = page * perPage;
                if (type === 'pagination') {
                    start = (page - 1) * perPage;
                }
                end = pageRowLastIndex > 0 && pageRowLastIndex < end ? pageRowLastIndex : end;
            }
            return [start, end];
        },
    });
}
exports.create = create;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.initSelection = exports.setSelection = exports.changeSelectionRange = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var eventBus_1 = __webpack_require__(7);
var selection_1 = __webpack_require__(21);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var rowSpan_1 = __webpack_require__(13);
function changeSelectionRange(selection, inputRange, id) {
    if (!selection_1.isSameInputRange(selection.inputRange, inputRange)) {
        selection.inputRange = inputRange;
        var eventBus = eventBus_1.getEventBus(id);
        var gridEvent = new gridEvent_1.default({ range: selection.rangeWithRowHeader });
        /**
         * Occurs when selecting cells
         * @event Grid#selection
         * @property {Object} range - Range of selection
         * @property {Array} range.start - Info of start cell (ex: [rowKey, columnName])
         * @property {Array} range.end - Info of end cell (ex: [rowKey, columnName])
         * @property {Grid} instance - Current grid instance
         */
        eventBus.trigger('selection', gridEvent);
    }
}
exports.changeSelectionRange = changeSelectionRange;
function setSelection(store, range) {
    var _a;
    var selection = store.selection, data = store.data, column = store.column, id = store.id;
    var visibleColumnsWithRowHeader = column.visibleColumnsWithRowHeader, rowHeaderCount = column.rowHeaderCount;
    var viewData = data.viewData;
    var rowLength = viewData.length;
    var columnLength = visibleColumnsWithRowHeader.length;
    var startRowIndex = common_1.clamp(range.start[0], 0, rowLength - 1);
    var endRowIndex = common_1.clamp(range.end[0], 0, rowLength - 1);
    var startColumnIndex = common_1.clamp(range.start[1] + rowHeaderCount, rowHeaderCount, columnLength - 1);
    var endColumnIndex = common_1.clamp(range.end[1] + rowHeaderCount, rowHeaderCount, columnLength - 1);
    _a = rowSpan_1.getRowRangeWithRowSpan([startRowIndex, endRowIndex], [startColumnIndex, endColumnIndex], column, null, data), startRowIndex = _a[0], endRowIndex = _a[1];
    var inputRange = {
        row: [startRowIndex, endRowIndex],
        column: [startColumnIndex, endColumnIndex],
    };
    changeSelectionRange(selection, inputRange, id);
}
exports.setSelection = setSelection;
function initSelection(store) {
    store.selection.inputRange = null;
}
exports.initSelection = initSelection;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.setFocusInfo = exports.saveAndFinishEditing = exports.initFocus = exports.changeFocus = exports.finishEditing = exports.startEditing = void 0;
var tslib_1 = __webpack_require__(1);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var eventBus_1 = __webpack_require__(7);
var data_1 = __webpack_require__(6);
var focus_1 = __webpack_require__(43);
var rowSpan_1 = __webpack_require__(13);
var data_2 = __webpack_require__(14);
var common_1 = __webpack_require__(0);
var column_1 = __webpack_require__(12);
function startEditing(store, rowKey, columnName) {
    var data = store.data, focus = store.focus, column = store.column, id = store.id;
    var filteredRawData = data.filteredRawData;
    var foundIndex = data_1.findIndexByRowKey(data, column, id, rowKey);
    if (foundIndex === -1) {
        return;
    }
    // makes the data observable to judge editable, disable of the cell
    data_2.makeObservable(store, data_1.findIndexByRowKey(data, column, id, rowKey, false));
    if (!data_1.isEditableCell(store, foundIndex, columnName)) {
        return;
    }
    var eventBus = eventBus_1.getEventBus(id);
    var gridEvent = new gridEvent_1.default({
        rowKey: rowKey,
        columnName: columnName,
        value: filteredRawData[foundIndex][columnName],
    });
    /**
     * Occurs when editing the cell is started
     * @event Grid#editingStart
     * @property {number} rowKey - rowKey of the target cell
     * @property {number} columnName - columnName of the target cell
     * @property {number | string | boolean | null | undefined} value - value of the editing cell
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('editingStart', gridEvent);
    if (!gridEvent.isStopped()) {
        focus.forcedDestroyEditing = false;
        focus.navigating = false;
        focus.editingAddress = { rowKey: rowKey, columnName: columnName };
    }
}
exports.startEditing = startEditing;
// @TODO: Events should be separated(ex.'editingFinish', 'editingCanceled')
function finishEditing(_a, rowKey, columnName, value, editingInfo) {
    var focus = _a.focus, id = _a.id;
    if (focus_1.isEditingCell(focus, rowKey, columnName)) {
        focus.editingAddress = null;
        focus.navigating = true;
    }
    var eventBus = eventBus_1.getEventBus(id);
    var gridEvent = new gridEvent_1.default(tslib_1.__assign({ rowKey: rowKey, columnName: columnName, value: value }, editingInfo));
    /**
     * Occurs when editing the cell is finished
     * @event Grid#editingFinish
     * @property {number} rowKey - rowKey of the target cell
     * @property {number} columnName - columnName of the target cell
     * @property {number | string | boolean | null | undefined} value - value of the editing cell
     * @property {Grid} instance - Current grid instance
     * @property {boolean} save - Whether to save the value
     * @property {boolean} triggeredByKey - Whether to trigger the event by key
     */
    eventBus.trigger('editingFinish', gridEvent);
}
exports.finishEditing = finishEditing;
function changeFocus(store, rowKey, columnName, id) {
    var data = store.data, focus = store.focus, column = store.column;
    if (focus_1.isFocusedCell(focus, rowKey, columnName) ||
        (columnName && column_1.isHiddenColumn(column, columnName)) || (columnName && !column_1.isEnableFocusColumn(column, columnName))) {
        return;
    }
    var rawData = data.rawData, sortState = data.sortState;
    var eventBus = eventBus_1.getEventBus(id);
    var gridEvent = new gridEvent_1.default({
        rowKey: rowKey,
        columnName: columnName,
        prevColumnName: focus.columnName,
        prevRowKey: focus.rowKey,
    });
    /**
     * Occurs when focused cell is about to change
     * @event Grid#focusChange
     * @property {number} rowKey - rowKey of the target cell
     * @property {number} columnName - columnName of the target cell
     * @property {number} prevRowKey - rowKey of the currently focused cell
     * @property {number} prevColumnName - columnName of the currently focused cell
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('focusChange', gridEvent);
    if (!gridEvent.isStopped()) {
        var focusRowKey = rowKey;
        if (rowKey && columnName && rowSpan_1.isRowSpanEnabled(sortState, column)) {
            var rowSpan = rowSpan_1.getRowSpanByRowKey(rowKey, columnName, rawData);
            if (rowSpan) {
                focusRowKey = rowSpan.mainRowKey;
            }
        }
        focus.prevColumnName = focus.columnName;
        focus.prevRowKey = focus.rowKey;
        focus.columnName = columnName;
        focus.rowKey = focusRowKey;
    }
}
exports.changeFocus = changeFocus;
function initFocus(_a) {
    var focus = _a.focus;
    focus.editingAddress = null;
    focus.navigating = false;
    focus.rowKey = null;
    focus.columnName = null;
    focus.prevRowKey = null;
    focus.prevColumnName = null;
}
exports.initFocus = initFocus;
function saveAndFinishEditing(store, value) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var focus, data, column, id, editingAddress, rowKey, columnName;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    focus = store.focus, data = store.data, column = store.column, id = store.id;
                    editingAddress = focus.editingAddress;
                    if (!editingAddress) {
                        return [2 /*return*/];
                    }
                    rowKey = editingAddress.rowKey, columnName = editingAddress.columnName;
                    // makes the data observable to judge editable, disable of the cell.
                    data_2.makeObservable(store, data_1.findIndexByRowKey(data, column, id, rowKey, false));
                    // if value is 'undefined', editing result is saved and finished.
                    if (common_1.isUndefined(value)) {
                        focus.forcedDestroyEditing = true;
                        focus.editingAddress = null;
                        focus.navigating = true;
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, data_2.setValue(store, rowKey, columnName, value)];
                case 1:
                    _a.sent();
                    finishEditing(store, rowKey, columnName, value, { save: true });
                    return [2 /*return*/];
            }
        });
    });
}
exports.saveAndFinishEditing = saveAndFinishEditing;
function setFocusInfo(store, rowKey, columnName, navigating) {
    var focus = store.focus, id = store.id;
    focus.navigating = navigating;
    changeFocus(store, rowKey, columnName, id);
}
exports.setFocusInfo = setFocusInfo;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var messages = {
    en: {
        display: {
            noData: 'No data.',
            loadingData: 'Loading data.',
            resizeHandleGuide: 'You can change the width of the column by mouse drag, and initialize the width by double-clicking.',
        },
        net: {
            confirmCreate: 'Are you sure you want to create {{count}} data?',
            confirmUpdate: 'Are you sure you want to update {{count}} data?',
            confirmDelete: 'Are you sure you want to delete {{count}} data?',
            confirmModify: 'Are you sure you want to modify {{count}} data?',
            noDataToCreate: 'No data to create.',
            noDataToUpdate: 'No data to update.',
            noDataToDelete: 'No data to delete.',
            noDataToModify: 'No data to modify.',
            failResponse: 'An error occurred while requesting data.\nPlease try again.',
        },
        filter: {
            contains: 'Contains',
            eq: 'Equals',
            ne: 'Not equals',
            start: 'Starts with',
            end: 'Ends with',
            after: 'After',
            afterEq: 'After or Equal',
            before: 'Before',
            beforeEq: 'Before or Equal',
            apply: 'Apply',
            clear: 'Clear',
            selectAll: 'Select All',
            emptyValue: 'Empty Value',
        },
        contextMenu: {
            copy: '复制',
            copyColumns: '复制列',
            copyRows: '复制行',
            export: '导出',
            csvExport: '导出CSV',
            excelExport: '导出Excel',
        },
    },
    pt: {
        display: {
            noData: 'Nenhuma informação.',
            loadingData: 'Carregando informações.',
            resizeHandleGuide: 'Você pode alterar a largura da coluna arrastando o mouse e inicializar a largura clicando duas vezes.',
        },
        net: {
            confirmCreate: 'Tem certeza que deseja criar {{count}} dados?',
            confirmUpdate: 'Tem ceretza que deseja atualizar {{count}} dados?',
            confirmDelete: 'Tem certeza que deseja apagar {{count}} dados?',
            confirmModify: 'Tem certeza que deseja modificar {{count}} dados?',
            noDataToCreate: 'Não há informação a criar.',
            noDataToUpdate: 'Não há informação a atualizar.',
            noDataToDelete: 'Não há informação a apagar.',
            noDataToModify: 'Não há informação a modificar.',
            failResponse: 'Um erro ocorreu euquanto processava sua solicitação.\nPor favor, tente novamente.',
        },
        filter: {
            contains: 'Contém',
            eq: 'Igual',
            ne: 'Diferente de',
            start: 'Começa com',
            end: 'Termina com',
            after: 'Depois',
            afterEq: 'Depois ou igual',
            before: 'Antes',
            beforeEq: 'Antes ou igual',
            apply: 'Aplicar',
            clear: 'Limpar',
            selectAll: 'Selecionar tudo',
            emptyValue: 'Está vazio',
        },
        contextMenu: {
            copy: 'Copiar',
            copyColumns: 'Copiar colunas',
            copyRows: 'Copiar linhas',
            export: 'Exportar',
            csvExport: 'Exportar CSV',
            excelExport: 'Exportar Excel',
        },
    },
    es: {
        display: {
            noData: 'No hay información.',
            loadingData: 'Cargando información.',
            resizeHandleGuide: 'Puedes cambiar el ancho de la columna arrastrando el ratón e inicializar el ancho haciendo doble clic.',
        },
        net: {
            confirmCreate: '¿Estás seguro que quieres crear {{count}} filas?',
            confirmUpdate: '¿Estás seguro que quieres actualizar {{count}} filas?',
            confirmDelete: '¿Estás seguro que quieres eliminar {{count}} filas?',
            confirmModify: '¿Estás seguro que quieres modificar {{count}} filas?',
            noDataToCreate: 'No hay información para crear.',
            noDataToUpdate: 'No hay información para actualizar.',
            noDataToDelete: 'No hay información para eliminar.',
            noDataToModify: 'No hay información para modificar.',
            failResponse: 'Se produjo un error al solicitar datos. \nVuelve a intentarlo.',
        },
        filter: {
            contains: 'Contiene',
            eq: 'Igual',
            ne: 'Distinto',
            start: 'Empieza con',
            end: 'Termina en',
            after: 'Después',
            afterEq: 'Después o Igual',
            before: 'Antes',
            beforeEq: 'Antes o Igual',
            apply: 'Aplicar',
            clear: 'Limpiar',
            selectAll: 'Seleccionar Todo',
            emptyValue: 'Vaciar Valor',
        },
        contextMenu: {
            copy: 'Copiar',
            copyColumns: 'Copiar Columnas',
            copyRows: 'Copiar Filas',
            export: 'exportar',
            csvExport: 'CSV exportar',
            excelExport: 'Excel exportar',
        },
    },
    ko: {
        display: {
            noData: '데이터가 존재하지 않습니다.',
            loadingData: '데이터를 불러오는 중입니다.',
            resizeHandleGuide: '마우스 드래그하여 컬럼 너비를 조정할 수 있고, 더블 클릭으로 컬럼 너비를 초기화할 수 있습니다.',
        },
        net: {
            confirmCreate: '{{count}}건의 데이터를 생성하겠습니까?',
            confirmUpdate: '{{count}}건의 데이터를 수정하겠습니까?',
            confirmDelete: '{{count}}건의 데이터를 삭제하겠습니까?',
            confirmModify: '{{count}}건의 데이터를 처리하겠습니까?',
            noDataToCreate: '생성할 데이터가 없습니다.',
            noDataToUpdate: '수정할 데이터가 없습니다.',
            noDataToDelete: '삭제할 데이터가 없습니다.',
            noDataToModify: '처리할 데이터가 없습니다.',
            failResponse: '데이터 요청 중에 에러가 발생하였습니다.\n다시 시도하여 주시기 바랍니다.',
        },
        filter: {
            contains: 'Contains',
            eq: 'Equals',
            ne: 'Not equals',
            start: 'Starts with',
            end: 'Ends with',
            after: 'After',
            afterEq: 'After or Equal',
            before: 'Before',
            beforeEq: 'Before or Equal',
            apply: 'Apply',
            clear: 'Clear',
            selectAll: 'Select All',
            emptyValue: 'Empty Value',
        },
        contextMenu: {
            copy: '복사',
            copyColumns: '열 복사',
            copyRows: '행 복사',
            export: '내보내기',
            csvExport: 'CSV로 내보내기',
            excelExport: '엑셀로 내보내기',
        },
    },
    nl: {
        display: {
            noData: 'Geen data.',
            loadingData: 'Data aan het laden.',
            resizeHandleGuide: 'Je kunt de kolombreedte verschuiven met de muis, of terugbrengen naar standaard door dubbel te klikken',
        },
        net: {
            confirmCreate: 'Weet je zeker dat je {{count}} nieuwe wilt maken?',
            confirmUpdate: 'Weet je zeker dat je {{count}} stuk(s) wilt bijwerken?',
            confirmDelete: 'Weet je zeker dat je {{count}} stuk(s) wilt verwijderen?',
            confirmModify: 'Weet je zeker dat je {{count}} stuk(s) wilt aanpassen?',
            noDataToCreate: 'Niets om aan te maken.',
            noDataToUpdate: 'Niets om bij te werken.',
            noDataToDelete: 'Niets om te verwijderen.',
            noDataToModify: 'Niets om aan te passen.',
            failResponse: 'Er ging iets mis tijdens het ophalen van de data.\nProbeer het nog eens.',
        },
        filter: {
            contains: 'Bevat',
            eq: 'Is',
            ne: 'Is niet',
            start: 'Begint met',
            end: 'Eindigt met',
            after: 'Na',
            afterEq: 'Na of gelijk aan',
            before: 'Voor',
            beforeEq: 'Voor of gelijk aan',
            apply: 'Toepassen',
            clear: 'Leeg maken',
            selectAll: 'Selecteer alle',
            emptyValue: 'Lege waarde',
        },
        contextMenu: {
            copy: 'Kopieer',
            copyColumns: 'Kopieer kolommen',
            copyRows: 'Kopieer rijen',
            export: 'Exporteer',
            csvExport: 'Maak CSV Export',
            excelExport: 'Maak Excel Export',
        },
    },
    it: {
        display: {
            noData: 'Nessun dato.',
            loadingData: 'Caricamento dati.',
            resizeHandleGuide: 'È possibile modificare la larghezza della colonna trascinando il mouse e inizializzare la larghezza facendo doppio clic.',
        },
        net: {
            confirmCreate: 'Sei sicuro di voler creare {{count}} dati?',
            confirmUpdate: 'Sei sicuro di voler aggiornare {{count}} dati?',
            confirmDelete: 'Sei sicuro di voler eliminare {{count}} dati?',
            confirmModify: 'Sei sicuro di voler modificare {{count}} dati?',
            noDataToCreate: 'Nessun dato da creare.',
            noDataToUpdate: 'Nessun dato da aggiornare.',
            noDataToDelete: 'Nessun dato da eliminare.',
            noDataToModify: 'Nessun dato da modificare.',
            failResponse: 'Si è verificato un errore durante la richiesta dei dati.\nPer favore riprova.',
        },
        filter: {
            contains: 'Contiene',
            eq: 'Uguale',
            ne: 'Non è uguale',
            start: 'Inizia con',
            end: 'Finisce con',
            after: 'Dopo',
            afterEq: 'Dopo o Uguale',
            before: 'Prima',
            beforeEq: 'Prima o Uguale',
            apply: 'Applicare',
            clear: 'Chiari',
            selectAll: 'Seleziona tutto',
            emptyValue: 'Valore vuoto',
        },
        contextMenu: {
            copy: 'Copia',
            copyColumns: 'Copia colonne',
            copyRows: 'Copia righe',
            export: 'Esportare',
            csvExport: 'Esportazione CSV',
            excelExport: 'Esportazione Excel',
        },
    },
};
var messageMap = {};
/**
 * Flatten message map
 * @param {object} data - Messages
 * @returns {object} Flatten message object (key format is 'key.subKey')
 * @ignore
 */
function flattenMessageMap(data) {
    if (data === void 0) { data = {}; }
    var obj = {};
    var newKey;
    Object.keys(data).forEach(function (key) {
        var keyWithType = key;
        var groupMessages = data[keyWithType];
        Object.keys(groupMessages).forEach(function (subKey) {
            newKey = key + "." + subKey;
            obj[newKey] = groupMessages[subKey];
        });
    });
    return obj;
}
/**
 * Replace text
 * @param {string} text - Text including handlebar expression
 * @param {Object} values - Replaced values
 * @returns {string} Replaced text
 */
function replaceText(text, values) {
    return text
        ? text.replace(/\{\{(\w*)\}\}/g, function (_, prop) { return (values.hasOwnProperty(prop) ? values[prop] : ''); })
        : '';
}
exports.default = {
    /**
     * Set messages
     * @param {string} localeCode - Code to set locale messages and
     *     this is the language or language-region combination. (ex: en-US)
     * @param {object} [data] - Messages using in Grid
     */
    setLanguage: function (localeCode, data) {
        var localeMessages = messages[localeCode];
        if (!localeMessages && !data) {
            throw new Error('You should set messages to map the locale code.');
        }
        var newData = flattenMessageMap(data);
        if (localeMessages) {
            var originData = flattenMessageMap(localeMessages);
            messageMap = tslib_1.__assign(tslib_1.__assign({}, originData), newData);
        }
        else {
            messageMap = newData;
        }
    },
    /**
     * Get message
     * @param {string} key - Key to find message (ex: 'net.confirmCreate')
     * @param {object} [replacements] - Values to replace string
     * @returns {string} Message
     */
    get: function (key, replacements) {
        if (replacements === void 0) { replacements = {}; }
        var message = messageMap[key];
        return replaceText(message, replacements);
    },
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getTreeIndentWidth = exports.createTreeCellInfo = exports.createTreeRawData = exports.flattenTreeData = exports.createTreeRawRow = exports.clearTreeRowKeyMap = void 0;
var tslib_1 = __webpack_require__(1);
var data_1 = __webpack_require__(15);
var tree_1 = __webpack_require__(20);
var observable_1 = __webpack_require__(5);
var common_1 = __webpack_require__(0);
var constant_1 = __webpack_require__(10);
var treeRowKeyMap = {};
function clearTreeRowKeyMap(id) {
    delete treeRowKeyMap[id];
}
exports.clearTreeRowKeyMap = clearTreeRowKeyMap;
function generateTreeRowKey(id) {
    var _a;
    treeRowKeyMap[id] = (_a = treeRowKeyMap[id]) !== null && _a !== void 0 ? _a : -1;
    treeRowKeyMap[id] += 1;
    return treeRowKeyMap[id];
}
function addChildRowKey(row, childRow) {
    var tree = row._attributes.tree;
    var rowKey = childRow.rowKey;
    if (tree && !common_1.includes(tree.childRowKeys, rowKey)) {
        tree.childRowKeys.push(rowKey);
    }
    if (!common_1.someProp('rowKey', rowKey, row._children)) {
        row._children.push(childRow);
    }
    row._leaf = false;
}
function insertChildRowKey(row, childRow, offset) {
    var tree = row._attributes.tree;
    var rowKey = childRow.rowKey;
    if (tree && !common_1.includes(tree.childRowKeys, rowKey)) {
        tree.childRowKeys.splice(offset, 0, rowKey);
    }
    if (!common_1.someProp('rowKey', rowKey, row._children)) {
        row._children.splice(offset, 0, childRow);
    }
    row._leaf = false;
}
function getTreeCellInfo(rawData, row, treeIndentWidth, useIcon) {
    var depth = tree_1.getDepth(rawData, row);
    var indentWidth = getTreeIndentWidth(depth, treeIndentWidth, useIcon);
    return {
        depth: depth,
        indentWidth: indentWidth,
        leaf: tree_1.isLeaf(row),
        expanded: tree_1.isExpanded(row),
    };
}
function createTreeRawRow(id, row, parentRow, column, options) {
    if (options === void 0) { options = {}; }
    var childRowKeys = [];
    if (row._attributes && row._attributes.tree) {
        childRowKeys = row._attributes.tree.childRowKeys;
    }
    var keyColumnName = options.keyColumnName, offset = options.offset, _a = options.lazyObservable, lazyObservable = _a === void 0 ? false : _a, _b = options.disabled, disabled = _b === void 0 ? false : _b;
    if (!row._children) {
        row._children = [];
        row._leaf = true;
    }
    // generate new tree rowKey when row doesn't have rowKey
    var targetTreeRowKey = common_1.isUndefined(row.rowKey) ? generateTreeRowKey(id) : Number(row.rowKey); //xuedan
    var rawRow = data_1.createRawRow(id, row, targetTreeRowKey, column, {
        keyColumnName: keyColumnName,
        lazyObservable: lazyObservable,
        disabled: disabled,
    });
    var defaultAttributes = {
        parentRowKey: parentRow ? parentRow.rowKey : null,
        childRowKeys: childRowKeys,
        hidden: parentRow ? !tree_1.isExpanded(parentRow) || tree_1.isHidden(parentRow) : false,
    };
    if (parentRow) {
        if (!common_1.isUndefined(offset)) {
            insertChildRowKey(parentRow, rawRow, offset);
        }
        else {
            addChildRowKey(parentRow, rawRow);
        }
    }
    var tree = tslib_1.__assign(tslib_1.__assign({}, defaultAttributes), { expanded: row._attributes.expanded });
    rawRow._attributes.tree = lazyObservable ? tree : observable_1.observable(tree);
    return rawRow;
}
exports.createTreeRawRow = createTreeRawRow;
function flattenTreeData(id, data, parentRow, column, options) {
    var flattenedRows = [];
    data.forEach(function (row) {
        var rawRow = createTreeRawRow(id, row, parentRow, column, options);
        flattenedRows.push(rawRow);
        if (Array.isArray(row._children)) {
            if (row._children.length) {
                flattenedRows.push.apply(flattenedRows, flattenTreeData(id, row._children, rawRow, column, options));
            }
        }
    });
    return flattenedRows;
}
exports.flattenTreeData = flattenTreeData;
function createTreeRawData(_a, parentRow) {
    var id = _a.id, data = _a.data, column = _a.column, keyColumnName = _a.keyColumnName, _b = _a.lazyObservable, lazyObservable = _b === void 0 ? false : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c;
    // only reset the rowKey on lazy observable data
    if (lazyObservable) {
        treeRowKeyMap[id] = -1;
    }
    return flattenTreeData(id, data, parentRow, column, {
        keyColumnName: keyColumnName,
        lazyObservable: lazyObservable,
        disabled: disabled,
    });
}
exports.createTreeRawData = createTreeRawData;
function createTreeCellInfo(rawData, row, treeIndentWidth, useIcon, lazyObservable) {
    if (lazyObservable === void 0) { lazyObservable = false; }
    var treeCellInfo = getTreeCellInfo(rawData, row, treeIndentWidth, useIcon);
    var treeInfo = lazyObservable ? treeCellInfo : observable_1.observable(treeCellInfo);
    if (!lazyObservable) {
        observable_1.observe(function () {
            treeInfo.expanded = tree_1.isExpanded(row);
            treeInfo.leaf = tree_1.isLeaf(row);
        });
    }
    return treeInfo;
}
exports.createTreeCellInfo = createTreeCellInfo;
function getTreeIndentWidth(depth, treeIndentWidth, showIcon) {
    var indentWidth = treeIndentWidth !== null && treeIndentWidth !== void 0 ? treeIndentWidth : constant_1.TREE_INDENT_WIDTH;
    return constant_1.TREE_INDENT_WIDTH + (depth - 1) * indentWidth + (showIcon ? constant_1.TREE_INDENT_WIDTH : 0);
}
exports.getTreeIndentWidth = getTreeIndentWidth;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootParentRow = exports.traverseDescendantRows = exports.traverseAncestorRows = exports.getDepth = exports.isRootChildRow = exports.isExpanded = exports.isLeaf = exports.isHidden = exports.isTreeColumnName = exports.getChildRowKeys = exports.getParentRowKey = exports.getStartIndexToAppendRow = exports.getDescendantRows = exports.getAncestorRows = exports.getChildRows = exports.getParentRow = void 0;
var observable_1 = __webpack_require__(5);
var data_1 = __webpack_require__(6);
var common_1 = __webpack_require__(0);
function getParentRow(store, rowKey, plainObj) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_1.findRowByRowKey(data, column, id, rowKey);
    if (row) {
        var parentRowKey = getParentRowKey(row);
        var parentRow = data_1.findRowByRowKey(data, column, id, parentRowKey);
        if (parentRow) {
            return plainObj ? observable_1.getOriginObject(parentRow) : parentRow;
        }
    }
    return null;
}
exports.getParentRow = getParentRow;
function getChildRows(store, rowKey, plainObj) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_1.findRowByRowKey(data, column, id, rowKey);
    if (row) {
        var childRowKeys = getChildRowKeys(row);
        return childRowKeys.map(function (childRowKey) {
            var childRow = data_1.findRowByRowKey(data, column, id, childRowKey);
            return plainObj ? observable_1.getOriginObject(childRow) : childRow;
        });
    }
    return [];
}
exports.getChildRows = getChildRows;
function getAncestorRows(store, rowKey) {
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData;
    var row = data_1.findRowByRowKey(data, column, id, rowKey);
    var ancestorRows = [];
    if (row) {
        traverseAncestorRows(rawData, row, function (parentRow) {
            ancestorRows.unshift(observable_1.getOriginObject(parentRow));
        });
    }
    return ancestorRows;
}
exports.getAncestorRows = getAncestorRows;
function getDescendantRows(store, rowKey) {
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData;
    var row = data_1.findRowByRowKey(data, column, id, rowKey);
    var childRows = [];
    if (row) {
        traverseDescendantRows(rawData, row, function (childRow) {
            childRows.push(observable_1.getOriginObject(childRow));
        });
    }
    return childRows;
}
exports.getDescendantRows = getDescendantRows;
function getStartIndexToAppendRow(store, parentRow, offset) {
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData;
    var startIdx;
    if (parentRow) {
        if (offset) {
            var childRowKeys = getChildRowKeys(parentRow);
            var prevChildRowKey = childRowKeys[offset - 1];
            var prevChildRowIdx = data_1.findIndexByRowKey(data, column, id, prevChildRowKey);
            var descendantRowsCount = getDescendantRows(store, prevChildRowKey).length;
            startIdx = prevChildRowIdx + descendantRowsCount + 1;
        }
        else {
            startIdx = data_1.findIndexByRowKey(data, column, id, parentRow.rowKey) + 1;
            if (common_1.isUndefined(offset)) {
                startIdx += getDescendantRows(store, parentRow.rowKey).length;
            }
        }
    }
    else {
        startIdx = common_1.isUndefined(offset) ? rawData.length : offset;
    }
    return startIdx;
}
exports.getStartIndexToAppendRow = getStartIndexToAppendRow;
function getParentRowKey(row) {
    var tree = row._attributes.tree;
    return tree && tree.parentRowKey !== row.rowKey ? tree.parentRowKey : null;
}
exports.getParentRowKey = getParentRowKey;
function getChildRowKeys(row) {
    var tree = row._attributes.tree;
    return tree ? tree.childRowKeys.slice() : [];
}
exports.getChildRowKeys = getChildRowKeys;
function isTreeColumnName(column, columnName) {
    return column.treeColumnName === columnName;
}
exports.isTreeColumnName = isTreeColumnName;
function isHidden(_a) {
    var _attributes = _a._attributes;
    var tree = _attributes.tree;
    return !!(tree && tree.hidden);
}
exports.isHidden = isHidden;
function isLeaf(_a) {
    var _attributes = _a._attributes, _leaf = _a._leaf;
    var tree = _attributes.tree;
    return !!tree && !tree.childRowKeys.length && !!_leaf;
}
exports.isLeaf = isLeaf;
function isExpanded(row) {
    var tree = row._attributes.tree;
    return !!(tree && tree.expanded);
}
exports.isExpanded = isExpanded;
function isRootChildRow(row) {
    var tree = row._attributes.tree;
    return !!tree && common_1.isNull(tree.parentRowKey);
}
exports.isRootChildRow = isRootChildRow;
function getDepth(rawData, row) {
    var parentRow = row;
    var depth = 0;
    do {
        depth += 1;
        parentRow = common_1.findProp('rowKey', getParentRowKey(parentRow), rawData);
    } while (parentRow);
    return depth;
}
exports.getDepth = getDepth;
function traverseAncestorRows(rawData, row, iteratee) {
    var parentRowKey = getParentRowKey(row);
    var parentRow;
    while (!common_1.isNull(parentRowKey)) {
        parentRow = common_1.findProp('rowKey', parentRowKey, rawData);
        iteratee(parentRow);
        parentRowKey = parentRow ? getParentRowKey(parentRow) : null;
    }
}
exports.traverseAncestorRows = traverseAncestorRows;
function traverseDescendantRows(rawData, row, iteratee) {
    var childRowKeys = getChildRowKeys(row);
    var rowKey, childRow;
    while (childRowKeys.length) {
        rowKey = childRowKeys.shift();
        childRow = common_1.findProp('rowKey', rowKey, rawData);
        iteratee(childRow);
        if (childRow) {
            childRowKeys = childRowKeys.concat(getChildRowKeys(childRow));
        }
    }
}
exports.traverseDescendantRows = traverseDescendantRows;
function getRootParentRow(rawData, row) {
    var rootParentRow = row;
    do {
        var parentRow = common_1.findProp('rowKey', getParentRowKey(rootParentRow), rawData);
        if (!parentRow) {
            break;
        }
        rootParentRow = parentRow;
    } while (rootParentRow);
    return rootParentRow;
}
exports.getRootParentRow = getRootParentRow;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectionRange = exports.isSameInputRange = exports.getSortedRange = exports.getChildColumnRange = exports.getLeafChildColumnNames = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var column_1 = __webpack_require__(12);
function sortByVisibleColumns(visibleColumnsWithRowHeader, childNames) {
    var result = [];
    visibleColumnsWithRowHeader.forEach(function (column) {
        if (common_1.includes(childNames, column.name)) {
            result.push(column.name);
        }
    });
    return result;
}
function getLeafChildColumnNames(complexColumnHeaders, name) {
    var column = common_1.findProp('name', name, complexColumnHeaders);
    if (!column) {
        return [name];
    }
    var result = [];
    column.childNames.forEach(function (childName) {
        if (column_1.isParentColumnHeader(complexColumnHeaders, childName)) {
            result = tslib_1.__spreadArrays(result, getLeafChildColumnNames(complexColumnHeaders, childName));
        }
        else {
            result = tslib_1.__spreadArrays(result, [childName]);
        }
    });
    return result;
}
exports.getLeafChildColumnNames = getLeafChildColumnNames;
function getChildColumnRange(visibleColumnsWithRowHeader, complexColumnHeaders, name) {
    var unsortedChildNames = getLeafChildColumnNames(complexColumnHeaders, name);
    var childNames = sortByVisibleColumns(visibleColumnsWithRowHeader, unsortedChildNames);
    var startIndex = common_1.findPropIndex('name', childNames[0], visibleColumnsWithRowHeader);
    var endIndex = common_1.findPropIndex('name', childNames[childNames.length - 1], visibleColumnsWithRowHeader);
    return [startIndex, endIndex];
}
exports.getChildColumnRange = getChildColumnRange;
function getSortedRange(range) {
    return range[0] > range[1] ? [range[1], range[0]] : range;
}
exports.getSortedRange = getSortedRange;
function isSameInputRange(inp1, inp2) {
    if (common_1.isNull(inp1) || common_1.isNull(inp2)) {
        return inp1 === inp2;
    }
    return (inp1.column[0] === inp2.column[0] &&
        inp1.column[1] === inp2.column[1] &&
        inp1.row[0] === inp2.row[0] &&
        inp1.row[1] === inp2.row[1]);
}
exports.isSameInputRange = isSameInputRange;
function getSelectionRange(range, pageOptions) {
    if (!common_1.isEmpty(pageOptions)) {
        var row = range.row, column = range.column;
        var perPage = pageOptions.perPage, page = pageOptions.page;
        var prevPageRowCount = (page - 1) * perPage;
        return {
            row: [row[0] - prevPageRowCount, row[1] - prevPageRowCount],
            column: column,
        };
    }
    return range;
}
exports.getSelectionRange = getSelectionRange;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrowKey = exports.isNonPrintableKey = exports.keyEventGenerate = exports.getKeyStrokeString = exports.keyStrokeCommandMap = exports.keyboardEventCommandMap = exports.keyboardEventTypeMap = exports.keyNameMap = void 0;
var common_1 = __webpack_require__(0);
exports.keyNameMap = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    27: 'esc',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'a',
    67: 'c',
    86: 'v',
    32: 'space',
    33: 'pageUp',
    34: 'pageDown',
    36: 'home',
    35: 'end',
    46: 'del',
};
exports.keyboardEventTypeMap = {
    move: 'move',
    edit: 'edit',
    remove: 'remove',
    select: 'select',
    clipboard: 'clipboard',
};
exports.keyboardEventCommandMap = {
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right',
    pageUp: 'pageUp',
    pageDown: 'pageDown',
    firstColumn: 'firstColumn',
    lastColumn: 'lastColumn',
    currentCell: 'currentCell',
    nextCell: 'nextCell',
    prevCell: 'prevCell',
    firstCell: 'firstCell',
    lastCell: 'lastCell',
    all: 'all',
    copy: 'copy',
    paste: 'paste',
};
/**
 * K-V object for matching keystroke and event command
 * K: keystroke (order : ctrl -> shift -> keyName)
 * V: [key event type, command]
 * @type {Object}
 * @ignore
 */
exports.keyStrokeCommandMap = {
    up: ['move', 'up'],
    down: ['move', 'down'],
    left: ['move', 'left'],
    right: ['move', 'right'],
    pageUp: ['move', 'pageUp'],
    pageDown: ['move', 'pageDown'],
    home: ['move', 'firstColumn'],
    end: ['move', 'lastColumn'],
    enter: ['edit', 'currentCell'],
    space: ['edit', 'currentCell'],
    tab: ['edit', 'nextCell'],
    backspace: ['remove'],
    del: ['remove'],
    'shift-tab': ['edit', 'prevCell'],
    'shift-up': ['select', 'up'],
    'shift-down': ['select', 'down'],
    'shift-left': ['select', 'left'],
    'shift-right': ['select', 'right'],
    'shift-pageUp': ['select', 'pageUp'],
    'shift-pageDown': ['select', 'pageDown'],
    'shift-home': ['select', 'firstColumn'],
    'shift-end': ['select', 'lastColumn'],
    'ctrl-a': ['select', 'all'],
    'ctrl-c': ['clipboard', 'copy'],
    'ctrl-v': ['clipboard', 'paste'],
    'ctrl-home': ['move', 'firstCell'],
    'ctrl-end': ['move', 'lastCell'],
    'ctrl-shift-home': ['select', 'firstCell'],
    'ctrl-shift-end': ['select', 'lastCell'],
};
/**
 * Returns the keyStroke string
 * @param {Event} ev - Keyboard event
 * @returns {String}
 * @ignore
 */
function getKeyStrokeString(ev) {
    var keys = [];
    var keyCode = ev.keyCode, ctrlKey = ev.ctrlKey, metaKey = ev.metaKey, shiftKey = ev.shiftKey;
    if (ctrlKey || metaKey) {
        keys.push('ctrl');
    }
    if (shiftKey) {
        keys.push('shift');
    }
    if (keyCode in exports.keyNameMap) {
        keys.push(exports.keyNameMap[keyCode]);
    }
    return keys.join('-');
}
exports.getKeyStrokeString = getKeyStrokeString;
function keyEventGenerate(ev) {
    var keyStroke = getKeyStrokeString(ev);
    var commandInfo = exports.keyStrokeCommandMap[keyStroke];
    return commandInfo
        ? {
            type: commandInfo[0],
            command: commandInfo[1],
        }
        : {};
}
exports.keyEventGenerate = keyEventGenerate;
function isNonPrintableKey(keyCode) {
    var keys = [
        'shift',
        'ctrl',
        'esc',
        'left',
        'up',
        'right',
        'down',
        'pageUp',
        'pageDown',
        'end',
        'home',
    ];
    var key = exports.keyNameMap[keyCode];
    return common_1.includes(keys, key);
}
exports.isNonPrintableKey = isNonPrintableKey;
function isArrowKey(keyName) {
    return common_1.includes(['up', 'down', 'left', 'right'], keyName);
}
exports.isArrowKey = isArrowKey;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedValue = exports.createFormattedValue = exports.getMaxTextMap = exports.setMaxColumnTextMap = exports.setMaxTextMap = exports.initMaxTextMap = void 0;
var listItemText_1 = __webpack_require__(64);
var common_1 = __webpack_require__(0);
var maxTextMap = {};
function initMaxTextMap() {
    maxTextMap = {};
}
exports.initMaxTextMap = initMaxTextMap;
function setMaxTextMap(column, row) {
    column.autoResizingColumn.forEach(function (columnInfo) {
        var name = columnInfo.name;
        var formattedValue = createFormattedValue(row, columnInfo);
        if (!maxTextMap[name] || maxTextMap[name].formattedValue.length < formattedValue.length) {
            setMaxColumnTextMap(name, formattedValue, row);
        }
    });
}
exports.setMaxTextMap = setMaxTextMap;
function setMaxColumnTextMap(columnName, formattedValue, row) {
    maxTextMap[columnName] = { formattedValue: formattedValue, row: row };
}
exports.setMaxColumnTextMap = setMaxColumnTextMap;
function getMaxTextMap() {
    return maxTextMap;
}
exports.getMaxTextMap = getMaxTextMap;
function createFormattedValue(row, columnInfo) {
    var name = columnInfo.name, formatter = columnInfo.formatter, defaultValue = columnInfo.defaultValue;
    var formatterProps = { row: row, column: columnInfo, value: row[name] };
    return getFormattedValue(formatterProps, formatter, row[name] || defaultValue, row._relationListItemMap[name]);
}
exports.createFormattedValue = createFormattedValue;
function getFormattedValue(props, formatter, defaultValue, relationListItems) {
    var value;
    if (formatter === 'listItemText') {
        value = listItemText_1.listItemText(props, relationListItems);
    }
    else if (common_1.isFunction(formatter)) {
        value = formatter(props);
    }
    else if (common_1.isString(formatter)) {
        value = formatter;
    }
    else {
        value = defaultValue;
    }
    var strValue = getCellDisplayValue(value);
    if (strValue && props.column.escapeHTML) {
        return common_1.encodeHTMLEntity(strValue);
    }
    return strValue;
}
exports.getFormattedValue = getFormattedValue;
function getCellDisplayValue(value) {
    if (common_1.isNil(value)) {
        return '';
    }
    return String(value);
}


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resetRowSpan = exports.updateMainRowSpan = exports.updateRowSpan = exports.updateRowSpanWhenRemoving = exports.updateRowSpanWhenAppending = void 0;
var data_1 = __webpack_require__(15);
var common_1 = __webpack_require__(0);
var observable_1 = __webpack_require__(5);
var rowSpan_1 = __webpack_require__(13);
var constant_1 = __webpack_require__(10);
function updateRowSpanWhenAppending(data, prevRow, extendPrevRowSpan) {
    var prevRowSpanMap = prevRow.rowSpanMap;
    if (common_1.isEmpty(prevRowSpanMap)) {
        return;
    }
    Object.keys(prevRowSpanMap).forEach(function (columnName) {
        var prevRowSpan = prevRowSpanMap[columnName];
        if (prevRowSpan) {
            var count = prevRowSpan.count, keyRow = prevRowSpan.mainRow, mainRowKey = prevRowSpan.mainRowKey;
            var mainRow = keyRow ? prevRow : common_1.findProp('rowKey', mainRowKey, data);
            var mainRowSpan = mainRow.rowSpanMap[columnName];
            var startOffset = keyRow || extendPrevRowSpan ? 1 : -count + 1;
            // keep rowSpan state when appends row in the middle of rowSpan
            if (mainRowSpan.spanCount > startOffset) {
                mainRowSpan.count += 1;
                mainRowSpan.spanCount += 1;
                updateSubRowSpan(data, mainRow, columnName, 1, mainRowSpan.spanCount);
            }
        }
    });
}
exports.updateRowSpanWhenAppending = updateRowSpanWhenAppending;
function updateRowSpanWhenRemoving(data, removedRow, nextRow, keepRowSpanData) {
    var removedRowSpanMap = removedRow.rowSpanMap;
    if (common_1.isEmpty(removedRowSpanMap)) {
        return;
    }
    Object.keys(removedRowSpanMap).forEach(function (columnName) {
        var removedRowSpan = removedRowSpanMap[columnName];
        var count = removedRowSpan.count, keyRow = removedRowSpan.mainRow, mainRowKey = removedRowSpan.mainRowKey;
        var mainRow, spanCount;
        if (keyRow) {
            mainRow = nextRow;
            spanCount = count - 1;
            if (spanCount > 1) {
                var mainRowSpan = mainRow.rowSpanMap[columnName];
                mainRowSpan.mainRowKey = mainRow.rowKey;
                mainRowSpan.mainRow = true;
            }
            if (keepRowSpanData) {
                mainRow[columnName] = removedRow[columnName];
            }
        }
        else {
            mainRow = common_1.findProp('rowKey', mainRowKey, data);
            spanCount = mainRow.rowSpanMap[columnName].spanCount - 1;
        }
        if (spanCount > 1) {
            var mainRowSpan = mainRow.rowSpanMap[columnName];
            mainRowSpan.count = spanCount;
            mainRowSpan.spanCount = spanCount;
            updateSubRowSpan(data, mainRow, columnName, 1, spanCount);
        }
        else {
            delete mainRow.rowSpanMap[columnName];
        }
    });
}
exports.updateRowSpanWhenRemoving = updateRowSpanWhenRemoving;
function updateRowSpan(store) {
    var data = store.data, column = store.column;
    var filteredRawData = data.filteredRawData, pageOptions = data.pageOptions;
    var perPageOption = pageOptions.perPage;
    var rowSpans = {};
    var perPage = !common_1.isEmpty(pageOptions) && !perPageOption ? constant_1.DEFAULT_PER_PAGE : perPageOption;
    if (column.visibleRowSpanEnabledColumns.length > 0) {
        resetRowSpan(store, true);
        column.visibleRowSpanEnabledColumns.forEach(function (col) {
            var name = col.name;
            // modify by xd
            var rowSpanOfColumn = rowSpan_1.getRowSpanOfColumn2(filteredRawData, col, perPage);
            Object.keys(rowSpanOfColumn).forEach(function (rowKey) {
                if (rowSpans[rowKey]) {
                    rowSpans[rowKey][name] = rowSpanOfColumn[rowKey][name];
                }
                else {
                    rowSpans[rowKey] = rowSpanOfColumn[rowKey];
                }
            });
        });
        Object.keys(rowSpans).forEach(function (rowKey) {
            var row = common_1.find(function (_a) {
                var key = _a.rowKey;
                return "" + key === rowKey;
            }, filteredRawData);
            updateMainRowSpan(filteredRawData, row, rowSpans[rowKey]);
        });
        observable_1.notify(data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
    }
}
exports.updateRowSpan = updateRowSpan;
function updateMainRowSpan(data, mainRow, rowSpan) {
    if (rowSpan) {
        var rowKey_1 = mainRow.rowKey, rowSpanMap_1 = mainRow.rowSpanMap;
        Object.keys(rowSpan).forEach(function (columnName) {
            var spanCount = rowSpan[columnName];
            rowSpanMap_1[columnName] = data_1.createRowSpan(true, rowKey_1, spanCount, spanCount);
            updateSubRowSpan(data, mainRow, columnName, 1, spanCount);
        });
    }
}
exports.updateMainRowSpan = updateMainRowSpan;
function updateSubRowSpan(data, mainRow, columnName, startOffset, spanCount) {
    var mainRowIndex = common_1.findPropIndex('rowKey', mainRow.rowKey, data);
    for (var offset = startOffset; offset < spanCount; offset += 1) {
        var row = data[mainRowIndex + offset];
        row.rowSpanMap[columnName] = data_1.createRowSpan(false, mainRow.rowKey, -offset, spanCount);
    }
}
function resetRowSpan(_a, slient) {
    var data = _a.data, column = _a.column;
    if (slient === void 0) { slient = false; }
    if (column.visibleRowSpanEnabledColumns.length <= 0) {
        return;
    }
    data.rawData.forEach(function (_a) {
        var rowSpanMap = _a.rowSpanMap;
        Object.keys(rowSpanMap).forEach(function (columnName) {
            delete rowSpanMap[columnName];
        });
    });
    if (!slient) {
        observable_1.notify(data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
    }
}
exports.resetRowSpan = resetRowSpan;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.initScrollPosition = exports.setScrollTop = exports.setScrollLeft = exports.setScrollToSelection = exports.setScrollToFocus = void 0;
var viewport_1 = __webpack_require__(73);
function setScrollPosition(viewport, changedScrollTop, changedScrollLeft) {
    if (changedScrollLeft !== null) {
        viewport.scrollLeft = changedScrollLeft;
    }
    if (changedScrollTop !== null) {
        viewport.scrollTop = changedScrollTop;
    }
}
function setScrollToFocus(store) {
    var _a = store.focus, cellPosRect = _a.cellPosRect, side = _a.side, viewport = store.viewport;
    if (cellPosRect === null || side === null) {
        return;
    }
    var _b = viewport_1.getChangedScrollPosition(store, side), changedScrollLeft = _b[0], changedScrollTop = _b[1];
    setScrollPosition(viewport, changedScrollTop, changedScrollLeft);
}
exports.setScrollToFocus = setScrollToFocus;
function setScrollToSelection(store) {
    var _a = store.columnCoords, widths = _a.widths, columnOffsets = _a.offsets, _b = store.rowCoords, heights = _b.heights, rowOffsets = _b.offsets, inputRange = store.selection.inputRange, viewport = store.viewport;
    if (!inputRange) {
        return;
    }
    var rowIndex = inputRange.row[1];
    var columnIndex = inputRange.column[1];
    var cellSide = columnIndex > widths.L.length - 1 ? 'R' : 'L';
    var rightSideColumnIndex = columnIndex < widths.L.length ? widths.L.length : columnIndex - widths.L.length;
    var left = columnOffsets[cellSide][rightSideColumnIndex];
    var right = left + widths[cellSide][rightSideColumnIndex];
    var top = rowOffsets[rowIndex];
    var bottom = top + heights[rowIndex];
    var cellPosRect = { left: left, right: right, top: top, bottom: bottom };
    var _c = viewport_1.getChangedScrollPosition(store, cellSide, cellPosRect), changedScrollLeft = _c[0], changedScrollTop = _c[1];
    setScrollPosition(viewport, changedScrollTop, changedScrollLeft);
}
exports.setScrollToSelection = setScrollToSelection;
function setScrollLeft(_a, scrollLeft) {
    var viewport = _a.viewport;
    viewport.scrollLeft = scrollLeft;
}
exports.setScrollLeft = setScrollLeft;
function setScrollTop(_a, scrollTop) {
    var viewport = _a.viewport;
    viewport.scrollTop = scrollTop;
}
exports.setScrollTop = setScrollTop;
function initScrollPosition(_a) {
    var viewport = _a.viewport;
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
}
exports.initScrollPosition = initScrollPosition;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllSummaryValues = exports.updateSummaryValueByRow = exports.updateSummaryValueByColumn = exports.updateSummaryValueByCell = exports.setSummaryColumnContent = void 0;
var summary_1 = __webpack_require__(45);
var summary_2 = __webpack_require__(46);
var observable_1 = __webpack_require__(5);
function setSummaryColumnContent(_a, columnName, columnContent) {
    var summary = _a.summary, data = _a.data;
    var castedColumnContent = summary_1.castToSummaryColumnContent(columnContent);
    var content = summary_1.extractSummaryColumnContent(castedColumnContent, null);
    summary.summaryColumnContents[columnName] = content;
    summary.summaryValues[columnName] = summary_2.createSummaryValue(content, columnName, data);
    observable_1.notify(summary, 'summaryValues');
}
exports.setSummaryColumnContent = setSummaryColumnContent;
function updateSummaryValue(_a, columnName, type, options) {
    var summary = _a.summary, data = _a.data;
    var content = summary.summaryColumnContents[columnName];
    if (!content || !content.useAutoSummary) {
        return;
    }
    summary.summaryValues[columnName] = summary_2.createSummaryValue(content, columnName, data);
    // const summaryValue = summary.summaryValues[columnName];
    // const orgValue = Number(options.orgValue) || 0;
    // const value = Number(options.value) || 0;
    // const cntVariation = options.type === 'APPEND' ? 1 : -1;
    //
    // const columnFilter = findProp('columnName', columnName, data.filters || []);
    // const hasColumnFilter = !!(columnFilter && isFunction(columnFilter.conditionFn));
    // const included = hasColumnFilter && columnFilter!.conditionFn!(value);
    // let { sum, min, max, cnt } = summaryValue;
    // let {
    //   sum: filteredSum,
    //   min: filteredMin,
    //   max: filteredMax,
    //   cnt: filteredCnt,
    // } = summaryValue.filtered;
    //
    // switch (type) {
    //   case 'UPDATE_COLUMN':
    //     sum = value * cnt;
    //     min = value;
    //     max = value;
    //
    //     if (hasColumnFilter) {
    //       filteredCnt = included ? filteredCnt : 0;
    //       filteredSum = included ? value * filteredCnt : 0;
    //       filteredMin = included ? value : 0;
    //       filteredMax = included ? value : 0;
    //     }
    //     break;
    //   case 'UPDATE_CELL':
    //     sum = sum - orgValue + value;
    //
    //     if (hasColumnFilter) {
    //       const orgIncluded = columnFilter!.conditionFn!(orgValue);
    //       if (!orgIncluded && included) {
    //         filteredSum = filteredSum + value;
    //         filteredCnt += 1;
    //       } else if (orgIncluded && !included) {
    //         filteredSum = filteredSum - orgValue;
    //         filteredCnt -= 1;
    //       } else if (orgIncluded && included) {
    //         filteredSum = filteredSum - orgValue + value;
    //       }
    //     }
    //     break;
    //   case 'UPDATE_ROW':
    //     cnt += cntVariation;
    //     sum = sum + cntVariation * value;
    //
    //     if (hasColumnFilter && included) {
    //       filteredSum = filteredSum + cntVariation * value;
    //       filteredCnt += cntVariation;
    //     }
    //     break;
    //   default:
    //   // do nothing;
    // }
    //
    // const avg = sum / cnt;
    // const filteredAvg = filteredSum / filteredCnt;
    //
    // min = Math.min(value, min);
    // max = Math.max(value, max);
    // filteredMin = Math.min(value, filteredMin);
    // filteredMax = Math.max(value, filteredMax);
    //
    // summary.summaryValues[columnName] = {
    //   sum,
    //   min,
    //   max,
    //   avg,
    //   cnt,
    //   filtered: {
    //     sum: filteredSum,
    //     min: filteredMin,
    //     max: filteredMax,
    //     avg: filteredAvg,
    //     cnt: filteredCnt,
    //   },
    // };
    observable_1.notify(summary, 'summaryValues');
}
function updateSummaryValueByCell(store, columnName, options) {
    updateSummaryValue(store, columnName, 'UPDATE_CELL', options);
}
exports.updateSummaryValueByCell = updateSummaryValueByCell;
function updateSummaryValueByColumn(store, columnName, options) {
    updateSummaryValue(store, columnName, 'UPDATE_COLUMN', options);
}
exports.updateSummaryValueByColumn = updateSummaryValueByColumn;
function updateSummaryValueByRow(store, row, options) {
    var summary = store.summary, column = store.column;
    var type = options.type, orgRow = options.orgRow;
    var summaryColumns = column.allColumns.filter(function (_a) {
        var name = _a.name;
        return !!summary.summaryColumnContents[name];
    });
    summaryColumns.forEach(function (_a) {
        var name = _a.name;
        if (type === 'SET') {
            updateSummaryValue(store, name, 'UPDATE_CELL', { orgValue: orgRow[name], value: row[name] });
        }
        else {
            updateSummaryValue(store, name, 'UPDATE_ROW', { type: type, value: row[name] });
        }
    });
}
exports.updateSummaryValueByRow = updateSummaryValueByRow;
function updateAllSummaryValues(_a) {
    var summary = _a.summary, data = _a.data, column = _a.column;
    var summaryColumns = column.allColumns.filter(function (_a) {
        var name = _a.name;
        return !!summary.summaryColumnContents[name];
    });
    summaryColumns.forEach(function (_a) {
        var name = _a.name;
        var content = summary.summaryColumnContents[name];
        summary.summaryValues[name] = summary_2.createSummaryValue(content, name, data);
    });
    observable_1.notify(summary, 'summaryValues');
}
exports.updateAllSummaryValues = updateAllSummaryValues;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidationCode = exports.forceValidateUniquenessOfColumn = exports.forceValidateUniquenessOfColumns = exports.replaceColumnUniqueInfoMap = exports.removeUniqueInfoMap = exports.addUniqueInfoMap = exports.invokeWithUniqueValidationColumn = exports.createNewValidationMap = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var observable_1 = __webpack_require__(5);
var instance_1 = __webpack_require__(8);
var data_1 = __webpack_require__(6);
var instanceValidationMap = {};
var isValidatingUniquenessMap = {};
function createNewValidationMap(id) {
    instanceValidationMap[id] = {};
}
exports.createNewValidationMap = createNewValidationMap;
function invokeWithUniqueValidationColumn(column, fn) {
    column.validationColumns.forEach(function (_a) {
        var name = _a.name, validation = _a.validation;
        if (validation.unique) {
            fn(name);
        }
    });
}
exports.invokeWithUniqueValidationColumn = invokeWithUniqueValidationColumn;
function addUniqueInfoMap(id, row, column) {
    invokeWithUniqueValidationColumn(column, function (name) {
        return addColumnUniqueInfoMap(id, row.rowKey, name, row[name]);
    });
}
exports.addUniqueInfoMap = addUniqueInfoMap;
function removeUniqueInfoMap(id, row, column) {
    invokeWithUniqueValidationColumn(column, function (name) {
        return removeColumnUniqueInfoMap(id, row.rowKey, name, row[name]);
    });
}
exports.removeUniqueInfoMap = removeUniqueInfoMap;
function removeColumnUniqueInfoMap(id, rowKey, columnName, cellValue) {
    var value = String(cellValue);
    var uniqueInfoMap = instanceValidationMap[id];
    if (uniqueInfoMap && uniqueInfoMap[value] && uniqueInfoMap[value][columnName]) {
        uniqueInfoMap[value][columnName] = uniqueInfoMap[value][columnName].filter(function (targetRowKey) { return targetRowKey !== rowKey; });
    }
}
function addColumnUniqueInfoMap(id, rowKey, columnName, cellValue) {
    var value = String(cellValue);
    var uniqueInfoMap = instanceValidationMap[id];
    uniqueInfoMap[value] = uniqueInfoMap[value] || {};
    uniqueInfoMap[value][columnName] = uniqueInfoMap[value][columnName] || [];
    uniqueInfoMap[value][columnName].push(rowKey);
}
function replaceColumnUniqueInfoMap(id, column, _a) {
    var rowKey = _a.rowKey, columnName = _a.columnName, prevValue = _a.prevValue, value = _a.value;
    if (common_1.some(function (_a) {
        var name = _a.name;
        return name === columnName;
    }, column.validationColumns)) {
        removeColumnUniqueInfoMap(id, rowKey, columnName, prevValue);
        addColumnUniqueInfoMap(id, rowKey, columnName, value);
    }
}
exports.replaceColumnUniqueInfoMap = replaceColumnUniqueInfoMap;
function forceValidateUniquenessOfColumns(rawData, column) {
    if (rawData.length) {
        // trick for forcing to validate the uniqueness
        invokeWithUniqueValidationColumn(column, function (name) { return observable_1.notify(rawData[0], name); });
    }
}
exports.forceValidateUniquenessOfColumns = forceValidateUniquenessOfColumns;
function forceValidateUniquenessOfColumn(rawData, column, columnName) {
    if (common_1.some(function (_a) {
        var name = _a.name;
        return name === columnName;
    }, column.validationColumns) && rawData.length) {
        // trick for forcing to validate the uniqueness
        observable_1.notify(rawData[0], columnName);
    }
}
exports.forceValidateUniquenessOfColumn = forceValidateUniquenessOfColumn;
function hasDuplicateValue(id, columnName, cellValue) {
    var _a;
    var value = String(cellValue);
    var uniqueInfoMap = instanceValidationMap[id];
    return !!(uniqueInfoMap && uniqueInfoMap[value] && ((_a = uniqueInfoMap[value][columnName]) === null || _a === void 0 ? void 0 : _a.length) > 1);
}
function validateDataUniqueness(id, value, columnName, invalidStates) {
    if (hasDuplicateValue(id, columnName, value)) {
        invalidStates.push({ code: 'UNIQUE' });
    }
    // prevent recursive call of 'validateDataUniqueness' when scrolling or manipulating the data
    if (!isValidatingUniquenessMap[columnName] &&
        !common_1.includes(observable_1.getRunningObservers(), 'lazyObservable')) {
        var rawData_1 = [];
        observable_1.unobservedInvoke(function () {
            // @TODO: should get the latest rawData through function(not private field of the grid instance)
            // @ts-ignore
            rawData_1 = instance_1.getInstance(id).store.data.rawData;
        });
        isValidatingUniquenessMap[columnName] = true;
        rawData_1.forEach(function (row) {
            if (observable_1.isObservable(row)) {
                observable_1.notify(row, columnName);
            }
        });
        setTimeout(function () {
            isValidatingUniquenessMap[columnName] = false;
        });
    }
}
function validateCustomValidator(row, value, columnName, validatorFn, invalidStates) {
    var originRow = data_1.getOmittedInternalProp(row);
    observable_1.unobservedInvoke(function () {
        var result = validatorFn(value, originRow, columnName);
        var _a = (common_1.isBoolean(result)
            ? { valid: result }
            : result), valid = _a.valid, meta = _a.meta;
        if (!valid) {
            invalidStates.push(tslib_1.__assign({ code: 'VALIDATOR_FN' }, meta));
        }
    });
}
function getValidationCode(_a) {
    var id = _a.id, value = _a.value, row = _a.row, columnName = _a.columnName, validation = _a.validation;
    var invalidStates = [];
    if (!validation) {
        return invalidStates;
    }
    var required = validation.required, dataType = validation.dataType, min = validation.min, max = validation.max, regExp = validation.regExp, unique = validation.unique, validatorFn = validation.validatorFn;
    if (required && common_1.isBlank(value)) {
        invalidStates.push({ code: 'REQUIRED' });
    }
    if (unique) {
        validateDataUniqueness(id, value, columnName, invalidStates);
    }
    if (common_1.isFunction(validatorFn)) {
        validateCustomValidator(row, value, columnName, validatorFn, invalidStates);
    }
    if (dataType === 'string' && !common_1.isString(value)) {
        invalidStates.push({ code: 'TYPE_STRING' });
    }
    if (regExp && common_1.isString(value) && !regExp.test(value)) {
        invalidStates.push({ code: 'REGEXP', regExp: regExp });
    }
    var numberValue = common_1.convertToNumber(value);
    if (dataType === 'number' && !common_1.isNumber(numberValue)) {
        invalidStates.push({ code: 'TYPE_NUMBER' });
    }
    if (common_1.isNumber(min) && common_1.isNumber(numberValue) && numberValue < min) {
        invalidStates.push({ code: 'MIN', min: min });
    }
    if (common_1.isNumber(max) && common_1.isNumber(numberValue) && numberValue > max) {
        invalidStates.push({ code: 'MAX', max: max });
    }
    return invalidStates;
}
exports.getValidationCode = getValidationCode;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyArea = exports.toBodyZoom = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var draggable_1 = __webpack_require__(52);
var bodyRows_1 = __webpack_require__(92);
var colGroup_1 = __webpack_require__(38);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var focusLayer_1 = __webpack_require__(98);
var selectionLayer_1 = __webpack_require__(99);
var common_1 = __webpack_require__(0);
var editingLayer_1 = __webpack_require__(100);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var eventBus_1 = __webpack_require__(7);
var constant_1 = __webpack_require__(10);
var focus_1 = __webpack_require__(43);
// only updates when these props are changed
// for preventing unnecessary rendering when scroll changes
var PROPS_FOR_UPDATE = [
    'bodyHeight',
    'totalRowHeight',
    'offsetLeft',
    'offsetTop',
    'totalColumnWidth',
    'visibleTotalWidth',
];
// Minimum distance (pixel) to detect if user wants to drag when moving mouse with button pressed.
var MIN_DISTANCE_FOR_DRAG = 10;
var ADDITIONAL_RANGE = 16; //xuedan
var DRAGGING_CLASS = 'dragging';
var PARENT_CELL_CLASS = 'parent-cell';
var DRAGGABLE_COLUMN_NAME = '_draggable';
var BodyAreaComp = /** @class */ (function (_super) {
    tslib_1.__extends(BodyAreaComp, _super);
    function BodyAreaComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dragStartData = {
            pageX: null,
            pageY: null,
        };
        _this.prevScrollLeft = 0;
        // draggable info when start to move the row
        _this.draggableInfo = null;
        // floating row width and height for dragging
        _this.floatingRowSize = null;
        // the index info to move row through drag
        _this.movedIndexInfo = null;
        _this.scrollToNextDebounced = common_1.debounce(function () {
            _this.props.dispatch('scrollToNext');
        }, 200);
        _this.handleScroll = function (ev) {
            if (!ev.target) {
                return;
            }
            var _a = ev.target, scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
            var _b = _this.props, dispatch = _b.dispatch, eventBus = _b.eventBus, side = _b.side;
            dispatch('setScrollTop', scrollTop);
            if (side === 'R') {
                dispatch('setScrollLeft', scrollLeft);
                if (scrollTop > 0 &&
                    scrollHeight - scrollTop === clientHeight &&
                    _this.prevScrollLeft === scrollLeft) {
                    var gridEvent = new gridEvent_1.default();
                    /**
                     * Occurs when scroll at the bottommost
                     * @event Grid#scrollEnd
                     * @property {Grid} instance - Current grid instance
                     */
                    eventBus.trigger('scrollEnd', gridEvent);
                    _this.scrollToNextDebounced();
                }
                _this.prevScrollLeft = scrollLeft;
            }
        };
        _this.dragRow = function (ev) {
            var _a;
            var _b = dom_1.getCoordinateWithOffset(ev.pageX, ev.pageY), pageX = _b[0], pageY = _b[1];
            pageX = toBodyZoom(pageX);
            pageY = toBodyZoom(pageY);
            if (_this.moveEnoughToTriggerDragEvent({ pageX: pageX, pageY: pageY })) {
                var _c = _this, el = _c.el, boundingRect = _c.boundingRect, props = _c.props;
                if (!el) {
                    return;
                }
                var _d = el, scrollTop = _d.scrollTop, scrollLeft = _d.scrollLeft;
                var movedPosAndIndex = draggable_1.getMovedPosAndIndexOfRow(_this.context.store, {
                    scrollLeft: scrollLeft,
                    scrollTop: scrollTop,
                    left: boundingRect.left,
                    top: boundingRect.top,
                    pageX: pageX,
                    pageY: pageY,
                });
                var index = movedPosAndIndex.index, targetRow = movedPosAndIndex.targetRow;
                var rowKeyToMove = targetRow.rowKey;
                var _e = _this.draggableInfo, row = _e.row, rowKey = _e.rowKey;
                var _f = draggable_1.getResolvedOffsets(_this.context.store, movedPosAndIndex, _this.floatingRowSize), offsetLeft = _f.offsetLeft, offsetTop = _f.offsetTop;
                row.style.left = offsetLeft + "px";
                row.style.top = offsetTop + "px";
                // xuedan
                if (props.hasTreeColumn) {
                    _this.setTreeMovedIndexInfo(movedPosAndIndex);
                }
                else {
                    var line = _this.draggableInfo.line;
                    // xuedan
                    // move the row to next index
                    if (!common_1.isNil((_a = _this.movedIndexInfo) === null || _a === void 0 ? void 0 : _a.rowKey)) {
                        line.style.display = 'none';
                        _this.props.dispatch('removeRowClassName', _this.movedIndexInfo.rowKey, PARENT_CELL_CLASS);
                    }
                    var offsetTop_1 = movedPosAndIndex.offsetTop, height = movedPosAndIndex.height, targetRow_1 = movedPosAndIndex.targetRow, moveToLast = movedPosAndIndex.moveToLast;
                    var rowKey_1 = targetRow_1.rowKey;
                    line.style.top = height + "px";
                    line.style.display = 'block';
                    _this.movedIndexInfo = { index: index, rowKey: rowKeyToMove, appended: false };
                    _this.props.dispatch('addRowClassName', rowKey_1, PARENT_CELL_CLASS);
                    // this.props.dispatch('moveRow', rowKey, index);
                }
                var gridEvent = new gridEvent_1.default({
                    rowKey: rowKey,
                    targetRowKey: _this.movedIndexInfo.rowKey,
                    appended: _this.movedIndexInfo.appended,
                });
                /**
                 * Occurs when dragging the row
                 * @event Grid#drag
                 * @property {Grid} instance - Current grid instance
                 * @property {RowKey} rowKey - The rowKey of the dragging row
                 * @property {RowKey} targetRowKey - The rowKey of the row at current dragging position
                 * @property {boolean} appended - Whether the row is appended to other row as the child in tree data.
                 */
                _this.props.eventBus.trigger('drag', gridEvent);
            }
        };
        _this.startToDragRow = function (posInfo) {
            var container = _this.el.parentElement.parentElement;
            posInfo.container = container;
            _this.props.dispatch('resetRowSpan');
            var draggableInfo = draggable_1.createDraggableRowInfo(_this.context.store, posInfo);
            if (draggableInfo) {
                var row = draggableInfo.row, rowKey = draggableInfo.rowKey, line = draggableInfo.line;
                var gridEvent = new gridEvent_1.default({ rowKey: rowKey, floatingRow: row });
                /**
                 * Occurs when starting to drag the row
                 * @event Grid#dragStart
                 * @property {Grid} instance - Current grid instance
                 * @property {RowKey} rowKey - The rowKey of the row to drag
                 * @property {HTMLElement} floatingRow - The floating row DOM element
                 */
                _this.props.eventBus.trigger('dragStart', gridEvent);
                if (!gridEvent.isStopped()) {
                    container.appendChild(row);
                    var clientWidth = row.clientWidth, clientHeight = row.clientHeight;
                    _this.floatingRowSize = { width: clientWidth, height: clientHeight };
                    _this.draggableInfo = draggableInfo;
                    // if (this.props.hasTreeColumn) {
                    container.appendChild(line);
                    // }
                    _this.props.dispatch('addRowClassName', rowKey, DRAGGING_CLASS);
                    _this.props.dispatch('setFocusInfo', null, null, false);
                    _this.props.dispatch('initSelection');
                    document.addEventListener('mousemove', _this.dragRow);
                    document.addEventListener('mouseup', _this.dropRow);
                    document.addEventListener('selectstart', _this.handleSelectStart);
                }
            }
        };
        _this.handleMouseDown = function (ev) {
            var _a;
            var targetElement = ev.target;
            if (!_this.el ||
                targetElement === _this.el ||
                (ev.button === constant_1.RIGHT_MOUSE_BUTTON && _this.isSelectedCell(targetElement))) {
                return;
            }
            var _b = _this.props, side = _b.side, dispatch = _b.dispatch;
            if (dom_1.hasClass(targetElement, 'cell-dummy')) {
                dispatch('saveAndFinishEditing');
                dispatch('initFocus');
                dispatch('initSelection');
                return;
            }
            var el = _this.el;
            var shiftKey = ev.shiftKey;
            var _c = dom_1.getCoordinateWithOffset(ev.pageX, ev.pageY), pageX = _c[0], pageY = _c[1];
            if (!el) {
                return;
            }
            pageX = toBodyZoom(pageX);
            pageY = toBodyZoom(pageY);
            var scrollTop = el.scrollTop, scrollLeft = el.scrollLeft;
            var _d = el.getBoundingClientRect(), top = _d.top, left = _d.left;
            _this.boundingRect = { top: top, left: left };
            if (((_a = dom_1.getCellAddress(targetElement)) === null || _a === void 0 ? void 0 : _a.columnName) === DRAGGABLE_COLUMN_NAME) {
                _this.startToDragRow({ pageX: pageX, pageY: pageY, left: left, top: top, scrollLeft: scrollLeft, scrollTop: scrollTop });
                return;
            }
            if (!dom_1.isDatePickerElement(targetElement) &&
                !dom_1.findParentByClassName(targetElement, 'layer-editing') &&
                !dom_1.findParentByClassName(targetElement, 'btn-tree')) {
                dispatch('mouseDownBody', tslib_1.__assign({ scrollTop: scrollTop, scrollLeft: scrollLeft, side: side }, _this.boundingRect), { pageX: pageX, pageY: pageY, shiftKey: shiftKey });
            }
            _this.dragStartData = { pageX: pageX, pageY: pageY };
            dom_1.setCursorStyle('default');
            document.addEventListener('mousemove', _this.handleMouseMove);
            document.addEventListener('mouseup', _this.clearDocumentEvents);
            document.addEventListener('selectstart', _this.handleSelectStart);
            // @ts-ignore
            if (ev.target && ev.target.focus) { //update by tangbin
                window.setTimeout(function () {
                    ev.target.focus();
                }, 16);
            }
        };
        _this.moveEnoughToTriggerDragEvent = function (current) {
            var dx = Math.abs(_this.dragStartData.pageX - current.pageX);
            var dy = Math.abs(_this.dragStartData.pageY - current.pageY);
            var movedDistance = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
            return movedDistance >= MIN_DISTANCE_FOR_DRAG;
        };
        _this.handleSelectStart = function (ev) {
            ev.preventDefault();
        };
        _this.handleMouseMove = function (ev) {
            var _a = dom_1.getCoordinateWithOffset(ev.pageX, ev.pageY), pageX = _a[0], pageY = _a[1];
            pageX = toBodyZoom(pageX);
            pageY = toBodyZoom(pageY);
            if (_this.moveEnoughToTriggerDragEvent({ pageX: pageX, pageY: pageY })) {
                var _b = _this, el = _b.el, boundingRect = _b.boundingRect, props = _b.props;
                if (!el) {
                    return;
                }
                var _c = el, scrollTop = _c.scrollTop, scrollLeft = _c.scrollLeft;
                var side = props.side, dispatch = props.dispatch;
                dispatch('dragMoveBody', _this.dragStartData, { pageX: pageX, pageY: pageY }, tslib_1.__assign({ scrollTop: scrollTop, scrollLeft: scrollLeft, side: side }, boundingRect));
            }
        };
        _this.dropRow = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var hasTreeColumn, rowKey, _a, index, targetRowKey, appended, _b, moveToLast, gridEvent;
            var _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        hasTreeColumn = this.props.hasTreeColumn;
                        rowKey = this.draggableInfo.rowKey;
                        if (!this.movedIndexInfo) return [3 /*break*/, 2];
                        _a = this.movedIndexInfo, index = _a.index, targetRowKey = _a.rowKey, appended = _a.appended, _b = _a.moveToLast, moveToLast = _b === void 0 ? false : _b;
                        gridEvent = new gridEvent_1.default({ rowKey: rowKey, targetRowKey: targetRowKey, appended: appended });
                        /**
                         * Occurs when dropping the row
                         * @event Grid#drop
                         * @property {Grid} instance - Current grid instance
                         * @property {RowKey} rowKey - The rowKey of the dragging row
                         * @property {RowKey} targetRowKey - The rowKey of the row at current dragging position
                         * @property {boolean} appended - Whether the row is appended to other row as the child in tree data.
                         */
                        return [4 /*yield*/, this.props.eventBus.trigger('drop', gridEvent)];
                    case 1:
                        /**
                         * Occurs when dropping the row
                         * @event Grid#drop
                         * @property {Grid} instance - Current grid instance
                         * @property {RowKey} rowKey - The rowKey of the dragging row
                         * @property {RowKey} targetRowKey - The rowKey of the row at current dragging position
                         * @property {boolean} appended - Whether the row is appended to other row as the child in tree data.
                         */
                        _d.sent();
                        if (!gridEvent.isStopped()) {
                            if (hasTreeColumn) {
                                this.props.dispatch('moveTreeRow', rowKey, index, { appended: appended, moveToLast: moveToLast });
                            }
                            else {
                                this.props.dispatch('moveRow', rowKey, index);
                            }
                        }
                        _d.label = 2;
                    case 2:
                        this.props.dispatch('removeRowClassName', rowKey, DRAGGING_CLASS);
                        if (!common_1.isNil((_c = this.movedIndexInfo) === null || _c === void 0 ? void 0 : _c.rowKey)) {
                            this.props.dispatch('removeRowClassName', this.movedIndexInfo.rowKey, PARENT_CELL_CLASS);
                        }
                        // clear floating element and draggable info
                        this.clearDraggableInfo();
                        this.props.dispatch('updateRowSpan');
                        return [2 /*return*/];
                }
            });
        }); };
        _this.clearDocumentEvents = function () {
            _this.dragStartData = { pageX: null, pageY: null };
            _this.props.dispatch('dragEnd');
            dom_1.setCursorStyle('');
            document.removeEventListener('mousemove', _this.handleMouseMove);
            document.removeEventListener('mouseup', _this.clearDocumentEvents);
            document.removeEventListener('selectstart', _this.handleSelectStart);
        };
        return _this;
    }
    BodyAreaComp.prototype.setTreeMovedIndexInfo = function (movedPosAndIndex) {
        var _a;
        var line = this.draggableInfo.line;
        var index = movedPosAndIndex.index, offsetTop = movedPosAndIndex.offsetTop, height = movedPosAndIndex.height, targetRow = movedPosAndIndex.targetRow, moveToLast = movedPosAndIndex.moveToLast;
        var rowKey = targetRow.rowKey;
        if (!common_1.isNil((_a = this.movedIndexInfo) === null || _a === void 0 ? void 0 : _a.rowKey)) {
            this.props.dispatch('removeRowClassName', this.movedIndexInfo.rowKey, PARENT_CELL_CLASS);
        }
        var targetRowKey = moveToLast ? null : rowKey;
        // display line border to mark the index to move
        if (Math.abs(height - offsetTop) < ADDITIONAL_RANGE || moveToLast) {
            line.style.top = height + "px";
            line.style.display = 'block';
            this.movedIndexInfo = { index: index, rowKey: targetRowKey, moveToLast: moveToLast, appended: false };
            // show the background color to mark parent row
        }
        else {
            line.style.display = 'none';
            this.movedIndexInfo = { index: index, rowKey: targetRowKey, appended: true };
            this.props.dispatch('addRowClassName', rowKey, PARENT_CELL_CLASS);
        }
    };
    BodyAreaComp.prototype.isSelectedCell = function (element) {
        var cellAddress = dom_1.getCellAddress(element);
        if (cellAddress) {
            var rowKey = cellAddress.rowKey, columnName = cellAddress.columnName;
            return focus_1.isFocusedCell(this.context.store.focus, rowKey, columnName);
        }
        return !!dom_1.findParentByClassName(element, 'layer-selection');
    };
    BodyAreaComp.prototype.clearDraggableInfo = function () {
        if (this.draggableInfo) {
            var _a = this.draggableInfo, row = _a.row, line = _a.line;
            row.parentElement.removeChild(row);
            // if (this.props.hasTreeColumn) {
            line.parentElement.removeChild(line);
            // }
        }
        this.draggableInfo = null;
        this.movedIndexInfo = null;
        document.removeEventListener('mousemove', this.dragRow);
        document.removeEventListener('mouseup', this.dropRow);
        document.removeEventListener('selectstart', this.handleSelectStart);
    };
    BodyAreaComp.prototype.shouldComponentUpdate = function (nextProps) {
        var currProps = this.props;
        return common_1.some(function (propName) { return nextProps[propName] !== currProps[propName]; }, PROPS_FOR_UPDATE);
    };
    BodyAreaComp.prototype.componentWillReceiveProps = function (nextProps) {
        var scrollTop = nextProps.scrollTop, scrollLeft = nextProps.scrollLeft;
        if (!this.el) {
            return;
        }
        this.el.scrollTop = scrollTop;
        this.el.scrollLeft = scrollLeft;
    };
    BodyAreaComp.prototype.render = function (_a) {
        var _this = this;
        var side = _a.side, bodyHeight = _a.bodyHeight, totalRowHeight = _a.totalRowHeight, totalColumnWidth = _a.totalColumnWidth, scrollXHeight = _a.scrollXHeight, offsetTop = _a.offsetTop, offsetLeft = _a.offsetLeft, dummyRowCount = _a.dummyRowCount, scrollX = _a.scrollX, scrollY = _a.scrollY, cellBorderWidth = _a.cellBorderWidth, visibleTotalWidth = _a.visibleTotalWidth;
        var areaStyle = { height: bodyHeight };
        if (!scrollX) {
            areaStyle.overflowX = 'hidden';
        }
        if (!scrollY && side === 'R') {
            areaStyle.overflowY = 'hidden';
        }
        var tableContainerStyle = {
            width: visibleTotalWidth,
            top: offsetTop,
            left: offsetLeft,
            height: dummyRowCount ? bodyHeight - scrollXHeight : '',
            overflow: dummyRowCount ? 'hidden' : 'visible',
        };
        var containerStyle = {
            width: totalColumnWidth + (side === 'R' ? 0 : cellBorderWidth),
            height: totalRowHeight ? totalRowHeight + cellBorderWidth : '100%',
        };
        return (preact_1.h("div", { class: dom_1.cls('body-area'), style: areaStyle, onScroll: this.handleScroll, onMouseDown: this.handleMouseDown, ref: function (el) {
                _this.el = el;
            } },
            preact_1.h("div", { class: dom_1.cls('body-container'), style: containerStyle },
                preact_1.h("div", { class: dom_1.cls('table-container'), style: tableContainerStyle },
                    preact_1.h("table", { class: dom_1.cls('table') },
                        preact_1.h(colGroup_1.ColGroup, { side: side, useViewport: true }),
                        preact_1.h(bodyRows_1.BodyRows, { side: side }))),
                preact_1.h(focusLayer_1.FocusLayer, { side: side }),
                preact_1.h(selectionLayer_1.SelectionLayer, { side: side }),
                preact_1.h(editingLayer_1.EditingLayer, { side: side }))));
    };
    return BodyAreaComp;
}(preact_1.Component));
function toBodyZoom(num) {
    // @ts-ignore
    var zoom = document.body.style.zoom;
    // @ts-ignore
    if (zoom) {
        // @ts-ignore
        zoom = parseFloat(zoom);
        // @ts-ignore
        num = num * (1 / zoom);
    }
    return num;
}
exports.toBodyZoom = toBodyZoom;
exports.BodyArea = hoc_1.connect(function (store, _a) {
    var _b;
    var side = _a.side;
    var columnCoords = store.columnCoords, rowCoords = store.rowCoords, dimension = store.dimension, viewport = store.viewport, id = store.id, column = store.column;
    var totalRowHeight = rowCoords.totalRowHeight;
    var totalColumnWidth = columnCoords.totalColumnWidth, widths = columnCoords.widths;
    var bodyHeight = dimension.bodyHeight, scrollXHeight = dimension.scrollXHeight, scrollX = dimension.scrollX, scrollY = dimension.scrollY, cellBorderWidth = dimension.cellBorderWidth;
    var offsetLeft = viewport.offsetLeft, offsetTop = viewport.offsetTop, scrollTop = viewport.scrollTop, scrollLeft = viewport.scrollLeft, dummyRowCount = viewport.dummyRowCount, colRange = viewport.colRange, columns = viewport.columns;
    var visibleWidths = side === 'R' ? (_b = widths[side]).slice.apply(_b, colRange) : widths[side];
    var visibleColumns = side === 'R' ? columns : column.visibleColumnsBySideWithRowHeader[side];
    var visibleTotalWidth = visibleColumns.reduce(function (acc, _, idx) { return acc + visibleWidths[idx] + cellBorderWidth; }, 0);
    return {
        bodyHeight: bodyHeight,
        totalRowHeight: totalRowHeight,
        offsetTop: offsetTop,
        scrollTop: scrollTop,
        totalColumnWidth: totalColumnWidth[side],
        offsetLeft: side === 'L' ? 0 : offsetLeft,
        scrollLeft: side === 'L' ? 0 : scrollLeft,
        scrollXHeight: scrollXHeight,
        dummyRowCount: dummyRowCount,
        scrollX: scrollX,
        scrollY: scrollY,
        cellBorderWidth: cellBorderWidth,
        eventBus: eventBus_1.getEventBus(id),
        hasTreeColumn: !!column.treeColumnName,
        visibleTotalWidth: visibleTotalWidth,
    };
})(BodyAreaComp);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createObservableData = exports.fillMissingColumnData = void 0;
var tslib_1 = __webpack_require__(1);
var observable_1 = __webpack_require__(5);
var data_1 = __webpack_require__(15);
var data_2 = __webpack_require__(6);
var tree_1 = __webpack_require__(19);
var common_1 = __webpack_require__(0);
function getDataToBeObservable(acc, row, viewRow, index, treeColumnName) {
    if (treeColumnName && row._attributes.tree.hidden) {
        return acc;
    }
    if (!observable_1.isObservable(row) ||
        (viewRow && row.rowKey === viewRow.rowKey && !observable_1.isObservable(viewRow.valueMap))) {
        acc.rows.push(row);
        acc.targetIndexes.push(index);
    }
    return acc;
}
function createOriginData(data, rowRange, treeColumnName) {
    var start = rowRange[0], end = rowRange[1];
    var viewData = data.viewData.slice(start, end);
    return data.rawData
        .slice(start, end)
        .reduce(function (acc, row, index) {
        return getDataToBeObservable(acc, row, viewData[index], index + start, treeColumnName);
    }, {
        rows: [],
        targetIndexes: [],
    });
}
function createFilteredOriginData(data, rowRange, treeColumnName) {
    var start = rowRange[0], end = rowRange[1];
    var rawData = data.rawData, viewData = data.viewData;
    return data
        .filteredIndex.slice(start, end)
        .reduce(function (acc, rowIndex) {
        return getDataToBeObservable(acc, rawData[rowIndex], viewData[rowIndex], rowIndex, treeColumnName);
    }, { rows: [], targetIndexes: [] });
}
function changeToObservableData(id, column, data, originData) {
    var targetIndexes = originData.targetIndexes, rows = originData.rows;
    var rawData = data.rawData;
    fillMissingColumnData(column, rows);
    // prevRows is needed to create rowSpan
    var prevRows = targetIndexes.map(function (targetIndex) { return data.rawData[targetIndex - 1]; });
    for (var index = 0, end = rows.length; index < end; index += 1) {
        var targetIndex = targetIndexes[index];
        var rawRow = data_1.createRawRow(id, rows[index], index, column, {
            lazyObservable: false,
            prevRow: prevRows[index],
            keyColumnName: column.keyColumnName,
        });
        var viewRow = data_1.createViewRow(id, rawRow, rawData, column);
        common_1.silentSplice(data.rawData, targetIndex, 1, rawRow);
        common_1.silentSplice(data.viewData, targetIndex, 1, viewRow);
    }
    observable_1.notify(data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
}
function changeToObservableTreeData(id, column, data, originData) {
    var rows = originData.rows;
    var rawData = data.rawData, viewData = data.viewData;
    fillMissingColumnData(column, rows);
    // create new creation key for updating the observe function of hoc component
    data_1.generateDataCreationKey();
    rows.forEach(function (row) {
        var parentRow = data_2.findRowByRowKey(data, column, id, row._attributes.tree.parentRowKey);
        var rawRow = tree_1.createTreeRawRow(id, row, parentRow || null, column);
        var viewRow = data_1.createViewRow(id, rawRow, rawData, column);
        var foundIndex = data_2.findIndexByRowKey(data, column, id, rawRow.rowKey);
        common_1.silentSplice(rawData, foundIndex, 1, rawRow);
        common_1.silentSplice(viewData, foundIndex, 1, viewRow);
    });
    observable_1.notify(data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
}
function fillMissingColumnData(column, rawData) {
    for (var i = 0; i < rawData.length; i += 1) {
        rawData[i] = tslib_1.__assign(tslib_1.__assign({}, column.emptyRow), rawData[i]);
    }
}
exports.fillMissingColumnData = fillMissingColumnData;
function createObservableData(_a, allRowRange) {
    var column = _a.column, data = _a.data, viewport = _a.viewport, id = _a.id;
    if (allRowRange === void 0) { allRowRange = false; }
    var rowRange = allRowRange ? [0, data.rawData.length] : viewport.rowRange;
    var treeColumnName = column.treeColumnName;
    var originData = data.filters && !allRowRange
        ? createFilteredOriginData(data, rowRange, treeColumnName)
        : createOriginData(data, rowRange, treeColumnName);
    if (!originData.rows.length) {
        return;
    }
    if (treeColumnName) {
        changeToObservableTreeData(id, column, data, originData);
    }
    else {
        changeToObservableData(id, column, data, originData);
    }
}
exports.createObservableData = createObservableData;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSortState = exports.sortByCurrentState = exports.resetSortKey = exports.updateSortKey = exports.emitAfterSort = exports.emitBeforeSort = exports.initSortState = exports.unsort = exports.sort = exports.changeSortState = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var observable_1 = __webpack_require__(5);
var sort_1 = __webpack_require__(72);
var eventBus_1 = __webpack_require__(7);
var data_1 = __webpack_require__(14);
var data_2 = __webpack_require__(6);
var column_1 = __webpack_require__(12);
var sort_2 = __webpack_require__(44);
var rowSpan_1 = __webpack_require__(24);
function createSoretedViewData(rawData) {
    return rawData.map(function (_a) {
        var rowKey = _a.rowKey, sortKey = _a.sortKey, uniqueKey = _a.uniqueKey;
        return ({ rowKey: rowKey, sortKey: sortKey, uniqueKey: uniqueKey });
    });
}
function sortData(store) {
    var data = store.data, column = store.column;
    var sortState = data.sortState, rawData = data.rawData, viewData = data.viewData, pageRowRange = data.pageRowRange;
    var columns = sortState.columns;
    var sortedColumns = columns.map(function (sortedColumn) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, sortedColumn), { comparator: (_a = column.allColumnMap[sortedColumn.columnName]) === null || _a === void 0 ? void 0 : _a.comparator }));
    });
    if (data_2.isScrollPagination(data, true)) {
        // should sort the sliced data which is displayed in viewport in case of client infinite scrolling
        var targetRawData = rawData.slice.apply(rawData, pageRowRange);
        targetRawData.sort(sort_1.sortRawData(sortedColumns));
        var targetViewData = createSoretedViewData(targetRawData);
        data.rawData = targetRawData.concat(rawData.slice(pageRowRange[1]));
        data.viewData = targetViewData.concat(viewData.slice(pageRowRange[1]));
    }
    else {
        rawData.sort(sort_1.sortRawData(sortedColumns));
        data.viewData = createSoretedViewData(rawData);
    }
}
function setInitialSortState(data) {
    data.sortState.columns = [{ columnName: 'sortKey', ascending: true }];
}
function setSortStateForEmptyState(data) {
    if (!data.sortState.columns.length) {
        setInitialSortState(data);
    }
}
function toggleSortAscending(data, index, ascending, sortingType, cancelable) {
    var defaultAscending = sortingType === 'asc';
    if (defaultAscending === ascending && cancelable) {
        data.sortState.columns.splice(index, 1);
    }
    else {
        data.sortState.columns[index].ascending = ascending;
    }
}
function changeSingleSortState(data, columnName, ascending, sortingType, cancelable) {
    var sortState = data.sortState;
    var columns = sortState.columns;
    var sortedColumn = { columnName: columnName, ascending: ascending };
    if (columns.length === 1 && columns[0].columnName === columnName) {
        var columnIndex = common_1.findPropIndex('columnName', columnName, sortState.columns);
        toggleSortAscending(data, columnIndex, ascending, sortingType, cancelable);
    }
    else {
        data.sortState.columns = [sortedColumn];
    }
}
function changeMultiSortState(data, columnName, ascending, sortingType, cancelable) {
    var sortedColumn = { columnName: columnName, ascending: ascending };
    var sortState = data.sortState;
    var columns = sortState.columns;
    var columnIndex = common_1.findPropIndex('columnName', columnName, columns);
    if (columnIndex === -1) {
        data.sortState.columns = data_2.isInitialSortState(sortState)
            ? [sortedColumn]
            : tslib_1.__spreadArrays(columns, [sortedColumn]);
    }
    else {
        toggleSortAscending(data, columnIndex, ascending, sortingType, cancelable);
    }
}
function changeSortState(_a, columnName, ascending, multiple, cancelable) {
    var data = _a.data, column = _a.column;
    if (cancelable === void 0) { cancelable = true; }
    if (columnName === 'sortKey') {
        setInitialSortState(data);
    }
    else {
        var sortingType = column.allColumnMap[columnName].sortingType;
        if (multiple) {
            changeMultiSortState(data, columnName, ascending, sortingType, cancelable);
        }
        else {
            changeSingleSortState(data, columnName, ascending, sortingType, cancelable);
        }
        setSortStateForEmptyState(data);
    }
    if (!data.sortState.useClient) {
        observable_1.notify(data, 'sortState');
    }
}
exports.changeSortState = changeSortState;
function applySortedData(store) {
    sortData(store);
    observable_1.notify(store.data, 'sortState');
    data_1.updateRowNumber(store, 0);
    data_1.setCheckedAllRows(store);
}
function sort(store, columnName, ascending, multiple, cancelable) {
    if (multiple === void 0) { multiple = false; }
    if (cancelable === void 0) { cancelable = true; }
    var data = store.data, column = store.column;
    var sortState = data.sortState;
    if (column_1.isComplexHeader(column, columnName) || !data_2.isSortable(sortState, column, columnName)) {
        return;
    }
    var cancelSort = sort_2.isCancelSort(store, columnName, ascending, cancelable);
    var gridEvent = emitBeforeSort(store, cancelSort, { columnName: columnName, ascending: ascending, multiple: multiple });
    if (gridEvent.isStopped()) {
        return;
    }
    changeSortState(store, columnName, ascending, multiple, cancelable);
    applySortedData(store);
    emitAfterSort(store, cancelSort, columnName);
    rowSpan_1.updateRowSpan(store);
}
exports.sort = sort;
function unsort(store, columnName) {
    if (columnName === void 0) { columnName = 'sortKey'; }
    var data = store.data, column = store.column;
    var sortState = data.sortState;
    if (column_1.isComplexHeader(column, columnName) || !data_2.isSortable(sortState, column, columnName)) {
        return;
    }
    emitBeforeSort(store, true, { columnName: columnName, multiple: true });
    if (columnName === 'sortKey') {
        setInitialSortState(data);
    }
    else {
        var index = common_1.findPropIndex('columnName', columnName, data.sortState.columns);
        if (index !== -1) {
            data.sortState.columns.splice(index, 1);
            setSortStateForEmptyState(data);
        }
    }
    applySortedData(store);
    emitAfterSort(store, true, columnName);
    rowSpan_1.updateRowSpan(store);
}
exports.unsort = unsort;
function initSortState(data) {
    setInitialSortState(data);
    observable_1.notify(data, 'sortState');
}
exports.initSortState = initSortState;
function emitBeforeSort(store, cancelSort, eventParams) {
    var id = store.id, data = store.data;
    var eventBus = eventBus_1.getEventBus(id);
    var eventType = cancelSort ? 'beforeUnsort' : 'beforeSort';
    var gridEvent = sort_2.createSortEvent(eventType, tslib_1.__assign(tslib_1.__assign({}, eventParams), { sortState: data.sortState }));
    eventBus.trigger(eventType, gridEvent);
    return gridEvent;
}
exports.emitBeforeSort = emitBeforeSort;
function emitAfterSort(store, cancelSort, columnName) {
    var id = store.id, data = store.data;
    var eventBus = eventBus_1.getEventBus(id);
    // @TODO: `sort` event will be deprecated. This event is replaced with `afterSort` event
    var eventTypes = (cancelSort ? ['afterUnsort'] : ['afterSort', 'sort']);
    eventTypes.forEach(function (eventType) {
        var gridEvent = sort_2.createSortEvent(eventType, { columnName: columnName, sortState: data.sortState });
        eventBus.trigger(eventType, gridEvent);
    });
}
exports.emitAfterSort = emitAfterSort;
function updateSortKey(data, sortKey, appended) {
    if (appended === void 0) { appended = true; }
    var incremental = appended ? 1 : -1;
    var rawData = data.rawData, viewData = data.viewData;
    for (var idx = 0; idx < rawData.length; idx += 1) {
        if (rawData[idx].sortKey >= sortKey) {
            rawData[idx].sortKey += incremental;
            viewData[idx].sortKey += incremental;
        }
    }
    if (appended) {
        rawData[sortKey].sortKey = sortKey;
        viewData[sortKey].sortKey = sortKey;
    }
}
exports.updateSortKey = updateSortKey;
function resetSortKey(data, start) {
    var rawData = data.rawData, viewData = data.viewData;
    for (var idx = start; idx < rawData.length; idx += 1) {
        rawData[idx].sortKey = idx;
        viewData[idx].sortKey = idx;
    }
}
exports.resetSortKey = resetSortKey;
function sortByCurrentState(store) {
    var data = store.data;
    if (data_2.isSorted(data)) {
        var _a = data.sortState.columns[0], columnName = _a.columnName, ascending = _a.ascending;
        sort(store, columnName, ascending, true, false);
    }
}
exports.sortByCurrentState = sortByCurrentState;
function resetSortState(store, sortState) {
    var data = store.data, column = store.column;
    if (sortState) {
        var columnName = sortState.columnName, ascending = sortState.ascending, multiple = sortState.multiple;
        var _a = column.allColumnMap[columnName], sortingType = _a.sortingType, sortable = _a.sortable;
        if (sortable) {
            var cancelable = common_1.isUndefined(ascending);
            var nextAscending = cancelable ? sortingType === 'asc' : ascending;
            changeSortState(store, columnName, nextAscending, multiple, cancelable);
            observable_1.notify(data, 'sortState');
        }
    }
    else {
        initSortState(data);
    }
}
exports.resetSortState = resetSortState;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.composeConditionFn = exports.getFilterConditionFn = exports.getUnixTime = exports.createFilterSelectOption = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var i18n_1 = tslib_1.__importDefault(__webpack_require__(18));
var filterSelectOption;
function createFilterSelectOption() {
    if (!filterSelectOption) {
        filterSelectOption = {
            number: {
                eq: '=',
                lt: '<',
                gt: '>',
                lte: '<=',
                gte: '>=',
                ne: '!=',
            },
            text: {
                contain: i18n_1.default.get('filter.contains'),
                eq: i18n_1.default.get('filter.eq'),
                ne: i18n_1.default.get('filter.ne'),
                start: i18n_1.default.get('filter.start'),
                end: i18n_1.default.get('filter.end'),
            },
            date: {
                eq: i18n_1.default.get('filter.eq'),
                ne: i18n_1.default.get('filter.ne'),
                after: i18n_1.default.get('filter.after'),
                afterEq: i18n_1.default.get('filter.afterEq'),
                before: i18n_1.default.get('filter.before'),
                beforeEq: i18n_1.default.get('filter.beforeEq'),
            },
        };
    }
    return filterSelectOption;
}
exports.createFilterSelectOption = createFilterSelectOption;
function getUnixTime(value) {
    return parseInt((new Date(String(value)).getTime() / 1000).toFixed(0), 10);
}
exports.getUnixTime = getUnixTime;
function getPredicateWithType(code, type, inputValue) {
    var convertFn = {
        number: Number,
        text: String,
        select: String,
        date: getUnixTime,
    }[type];
    return code === 'eq'
        ? function (cellValue) { return convertFn(cellValue) === convertFn(inputValue); }
        : function (cellValue) { return convertFn(cellValue) !== convertFn(inputValue); };
}
function getFilterConditionFn(code, inputValue, type) {
    switch (code) {
        case 'eq':
        case 'ne':
            return getPredicateWithType(code, type, inputValue);
        case 'lt':
            return function (cellValue) { return Number(cellValue) < Number(inputValue); };
        case 'gt':
            return function (cellValue) { return Number(cellValue) > Number(inputValue); };
        case 'lte':
            return function (cellValue) { return Number(cellValue) <= Number(inputValue); };
        case 'gte':
            return function (cellValue) { return Number(cellValue) >= Number(inputValue); };
        case 'contain':
            return function (cellValue) {
                return common_1.isString(cellValue) && common_1.isString(inputValue) && cellValue.indexOf(inputValue) !== -1;
            };
        case 'start':
            return function (cellValue) {
                return common_1.isString(cellValue) && common_1.isString(inputValue) && common_1.startsWith(inputValue, cellValue);
            };
        case 'end':
            return function (cellValue) {
                return common_1.isString(cellValue) && common_1.isString(inputValue) && common_1.endsWith(inputValue, cellValue);
            };
        case 'after':
            return function (cellValue) { return getUnixTime(cellValue) > getUnixTime(inputValue); };
        case 'afterEq':
            return function (cellValue) { return getUnixTime(cellValue) >= getUnixTime(inputValue); };
        case 'before':
            return function (cellValue) { return getUnixTime(cellValue) < getUnixTime(inputValue); };
        case 'beforeEq':
            return function (cellValue) { return getUnixTime(cellValue) <= getUnixTime(inputValue); };
        default:
            throw new Error('code not available.');
    }
}
exports.getFilterConditionFn = getFilterConditionFn;
function composeConditionFn(fns, operator) {
    return function (value) {
        return fns.reduce(function (acc, fn) {
            return operator === 'OR' ? acc || fn(value) : acc && fn(value);
        }, operator !== 'OR');
    };
}
exports.composeConditionFn = composeConditionFn;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTreeRow = exports.replaceTreeRow = exports.removeTreeRow = exports.appendTreeRow = exports.changeTreeRowsCheckedState = exports.collapseAll = exports.collapseByRowKey = exports.selectionEnd = exports.expandAll = exports.expandByRowKey = exports.removeExpandedAttr = void 0;
var tslib_1 = __webpack_require__(1);
var data_1 = __webpack_require__(15);
var data_2 = __webpack_require__(6);
var observable_1 = __webpack_require__(5);
var instance_1 = __webpack_require__(8);
var data_3 = __webpack_require__(14);
var tree_1 = __webpack_require__(20);
var eventBus_1 = __webpack_require__(7);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var tree_2 = __webpack_require__(19);
var common_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(2);
var lazyObservable_1 = __webpack_require__(29);
var column_1 = __webpack_require__(12);
var data_4 = __webpack_require__(23);
var constant_1 = __webpack_require__(10);
var column_2 = __webpack_require__(33);
function changeExpandedAttr(row, expanded) {
    var tree = row._attributes.tree;
    if (tree) {
        row._attributes.expanded = expanded;
        tree.expanded = expanded;
    }
}
function changeHiddenAttr(row, hidden) {
    var tree = row._attributes.tree;
    if (tree) {
        tree.hidden = hidden;
    }
}
function expand(store, row, recursive) {
    var rowKey = row.rowKey;
    var eventBus = eventBus_1.getEventBus(store.id);
    var gridEvent = new gridEvent_1.default({ rowKey: rowKey });
    /**
     * Occurs when the row having child rows is expanded
     * @event Grid#expand
     * @type {module:event/gridEvent}
     * @property {number|string} rowKey - rowKey of the expanded row
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('expand', gridEvent);
    if (gridEvent.isStopped()) {
        return;
    }
    var data = store.data, rowCoords = store.rowCoords, dimension = store.dimension, column = store.column, id = store.id, viewport = store.viewport, columnCoords = store.columnCoords;
    var heights = rowCoords.heights;
    changeExpandedAttr(row, true);
    var childRowKeys = tree_1.getChildRowKeys(row);
    updateTreeColumnWidth(childRowKeys, column, columnCoords, dimension, data.rawData);
    childRowKeys.forEach(function (childRowKey) {
        var childRow = data_2.findRowByRowKey(data, column, id, childRowKey);
        if (!childRow) {
            return;
        }
        changeHiddenAttr(childRow, false);
        if (!tree_1.isLeaf(childRow) && (tree_1.isExpanded(childRow) || recursive)) {
            expand(store, childRow, recursive);
        }
        var index = data_2.findIndexByRowKey(data, column, id, childRowKey);
        heights[index] = data_2.getRowHeight(childRow, dimension.rowHeight);
    });
    if (childRowKeys.length) {
        observable_1.notify(rowCoords, 'heights');
        observable_1.notify(viewport, 'rowRange');
    }
}
function updateTreeColumnWidth(childRowKeys, column, columnCoords, dimension, rawData) {
    var visibleColumnsBySideWithRowHeader = column.visibleColumnsBySideWithRowHeader, treeIcon = column.treeIcon, allColumnMap = column.allColumnMap, treeIndentWidth = column.treeIndentWidth;
    var treeColumnName = column.treeColumnName;
    var treeColumnSide = column_1.getColumnSide(column, treeColumnName);
    var treeColumnIndex = common_1.findPropIndex('name', treeColumnName, column.visibleColumnsBySide[treeColumnSide]);
    var columnInfo = visibleColumnsBySideWithRowHeader[treeColumnSide][treeColumnIndex];
    // @TODO: auto resizing is operated with 'autoResizing' option
    // 'resizable' condition should be deprecated in next version
    if (columnInfo.resizable || columnInfo.autoResizing) {
        var maxWidth = getChildTreeNodeMaxWidth(childRowKeys, rawData, columnInfo, treeIndentWidth, treeIcon);
        var prevWidth = columnCoords.widths[treeColumnSide][treeColumnIndex] + dimension.cellBorderWidth;
        allColumnMap[treeColumnName].baseWidth = Math.max(prevWidth, maxWidth);
        allColumnMap[treeColumnName].fixedWidth = true;
    }
}
function getChildTreeNodeMaxWidth(childRowKeys, rawData, column, treeIndentWidth, useIcon) {
    var maxLength = 0;
    var bodyArea = document.querySelector("." + dom_1.cls('rside-area') + " ." + dom_1.cls('body-container') + " ." + dom_1.cls('table'));
    var getMaxWidth = childRowKeys.reduce(function (acc, rowKey) {
        var row = common_1.findProp('rowKey', rowKey, rawData);
        var formattedValue = data_4.createFormattedValue(row, column);
        if (formattedValue.length > maxLength) {
            maxLength = formattedValue.length;
            acc = function () {
                return dom_1.getTextWidth(formattedValue, bodyArea) +
                    tree_2.getTreeIndentWidth(tree_1.getDepth(rawData, row), treeIndentWidth, useIcon) +
                    constant_1.TREE_CELL_HORIZONTAL_PADDING;
            };
        }
        return acc;
    }, function () { return 0; });
    return getMaxWidth();
}
function collapse(store, row, recursive) {
    var rowKey = row.rowKey;
    var eventBus = eventBus_1.getEventBus(store.id);
    var gridEvent = new gridEvent_1.default({ rowKey: rowKey });
    /**
     * Occurs when the row having child rows is collapsed
     * @event Grid#collapse
     * @type {module:event/gridEvent}
     * @property {number|string} rowKey - rowKey of the collapsed row
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('collapse', gridEvent);
    if (gridEvent.isStopped()) {
        return;
    }
    var data = store.data, rowCoords = store.rowCoords, column = store.column, id = store.id;
    var heights = rowCoords.heights;
    changeExpandedAttr(row, false);
    var childRowKeys = tree_1.getChildRowKeys(row);
    childRowKeys.forEach(function (childRowKey) {
        var childRow = data_2.findRowByRowKey(data, column, id, childRowKey);
        if (!childRow) {
            return;
        }
        changeHiddenAttr(childRow, true);
        if (!tree_1.isLeaf(childRow)) {
            if (recursive) {
                collapse(store, childRow, recursive);
            }
            else {
                tree_1.getDescendantRows(store, childRowKey).forEach(function (_a) {
                    var descendantRowKey = _a.rowKey;
                    var index = data_2.findIndexByRowKey(data, column, id, descendantRowKey);
                    changeHiddenAttr(data.filteredRawData[index], true);
                    heights[index] = 0;
                });
            }
        }
        var index = data_2.findIndexByRowKey(data, column, id, childRowKey);
        heights[index] = 0;
    });
    observable_1.notify(rowCoords, 'heights');
}
function setCheckedState(row, state) {
    if (row && data_3.isUpdatableRowAttr('checked', row._attributes.checkDisabled)) {
        row._attributes.checked = state;
    }
}
function changeAncestorRowsCheckedState(store, rowKey) {
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData;
    var row = data_2.findRowByRowKey(data, column, id, rowKey);
    if (row) {
        tree_1.traverseAncestorRows(rawData, row, function (parentRow) {
            var childRowKeys = tree_1.getChildRowKeys(parentRow);
            var checkedChildRows = childRowKeys.filter(function (childRowKey) {
                var childRow = data_2.findRowByRowKey(data, column, id, childRowKey);
                return !!childRow && childRow._attributes.checked;
            });
            var checked = childRowKeys.length === checkedChildRows.length;
            setCheckedState(parentRow, checked);
        });
    }
}
function changeDescendantRowsCheckedState(store, rowKey, state) {
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData;
    var row = data_2.findRowByRowKey(data, column, id, rowKey);
    if (row) {
        tree_1.traverseDescendantRows(rawData, row, function (childRow) {
            setCheckedState(childRow, state);
        });
    }
}
function removeChildRowKey(row, rowKey) {
    var tree = row._attributes.tree;
    if (tree) {
        common_1.removeArrayItem(rowKey, tree.childRowKeys);
        if (row._children) {
            var index = common_1.findPropIndex('rowKey', rowKey, row._children);
            if (index !== -1) {
                row._children.splice(index, 1);
            }
        }
        if (!tree.childRowKeys.length) {
            row._leaf = true;
        }
        observable_1.notify(tree, 'childRowKeys');
    }
}
function removeExpandedAttr(row) {
    var tree = row._attributes.tree;
    if (tree) {
        tree.expanded = false;
    }
}
exports.removeExpandedAttr = removeExpandedAttr;
function expandByRowKey(store, rowKey, recursive) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_2.findRowByRowKey(data, column, id, rowKey);
    if (row) {
        // xuedan
        if (!recursive && tree_1.isExpanded(row)) {
            return;
        }
        expand(store, row, recursive);
    }
}
exports.expandByRowKey = expandByRowKey;
function expandAll(store) {
    store.data.rawData.forEach(function (row) {
        if (tree_1.isRootChildRow(row) && !tree_1.isLeaf(row)) {
            expand(store, row, true);
        }
    });
}
exports.expandAll = expandAll;
function selectionEnd(store) {
    var selection = store.selection;
    selection.inputRange = null;
}
exports.selectionEnd = selectionEnd;
function collapseByRowKey(store, rowKey, recursive) {
    var data = store.data, column = store.column, id = store.id;
    var row = data_2.findRowByRowKey(data, column, id, rowKey);
    if (row) {
        collapse(store, row, recursive);
    }
}
exports.collapseByRowKey = collapseByRowKey;
function collapseAll(store) {
    store.data.rawData.forEach(function (row) {
        if (tree_1.isRootChildRow(row) && !tree_1.isLeaf(row)) {
            collapse(store, row, true);
        }
    });
}
exports.collapseAll = collapseAll;
function changeTreeRowsCheckedState(store, rowKey, state) {
    var _a = store.column, treeColumnName = _a.treeColumnName, treeCascadingCheckbox = _a.treeCascadingCheckbox;
    if (treeColumnName && treeCascadingCheckbox) {
        changeDescendantRowsCheckedState(store, rowKey, state);
        changeAncestorRowsCheckedState(store, rowKey);
    }
}
exports.changeTreeRowsCheckedState = changeTreeRowsCheckedState;
// @TODO: consider tree disabled state with cascading
function appendTreeRow(store, row, options) {
    var data = store.data, column = store.column, rowCoords = store.rowCoords, dimension = store.dimension, id = store.id;
    var rawData = data.rawData, viewData = data.viewData;
    var heights = rowCoords.heights;
    var parentRowKey = options.parentRowKey, offset = options.offset, movingRow = options.movingRow;
    var parentRow = data_2.findRowByRowKey(data, column, id, parentRowKey);
    var startIdx = tree_1.getStartIndexToAppendRow(store, parentRow, offset);
    var rawRows = tree_2.flattenTreeData(id, [row], parentRow, column, {
        keyColumnName: column.keyColumnName,
        offset: offset,
    });
    var modificationType = movingRow ? 'UPDATE' : 'CREATE';
    lazyObservable_1.fillMissingColumnData(column, rawRows);
    var viewRows = rawRows.map(function (rawRow) { return data_1.createViewRow(id, rawRow, rawData, column); });
    common_1.silentSplice.apply(void 0, tslib_1.__spreadArrays([rawData, startIdx, 0], rawRows));
    common_1.silentSplice.apply(void 0, tslib_1.__spreadArrays([viewData, startIdx, 0], viewRows));
    var rowHeights = rawRows.map(function (rawRow) {
        changeTreeRowsCheckedState(store, rawRow.rowKey, rawRow._attributes.checked);
        instance_1.getDataManager(id).push(modificationType, rawRow, true);
        return data_2.getRowHeight(rawRow, dimension.rowHeight);
    });
    observable_1.notify(data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
    heights.splice.apply(heights, tslib_1.__spreadArrays([startIdx, 0], rowHeights));
    postUpdateAfterManipulation(store, startIdx, rawRows);
}
exports.appendTreeRow = appendTreeRow;
// @TODO: consider tree disabled state with cascading
function removeTreeRow(store, rowKey, movingRow) {
    var data = store.data, rowCoords = store.rowCoords, id = store.id, column = store.column;
    var rawData = data.rawData, viewData = data.viewData;
    var heights = rowCoords.heights;
    var parentRow = tree_1.getParentRow(store, rowKey);
    var modificationType = movingRow ? 'UPDATE' : 'DELETE';
    data_3.uncheck(store, rowKey);
    if (parentRow) {
        removeChildRowKey(parentRow, rowKey);
        if (!tree_1.getChildRowKeys(parentRow).length) {
            removeExpandedAttr(parentRow);
        }
    }
    var startIdx = data_2.findIndexByRowKey(data, column, id, rowKey);
    var deleteCount = tree_1.getDescendantRows(store, rowKey).length + 1;
    var removedRows = [];
    observable_1.batchObserver(function () {
        removedRows = rawData.splice(startIdx, deleteCount);
    });
    viewData.splice(startIdx, deleteCount);
    heights.splice(startIdx, deleteCount);
    for (var i = removedRows.length - 1; i >= 0; i -= 1) {
        instance_1.getDataManager(id).push(modificationType, removedRows[i]);
    }
    postUpdateAfterManipulation(store, startIdx, rawData);
}
exports.removeTreeRow = removeTreeRow;
// xuedan
function replaceTreeRow(store, row, rowKey) {
    var data = store.data, column = store.column, rowCoords = store.rowCoords, dimension = store.dimension, id = store.id;
    var rawData = data.rawData, viewData = data.viewData;
    var heights = rowCoords.heights;
    var parentRow = tree_1.getParentRow(store, rowKey);
    var modificationType = 'DELETE';
    var offset;
    data_3.uncheck(store, rowKey);
    if (parentRow) {
        if (parentRow._children) {
            offset = common_1.findPropIndex('rowKey', rowKey, parentRow._children);
        }
        removeChildRowKey(parentRow, rowKey);
    }
    var startIdx = data_2.findIndexByRowKey(data, column, id, rowKey);
    var deleteCount = tree_1.getDescendantRows(store, rowKey).length + 1;
    var removedRows = [];
    observable_1.batchObserver(function () {
        removedRows = rawData.splice(startIdx, deleteCount);
    });
    viewData.splice(startIdx, deleteCount);
    heights.splice(startIdx, deleteCount);
    // for (let i = removedRows.length - 1; i >= 0; i -= 1) {
    //   getDataManager(id).push(modificationType, removedRows[i]);
    // }
    var rawRows = tree_2.flattenTreeData(id, [row], parentRow, column, {
        keyColumnName: column.keyColumnName,
        offset: offset,
    });
    modificationType = 'UPDATE';
    lazyObservable_1.fillMissingColumnData(column, rawRows);
    var viewRows = rawRows.map(function (rawRow) { return data_1.createViewRow(id, rawRow, rawData, column); });
    common_1.silentSplice.apply(void 0, tslib_1.__spreadArrays([rawData, startIdx, 0], rawRows));
    common_1.silentSplice.apply(void 0, tslib_1.__spreadArrays([viewData, startIdx, 0], viewRows));
    var rowHeights = rawRows.map(function (rawRow) {
        changeTreeRowsCheckedState(store, rawRow.rowKey, rawRow._attributes.checked);
        //getDataManager(id).push(modificationType, rawRow, true);
        return data_2.getRowHeight(rawRow, dimension.rowHeight);
    });
    observable_1.notify(data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
    heights.splice.apply(heights, tslib_1.__spreadArrays([startIdx, 0], rowHeights));
    postUpdateAfterManipulation(store, startIdx, rawRows);
}
exports.replaceTreeRow = replaceTreeRow;
function postUpdateAfterManipulation(store, rowIndex, rows) {
    data_3.setLoadingState(store, data_2.getLoadingState(store.data.rawData));
    data_3.updateRowNumber(store, rowIndex);
    data_3.setCheckedAllRows(store);
    column_2.setAutoResizingColumnWidths(store, rows);
}
function moveTreeRow(store, rowKey, targetIndex, options) {
    var data = store.data, column = store.column, id = store.id;
    var rawData = data.rawData;
    var targetRow = rawData[targetIndex];
    if (!targetRow || data_2.isSorted(data) || data_2.isFiltered(data)) {
        return;
    }
    var currentIndex = data_2.findIndexByRowKey(data, column, id, rowKey, false);
    var row = rawData[currentIndex];
    if (currentIndex === -1 ||
        currentIndex === targetIndex ||
        row._attributes.disabled ||
        (targetRow._attributes.disabled && options.appended)) {
        return;
    }
    var childRows = tree_1.getDescendantRows(store, rowKey);
    var minIndex = Math.min(currentIndex, targetIndex);
    var moveToChild = common_1.some(function (childRow) { return childRow.rowKey === targetRow.rowKey; }, childRows);
    if (!moveToChild) {
        removeTreeRow(store, rowKey, true);
        var originRow = observable_1.getOriginObject(row);
        instance_1.getDataManager(id).push('UPDATE', targetRow, true);
        instance_1.getDataManager(id).push('UPDATE', row, true);
        if (options.appended) {
            appendTreeRow(store, originRow, { parentRowKey: targetRow.rowKey, movingRow: true });
        }
        else {
            var parentRowKey = targetRow._attributes.tree.parentRowKey;
            var parentIndex = data_2.findIndexByRowKey(data, column, id, parentRowKey);
            var offset = targetIndex > currentIndex ? targetIndex - (childRows.length + 1) : targetIndex;
            // calculate the offset based on parent row
            if (parentIndex !== -1) {
                var parentRow = rawData[parentIndex];
                offset = parentRow._attributes.tree.childRowKeys.indexOf(targetRow.rowKey);
            }
            // to resolve the index for moving last index
            if (options.moveToLast) {
                parentRowKey = null;
                offset = rawData.length;
            }
            appendTreeRow(store, originRow, { parentRowKey: parentRowKey, offset: offset, movingRow: true });
        }
        postUpdateAfterManipulation(store, minIndex);
    }
}
exports.moveTreeRow = moveTreeRow;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.moveColumn = exports.setColumnWidthsByText = exports.setAutoResizingColumnWidths = exports.changeColumnHeadersByName = exports.setComplexColumnHeaders = exports.showColumn = exports.hideColumn = exports.resetColumnWidths = exports.setColumns = exports.setColumnWidth = exports.setFrozenColumnCount = void 0;
var tslib_1 = __webpack_require__(1);
var column_1 = __webpack_require__(34);
var data_1 = __webpack_require__(15);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var eventBus_1 = __webpack_require__(7);
var focus_1 = __webpack_require__(17);
var observable_1 = __webpack_require__(5);
var sort_1 = __webpack_require__(30);
var filter_1 = __webpack_require__(35);
var selection_1 = __webpack_require__(16);
var common_1 = __webpack_require__(0);
var viewport_1 = __webpack_require__(25);
var dom_1 = __webpack_require__(2);
var data_2 = __webpack_require__(23);
var tree_1 = __webpack_require__(19);
var tree_2 = __webpack_require__(20);
var constant_1 = __webpack_require__(10);
var rowSpan_1 = __webpack_require__(24);
var column_2 = __webpack_require__(11);
var column_3 = __webpack_require__(12);
function setFrozenColumnCount(_a, count) {
    var column = _a.column;
    column.frozenCount = count;
}
exports.setFrozenColumnCount = setFrozenColumnCount;
function getCellWidthToBeResized(columns, range, resizeAmount, startWidths) {
    var widths = [];
    var startIdx = range[0], endIdx = range[1];
    var rangeLength = endIdx - startIdx + 1;
    var delta = resizeAmount / rangeLength;
    for (var idx = 0; idx < rangeLength; idx += 1) {
        var columnIdx = startIdx + idx;
        var minWidth = columns[columnIdx].minWidth;
        var width = Math.max(startWidths[idx] + delta, minWidth);
        widths.push(width);
    }
    return widths;
}
function setColumnWidth(_a, side, range, resizeAmount, startWidths) {
    var column = _a.column, id = _a.id;
    var eventBus = eventBus_1.getEventBus(id);
    var columns = column.visibleColumnsBySideWithRowHeader[side];
    var startIdx = range[0], endIdx = range[1];
    var resizedColumns = [];
    var widths = getCellWidthToBeResized(columns, range, resizeAmount, startWidths);
    for (var idx = startIdx; idx <= endIdx; idx += 1) {
        resizedColumns.push({
            columnName: columns[idx].name,
            width: widths[idx - startIdx],
        });
    }
    var gridEvent = new gridEvent_1.default({ resizedColumns: resizedColumns });
    /**
     * Occurs when column is resized
     * @event Grid#columnResize
     * @property {Array} resizedColumns - state about resized columns
     * @property {number} resizedColumns.columnName - columnName of the target cell
     * @property {number} resizedColumns.width - width of the resized column
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('columnResize', gridEvent);
    if (!gridEvent.isStopped()) {
        widths.forEach(function (width, idx) {
            var columnIdx = startIdx + idx;
            var item = columns[columnIdx];
            item.baseWidth = width;
            item.fixedWidth = true;
        });
    }
}
exports.setColumnWidth = setColumnWidth;
function setColumns(store, optColumns) {
    var column = store.column, data = store.data, id = store.id;
    var _a = column.dataForColumnCreation, columnOptions = _a.columnOptions, copyOptions = _a.copyOptions, treeColumnOptions = _a.treeColumnOptions, rowHeaders = _a.rowHeaders;
    var relationColumns = optColumns.reduce(function (acc, _a) {
        var _b = _a.relations, relations = _b === void 0 ? [] : _b;
        return acc.concat(column_1.createRelationColumns(relations)).filter(function (columnName, index) {
            var foundIndex = acc.indexOf(columnName);
            return foundIndex === -1 || foundIndex === index;
        });
    }, []);
    var columnInfos = optColumns.map(function (optColumn) {
        return column_1.createColumn(optColumn, columnOptions, relationColumns, copyOptions, treeColumnOptions, column.columnHeaderInfo, !!optColumn.disabled);
    });
    var dataCreationKey = data_1.generateDataCreationKey();
    viewport_1.initScrollPosition(store);
    // initFocus(store);//update by tangbin
    selection_1.initSelection(store);
    column.allColumns = tslib_1.__spreadArrays(rowHeaders, columnInfos);
    data.viewData.forEach(function (viewRow) {
        if (Array.isArray(viewRow.__unobserveFns__)) {
            viewRow.__unobserveFns__.forEach(function (fn) { return fn(); });
        }
    });
    data.rawData = data.rawData.map(function (row) {
        var newRow = tslib_1.__assign(tslib_1.__assign({}, column.emptyRow), row);
        newRow.uniqueKey = dataCreationKey + "-" + row.rowKey;
        return newRow;
    });
    data.viewData = data.rawData.map(function (row) {
        return observable_1.isObservable(row)
            ? data_1.createViewRow(id, row, data.rawData, column)
            : { rowKey: row.rowKey, sortKey: row.sortKey, uniqueKey: row.uniqueKey };
    });
    filter_1.initFilter(store);
    // unsort(store);
    setColumnWidthsByText(store);
}
exports.setColumns = setColumns;
function resetColumnWidths(_a, widths) {
    var column = _a.column;
    column.visibleColumns.forEach(function (columnInfo, idx) {
        columnInfo.baseWidth = widths[idx];
        columnInfo.autoResizing = false;
    });
}
exports.resetColumnWidths = resetColumnWidths;
function setColumnsHiddenValue(column, columnName, hidden) {
    var allColumnMap = column.allColumnMap, complexColumnHeaders = column.complexColumnHeaders;
    if (complexColumnHeaders.length) {
        var complexColumn = common_1.findProp('name', columnName, complexColumnHeaders);
        if (complexColumn) {
            complexColumn.childNames.forEach(function (childName) {
                allColumnMap[childName].hidden = hidden;
            });
            return;
        }
    }
    allColumnMap[columnName].hidden = hidden;
}
function hideColumn(store, columnName) {
    var column = store.column, focus = store.focus;
    if (focus.columnName === columnName) {
        focus_1.initFocus(store);
    }
    selection_1.initSelection(store);
    filter_1.unfilter(store, columnName);
    sort_1.unsort(store, columnName);
    setColumnsHiddenValue(column, columnName, true);
}
exports.hideColumn = hideColumn;
function showColumn(store, columnName) {
    setColumnsHiddenValue(store.column, columnName, false);
    rowSpan_1.updateRowSpan(store);
}
exports.showColumn = showColumn;
function setComplexColumnHeaders(store, complexColumnHeaders) {
    store.column.complexColumnHeaders = complexColumnHeaders;
}
exports.setComplexColumnHeaders = setComplexColumnHeaders;
function changeColumnHeadersByName(_a, columnsMap) {
    var column = _a.column;
    var complexColumnHeaders = column.complexColumnHeaders, allColumnMap = column.allColumnMap;
    Object.keys(columnsMap).forEach(function (columnName) {
        var col = allColumnMap[columnName];
        if (col) {
            col.header = columnsMap[columnName];
        }
        if (complexColumnHeaders.length) {
            var complexCol = common_1.findProp('name', columnName, complexColumnHeaders);
            if (complexCol) {
                complexCol.header = columnsMap[columnName];
            }
        }
    });
    observable_1.notify(column, 'allColumns');
}
exports.changeColumnHeadersByName = changeColumnHeadersByName;
function setAutoResizingColumnWidths(store, targetData) {
    var autoResizingColumn = store.column.autoResizingColumn;
    var rawData = targetData || store.data.rawData;
    if (!rawData.length || !autoResizingColumn.length) {
        return;
    }
    data_2.initMaxTextMap();
    var maxTextMap = data_2.getMaxTextMap();
    rawData.forEach(function (row) {
        autoResizingColumn.forEach(function (columnInfo) {
            var name = columnInfo.name;
            var formattedValue = data_2.createFormattedValue(row, columnInfo);
            if (!maxTextMap[name] || maxTextMap[name].formattedValue.length < formattedValue.length) {
                data_2.setMaxColumnTextMap(name, formattedValue, row);
            }
        });
    });
    setColumnWidthsByText(store);
}
exports.setAutoResizingColumnWidths = setAutoResizingColumnWidths;
function setColumnWidthsByText(store) {
    var autoResizingColumn = store.column.autoResizingColumn;
    var bodyArea = document.querySelector("." + dom_1.cls('rside-area') + " ." + dom_1.cls('body-container') + " ." + dom_1.cls('table'));
    if (store.data.rawData.length && autoResizingColumn.length) {
        autoResizingColumn.forEach(function (_a) {
            var name = _a.name;
            setColumnWidthByText(store, name, bodyArea);
        });
    }
}
exports.setColumnWidthsByText = setColumnWidthsByText;
function setColumnWidthByText(_a, columnName, bodyArea) {
    var data = _a.data, column = _a.column;
    var allColumnMap = column.allColumnMap, treeColumnName = column.treeColumnName, treeIcon = column.treeIcon, treeIndentWidth = column.treeIndentWidth;
    var maxTextMap = data_2.getMaxTextMap();
    var _b = maxTextMap[columnName], formattedValue = _b.formattedValue, row = _b.row;
    var width = dom_1.getTextWidth(formattedValue, bodyArea);
    if (treeColumnName) {
        width +=
            tree_1.getTreeIndentWidth(tree_2.getDepth(data.rawData, row), treeIndentWidth, treeIcon) +
                constant_1.TREE_CELL_HORIZONTAL_PADDING;
    }
    allColumnMap[columnName].baseWidth = Math.max(allColumnMap[columnName].minWidth, width);
    allColumnMap[columnName].fixedWidth = true;
}
function moveColumn(store, columnName, targetIndex) {
    var column = store.column;
    var allColumns = column.allColumns;
    if (!column_3.isAllColumnsVisible(column) || column.complexColumnHeaders.length > 0) {
        return;
    }
    var originIndex = common_1.findIndex(function (_a) {
        var name = _a.name;
        return name === columnName;
    }, allColumns);
    var columnToMove = allColumns[originIndex];
    var targetColumnName = allColumns[targetIndex].name;
    if (columnName === targetColumnName ||
        column_2.isRowHeader(targetColumnName) ||
        tree_2.isTreeColumnName(column, targetColumnName)) {
        return;
    }
    focus_1.setFocusInfo(store, null, null, false);
    selection_1.initSelection(store);
    allColumns.splice(originIndex, 1);
    allColumns.splice(targetIndex, 0, columnToMove);
}
exports.moveColumn = moveColumn;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.createColumn = exports.createRelationColumns = exports.createColumnFilterOption = exports.validateRelationColumn = void 0;
var tslib_1 = __webpack_require__(1);
var observable_1 = __webpack_require__(5);
var column_1 = __webpack_require__(11);
var common_1 = __webpack_require__(0);
var default_1 = __webpack_require__(65);
var manager_1 = __webpack_require__(66);
var rowHeaderInput_1 = __webpack_require__(70);
var rowHeaderDraggable_1 = __webpack_require__(71);
var constant_1 = __webpack_require__(10);
var DEF_ROW_HEADER_INPUT = '<input type="checkbox" name="_checked" />';
var ROW_HEADER = 40;
var COLUMN = 50;
var rowHeadersMap = {
    rowNum: '_number',
    checkbox: '_checked',
    draggable: '_draggable',
};
function validateRelationColumn(columnInfos) {
    var checked = {};
    function checkCircularRelation(column, relations) {
        var name = column.name, relationMap = column.relationMap;
        relations.push(name);
        checked[name] = true;
        if (common_1.uniq(relations).length !== relations.length) {
            throw new Error('Cannot create circular reference between relation columns');
        }
        if (!common_1.isUndefined(relationMap)) {
            Object.keys(relationMap).forEach(function (targetName) {
                var targetColumn = common_1.findProp('name', targetName, columnInfos);
                // copy the 'relation' array to prevent to push all relation column into same array
                checkCircularRelation(targetColumn, tslib_1.__spreadArrays(relations));
            });
        }
    }
    columnInfos.forEach(function (column) {
        if (!checked[column.name]) {
            checkCircularRelation(column, []);
        }
    });
}
exports.validateRelationColumn = validateRelationColumn;
function createBuiltInEditorOptions(editorType, options) {
    var editInfo = manager_1.editorMap[editorType];
    return {
        type: editInfo[0],
        options: tslib_1.__assign(tslib_1.__assign({}, editInfo[1]), options),
    };
}
function createEditorOptions(editor) {
    if (common_1.isFunction(editor)) {
        return { type: editor };
    }
    if (common_1.isString(editor)) {
        return createBuiltInEditorOptions(editor);
    }
    if (common_1.isObject(editor)) {
        return common_1.isString(editor.type)
            ? createBuiltInEditorOptions(editor.type, editor.options)
            : editor;
    }
    return null;
}
function createRendererOptions(renderer) {
    if (common_1.isFunction(renderer)) {
        return { type: renderer };
    }
    if (common_1.isObject(renderer) && !common_1.isFunction(renderer) && common_1.isFunction(renderer.type)) {
        return renderer;
    }
    var defaultRenderer = { type: default_1.DefaultRenderer };
    return common_1.isObject(renderer)
        ? tslib_1.__assign(tslib_1.__assign({}, defaultRenderer), renderer)
        : defaultRenderer;
}
function createTreeInfo(treeColumnOptions, name) {
    if (treeColumnOptions && treeColumnOptions.name === name) {
        var _a = treeColumnOptions.useIcon, useIcon = _a === void 0 ? true : _a;
        return { tree: { useIcon: useIcon } };
    }
    return null;
}
function createRelationMap(relations) {
    var relationMap = {};
    relations.forEach(function (relation) {
        var editable = relation.editable, disabled = relation.disabled, listItems = relation.listItems, _a = relation.targetNames, targetNames = _a === void 0 ? [] : _a;
        targetNames.forEach(function (targetName) {
            relationMap[targetName] = {
                editable: editable,
                disabled: disabled,
                listItems: listItems,
            };
        });
    });
    return relationMap;
}
function createColumnHeaderInfo(name, columnHeaderInfo) {
    var columnHeaders = columnHeaderInfo.columnHeaders, defaultAlign = columnHeaderInfo.align, defaultVAlign = columnHeaderInfo.valign;
    var columnOption = common_1.findProp('name', name, columnHeaders);
    var headerAlign = columnOption && columnOption.align ? columnOption.align : defaultAlign;
    var headerVAlign = columnOption && columnOption.valign ? columnOption.valign : defaultVAlign;
    var headerRenderer = columnOption && columnOption.renderer ? columnOption.renderer : null;
    return {
        headerAlign: headerAlign,
        headerVAlign: headerVAlign,
        headerRenderer: headerRenderer,
    };
}
function createColumnFilterOption(filter) {
    var defaultOption = {
        type: common_1.isObject(filter) ? filter.type : filter,
        showApplyBtn: false,
        showClearBtn: false,
    };
    if (common_1.isString(filter)) {
        if (filter === 'select') {
            return tslib_1.__assign(tslib_1.__assign({}, defaultOption), { operator: 'OR' });
        }
    }
    if (common_1.isObject(filter)) {
        return tslib_1.__assign(tslib_1.__assign({}, defaultOption), (filter.type === 'select'
            ? common_1.omit(filter, 'showApplyBtn', 'showClearBtn', 'operator', 'options')
            : filter));
    }
    return defaultOption;
}
exports.createColumnFilterOption = createColumnFilterOption;
function createRelationColumns(relations) {
    var relationColumns = [];
    relations.forEach(function (relation) {
        var _a = relation.targetNames, targetNames = _a === void 0 ? [] : _a;
        targetNames.forEach(function (targetName) {
            relationColumns.push(targetName);
        });
    });
    return relationColumns;
}
exports.createRelationColumns = createRelationColumns;
// eslint-disable-next-line max-params
function createColumn(column, columnOptions, relationColumns, gridCopyOptions, treeColumnOptions, columnHeaderInfo, disabled) {
    var name = column.name, header = column.header, width = column.width, minWidth = column.minWidth, align = column.align, hidden = column.hidden, resizable = column.resizable, editor = column.editor, renderer = column.renderer, relations = column.relations, sortable = column.sortable, sortingType = column.sortingType, copyOptions = column.copyOptions, validation = column.validation, formatter = column.formatter, onBeforeChange = column.onBeforeChange, onAfterChange = column.onAfterChange, whiteSpace = column.whiteSpace, enableFocus = column.enableFocus, ellipsis = column.ellipsis, valign = column.valign, defaultValue = column.defaultValue, escapeHTML = column.escapeHTML, ignored = column.ignored, tableGrid = column.tableGrid, filter = column.filter, filterRenderer = column.filterRenderer, className = column.className, comparator = column.comparator, rowSpanCompare = column.rowSpanCompare;
    var editorOptions = createEditorOptions(editor);
    var rendererOptions = createRendererOptions(renderer);
    var filterOptions = filter ? createColumnFilterOption(filter) : null;
    var _a = createColumnHeaderInfo(name, columnHeaderInfo), headerAlign = _a.headerAlign, headerVAlign = _a.headerVAlign, headerRenderer = _a.headerRenderer;
    var useRowSpanOption = column.rowSpan && !treeColumnOptions.name && !common_1.includes(relationColumns, column.name);
    var rowSpan = useRowSpanOption ? column.rowSpan : false;
    return observable_1.observable(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({ name: name,
        escapeHTML: escapeHTML, header: header || name, hidden: Boolean(hidden), resizable: common_1.isUndefined(resizable) ? Boolean(columnOptions.resizable) : Boolean(resizable), align: align || 'left', fixedWidth: typeof width === 'number', copyOptions: tslib_1.__assign(tslib_1.__assign({}, gridCopyOptions), copyOptions), baseWidth: (width === 'auto' ? 0 : width) || 0, minWidth: minWidth || columnOptions.minWidth || COLUMN, relationMap: createRelationMap(relations || []), related: common_1.includes(relationColumns, name), sortable: sortable, sortingType: sortingType || 'asc', validation: validation ? tslib_1.__assign({}, validation) : {}, renderer: rendererOptions, formatter: formatter,
        onBeforeChange: onBeforeChange,
        onAfterChange: onAfterChange,
        whiteSpace: whiteSpace,
        ellipsis: ellipsis, valign: valign || 'middle', defaultValue: defaultValue, enableFocus: enableFocus === undefined ? true : enableFocus, ignored: ignored }, (!!editorOptions && { editor: editorOptions })), createTreeInfo(treeColumnOptions, name)), { headerAlign: headerAlign,
        headerVAlign: headerVAlign,
        tableGrid: tableGrid, filter: filterOptions, filterRenderer: filterRenderer,
        headerRenderer: headerRenderer,
        className: className,
        disabled: disabled,
        comparator: comparator, autoResizing: width === 'auto', rowSpan: rowSpan,
        rowSpanCompare: rowSpanCompare }));
}
exports.createColumn = createColumn;
function createRowHeader(data, columnHeaderInfo) {
    var rowHeader = common_1.isString(data)
        ? { name: rowHeadersMap[data] }
        : tslib_1.__assign({ name: rowHeadersMap[data.type] }, common_1.omit(data, 'type'));
    var name = rowHeader.name, header = rowHeader.header, align = rowHeader.align, valign = rowHeader.valign, renderer = rowHeader.renderer, width = rowHeader.width, minWidth = rowHeader.minWidth;
    var baseMinWith = common_1.isNumber(minWidth) ? minWidth : ROW_HEADER;
    var baseWidth = (width === 'auto' ? baseMinWith : width) || baseMinWith;
    var rowNumColumn = column_1.isRowNumColumn(name);
    var defaultHeader = rowNumColumn ? 'No. ' : DEF_ROW_HEADER_INPUT;
    var rendererOptions = renderer || {
        type: rowNumColumn ? default_1.DefaultRenderer : rowHeaderInput_1.RowHeaderInputRenderer,
    };
    var _a = createColumnHeaderInfo(name, columnHeaderInfo), headerAlign = _a.headerAlign, headerVAlign = _a.headerVAlign, headerRenderer = _a.headerRenderer;
    return observable_1.observable({
        name: name,
        header: header || defaultHeader,
        hidden: false,
        resizable: false,
        align: align || 'center',
        valign: valign || 'middle',
        renderer: createRendererOptions(rendererOptions),
        fixedWidth: true,
        baseWidth: baseWidth,
        escapeHTML: false,
        minWidth: baseMinWith,
        headerAlign: headerAlign,
        headerVAlign: headerVAlign,
        headerRenderer: headerRenderer,
        autoResizing: false,
    });
}
function createComplexColumnHeaders(column, columnHeaderInfo) {
    var header = column.header, name = column.name, childNames = column.childNames, renderer = column.renderer, hideChildHeaders = column.hideChildHeaders, _a = column.resizable, resizable = _a === void 0 ? false : _a;
    var headerAlign = column.headerAlign || columnHeaderInfo.align;
    var headerVAlign = column.headerVAlign || columnHeaderInfo.valign;
    return observable_1.observable({
        header: header,
        name: name,
        childNames: childNames,
        headerAlign: headerAlign,
        headerVAlign: headerVAlign,
        headerRenderer: renderer || null,
        hideChildHeaders: hideChildHeaders,
        resizable: resizable,
    });
}
function createDraggableRowHeader(rowHeaderColumn) {
    var renderer = common_1.isObject(rowHeaderColumn)
        ? rowHeaderColumn.renderer
        : { type: rowHeaderDraggable_1.RowHeaderDraggableRenderer };
    var draggableColumn = {
        name: '_draggable',
        header: '',
        hidden: false,
        resizable: false,
        align: 'center',
        valign: 'middle',
        renderer: createRendererOptions(renderer),
        baseWidth: ROW_HEADER,
        minWidth: ROW_HEADER,
        fixedWidth: true,
        autoResizing: false,
        escapeHTML: false,
        headerAlign: 'center',
        headerVAlign: 'middle',
    };
    return draggableColumn;
}
function create(_a) {
    var columns = _a.columns, columnOptions = _a.columnOptions, rowHeaders = _a.rowHeaders, copyOptions = _a.copyOptions, keyColumnName = _a.keyColumnName, treeColumnOptions = _a.treeColumnOptions, complexColumns = _a.complexColumns, align = _a.align, valign = _a.valign, columnHeaders = _a.columnHeaders, disabled = _a.disabled, draggable = _a.draggable;
    var relationColumns = columns.reduce(function (acc, _a) {
        var relations = _a.relations;
        acc = acc.concat(createRelationColumns(relations || []));
        return acc.filter(function (columnName, idx) { return acc.indexOf(columnName) === idx; });
    }, []);
    var columnHeaderInfo = { columnHeaders: columnHeaders, align: align, valign: valign };
    var rowHeaderInfos = [];
    if (draggable) {
        var rowHeaderColumn = null;
        var index = common_1.findIndex(function (rowHeader) {
            return (common_1.isString(rowHeader) && rowHeader === 'draggable') ||
                rowHeader.type === 'draggable';
        }, rowHeaders);
        if (index !== -1) {
            rowHeaderColumn = rowHeaders.splice(index, 1)[0];
        }
        rowHeaderInfos.push(createDraggableRowHeader(rowHeaderColumn));
    }
    rowHeaders.forEach(function (rowHeader) {
        return rowHeaderInfos.push(createRowHeader(rowHeader, columnHeaderInfo));
    });
    var columnInfos = columns.map(function (column) {
        return createColumn(column, columnOptions, relationColumns, copyOptions, treeColumnOptions, columnHeaderInfo, !!(disabled || column.disabled));
    });
    validateRelationColumn(columnInfos);
    var allColumns = rowHeaderInfos.concat(columnInfos);
    var treeColumnName = treeColumnOptions.name, _b = treeColumnOptions.useIcon, treeIcon = _b === void 0 ? true : _b, _c = treeColumnOptions.useCascadingCheckbox, treeCascadingCheckbox = _c === void 0 ? true : _c, _d = treeColumnOptions.indentWidth, treeIndentWidth = _d === void 0 ? constant_1.TREE_INDENT_WIDTH : _d;
    var complexColumnHeaders = complexColumns.map(function (column) {
        return createComplexColumnHeaders(column, columnHeaderInfo);
    });
    return observable_1.observable(tslib_1.__assign({ keyColumnName: keyColumnName,
        allColumns: allColumns,
        complexColumnHeaders: complexColumnHeaders,
        columnHeaderInfo: columnHeaderInfo, frozenCount: columnOptions.frozenCount || 0, draggable: draggable, dataForColumnCreation: {
            copyOptions: copyOptions,
            columnOptions: columnOptions,
            treeColumnOptions: treeColumnOptions,
            relationColumns: relationColumns,
            rowHeaders: rowHeaderInfos,
        }, get allColumnMap() {
            return common_1.createMapFromArray(this.allColumns, 'name');
        }, get rowHeaderCount() {
            return rowHeaderInfos.length;
        }, get visibleColumns() {
            return this.allColumns.slice(this.rowHeaderCount).filter(function (_a) {
                var hidden = _a.hidden;
                return !hidden;
            });
        },
        get visibleColumnsWithRowHeader() {
            return this.allColumns.filter(function (_a) {
                var hidden = _a.hidden;
                return !hidden;
            });
        }, get visibleColumnsBySide() {
            return {
                L: this.visibleColumns.slice(0, this.frozenCount),
                R: this.visibleColumns.slice(this.frozenCount),
            };
        }, get visibleColumnsBySideWithRowHeader() {
            var frozenLastIndex = this.rowHeaderCount + this.frozenCount;
            return {
                L: this.visibleColumnsWithRowHeader.slice(0, frozenLastIndex),
                R: this.visibleColumnsWithRowHeader.slice(frozenLastIndex),
            };
        },
        get visibleRowSpanEnabledColumns() {
            return this.visibleColumns.filter(function (_a) {
                var rowSpan = _a.rowSpan;
                return rowSpan;
            });
        },
        get defaultValues() {
            return this.allColumns
                .filter(function (_a) {
                var defaultValue = _a.defaultValue;
                return Boolean(defaultValue);
            })
                .map(function (_a) {
                var name = _a.name, defaultValue = _a.defaultValue;
                return ({ name: name, value: defaultValue });
            });
        }, get visibleFrozenCount() {
            return this.visibleColumnsBySideWithRowHeader.L.length;
        }, get validationColumns() {
            return this.allColumns.filter(function (_a) {
                var validation = _a.validation;
                return !common_1.isEmpty(validation);
            });
        },
        get ignoredColumns() {
            return this.allColumns.filter(function (_a) {
                var ignored = _a.ignored;
                return ignored;
            }).map(function (_a) {
                var name = _a.name;
                return name;
            });
        },
        get columnMapWithRelation() {
            // copy the array to prevent to affect allColumns property
            var copiedColumns = tslib_1.__spreadArrays(this.allColumns);
            copiedColumns.sort(function (columnA, columnB) {
                var _a, _b;
                var hasRelationMapA = !common_1.isEmpty(columnA.relationMap);
                var hasRelationMapB = !common_1.isEmpty(columnB.relationMap);
                if (hasRelationMapA && hasRelationMapB) {
                    if ((_a = columnA.relationMap) === null || _a === void 0 ? void 0 : _a[columnB.name]) {
                        return -1;
                    }
                    return ((_b = columnB.relationMap) === null || _b === void 0 ? void 0 : _b[columnA.name]) ? 1 : 0;
                }
                if (hasRelationMapA) {
                    return -1;
                }
                return hasRelationMapB ? 1 : 0;
            });
            return common_1.createMapFromArray(copiedColumns, 'name');
        }, get columnsWithoutRowHeader() {
            return this.allColumns.slice(this.rowHeaderCount);
        }, get emptyRow() {
            return this.columnsWithoutRowHeader.reduce(function (acc, _a) {
                var _b;
                var name = _a.name;
                return (tslib_1.__assign(tslib_1.__assign({}, acc), (_b = {}, _b[name] = null, _b)));
            }, {});
        },
        get autoResizingColumn() {
            return this.columnsWithoutRowHeader.filter(function (_a) {
                var autoResizing = _a.autoResizing;
                return autoResizing;
            });
        } }, (treeColumnName && { treeColumnName: treeColumnName, treeIcon: treeIcon, treeCascadingCheckbox: treeCascadingCheckbox, treeIndentWidth: treeIndentWidth })));
}
exports.create = create;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resetFilterState = exports.emitAfterFilter = exports.initFilter = exports.setFilter = exports.unfilter = exports.clearFilter = exports.updateFilters = exports.filter = exports.setActiveFilterState = exports.clearActiveFilterState = exports.applyActiveFilterState = exports.setActiveColumnAddress = exports.setActiveSelectFilterState = exports.toggleSelectAllCheckbox = exports.setActiveFilterOperator = void 0;
var observable_1 = __webpack_require__(5);
var common_1 = __webpack_require__(0);
var filter_1 = __webpack_require__(31);
var data_1 = __webpack_require__(6);
var column_1 = __webpack_require__(34);
var viewport_1 = __webpack_require__(25);
var selection_1 = __webpack_require__(16);
var focus_1 = __webpack_require__(17);
var eventBus_1 = __webpack_require__(7);
var column_2 = __webpack_require__(12);
var data_2 = __webpack_require__(14);
var summary_1 = __webpack_require__(26);
var filter_2 = __webpack_require__(47);
var pagination_1 = __webpack_require__(36);
var rowSpan_1 = __webpack_require__(24);
function initLayerAndScrollAfterFiltering(store) {
    var data = store.data;
    viewport_1.initScrollPosition(store);
    selection_1.initSelection(store);
    focus_1.initFocus(store);
    pagination_1.updatePageOptions(store, { totalCount: data.filteredRawData.length, page: 1 });
    data_2.updateHeights(store);
    data_2.setCheckedAllRows(store);
}
function setActiveFilterOperator(store, operator) {
    var column = store.column, filterLayerState = store.filterLayerState;
    var activeFilterState = filterLayerState.activeFilterState;
    var columnInfo = column.allColumnMap[activeFilterState.columnName];
    var columnFilterOption = columnInfo.filter;
    activeFilterState.operator = operator;
    if (!columnFilterOption.showApplyBtn) {
        columnFilterOption.operator = operator;
        applyActiveFilterState(store);
    }
}
exports.setActiveFilterOperator = setActiveFilterOperator;
function toggleSelectAllCheckbox(store, checked) {
    var column = store.column, filterLayerState = store.filterLayerState, data = store.data;
    var activeFilterState = filterLayerState.activeFilterState;
    var columnName = activeFilterState.columnName;
    var columnInfo = column.allColumnMap[columnName];
    if (checked) {
        var columnData = data_1.getUniqColumnData(data.rawData, column, columnName);
        activeFilterState.state = columnData.map(function (value) { return ({ code: 'eq', value: value }); });
    }
    else {
        activeFilterState.state = [];
    }
    if (!columnInfo.filter.showApplyBtn) {
        applyActiveFilterState(store);
    }
}
exports.toggleSelectAllCheckbox = toggleSelectAllCheckbox;
function setActiveSelectFilterState(store, value, checked) {
    var column = store.column, filterLayerState = store.filterLayerState;
    var activeFilterState = filterLayerState.activeFilterState;
    var columnName = filterLayerState.activeColumnAddress.name;
    var columnInfo = column.allColumnMap[columnName];
    if (checked) {
        activeFilterState.state.push({ value: value, code: 'eq' });
    }
    else {
        var index = common_1.findPropIndex('value', value, activeFilterState.state);
        activeFilterState.state.splice(index, 1);
    }
    if (!columnInfo.filter.showApplyBtn) {
        applyActiveFilterState(store);
    }
    else {
        observable_1.notify(filterLayerState, 'activeFilterState');
    }
}
exports.setActiveSelectFilterState = setActiveSelectFilterState;
function setActiveColumnAddress(store, address) {
    var data = store.data, column = store.column, filterLayerState = store.filterLayerState;
    var filters = data.filters, filteredRawData = data.filteredRawData;
    filterLayerState.activeColumnAddress = address;
    if (!address) {
        filterLayerState.activeFilterState = null;
        return;
    }
    var columnName = address.name;
    var _a = column.allColumnMap[columnName].filter, type = _a.type, operator = _a.operator;
    var initialState = [];
    if (filters) {
        var prevFilter = common_1.findProp('columnName', columnName, filters);
        if (prevFilter) {
            initialState = prevFilter.state;
        }
    }
    if (type === 'select' && !initialState.length) {
        var columnData = data_1.getUniqColumnData(filteredRawData, column, columnName);
        initialState = columnData.map(function (value) { return ({ code: 'eq', value: value }); });
    }
    filterLayerState.activeFilterState = {
        columnName: columnName,
        type: type,
        operator: operator,
        state: initialState,
    };
}
exports.setActiveColumnAddress = setActiveColumnAddress;
function applyActiveFilterState(store) {
    var filterLayerState = store.filterLayerState, data = store.data, column = store.column;
    var columnName = filterLayerState.activeColumnAddress.name;
    var _a = filterLayerState.activeFilterState, state = _a.state, type = _a.type, operator = _a.operator;
    var validState = state.filter(function (item) { return String(item.value).length; });
    if (type !== 'select' && !validState.length) {
        unfilter(store, columnName);
        return;
    }
    filterLayerState.activeFilterState.state = state;
    if (type === 'select') {
        var columnData = data_1.getUniqColumnData(data.rawData, column, columnName);
        if (columnData.length === state.length) {
            unfilter(store, columnName);
            return;
        }
    }
    var fns = state.map(function (_a) {
        var code = _a.code, value = _a.value;
        return filter_1.getFilterConditionFn(code, value, type);
    });
    filter(store, columnName, filter_1.composeConditionFn(fns, operator), state);
}
exports.applyActiveFilterState = applyActiveFilterState;
function clearActiveFilterState(store) {
    var filterLayerState = store.filterLayerState;
    var activeFilterState = filterLayerState.activeFilterState;
    activeFilterState.state = [];
    unfilter(store, activeFilterState.columnName);
}
exports.clearActiveFilterState = clearActiveFilterState;
function setActiveFilterState(store, state, filterIndex) {
    var column = store.column, filterLayerState = store.filterLayerState;
    var columnName = filterLayerState.activeColumnAddress.name;
    var columnInfo = column.allColumnMap[columnName];
    filterLayerState.activeFilterState.state[filterIndex] = state;
    if (!columnInfo.filter.showApplyBtn) {
        applyActiveFilterState(store);
    }
    else {
        observable_1.notify(filterLayerState, 'activeFilterState');
    }
}
exports.setActiveFilterState = setActiveFilterState;
function filter(store, columnName, conditionFn, state) {
    var column = store.column;
    var columnFilterInfo = column.allColumnMap[columnName].filter;
    if (column_2.isComplexHeader(column, columnName) ||
        !columnFilterInfo ||
        column_2.isHiddenColumn(column, columnName)) {
        return;
    }
    var type = columnFilterInfo.type, operator = columnFilterInfo.operator;
    var nextColumnFilterState = { columnName: columnName, type: type, conditionFn: conditionFn, state: state, operator: operator };
    var gridEvent = emitBeforeFilter(store, 'beforeFilter', nextColumnFilterState);
    if (gridEvent.isStopped()) {
        return;
    }
    pagination_1.updatePageOptions(store, { page: 1 });
    updateFilters(store, columnName, nextColumnFilterState);
    initLayerAndScrollAfterFiltering(store);
    summary_1.updateAllSummaryValues(store);
    emitAfterFilter(store, 'afterFilter', columnName);
    rowSpan_1.updateRowSpan(store);
}
exports.filter = filter;
function updateFilters(_a, columnName, nextColumnFilterState) {
    var data = _a.data;
    var filters = data.filters || [];
    var filterIndex = common_1.findPropIndex('columnName', columnName, filters);
    if (filterIndex >= 0) {
        filters.splice(filterIndex, 1, nextColumnFilterState);
    }
    else {
        data.filters = filters.concat(nextColumnFilterState);
    }
}
exports.updateFilters = updateFilters;
function clearFilter(_a, columnName) {
    var data = _a.data;
    var filters = data.filters || [];
    var filterIndex = common_1.findPropIndex('columnName', columnName, filters);
    if (filterIndex >= 0) {
        if (filters.length === 1) {
            data.filters = null;
        }
        else {
            filters.splice(filterIndex, 1);
        }
    }
}
exports.clearFilter = clearFilter;
function clearAll(store) {
    var gridEvent = emitBeforeFilter(store, 'beforeUnfilter', { columnName: null });
    if (gridEvent.isStopped()) {
        return;
    }
    initFilter(store);
    initLayerAndScrollAfterFiltering(store);
    summary_1.updateAllSummaryValues(store);
    emitAfterFilter(store, 'afterUnfilter', null);
}
function unfilter(store, columnName) {
    var data = store.data, column = store.column;
    var filters = data.filters;
    if (!columnName) {
        clearAll(store);
        return;
    }
    if (column_2.isComplexHeader(column, columnName) || column_2.isHiddenColumn(column, columnName)) {
        return;
    }
    if (filters) {
        var gridEvent = emitBeforeFilter(store, 'beforeUnfilter', { columnName: columnName });
        if (gridEvent.isStopped()) {
            return;
        }
        clearFilter(store, columnName);
        initLayerAndScrollAfterFiltering(store);
        summary_1.updateAllSummaryValues(store);
        emitAfterFilter(store, 'afterUnfilter', columnName);
    }
    rowSpan_1.updateRowSpan(store);
}
exports.unfilter = unfilter;
function setFilter(store, columnName, filterOpt) {
    var column = store.column;
    var filterOptions = column_1.createColumnFilterOption(filterOpt);
    var index = common_1.findPropIndex('name', columnName, column.allColumns);
    if (index !== -1) {
        if (column.allColumns[index].filter) {
            unfilter(store, columnName);
        }
        column.allColumns[index].filter = filterOptions;
        observable_1.notify(column, 'allColumns');
    }
}
exports.setFilter = setFilter;
function initFilter(store) {
    var filterLayerState = store.filterLayerState, data = store.data;
    filterLayerState.activeFilterState = null;
    filterLayerState.activeColumnAddress = null;
    data.filters = null;
}
exports.initFilter = initFilter;
function emitBeforeFilter(store, eventType, eventParams) {
    var eventBus = eventBus_1.getEventBus(store.id);
    var gridEvent = filter_2.createFilterEvent(store, eventType, eventParams);
    eventBus.trigger(eventType, gridEvent);
    return gridEvent;
}
function emitAfterFilter(store, eventType, columnName) {
    var id = store.id;
    var eventBus = eventBus_1.getEventBus(id);
    // @TODO: `filter` event will be deprecated. This event is replaced with `afterFilter` event
    var eventTypes = (eventType === 'afterFilter'
        ? ['afterFilter', 'filter']
        : ['afterUnfilter']);
    eventTypes.forEach(function (type) {
        var gridEvent = filter_2.createFilterEvent(store, type, { columnName: columnName });
        eventBus.trigger(type, gridEvent);
    });
}
exports.emitAfterFilter = emitAfterFilter;
function resetFilterState(store, filterState) {
    if (filterState) {
        var columnFilterState = filterState.columnFilterState, columnName = filterState.columnName;
        var columnFilterOption = store.column.allColumnMap[columnName].filter;
        if (columnFilterOption) {
            if (columnFilterState) {
                var nextState = {
                    conditionFn: function () { return true; },
                    type: columnFilterOption.type,
                    state: columnFilterState,
                    columnName: columnName,
                    operator: columnFilterOption.operator,
                };
                updateFilters(store, columnName, nextState);
            }
            else {
                clearFilter(store, columnName);
            }
        }
    }
    else {
        initFilter(store);
    }
}
exports.resetFilterState = resetFilterState;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPageState = exports.updatePageWhenRemovingRow = exports.movePage = exports.updatePageOptions = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var data_1 = __webpack_require__(6);
var viewport_1 = __webpack_require__(25);
var selection_1 = __webpack_require__(16);
var focus_1 = __webpack_require__(17);
var data_2 = __webpack_require__(14);
var summary_1 = __webpack_require__(26);
var observable_1 = __webpack_require__(5);
function updatePageOptions(_a, pageOptions, forceUpdatePage) {
    var data = _a.data;
    if (forceUpdatePage === void 0) { forceUpdatePage = false; }
    var orgPageOptions = data.pageOptions;
    if (!common_1.isEmpty(orgPageOptions)) {
        // if infinite scrolling is applied, page number should be not reset to know the last loaded page
        if (!forceUpdatePage && data_1.isScrollPagination(data)) {
            delete pageOptions.page;
        }
        var newPageOptions = tslib_1.__assign(tslib_1.__assign({}, orgPageOptions), pageOptions);
        if (!common_1.shallowEqual(newPageOptions, orgPageOptions)) {
            data.pageOptions = newPageOptions;
        }
    }
}
exports.updatePageOptions = updatePageOptions;
function movePage(store, page) {
    var data = store.data;
    viewport_1.initScrollPosition(store);
    data.pageOptions.page = page;
    observable_1.notify(data, 'pageOptions');
    data_2.updateHeights(store);
    selection_1.initSelection(store);
    focus_1.initFocus(store);
    data_2.setCheckedAllRows(store);
    summary_1.updateAllSummaryValues(store);
}
exports.movePage = movePage;
function updatePageWhenRemovingRow(store, deletedCount) {
    var pageOptions = store.data.pageOptions;
    if (!common_1.isEmpty(pageOptions)) {
        var perPage = pageOptions.perPage, totalCount = pageOptions.totalCount, page = pageOptions.page;
        var modifiedLastPage = Math.floor((totalCount - deletedCount) / perPage);
        if ((totalCount - deletedCount) % perPage) {
            modifiedLastPage += 1;
        }
        updatePageOptions(store, {
            totalCount: totalCount - deletedCount,
            page: (modifiedLastPage < page ? modifiedLastPage : page) || 1,
        }, true);
    }
}
exports.updatePageWhenRemovingRow = updatePageWhenRemovingRow;
function resetPageState(store, totalCount, pageState) {
    var pageOptions = pageState ? common_1.pruneObject(pageState) : { page: 1, totalCount: totalCount };
    updatePageOptions(store, pageOptions, true);
}
exports.resetPageState = resetPageState;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.findRowIndexByPosition = exports.findColumnIndexByPosition = exports.getColumnNameRange = exports.getOverflowFromMousePosition = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
function getTotalColumnOffsets(widths, cellBorderWidth) {
    var totalWidths = tslib_1.__spreadArrays(widths.L, widths.R);
    var offsets = [0];
    for (var i = 1, len = totalWidths.length; i < len; i += 1) {
        offsets.push(offsets[i - 1] + totalWidths[i - 1] + cellBorderWidth);
    }
    return offsets;
}
function getScrolledPosition(_a, dimension, leftSideWidth) {
    var pageX = _a.pageX, pageY = _a.pageY, scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
    var _b = getPositionFromBodyArea(pageX, pageY, dimension), bodyPositionX = _b.x, bodyPositionY = _b.y;
    var scrollX = bodyPositionX > leftSideWidth ? scrollLeft : 0;
    var scrolledPositionX = bodyPositionX + scrollX;
    var scrolledPositionY = bodyPositionY + scrollTop;
    return {
        x: scrolledPositionX,
        y: scrolledPositionY,
    };
}
function judgeOverflow(_a, _b) {
    var containerX = _a.x, containerY = _a.y;
    var bodyHeight = _b.bodyHeight, bodyWidth = _b.bodyWidth;
    var overflowY = 0;
    var overflowX = 0;
    if (containerY < 0) {
        overflowY = -1;
    }
    else if (containerY > bodyHeight) {
        overflowY = 1;
    }
    if (containerX < 0) {
        overflowX = -1;
    }
    else if (containerX > bodyWidth) {
        overflowX = 1;
    }
    return {
        x: overflowX,
        y: overflowY,
    };
}
function getPositionFromBodyArea(pageX, pageY, dimension) {
    var offsetLeft = dimension.offsetLeft, offsetTop = dimension.offsetTop, tableBorderWidth = dimension.tableBorderWidth, cellBorderWidth = dimension.cellBorderWidth, headerHeight = dimension.headerHeight, summaryHeight = dimension.summaryHeight, summaryPosition = dimension.summaryPosition;
    var adjustedSummaryHeight = summaryPosition === 'top' ? summaryHeight : 0;
    return {
        x: pageX - offsetLeft,
        y: pageY -
            (offsetTop + headerHeight + adjustedSummaryHeight + cellBorderWidth + tableBorderWidth),
    };
}
function getOverflowFromMousePosition(pageX, pageY, bodyWidth, dimension) {
    var bodyHeight = dimension.bodyHeight;
    var _a = getPositionFromBodyArea(pageX, pageY, dimension), x = _a.x, y = _a.y;
    return judgeOverflow({ x: x, y: y }, { bodyWidth: bodyWidth, bodyHeight: bodyHeight });
}
exports.getOverflowFromMousePosition = getOverflowFromMousePosition;
function getColumnNameRange(store, dragStartData, dragData, elementInfo) {
    var allColumns = store.column.allColumns;
    var scrollTop = elementInfo.scrollTop, scrollLeft = elementInfo.scrollLeft;
    var startPageX = dragStartData.pageX, startPageY = dragStartData.pageY;
    var endPageX = dragData.pageX, endPageY = dragData.pageY;
    var startViewInfo = { pageX: startPageX, pageY: startPageY, scrollTop: scrollTop, scrollLeft: scrollLeft };
    var endViewInfo = { pageX: endPageX, pageY: endPageY, scrollTop: scrollTop, scrollLeft: scrollLeft };
    var startColumnIndex = findColumnIndexByPosition(store, startViewInfo);
    var endColumnIndex = findColumnIndexByPosition(store, endViewInfo);
    var startColumnName = allColumns[startColumnIndex].name;
    var endColumnName = allColumns[endColumnIndex].name;
    return [startColumnName, endColumnName];
}
exports.getColumnNameRange = getColumnNameRange;
function findColumnIndexByPosition(store, viewInfo) {
    var dimension = store.dimension, columnCoords = store.columnCoords;
    var widths = columnCoords.widths, areaWidth = columnCoords.areaWidth;
    var totalColumnOffsets = getTotalColumnOffsets(widths, dimension.cellBorderWidth);
    var scrolledPosition = getScrolledPosition(viewInfo, dimension, areaWidth.L);
    return common_1.findOffsetIndex(totalColumnOffsets, scrolledPosition.x);
}
exports.findColumnIndexByPosition = findColumnIndexByPosition;
function findRowIndexByPosition(store, viewInfo) {
    var dimension = store.dimension, columnCoords = store.columnCoords, rowCoords = store.rowCoords;
    var areaWidth = columnCoords.areaWidth;
    var scrolledPosition = getScrolledPosition(viewInfo, dimension, areaWidth.L);
    return common_1.findOffsetIndex(rowCoords.offsets, scrolledPosition.y);
}
exports.findRowIndexByPosition = findRowIndexByPosition;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ColGroup = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var ColGroupComp = /** @class */ (function (_super) {
    tslib_1.__extends(ColGroupComp, _super);
    function ColGroupComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColGroupComp.prototype.render = function (_a) {
        var _b;
        var columns = _a.columns, widths = _a.widths, borderWidth = _a.borderWidth;
        var attrs = (_b = {}, _b[dom_1.dataAttr.COLUMN_NAME] = name, _b);
        return (preact_1.h("colgroup", null, columns.map(function (_a, idx) {
            var name = _a.name;
            return (preact_1.h("col", tslib_1.__assign({ key: name }, attrs, { style: { width: widths[idx] + borderWidth } })));
        })));
    };
    return ColGroupComp;
}(preact_1.Component));
exports.ColGroup = hoc_1.connect(function (_a, _b) {
    var _c;
    var columnCoords = _a.columnCoords, viewport = _a.viewport, dimension = _a.dimension, column = _a.column;
    var side = _b.side, useViewport = _b.useViewport;
    return ({
        widths: useViewport && side === 'R'
            ? (_c = columnCoords.widths[side]).slice.apply(_c, viewport.colRange) : columnCoords.widths[side],
        columns: useViewport && side === 'R'
            ? viewport.columns
            : column.visibleColumnsBySideWithRowHeader[side],
        borderWidth: dimension.cellBorderWidth,
    });
})(ColGroupComp);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadBlob = exports.isSupportMsSaveOrOpenBlob = exports.isMobile = exports.isEdge = void 0;
function isEdge() {
    var rEdge = /Edge\/(\d+)\./;
    return rEdge.exec(window.navigator.userAgent);
}
exports.isEdge = isEdge;
function isMobile() {
    return /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}
exports.isMobile = isMobile;
function isSupportMsSaveOrOpenBlob() {
    return !!window.navigator.msSaveOrOpenBlob;
}
exports.isSupportMsSaveOrOpenBlob = isSupportMsSaveOrOpenBlob;
function downloadBlob(blob, fileName) {
    if (isSupportMsSaveOrOpenBlob()) {
        window.navigator.msSaveOrOpenBlob(blob, fileName + ".csv");
    }
    else {
        var targetLink = document.createElement('a');
        targetLink.download = fileName + ".csv";
        if (typeof targetLink.download === 'undefined') {
            targetLink.setAttribute('target', '_blank');
        }
        targetLink.href = window.URL.createObjectURL(blob);
        targetLink.click();
    }
}
exports.downloadBlob = downloadBlob;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getText = exports.copyDataToRange = exports.getRangeToPaste = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var data_1 = __webpack_require__(14);
var observable_1 = __webpack_require__(5);
function getCustomValue(customValue, value, rowAttrs, column) {
    return typeof customValue === 'function' ? customValue(value, rowAttrs, column) : customValue;
}
function getTextWithCopyOptionsApplied(valueMap, rawData, column) {
    var text = valueMap.value;
    var copyOptions = column.copyOptions, editor = column.editor;
    var editorOptions = editor && editor.options;
    // priority: customValue > useListItemText > useFormattedValue > original Data
    if (copyOptions) {
        if (copyOptions.customValue) {
            text = getCustomValue(copyOptions.customValue, valueMap.value, rawData, column);
        }
        else if (copyOptions.useListItemText && (editorOptions === null || editorOptions === void 0 ? void 0 : editorOptions.listItems)) {
            var listItems_1 = editorOptions.listItems;
            var value = valueMap.value;
            var valueList = [value];
            var result_1 = [];
            if (typeof value === 'string') {
                valueList = value.split(',');
            }
            valueList.forEach(function (val) {
                var listItem = common_1.find(function (item) { return item.value === val; }, listItems_1);
                result_1.push(listItem ? listItem.text : val);
            });
            text = result_1.join(',');
        }
        else if (copyOptions.useFormattedValue) {
            text = "" + valueMap.formattedValue;
        }
    }
    if (typeof text === 'undefined' || text === null) {
        return '';
    }
    return String(text);
}
function getObservableList(store, filteredViewData, start, end) {
    var rowList = [];
    for (var i = start; i <= end; i += 1) {
        if (!observable_1.isObservable(filteredViewData[i].valueMap)) {
            data_1.makeObservable(store, i, true);
            if (i === end) {
                observable_1.notify(store.data, 'rawData', 'filteredRawData', 'viewData', 'filteredViewData');
            }
        }
        rowList.push(filteredViewData[i]);
    }
    return rowList;
}
function getValuesToString(store, ranges) {
    var visibleColumnsWithRowHeader = store.column.visibleColumnsWithRowHeader, _a = store.data, filteredViewData = _a.filteredViewData, filteredRawData = _a.filteredRawData;
    var rowRange = ranges.rowRange, columnRange = ranges.columnRange;
    if (!rowRange || !columnRange) {
        return '';
    }
    var rowList = getObservableList.apply(void 0, tslib_1.__spreadArrays([store, filteredViewData], rowRange));
    var columnInRange = visibleColumnsWithRowHeader.slice(columnRange[0], columnRange[1] + 1);
    return rowList
        .map(function (_a) {
        var valueMap = _a.valueMap;
        return columnInRange
            .map(function (targetColumn) {
            return getTextWithCopyOptionsApplied(valueMap[targetColumn.name], filteredRawData, targetColumn);
        })
            .join('\t');
    })
        .join('\n');
}
function getRangeToPaste(store, pasteData) {
    var originalRange = store.selection.originalRange, _a = store.focus, totalColumnIndex = _a.totalColumnIndex, originalRowIndex = _a.originalRowIndex, visibleColumnsWithRowHeader = store.column.visibleColumnsWithRowHeader;
    var startRowIndex, startColumnIndex;
    if (originalRange) {
        startRowIndex = originalRange.row[0];
        startColumnIndex = originalRange.column[0];
    }
    else {
        startRowIndex = originalRowIndex;
        startColumnIndex = totalColumnIndex;
    }
    var endRowIndex = pasteData.length + startRowIndex - 1;
    var endColumnIndex = Math.min(pasteData[0].length + startColumnIndex, visibleColumnsWithRowHeader.length) - 1;
    return {
        row: [startRowIndex, endRowIndex],
        column: [startColumnIndex, endColumnIndex],
    };
}
exports.getRangeToPaste = getRangeToPaste;
function copyDataToRange(range, pasteData) {
    var rowLength = range.row[1] - range.row[0] + 1;
    var colLength = range.column[1] - range.column[0] + 1;
    var dataRowLength = pasteData.length;
    var dataColLength = pasteData[0].length;
    var rowDupCount = Math.floor(rowLength / dataRowLength) - 1;
    var colDupCount = Math.floor(colLength / dataColLength) - 1;
    var result = tslib_1.__spreadArrays(pasteData);
    for (var i = 0; i < rowDupCount; i += 1) {
        pasteData.forEach(function (row) {
            result.push(row.slice(0));
        });
    }
    result.forEach(function (row) {
        var rowData = row.slice(0);
        for (var i = 0; i < colDupCount; i += 1) {
            row.push.apply(row, rowData);
        }
    });
    return result;
}
exports.copyDataToRange = copyDataToRange;
function getText(store, ranges) {
    var _a, _b;
    var originalRange = store.selection.originalRange, _c = store.focus, originalRowIndex = _c.originalRowIndex, totalColumnIndex = _c.totalColumnIndex;
    var rowRange = (_a = ranges === null || ranges === void 0 ? void 0 : ranges.rowRange) !== null && _a !== void 0 ? _a : originalRange === null || originalRange === void 0 ? void 0 : originalRange.row;
    var columnRange = (_b = ranges === null || ranges === void 0 ? void 0 : ranges.columnRange) !== null && _b !== void 0 ? _b : originalRange === null || originalRange === void 0 ? void 0 : originalRange.column;
    // set focus index when there is no selection area
    if (common_1.isNil(rowRange) && !common_1.isNull(originalRowIndex)) {
        rowRange = [originalRowIndex, originalRowIndex];
    }
    if (common_1.isNil(columnRange) && !common_1.isNull(totalColumnIndex)) {
        columnRange = [totalColumnIndex, totalColumnIndex];
    }
    return getValuesToString(store, { rowRange: rowRange, columnRange: columnRange });
}
exports.getText = getText;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getListItems = void 0;
var common_1 = __webpack_require__(0);
function getListItems(props) {
    var _a;
    var _b = (_a = props.columnInfo.editor.options) !== null && _a !== void 0 ? _a : {}, listItems = _b.listItems, relationListItemMap = _b.relationListItemMap;
    if (!common_1.isEmpty(relationListItemMap) && Array.isArray(relationListItemMap[props.rowKey])) {
        return relationListItemMap[props.rowKey];
    }
    return listItems;
}
exports.getListItems = getListItems;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.setLayerPosition = exports.moveLayer = exports.getContainerElement = exports.setOpacity = void 0;
var common_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(2);
var INDENT = 5;
var SCROLL_BAR_WIDTH = 17;
var SCROLL_BAR_HEIGHT = 17;
function exceedGridViewport(top, left, _a) {
    var bodyHeight = _a.bodyHeight, bodyWidth = _a.bodyWidth, headerHeight = _a.headerHeight, leftSideWidth = _a.leftSideWidth;
    return !(common_1.isBetween(top, headerHeight, bodyHeight + headerHeight) &&
        common_1.isBetween(left, leftSideWidth, bodyWidth));
}
function setOpacity(el, opacity) {
    el.style.opacity = String(opacity);
}
exports.setOpacity = setOpacity;
function getContainerElement(el) {
    return dom_1.findParentByClassName(el, 'container');
}
exports.getContainerElement = getContainerElement;
function moveLayer(layerEl, initLayerPos, gridRect) {
    var top = initLayerPos.top, left = initLayerPos.left;
    var initBodyScrollTop = gridRect.initBodyScrollTop, initBodyScrollLeft = gridRect.initBodyScrollLeft, bodyScrollTop = gridRect.bodyScrollTop, bodyScrollLeft = gridRect.bodyScrollLeft;
    var newTop = top + initBodyScrollTop - bodyScrollTop;
    var newLeft = left + initBodyScrollLeft - bodyScrollLeft;
    if (exceedGridViewport(newTop, newLeft, gridRect)) {
        layerEl.style.zIndex = '-100';
        layerEl.style.top = '0px';
        layerEl.style.left = '0px';
    }
    else {
        layerEl.style.zIndex = '';
        layerEl.style.top = newTop + "px";
        layerEl.style.left = newLeft + "px";
    }
}
exports.moveLayer = moveLayer;
function setLayerPosition(innerEl, layerEl, childEl, startBottom) {
    if (startBottom === void 0) { startBottom = false; }
    var containerRect = getContainerElement(innerEl).getBoundingClientRect();
    var innerHeight = window.innerHeight, innerWidth = window.innerWidth;
    var _a = innerEl.getBoundingClientRect(), left = _a.left, top = _a.top, bottom = _a.bottom;
    var _b = layerEl.getBoundingClientRect(), layerHeight = _b.height, layerWidth = _b.width;
    var layerTop = startBottom ? bottom : top + INDENT;
    var childElHeight = 0;
    var childElWidth = 0;
    if (childEl) {
        var _c = childEl.getBoundingClientRect(), height = _c.height, width = _c.width;
        childElHeight = height;
        childElWidth = width;
    }
    var totalHeight = layerHeight + childElHeight;
    var totalWidth = layerWidth || childElWidth;
    layerEl.style.top = (layerTop + totalHeight > innerHeight - SCROLL_BAR_WIDTH
        ? innerHeight - totalHeight - INDENT - SCROLL_BAR_WIDTH
        : layerTop) - containerRect.top + "px";
    layerEl.style.left = (left + totalWidth > innerWidth - SCROLL_BAR_HEIGHT
        ? innerWidth - totalWidth - INDENT - SCROLL_BAR_HEIGHT
        : left) - containerRect.left + "px";
}
exports.setLayerPosition = setLayerPosition;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isEditingCell = exports.isFocusedCell = void 0;
function isFocusedCell(focus, rowKey, columnName) {
    return rowKey === focus.rowKey && columnName === focus.columnName;
}
exports.isFocusedCell = isFocusedCell;
function isEditingCell(focus, rowKey, columnName) {
    var editingAddress = focus.editingAddress;
    return !!(editingAddress &&
        editingAddress.rowKey === rowKey &&
        editingAddress.columnName === columnName);
}
exports.isEditingCell = isEditingCell;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createSortEvent = exports.isCancelSort = void 0;
var tslib_1 = __webpack_require__(1);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var common_1 = __webpack_require__(0);
function isCancelSort(_a, columnName, ascending, cancelable) {
    var data = _a.data, column = _a.column;
    var index = common_1.findPropIndex('columnName', columnName, data.sortState.columns);
    var defaultAscending = column.allColumnMap[columnName].sortingType === 'asc';
    return cancelable && ascending === defaultAscending && index !== -1;
}
exports.isCancelSort = isCancelSort;
function createSortEvent(eventType, eventParams) {
    var columnName = eventParams.columnName, multiple = eventParams.multiple, ascending = eventParams.ascending;
    var sortState = common_1.deepCopy(eventParams.sortState);
    var props = {};
    /* eslint-disable no-fallthrough */
    switch (eventType) {
        /**
         * Occurs before sorting.
         * @event Grid#beforeSort
         * @property {Object} sortState - Current sort state
         * @property {string} columnName - Target column name
         * @property {boolean} ascending - Next ascending state of a column.
         * If the event is not stopped this ascending state will be applied to grid.
         * @property {boolean} multiple - Whether to use multiple sort
         * @property {Grid} instance - Current grid instance
         */
        case 'beforeSort':
            props = {
                sortState: sortState,
                columnName: columnName,
                ascending: ascending,
                multiple: multiple,
            };
            break;
        /**
         * Occurs before unsorting.
         * @event Grid#beforeUnsort
         * @property {Object} sortState - Current sort state of the grid
         * @property {string} columnName - Target column name
         * @property {boolean} multiple - Whether to use multiple sort
         * @property {Grid} instance - Current grid instance
         */
        case 'beforeUnsort':
            props = {
                sortState: sortState,
                columnName: columnName,
                multiple: multiple,
            };
            break;
        /**
         * Occurs after sorting.
         * @deprecated
         * @event Grid#sort
         * @property {Object} sortState - sort state
         * @property {string} columnName - Target column name
         * @property {Grid} instance - Current grid instance
         */
        case 'sort':
        /**
         * Occurs after sorting.
         * @event Grid#afterSort
         * @property {Object} sortState - sort state
         * @property {string} columnName - Target column name
         * @property {Grid} instance - Current grid instance
         */
        case 'afterSort':
        /**
         * Occurs after unsorting.
         * @event Grid#afterUnsort
         * @property {Object} sortState - sort state
         * @property {string} columnName - Target column name
         * @property {Grid} instance - Current grid instance
         */
        case 'afterUnsort':
            props = {
                sortState: sortState,
                columnName: columnName,
            };
            break;
        default: // do nothing
    }
    /* eslint-disable no-fallthrough */
    return new gridEvent_1.default(props);
}
exports.createSortEvent = createSortEvent;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSummaryColumnContent = exports.castToSummaryColumnContent = exports.calculate = exports.accDiv = exports.accAdd = exports.getSummaryValue = void 0;
var tslib_1 = __webpack_require__(1);
function assignFilteredSummaryValue(summaryValue) {
    var sum = summaryValue.sum, min = summaryValue.min, max = summaryValue.max, avg = summaryValue.avg, cnt = summaryValue.cnt;
    return {
        filtered: {
            sum: sum,
            min: min,
            max: max,
            avg: avg,
            cnt: cnt,
        },
    };
}
function getSummaryValue(columnName, rawData, filteredRawData) {
    var columnValues = rawData.map(function (row) { return row[columnName]; });
    var summaryValue = calculate(columnValues);
    if (rawData.length === filteredRawData.length) {
        return tslib_1.__assign(tslib_1.__assign({}, summaryValue), assignFilteredSummaryValue(summaryValue));
    }
    var filteredColumnValues = filteredRawData.map(function (row) { return row[columnName]; });
    return tslib_1.__assign(tslib_1.__assign({}, summaryValue), assignFilteredSummaryValue(calculate(filteredColumnValues)));
}
exports.getSummaryValue = getSummaryValue;
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}
exports.accAdd = accAdd;
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}
exports.accDiv = accDiv;
function calculate(values) {
    var cnt = values.length;
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    var sum = 0;
    var avg = 0;
    for (var i = 0; i < cnt; i += 1) {
        var value = Number(values[i]);
        if (isNaN(value)) {
            value = 0;
        }
        sum = accAdd(sum, value);
        if (min > value) {
            min = value;
        }
        if (max < value) {
            max = value;
        }
    }
    if (!cnt) {
        max = min = avg = 0;
    }
    else {
        avg = accDiv(sum, cnt);
    }
    return { sum: sum, min: min, max: max, avg: avg, cnt: cnt };
}
exports.calculate = calculate;
function castToSummaryColumnContent(content) {
    if (!content) {
        return null;
    }
    return typeof content === 'string'
        ? { template: content, useAutoSummary: false }
        : {
            template: content.template,
            useAutoSummary: typeof content.useAutoSummary === 'undefined' ? true : content.useAutoSummary,
        };
}
exports.castToSummaryColumnContent = castToSummaryColumnContent;
function extractSummaryColumnContent(content, defaultContent) {
    var summaryColumnContent = null;
    if (content) {
        summaryColumnContent = content;
    }
    else if (!content && defaultContent) {
        summaryColumnContent = defaultContent;
    }
    return summaryColumnContent;
}
exports.extractSummaryColumnContent = extractSummaryColumnContent;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.createSummaryValue = void 0;
var observable_1 = __webpack_require__(5);
var summary_1 = __webpack_require__(45);
var common_1 = __webpack_require__(0);
function createSummaryValue(content, columnName, data) {
    if (content && content.useAutoSummary) {
        return summary_1.getSummaryValue(columnName, data.rawData, data.filteredRawData);
    }
    return {
        sum: 0,
        min: 0,
        max: 0,
        avg: 0,
        cnt: 0,
        filtered: {
            sum: 0,
            min: 0,
            max: 0,
            avg: 0,
            cnt: 0,
        },
    };
}
exports.createSummaryValue = createSummaryValue;
function create(_a) {
    var column = _a.column, data = _a.data, summary = _a.summary;
    var summaryColumnContents = {};
    var summaryValues = {};
    var orgColumnContent = summary.columnContent, defaultContent = summary.defaultContent;
    if (Object.keys(summary).length) {
        var castedDefaultContent_1 = summary_1.castToSummaryColumnContent(defaultContent || '');
        var columnContent_1 = orgColumnContent || {};
        var summaryColumns = Object.keys(columnContent_1);
        var filteredSummaryColumns = summaryColumns.filter(function (columnName) { return !common_1.someProp('name', columnName, column.allColumns); });
        var targetColumns = castedDefaultContent_1
            ? column.allColumns.map(function (_a) {
                var name = _a.name;
                return name;
            }).concat(filteredSummaryColumns)
            : summaryColumns;
        targetColumns.forEach(function (columnName) {
            var castedColumnContent = summary_1.castToSummaryColumnContent(columnContent_1[columnName]);
            var content = summary_1.extractSummaryColumnContent(castedColumnContent, castedDefaultContent_1);
            summaryColumnContents[columnName] = content;
            summaryValues[columnName] = createSummaryValue(content, columnName, data);
        });
    }
    return observable_1.observable({ summaryColumnContents: summaryColumnContents, summaryValues: summaryValues, defaultContent: defaultContent });
}
exports.create = create;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createFilterEvent = exports.getFilterState = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
function getFilterState(store) {
    var filters = store.data.filters;
    if (filters) {
        common_1.deepCopyArray(filters);
    }
    return filters;
}
exports.getFilterState = getFilterState;
function createFilterEvent(_a, eventType, eventParams) {
    var data = _a.data;
    var columnName = eventParams.columnName, type = eventParams.type, conditionFn = eventParams.conditionFn, state = eventParams.state, operator = eventParams.operator;
    var filterState = data.filters ? common_1.deepCopyArray(data.filters) : null;
    var props = {};
    /* eslint-disable no-fallthrough */
    switch (eventType) {
        /**
         * Occurs before filtering.
         * @event Grid#beforeFilter
         * @property {Grid} instance - Current grid instance
         * @property {Object} filterState - Current filter state
         * @property {string} columnName - Target column name
         * @property {string} type - Column Filter type
         * @property {string} operator - Column filter Operator('AND' | 'OR')
         * @property {function} conditionFn - Original function to filter the data in grid.
         * @property {Array} columnFilterState - Next filter state of column which triggers the event.
         * If the event is not stopped this state will be applied to grid.
         */
        case 'beforeFilter':
            props = {
                filterState: filterState,
                columnFilterState: common_1.deepCopyArray(state),
                conditionFn: conditionFn,
                type: type,
                columnName: columnName,
                operator: operator,
            };
            break;
        /**
         * Occurs before unfiltering
         * @event Grid#beforeUnfilter
         * @property {Grid} instance - Current grid instance
         * @property {string} columnName - Target column name
         * @property {Object} filterState - Current filter state
         */
        case 'beforeUnfilter':
        /**
         * Occurs after filtering
         * @deprecated
         * @event Grid#filter
         * @property {Grid} instance - Current grid instance
         * @property {string} columnName - Target column name
         * @property {Object} filterState - Current filter state
         */
        case 'filter':
        /**
         * Occurs after filtering
         * @event Grid#afterFilter
         * @property {Grid} instance - Current grid instance
         * @property {string} columnName - Target column name
         * @property {Object} filterState - Current filter state
         */
        case 'afterFilter':
        /**
         * Occurs after unfiltering
         * @event Grid#afterUnfilter
         * @property {Grid} instance - Current grid instance
         * @property {string} columnName - Target column name
         * @property {Object} filterState - Current filter state
         */
        case 'afterUnfilter':
            props = {
                filterState: filterState,
                columnName: columnName,
            };
            break;
        default: // do nothing
    }
    /* eslint-disable no-fallthrough */
    return new gridEvent_1.default(props);
}
exports.createFilterEvent = createFilterEvent;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fitRowHeightWhenMovingRow = exports.refreshRowHeight = exports.removeRowHeight = exports.setCellHeight = exports.setHoveredRowKeyByPosition = exports.setHoveredRowKey = void 0;
var tslib_1 = __webpack_require__(1);
var observable_1 = __webpack_require__(5);
var mouse_1 = __webpack_require__(37);
var common_1 = __webpack_require__(0);
function setHoveredRowKey(_a, rowKey) {
    var renderState = _a.renderState;
    renderState.hoveredRowKey = rowKey;
}
exports.setHoveredRowKey = setHoveredRowKey;
function setHoveredRowKeyByPosition(store, viewInfo) {
    var renderState = store.renderState, data = store.data, viewport = store.viewport;
    var scrollLeft = viewport.scrollLeft, scrollTop = viewport.scrollTop;
    var rowIndex = mouse_1.findRowIndexByPosition(store, tslib_1.__assign(tslib_1.__assign({}, viewInfo), { scrollLeft: scrollLeft, scrollTop: scrollTop }));
    if (data.filteredRawData[rowIndex]) {
        var rowKey = data.filteredRawData[rowIndex].rowKey;
        if (renderState.hoveredRowKey !== rowKey) {
            setHoveredRowKey(store, rowKey);
        }
    }
}
exports.setHoveredRowKeyByPosition = setHoveredRowKeyByPosition;
function setCellHeight(_a, columnName, rowIndex, height, defaultRowHeight) {
    var renderState = _a.renderState;
    var cellHeightMap = renderState.cellHeightMap;
    if (!cellHeightMap[rowIndex]) {
        cellHeightMap[rowIndex] = {};
    }
    cellHeightMap[rowIndex][columnName] = Math.max(height, defaultRowHeight);
}
exports.setCellHeight = setCellHeight;
function removeRowHeight(_a, rowIndex) {
    var renderState = _a.renderState;
    var cellHeightMap = renderState.cellHeightMap;
    delete cellHeightMap[rowIndex];
}
exports.removeRowHeight = removeRowHeight;
function refreshRowHeight(store, rowIndex, rowHeight) {
    var data = store.data, rowCoords = store.rowCoords, renderState = store.renderState;
    var cellHeightMap = renderState.cellHeightMap;
    var cellHeights = cellHeightMap[rowIndex];
    if (common_1.isUndefined(cellHeights)) {
        return;
    }
    var highestHeight = Object.keys(cellHeights).reduce(function (acc, columnName) { return Math.max(acc, cellHeights[columnName]); }, -1);
    if (rowHeight !== highestHeight) {
        if (data.rawData[rowIndex]) {
            data.rawData[rowIndex]._attributes.height = highestHeight;
        }
        rowCoords.heights[rowIndex] = highestHeight;
        observable_1.notify(rowCoords, 'heights');
    }
}
exports.refreshRowHeight = refreshRowHeight;
function fitRowHeightWhenMovingRow(store, currentIndex, targetIndex) {
    var rowCoords = store.rowCoords, renderState = store.renderState;
    var cellHeightMap = renderState.cellHeightMap;
    if (Object.keys(cellHeightMap).length === 0) {
        return;
    }
    var direction = targetIndex > currentIndex ? 1 : -1;
    var _loop_1 = function (i) {
        var target = i + direction;
        var temp = cellHeightMap[i];
        cellHeightMap[i] = cellHeightMap[target];
        cellHeightMap[target] = temp;
        var highestHeight = Object.keys(cellHeightMap[i]).reduce(function (acc, columnName) { return Math.max(acc, cellHeightMap[i][columnName]); }, -1);
        var targetHighestHeight = Object.keys(cellHeightMap[target]).reduce(function (acc, columnName) { return Math.max(acc, cellHeightMap[target][columnName]); }, -1);
        if (highestHeight !== targetHighestHeight) {
            rowCoords.heights[i] = highestHeight;
            rowCoords.heights[target] = targetHighestHeight;
        }
    };
    for (var i = currentIndex; i !== targetIndex; i += direction) {
        _loop_1(i);
    }
    observable_1.notify(rowCoords, 'heights');
}
exports.fitRowHeightWhenMovingRow = fitRowHeightWhenMovingRow;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.setAutoBodyHeight = exports.refreshLayout = exports.setHeaderHeight = exports.setOffsetLeft = exports.setOffsetTop = exports.setBodyHeight = exports.setHeight = exports.setWidth = void 0;
function setWidth(_a, width, autoWidth) {
    var dimension = _a.dimension;
    dimension.autoWidth = autoWidth;
    dimension.width = width;
}
exports.setWidth = setWidth;
function setHeight(_a, height) {
    var dimension = _a.dimension;
    var headerHeight = dimension.headerHeight, summaryHeight = dimension.summaryHeight, tableBorderWidth = dimension.tableBorderWidth;
    dimension.bodyHeight = height - headerHeight - summaryHeight - tableBorderWidth;
}
exports.setHeight = setHeight;
function setBodyHeight(_a, bodyHeight) {
    var dimension = _a.dimension;
    dimension.autoHeight = false;
    dimension.bodyHeight = Math.max(bodyHeight, dimension.minBodyHeight);
}
exports.setBodyHeight = setBodyHeight;
function setOffsetTop(store, offsetTop) {
    store.dimension.offsetTop = offsetTop;
}
exports.setOffsetTop = setOffsetTop;
function setOffsetLeft(store, offsetLeft) {
    store.dimension.offsetLeft = offsetLeft;
}
exports.setOffsetLeft = setOffsetLeft;
function setHeaderHeight(store, height) {
    store.dimension.headerHeight = height;
}
exports.setHeaderHeight = setHeaderHeight;
function refreshLayout(store, containerEl, parentEl) {
    if (!containerEl) {
        return;
    }
    var dimension = store.dimension;
    var autoWidth = dimension.autoWidth, fitToParentHeight = dimension.fitToParentHeight;
    var clientHeight = containerEl.clientHeight, clientWidth = containerEl.clientWidth, scrollTop = containerEl.scrollTop, scrollLeft = containerEl.scrollLeft;
    var _a = containerEl.getBoundingClientRect(), top = _a.top, left = _a.left;
    setOffsetTop(store, top + scrollTop);
    setOffsetLeft(store, left + scrollLeft);
    if (parentEl && parentEl.clientWidth !== clientWidth) {
        clientWidth = parentEl.clientWidth;
    }
    setWidth(store, clientWidth, autoWidth);
    if (fitToParentHeight && parentEl && parentEl.clientHeight !== clientHeight) {
        setHeight(store, parentEl.clientHeight);
    }
}
exports.refreshLayout = refreshLayout;
function setAutoBodyHeight(_a) {
    var dimension = _a.dimension, rowCoords = _a.rowCoords;
    var totalRowHeight = rowCoords.totalRowHeight;
    var autoHeight = dimension.autoHeight, scrollXHeight = dimension.scrollXHeight, minBodyHeight = dimension.minBodyHeight;
    if (autoHeight) {
        dimension.bodyHeight = Math.max(totalRowHeight + scrollXHeight, minBodyHeight);
    }
}
exports.setAutoBodyHeight = setAutoBodyHeight;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderArea = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var colGroup_1 = __webpack_require__(38);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var columnResizer_1 = __webpack_require__(86);
var instance_1 = __webpack_require__(8);
var column_1 = __webpack_require__(12);
var complexHeader_1 = __webpack_require__(87);
var columnHeader_1 = __webpack_require__(51);
var constant_1 = __webpack_require__(10);
var draggable_1 = __webpack_require__(52);
var common_1 = __webpack_require__(0);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var eventBus_1 = __webpack_require__(7);
var bodyArea_1 = __webpack_require__(28);
var DRAGGING_CLASS = 'dragging';
var HeaderAreaComp = /** @class */ (function (_super) {
    tslib_1.__extends(HeaderAreaComp, _super);
    function HeaderAreaComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = null;
        _this.dragColumnInfo = null;
        _this.floatingColumnWidth = null;
        _this.startSelectedName = null;
        _this.offsetLeft = null;
        _this.movedIndexInfo = null;
        _this.handleDblClick = function (ev) {
            ev.stopPropagation();
        };
        _this.handleMouseMove = function (ev) {
            var store = _this.context.store;
            _this.offsetLeft = ev.offsetX;
            var posInfo = _this.getPosInfo(ev, _this.el);
            var pageX = posInfo.pageX, pageY = posInfo.pageY, scrollTop = posInfo.scrollTop, top = posInfo.top;
            var currentColumnName = draggable_1.getMovedPosAndIndexOfColumn(store, posInfo, _this.offsetLeft).targetColumn.name;
            if (currentColumnName === _this.startSelectedName &&
                column_1.isDraggableColumn(store, currentColumnName) &&
                common_1.findOffsetIndex(store.rowCoords.offsets, pageY - top + scrollTop) > 0) {
                _this.startToDragColumn(posInfo);
                return;
            }
            _this.props.dispatch('dragMoveHeader', { pageX: pageX, pageY: pageY }, _this.startSelectedName);
        };
        _this.handleMouseDown = function (ev) {
            var _a = _this.props, dispatch = _a.dispatch, complexColumnHeaders = _a.complexColumnHeaders;
            var target = ev.target;
            if (dom_1.findParentByClassName(target, 'cell-row-header') ||
                dom_1.hasClass(target, 'btn-sorting') ||
                dom_1.hasClass(target, 'btn-filter') ||
                ev.button === constant_1.RIGHT_MOUSE_BUTTON) {
                return;
            }
            var name = target.getAttribute('data-column-name');
            if (!name) {
                var parent = dom_1.findParentByClassName(target, 'cell-header');
                if (parent) {
                    name = parent.getAttribute('data-column-name');
                }
            }
            var parentHeader = column_1.isParentColumnHeader(complexColumnHeaders, name);
            _this.startSelectedName = name;
            dispatch('mouseDownHeader', name, parentHeader);
            document.addEventListener('mousemove', _this.handleMouseMove);
            document.addEventListener('mouseup', _this.clearDocumentEvents);
            document.addEventListener('selectstart', _this.handleSelectStart);
        };
        _this.clearDocumentEvents = function () {
            _this.props.dispatch('dragEnd');
            dom_1.setCursorStyle('');
            document.removeEventListener('mousemove', _this.handleMouseMove);
            document.removeEventListener('mouseup', _this.clearDocumentEvents);
            document.removeEventListener('selectstart', _this.handleSelectStart);
        };
        _this.handleSelectStart = function (ev) {
            ev.preventDefault();
        };
        _this.startToDragColumn = function (posInfo) {
            var _a, _b;
            var dispatch = _this.props.dispatch;
            _this.container = (_b = (_a = _this.el) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
            posInfo.container = _this.container;
            var draggableInfo = draggable_1.createDraggableColumnInfo(_this.context.store, posInfo);
            var column = draggableInfo.column, columnName = draggableInfo.columnName;
            var gridEvent = new gridEvent_1.default({ columnName: columnName, floatingColumn: column });
            /**
             * Occurs when starting to drag the column
             * @event Grid#dragStart
             * @property {Grid} instance - Current grid instance
             * @property {string} columnName - The column name of the column to drag
             * @property {HTMLElement} floatingColumn - The floating column DOM element
             */
            _this.props.eventBus.trigger('dragStart', gridEvent);
            if (!gridEvent.isStopped()) {
                _this.container.appendChild(column);
                _this.floatingColumnWidth = column.clientWidth;
                _this.dragColumnInfo = draggableInfo;
                dispatch('addColumnClassName', columnName, DRAGGING_CLASS);
                dispatch('setFocusInfo', null, null, false);
                dispatch('initSelection');
                document.removeEventListener('mousemove', _this.handleMouseMove);
                document.addEventListener('mousemove', _this.dragColumn);
                document.addEventListener('mouseup', _this.dropColumn);
            }
        };
        _this.dragColumn = function (ev) {
            var posInfo = _this.getPosInfo(ev, _this.el);
            var _a = draggable_1.getMovedPosAndIndexOfColumn(_this.context.store, posInfo, _this.offsetLeft, _this.floatingColumnWidth), index = _a.index, offsetLeft = _a.offsetLeft, targetColumn = _a.targetColumn;
            var _b = _this.dragColumnInfo, column = _b.column, columnName = _b.columnName;
            column.style.left = offsetLeft + "px";
            _this.movedIndexInfo = { index: index, columnName: targetColumn.name };
            _this.props.dispatch('moveColumn', columnName, index);
            var gridEvent = new gridEvent_1.default({
                columnName: columnName,
                targetColumnName: targetColumn.name,
            });
            /**
             * Occurs when dragging the column
             * @event Grid#drag
             * @property {Grid} instance - Current grid instance
             * @property {string} columnName - The column name of the dragging column
             * @property {string} targetColumnName - The column name of the column at current dragging position
             */
            _this.props.eventBus.trigger('drag', gridEvent);
        };
        _this.dropColumn = function () {
            var columnName = _this.dragColumnInfo.columnName;
            if (_this.movedIndexInfo) {
                var _a = _this.movedIndexInfo, index = _a.index, targetColumnName = _a.columnName;
                var gridEvent = new gridEvent_1.default({
                    columnName: columnName,
                    targetColumnName: targetColumnName,
                });
                /**
                 * Occurs when dropping the column
                 * @event Grid#drop
                 * @property {Grid} instance - Current grid instance
                 * @property {string} columnName - The column name of the dragging column
                 * @property {string} targetColumnName - The column name of the column at current dragging position
                 */
                _this.props.eventBus.trigger('drop', gridEvent);
                if (!gridEvent.isStopped()) {
                    _this.props.dispatch('moveColumn', columnName, index);
                }
            }
            _this.props.dispatch('removeColumnClassName', _this.dragColumnInfo.columnName, DRAGGING_CLASS);
            _this.clearDraggableInfo();
        };
        _this.clearDraggableInfo = function () {
            _this.container.removeChild(_this.dragColumnInfo.column);
            _this.dragColumnInfo = null;
            _this.container = null;
            _this.floatingColumnWidth = null;
            _this.offsetLeft = null;
            _this.movedIndexInfo = null;
            document.removeEventListener('mousemove', _this.dragColumn);
            document.removeEventListener('mouseup', _this.dropColumn);
        };
        return _this;
    }
    HeaderAreaComp.prototype.getPosInfo = function (ev, el) {
        var _a = dom_1.getCoordinateWithOffset(ev.pageX, ev.pageY), pageX = _a[0], pageY = _a[1];
        pageX = bodyArea_1.toBodyZoom(pageX);
        pageY = bodyArea_1.toBodyZoom(pageY);
        var scrollTop = el.scrollTop, scrollLeft = el.scrollLeft;
        var _b = el.getBoundingClientRect(), top = _b.top, left = _b.left;
        return { pageX: pageX, pageY: pageY, left: left, top: top, scrollLeft: scrollLeft, scrollTop: scrollTop };
    };
    HeaderAreaComp.prototype.isSelected = function (name, index) {
        var _a = this.props, focus = _a.focus, columnSelectionRange = _a.columnSelectionRange;
        if (focus.columnName == name) {
            return true;
        }
        if (!columnSelectionRange) {
            return false;
        }
        var start = columnSelectionRange[0], end = columnSelectionRange[1];
        return index >= start && index <= end;
    };
    HeaderAreaComp.prototype.componentDidUpdate = function () {
        this.el.scrollLeft = this.props.scrollLeft;
    };
    HeaderAreaComp.prototype.render = function () {
        var _this = this;
        var _a = this.props, columns = _a.columns, headerHeight = _a.headerHeight, side = _a.side, complexColumnHeaders = _a.complexColumnHeaders, grid = _a.grid;
        var headerHeightStyle = { height: headerHeight };
        return (preact_1.h("div", { class: dom_1.cls('header-area'), style: headerHeightStyle, ref: function (el) {
                _this.el = el;
            } },
            preact_1.h("table", { class: dom_1.cls('table'), onMouseDown: this.handleMouseDown },
                preact_1.h(colGroup_1.ColGroup, { side: side, useViewport: false }),
                complexColumnHeaders.length ? (preact_1.h(complexHeader_1.ComplexHeader, { side: side, grid: grid })) : (preact_1.h("tbody", null,
                    preact_1.h("tr", { style: headerHeightStyle, onDblClick: this.handleDblClick }, columns.map(function (columnInfo, index) { return (preact_1.h(columnHeader_1.ColumnHeader, { key: columnInfo.name, columnInfo: columnInfo, selected: _this.isSelected(columnInfo.name, index), grid: grid })); }))))),
            preact_1.h(columnResizer_1.ColumnResizer, { side: side })));
    };
    return HeaderAreaComp;
}(preact_1.Component));
exports.HeaderArea = hoc_1.connect(function (store, _a) {
    var side = _a.side;
    var _b = store.column, visibleColumnsBySideWithRowHeader = _b.visibleColumnsBySideWithRowHeader, complexColumnHeaders = _b.complexColumnHeaders, _c = store.dimension, headerHeight = _c.headerHeight, cellBorderWidth = _c.cellBorderWidth, rangeBySide = store.selection.rangeBySide, viewport = store.viewport, id = store.id, focus = store.focus;
    return {
        focus: focus,
        headerHeight: headerHeight,
        cellBorderWidth: cellBorderWidth,
        columns: visibleColumnsBySideWithRowHeader[side],
        scrollLeft: side === 'L' ? 0 : viewport.scrollLeft,
        grid: instance_1.getInstance(id),
        columnSelectionRange: rangeBySide && rangeBySide[side].column ? rangeBySide[side].column : null,
        complexColumnHeaders: complexColumnHeaders,
        eventBus: eventBus_1.getEventBus(id),
    };
})(HeaderAreaComp);


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnHeader = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var headerCheckbox_1 = __webpack_require__(88);
var sortingButton_1 = __webpack_require__(89);
var sortingOrder_1 = __webpack_require__(90);
var filterButton_1 = __webpack_require__(91);
var column_1 = __webpack_require__(11);
var common_1 = __webpack_require__(0);
var column_2 = __webpack_require__(12);
var ColumnHeader = /** @class */ (function (_super) {
    tslib_1.__extends(ColumnHeader, _super);
    function ColumnHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnHeader.prototype.getElement = function (type) {
        var _a = this.props, columnInfo = _a.columnInfo, grid = _a.grid;
        var name = columnInfo.name, sortable = columnInfo.sortable, sortingType = columnInfo.sortingType, filter = columnInfo.filter, headerRenderer = columnInfo.headerRenderer, header = columnInfo.header;
        if (headerRenderer) {
            return null;
        }
        switch (type) {
            case 'checkbox':
                return column_1.isCheckboxColumn(name) ? preact_1.h(headerCheckbox_1.HeaderCheckbox, null) : header;
            case 'sortingBtn':
                return sortable && preact_1.h(sortingButton_1.SortingButton, { columnName: name, sortingType: sortingType });
            case 'sortingOrder':
                return sortable && preact_1.h(sortingOrder_1.SortingOrder, { columnName: name });
            case 'filter':
                return filter && preact_1.h(filterButton_1.FilterButton, { columnName: name, grid: grid });
            default:
                return null;
        }
    };
    ColumnHeader.prototype.componentDidMount = function () {
        var _a = this.props, columnInfo = _a.columnInfo, grid = _a.grid;
        var headerRenderer = columnInfo.headerRenderer;
        if (!headerRenderer || !this.el) {
            return;
        }
        var HeaderRendererClass = headerRenderer;
        var renderer = new HeaderRendererClass({ grid: grid, columnInfo: columnInfo });
        var rendererEl = renderer.getElement();
        this.el.appendChild(rendererEl);
        this.renderer = renderer;
        if (common_1.isFunction(renderer.mounted)) {
            renderer.mounted(this.el);
        }
    };
    ColumnHeader.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.renderer) {
            this.renderer.render({ columnInfo: nextProps.columnInfo, grid: nextProps.grid });
        }
    };
    ColumnHeader.prototype.componentWillUnmount = function () {
        if (this.renderer && common_1.isFunction(this.renderer.beforeDestroy)) {
            this.renderer.beforeDestroy();
        }
    };
    ColumnHeader.prototype.render = function () {
        var _this = this;
        var _a = this.props, columnInfo = _a.columnInfo, colspan = _a.colspan, rowspan = _a.rowspan, selected = _a.selected, _b = _a.height, height = _b === void 0 ? null : _b;
        var name = columnInfo.name, textAlign = columnInfo.headerAlign, verticalAlign = columnInfo.headerVAlign, headerRenderer = columnInfo.headerRenderer;
        return (preact_1.h("th", tslib_1.__assign({ ref: function (el) {
                _this.el = el;
            }, "data-column-name": name, style: { textAlign: textAlign, verticalAlign: verticalAlign, padding: headerRenderer ? 0 : null, height: height }, class: dom_1.cls('cell', 'cell-header', [!column_1.isRowHeader(name) && selected, 'cell-selected'], [column_1.isRowHeader(name), 'cell-row-header'], [column_2.isDraggableColumn(this.context.store, name) && !column_1.isRowHeader(name), 'header-draggable']) }, (!!colspan && { colspan: colspan }), (!!rowspan && { rowspan: rowspan })), ['checkbox', 'sortingBtn', 'sortingOrder', 'filter'].map(function (type) { return _this.getElement(type); })));
    };
    return ColumnHeader;
}(preact_1.Component));
exports.ColumnHeader = ColumnHeader;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getResolvedOffsets = exports.createFloatingLine = exports.getMovedPosAndIndexOfColumn = exports.getMovedPosAndIndexOfRow = exports.createDraggableColumnInfo = exports.createDraggableRowInfo = exports.createCells = void 0;
var common_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(2);
var data_1 = __webpack_require__(6);
var mouse_1 = __webpack_require__(37);
var EXCEED_RATIO = 0.8;
var ADDITIONAL_HEIGHT = 10;
function createRow(height) {
    var row = document.createElement('div');
    row.className = dom_1.cls('floating-row');
    row.style.height = height;
    row.style.lineHeight = height;
    row.style.width = 'auto';
    return row;
}
function createColumn(height, width) {
    var column = document.createElement('div');
    column.className = dom_1.cls('floating-column');
    column.style.width = width + "px";
    column.style.lineHeight = height + "px";
    return column;
}
function createCells(cell) {
    var childLen = cell.childNodes.length;
    var el = document.createElement('div');
    el.className = dom_1.cls('floating-cell', 'cell-header');
    el.style.width = window.getComputedStyle(cell).width;
    for (var i = 0; i < childLen; i += 1) {
        // the cell is not complex structure, so there is no the performance problem
        el.appendChild(cell.childNodes[i].cloneNode(true));
    }
    return el;
}
exports.createCells = createCells;
function createTreeCell(treeColumnName, viewRow) {
    var cell = document.createElement('div');
    var iconStyle = viewRow.treeInfo.leaf ? '' : 'background-position: -39px -35px';
    var span = document.createElement('span');
    span.className = dom_1.cls('floating-tree-cell-content');
    span.textContent = String(viewRow.valueMap[treeColumnName].value);
    cell.className = dom_1.cls('floating-tree-cell');
    cell.innerHTML = "\n    <span class=\"" + dom_1.cls('tree-icon') + "\">\n      <i style=\"" + iconStyle + "\"></i>\n    </span>\n  ";
    cell.appendChild(span);
    return cell;
}
function createFloatingDraggableRow(store, rowKey, offsetLeft, offsetTop, posInfo) {
    var data = store.data, column = store.column, id = store.id;
    var treeColumnName = column.treeColumnName;
    var cells = common_1.fromArray(posInfo.container.querySelectorAll("[data-row-key=\"" + rowKey + "\"]"));
    // get original table row height
    var height = cells[0].parentElement.clientHeight + "px";
    var row = createRow(height);
    row.style.left = offsetLeft + "px";
    row.style.top = offsetTop + "px";
    if (treeColumnName) {
        var index = data_1.findIndexByRowKey(data, column, id, rowKey);
        var viewRow = data.viewData[index];
        row.appendChild(createTreeCell(treeColumnName, viewRow));
    }
    else {
        cells.forEach(function (cell) {
            row.appendChild(createCells(cell));
        });
    }
    return row;
}
function createFloatingDraggableColumn(store, colunmName, posInfo) {
    var cell = posInfo.container.querySelector("[data-column-name=\"" + colunmName + "\"]");
    var clientHeight = cell.clientHeight, clientWidth = cell.clientWidth;
    var left = cell.getBoundingClientRect().left;
    var column = createColumn(clientHeight, clientWidth);
    column.className = dom_1.cls('floating-column');
    column.style.left = left - store.dimension.offsetLeft + "px";
    column.appendChild(createCells(cell));
    return column;
}
function createDraggableRowInfo(store, posInfo) {
    var data = store.data, dimension = store.dimension;
    var rawData = data.rawData, filters = data.filters;
    // if there is any filter condition, cannot drag the row
    if (!rawData.length || (filters === null || filters === void 0 ? void 0 : filters.length)) {
        return null;
    }
    var _a = getMovedPosAndIndexOfRow(store, posInfo), offsetLeft = _a.offsetLeft, offsetTop = _a.offsetTop, index = _a.index;
    var _b = rawData[index], rowKey = _b.rowKey, _attributes = _b._attributes;
    var row = createFloatingDraggableRow(store, rowKey, offsetLeft, offsetTop, posInfo);
    return _attributes.disabled
        ? null
        : {
            row: row,
            rowKey: rowKey,
            line: createFloatingLine(dimension.scrollYWidth),
        };
}
exports.createDraggableRowInfo = createDraggableRowInfo;
function createDraggableColumnInfo(store, posInfo) {
    var targetColumn = getMovedPosAndIndexOfColumn(store, posInfo).targetColumn;
    var columnName = targetColumn.name;
    var column = createFloatingDraggableColumn(store, columnName, posInfo);
    return { column: column, columnName: columnName, targetColumn: targetColumn };
}
exports.createDraggableColumnInfo = createDraggableColumnInfo;
function getMovedPosAndIndexOfRow(store, _a) {
    var pageX = _a.pageX, pageY = _a.pageY, left = _a.left, top = _a.top, scrollTop = _a.scrollTop;
    var rowCoords = store.rowCoords, dimension = store.dimension, column = store.column, data = store.data;
    var heights = rowCoords.heights, offsets = rowCoords.offsets;
    var rawData = data.rawData;
    var headerHeight = dimension.headerHeight;
    var offsetLeft = pageX - left;
    var offsetTop = pageY - top + scrollTop;
    var index = common_1.findOffsetIndex(rowCoords.offsets, offsetTop);
    // move to next index when exceeding the height with ratio
    if (!column.treeColumnName) {
        if (index < rawData.length - 1 && offsetTop - offsets[index] > heights[index] * EXCEED_RATIO) {
            index += 1;
        }
    }
    var height = offsets[index] - scrollTop + headerHeight;
    var moveToLast = false;
    // resolve the height for moving to last index with tree data
    if (column.treeColumnName) {
        if (rawData.length - 1 === index && offsetTop > offsets[index] + heights[index]) {
            height += heights[index];
            moveToLast = true;
        }
    }
    return {
        index: index,
        height: height,
        offsetLeft: offsetLeft,
        offsetTop: offsetTop - scrollTop + headerHeight,
        targetRow: rawData[index],
        moveToLast: moveToLast,
    };
}
exports.getMovedPosAndIndexOfRow = getMovedPosAndIndexOfRow;
function getMovedPosAndIndexOfColumn(store, _a, offsetLeftOfDragColumn, floatingColumnWidth) {
    var pageX = _a.pageX, pageY = _a.pageY, scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
    var dimension = store.dimension, column = store.column;
    var containerLeft = dimension.offsetLeft, containerWidth = dimension.width;
    var floatingWidth = floatingColumnWidth || 0;
    var offsetLeftOfFloatingColumn = offsetLeftOfDragColumn || 0;
    var viewInfo = { pageX: pageX, pageY: pageY, scrollTop: scrollTop, scrollLeft: scrollLeft };
    var index = mouse_1.findColumnIndexByPosition(store, viewInfo);
    var targetColumn = column.allColumns[index];
    var offsetLeft = pageX - offsetLeftOfFloatingColumn - containerLeft;
    if (offsetLeft < 0) {
        offsetLeft = 0;
    }
    else if (offsetLeft + floatingWidth > containerWidth) {
        offsetLeft = containerWidth - floatingWidth;
    }
    return {
        index: index,
        offsetLeft: offsetLeft,
        targetColumn: targetColumn,
    };
}
exports.getMovedPosAndIndexOfColumn = getMovedPosAndIndexOfColumn;
function createFloatingLine(scrollYWidth) {
    var line = document.createElement('div');
    line.className = dom_1.cls('floating-line');
    line.style.width = "calc(100% - " + scrollYWidth + "px)";
    return line;
}
exports.createFloatingLine = createFloatingLine;
function getResolvedOffsets(_a, _b, _c) {
    var dimension = _a.dimension;
    var offsetLeft = _b.offsetLeft, offsetTop = _b.offsetTop;
    var width = _c.width;
    var bodyWidth = dimension.width, bodyHeight = dimension.bodyHeight, scrollXHeight = dimension.scrollXHeight;
    return {
        offsetLeft: common_1.clamp(offsetLeft, 0, bodyWidth - width),
        offsetTop: common_1.clamp(offsetTop, 0, bodyHeight + scrollXHeight + ADDITIONAL_HEIGHT),
    };
}
exports.getResolvedOffsets = getResolvedOffsets;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryArea = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var colGroup_1 = __webpack_require__(38);
var summaryBodyRow_1 = __webpack_require__(101);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var SummaryAreaComp = /** @class */ (function (_super) {
    tslib_1.__extends(SummaryAreaComp, _super);
    function SummaryAreaComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleScroll = function (ev) {
            var scrollLeft = ev.target.scrollLeft;
            var _a = _this.props, dispatch = _a.dispatch, side = _a.side;
            if (side === 'R') {
                dispatch('setScrollLeft', scrollLeft);
            }
        };
        return _this;
    }
    SummaryAreaComp.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.el) {
            this.el.scrollLeft = nextProps.scrollLeft;
        }
    };
    SummaryAreaComp.prototype.render = function (_a) {
        var _this = this;
        var height = _a.height, columns = _a.columns, side = _a.side;
        var tableStyle = { height: height };
        return (height > 0 && (preact_1.h("div", { class: dom_1.cls('summary-area'), onScroll: this.handleScroll, ref: function (el) {
                _this.el = el;
            } },
            preact_1.h("table", { class: dom_1.cls('table'), style: tableStyle },
                preact_1.h(colGroup_1.ColGroup, { side: side, useViewport: false }),
                preact_1.h(summaryBodyRow_1.SummaryBodyRow, { columns: columns })))));
    };
    return SummaryAreaComp;
}(preact_1.Component));
exports.SummaryArea = hoc_1.connect(function (store, _a) {
    var side = _a.side;
    var column = store.column, dimension = store.dimension, viewport = store.viewport;
    var summaryHeight = dimension.summaryHeight;
    var scrollLeft = viewport.scrollLeft;
    return {
        height: summaryHeight,
        columns: column.visibleColumnsBySideWithRowHeader[side],
        scrollLeft: scrollLeft,
    };
})(SummaryAreaComp);


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMenu = exports.ContextMenuComp = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var contextMenuItem_1 = __webpack_require__(111);
var ContextMenuComp = /** @class */ (function (_super) {
    tslib_1.__extends(ContextMenuComp, _super);
    function ContextMenuComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = null;
        return _this;
    }
    //update by tangbin
    ContextMenuComp.prototype.findParentByClassName = function (el, className) {
        var currentEl = el;
        while (currentEl && currentEl.className.split(' ').indexOf(className) == -1) {
            currentEl = currentEl.parentElement;
        }
        return currentEl;
    };
    ContextMenuComp.prototype.adjustPos = function () {
        var pos = this.props.pos;
        var _a = pos, left = _a.left, top = _a.top, right = _a.right, bottom = _a.bottom;
        var _b = this.container, offsetHeight = _b.offsetHeight, offsetWidth = _b.offsetWidth;
        var computedTop = offsetHeight > bottom ? top + bottom - offsetHeight : top;
        var computedLeft = offsetWidth > right ? left + right - offsetWidth : left;
        //update by tangbin
        if (this.container) {
            var _c = this.container, clientWidth = _c.clientWidth, clientHeight = _c.clientHeight;
            var tuiGrid = this.findParentByClassName(this.container, "tui-grid-container");
            var rect = tuiGrid === null || tuiGrid === void 0 ? void 0 : tuiGrid.getBoundingClientRect();
            if (rect) {
                if (rect.width < computedLeft + clientWidth) {
                    computedLeft = rect.width - clientWidth;
                }
                if (rect.height < computedTop + clientHeight) {
                    computedTop = rect.height - clientHeight;
                }
            }
        }
        this.container.style.top = computedTop + "px";
        this.container.style.left = computedLeft + "px";
    };
    ContextMenuComp.prototype.componentDidMount = function () {
        if (this.props.pos) {
            this.adjustPos();
        }
    };
    ContextMenuComp.prototype.componentDidUpdate = function () {
        if (this.props.pos) {
            this.adjustPos();
        }
    };
    ContextMenuComp.prototype.render = function () {
        var _this = this;
        var _a = this.props, pos = _a.pos, menuItems = _a.menuItems;
        if (pos) {
            return (preact_1.h("ul", { ref: function (ref) {
                    _this.container = ref;
                }, class: dom_1.cls('context-menu') }, menuItems.map(function (menuItem) { return (preact_1.h(contextMenuItem_1.ContextMenuItem, { key: menuItem.name, menuItem: menuItem })); })));
        }
        return null;
    };
    return ContextMenuComp;
}(preact_1.Component));
exports.ContextMenuComp = ContextMenuComp;
exports.ContextMenu = hoc_1.connect(function (_a, _b) {
    var _c, _d;
    var contextMenu = _a.contextMenu;
    var menuItems = _b.menuItems, pos = _b.pos;
    return ({
        pos: pos || ((_d = (_c = contextMenu === null || contextMenu === void 0 ? void 0 : contextMenu.posInfo) === null || _c === void 0 ? void 0 : _c.pos) !== null && _d !== void 0 ? _d : null),
        menuItems: menuItems || (contextMenu === null || contextMenu === void 0 ? void 0 : contextMenu.flattenTopMenuItems),
    });
})(ContextMenuComp);


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.execCopy = void 0;
var dom_1 = __webpack_require__(2);
var clipboard_1 = __webpack_require__(40);
var instance_1 = __webpack_require__(8);
function execCopy(store, ranges) {
    var el = instance_1.getInstance(store.id).el;
    var targetText = clipboard_1.getText(store, ranges);
    var clipboard = el.querySelector("." + dom_1.cls('clipboard'));
    clipboard.innerHTML = targetText;
    if (dom_1.isSupportWindowClipboardData()) {
        dom_1.setClipboardSelection(clipboard.childNodes[0]);
    }
    // Accessing the clipboard is a security concern on chrome
    document.execCommand('copy');
}
exports.execCopy = execCopy;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.execExport = void 0;
var common_1 = __webpack_require__(0);
var export_1 = __webpack_require__(122);
var eventBus_1 = __webpack_require__(7);
var browser_1 = __webpack_require__(39);
function getExportDataAndColumnsAndOptions(store, options) {
    var _a = options || {}, _b = _a.includeHeader, includeHeader = _b === void 0 ? true : _b, _c = _a.includeHiddenColumns, includeHiddenColumns = _c === void 0 ? false : _c, _d = _a.onlySelected, onlySelected = _d === void 0 ? false : _d, _e = _a.onlyFiltered, onlyFiltered = _e === void 0 ? true : _e, _f = _a.delimiter, delimiter = _f === void 0 ? ',' : _f, _g = _a.fileName, fileName = _g === void 0 ? 'grid-export' : _g, _h = _a.useFormattedValue, useFormattedValue = _h === void 0 ? false : _h;
    var _j = store.data, rawData = _j.rawData, filteredRawData = _j.filteredRawData, column = store.column, originalRange = store.selection.originalRange;
    var _k = export_1.getNamesAndHeadersOfColumnsByOptions(column, (options === null || options === void 0 ? void 0 : options.columnNames) || [], includeHiddenColumns, onlySelected, originalRange), columnHeaders = _k.targetColumnHeaders, columnNames = _k.targetColumnNames;
    var data = export_1.getTargetData(store, onlyFiltered ? filteredRawData : rawData, columnNames, onlySelected, useFormattedValue);
    var exportOptions = {
        includeHeader: includeHeader,
        includeHiddenColumns: includeHiddenColumns,
        onlySelected: onlySelected,
        onlyFiltered: onlyFiltered,
        delimiter: delimiter,
        fileName: fileName,
        columnNames: columnNames,
    };
    return { data: data, columnHeaders: columnHeaders, columnNames: columnNames, exportOptions: exportOptions };
}
function emitExportEvent(store, eventType, eventParams) {
    var eventBus = eventBus_1.getEventBus(store.id);
    var gridEvent = export_1.createExportEvent(eventType, eventParams);
    eventBus.trigger(eventType, gridEvent);
    return gridEvent;
}
function getMergeRelationship(complexColumnHeaderData) {
    var merges = [];
    var numOfRow = complexColumnHeaderData.length;
    var numOfColumn = complexColumnHeaderData[0].length;
    complexColumnHeaderData.forEach(function (row, rowIndex) {
        row.forEach(function (currentName, colIndex) {
            if (currentName) {
                var merge = { s: { r: rowIndex, c: colIndex }, e: { r: rowIndex, c: colIndex } };
                var mergeRowNum = void 0, mergeColNum = void 0;
                for (mergeRowNum = rowIndex + 1; mergeRowNum < numOfRow; mergeRowNum += 1) {
                    if (complexColumnHeaderData[mergeRowNum][colIndex] === currentName) {
                        complexColumnHeaderData[mergeRowNum][colIndex] = '';
                        merge.e.r += 1;
                    }
                    else {
                        break;
                    }
                }
                for (mergeColNum = colIndex + 1; mergeColNum < numOfColumn; mergeColNum += 1) {
                    if (complexColumnHeaderData[mergeRowNum - 1][mergeColNum] === currentName) {
                        complexColumnHeaderData[mergeRowNum - 1][mergeColNum] = '';
                        merge.e.c += 1;
                    }
                    else {
                        break;
                    }
                }
                complexColumnHeaderData[rowIndex][colIndex] = '';
                if (merge.s.r !== merge.e.r || merge.s.c !== merge.e.c) {
                    merges.push(merge);
                }
            }
        });
    });
    return merges;
}
function exportCSV(fileName, targetText) {
    var targetBlob = new Blob(["\uFEFF" + targetText], { type: 'text/csv;charset=utf-8;' });
    browser_1.downloadBlob(targetBlob, fileName);
}
function exportExcel(fileName, targetArray, complexColumnHeaderData) {
    // const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.aoa_to_sheet(targetArray);
    //
    // if (complexColumnHeaderData) {
    //   ws['!merges'] = getMergeRelationship(complexColumnHeaderData);
    // }
    //
    // XLSX.utils.book_append_sheet(wb, ws);
    // XLSX.writeFile(wb, `${fileName}.xlsx`);
}
function exportCallback(data, format, options, complexHeaderData) {
    var _a = options || {}, _b = _a.delimiter, delimiter = _b === void 0 ? ',' : _b, _c = _a.fileName, fileName = _c === void 0 ? 'grid-export' : _c;
    if (format === 'csv') {
        var targetText = common_1.convertDataToText(data, delimiter);
        exportCSV(fileName, targetText);
    }
    else {
        // if (!XLSX?.writeFile) {
        //   // eslint-disable-next-line no-console
        //   console.error(
        //     '[tui/grid] - Not found the dependency "xlsx". You should install the "xlsx" to export the data as Excel format'
        //   );
        //   return;
        // }
        exportExcel(fileName, data, complexHeaderData);
    }
}
function execExport(store, format, options) {
    var _a = getExportDataAndColumnsAndOptions(store, options), data = _a.data, columnHeaders = _a.columnHeaders, columnNames = _a.columnNames, exportOptions = _a.exportOptions;
    var includeHeader = exportOptions.includeHeader, delimiter = exportOptions.delimiter, fileName = exportOptions.fileName;
    var column = store.column;
    var targetData = data.slice(0);
    if (format === 'csv') {
        if (includeHeader && column.complexColumnHeaders.length === 0) {
            targetData.unshift(columnHeaders);
        }
        var exportFn = function (exportingData) {
            return exportCallback(exportingData, 'csv', exportOptions);
        };
        var gridEvent = emitExportEvent(store, 'beforeExport', {
            exportFormat: format,
            exportOptions: exportOptions,
            data: targetData,
            exportFn: exportFn,
        });
        if (gridEvent.isStopped()) {
            return;
        }
        var targetText = common_1.convertDataToText(targetData, delimiter);
        exportCSV(fileName, targetText);
    }
    else {
        // if (!XLSX?.writeFile) {
        //   // eslint-disable-next-line no-console
        //   console.error(
        //     '[tui/grid] - Not found the dependency "xlsx". You should install the "xlsx" to export the data as Excel format'
        //   );
        //   return;
        // }
        var complexHeaderData_1 = null;
        if (includeHeader) {
            if (column.complexColumnHeaders.length > 0) {
                complexHeaderData_1 = export_1.getHeaderDataFromComplexColumn(column, columnNames);
                targetData = complexHeaderData_1.concat(targetData);
            }
            else {
                targetData.unshift(columnHeaders);
            }
        }
        var exportFn = function (exportingData) {
            return exportCallback(exportingData, 'xlsx', exportOptions, complexHeaderData_1);
        };
        var gridEvent = emitExportEvent(store, 'beforeExport', {
            exportFormat: format,
            exportOptions: exportOptions,
            data: targetData,
            exportFn: exportFn,
        });
        if (gridEvent.isStopped()) {
            return;
        }
        exportExcel(fileName, targetData, complexHeaderData_1);
    }
    emitExportEvent(store, 'afterExport', {
        exportFormat: format,
        exportOptions: exportOptions,
        data: targetData,
    });
}
exports.execExport = execExport;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createManager = exports.getDataWithOptions = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var observable_1 = __webpack_require__(5);
var data_1 = __webpack_require__(6);
var paramNameMap = {
    CREATE: 'createdRows',
    UPDATE: 'updatedRows',
    DELETE: 'deletedRows',
};
// @TODO: fix 'Row' type with record(Dictionary) type to use negate type or other type utility
function getDataWithOptions(targetRows, options) {
    if (options === void 0) { options = {}; }
    var _a = options.checkedOnly, checkedOnly = _a === void 0 ? false : _a, _b = options.withRawData, withRawData = _b === void 0 ? false : _b, _c = options.rowKeyOnly, rowKeyOnly = _c === void 0 ? false : _c, _d = options.ignoredColumns, ignoredColumns = _d === void 0 ? [] : _d;
    var rows = targetRows.map(function (row) { return observable_1.getOriginObject(row); });
    if (checkedOnly) {
        rows = rows.filter(function (row) { return row._attributes.checked; });
    }
    if (ignoredColumns.length) {
        // @ts-ignore
        rows = rows.map(function (row) { return common_1.omit.apply(void 0, tslib_1.__spreadArrays([row], ignoredColumns)); });
    }
    if (!withRawData) {
        rows = rows.map(function (row) { return data_1.getOmittedInternalProp(row); });
    }
    if (rowKeyOnly) {
        return rows.map(function (row) { return row.rowKey; });
    }
    return rows;
}
exports.getDataWithOptions = getDataWithOptions;
function createManager() {
    var originData = [];
    var mixedOrder = false;
    var dataMap = {
        CREATE: [],
        UPDATE: [],
        DELETE: [],
    };
    var splice = function (type, rowKey, row) {
        var index = common_1.findIndex(function (createdRow) { return createdRow.rowKey === rowKey; }, dataMap[type]);
        if (index !== -1) {
            if (common_1.isUndefined(row)) {
                dataMap[type].splice(index, 1);
            }
            else {
                dataMap[type].splice(index, 1, row);
            }
        }
    };
    var spliceAll = function (rowKey, row) {
        splice('CREATE', rowKey, row);
        splice('UPDATE', rowKey, row);
        splice('DELETE', rowKey, row);
    };
    return {
        // only for restore
        setOriginData: function (data) {
            originData = data_1.changeRawDataToOriginDataForTree(data);
        },
        getOriginData: function () {
            return originData;
        },
        getModifiedData: function (type, options) {
            var _a;
            return _a = {}, _a[paramNameMap[type]] = getDataWithOptions(dataMap[type], options), _a;
        },
        getAllModifiedData: function (options) {
            var _this = this;
            return Object.keys(dataMap)
                .map(function (key) { return _this.getModifiedData(key, options); })
                .reduce(function (acc, data) { return (tslib_1.__assign(tslib_1.__assign({}, acc), data)); }, {});
        },
        isModified: function () {
            return !!(dataMap.CREATE.length || dataMap.UPDATE.length || dataMap.DELETE.length);
        },
        isModifiedByType: function (type) {
            return !!dataMap[type].length;
        },
        push: function (type, row, mixed) {
            if (mixed === void 0) { mixed = false; }
            var rowKey = row.rowKey;
            mixedOrder = mixedOrder || mixed;
            if (type === 'UPDATE' || type === 'DELETE') {
                splice('UPDATE', rowKey);
                // if the row was already registered in createdRows,
                // would update it in createdRows and not add it to updatedRows or deletedRows
                if (common_1.someProp('rowKey', rowKey, dataMap.CREATE)) {
                    if (type === 'UPDATE') {
                        splice('CREATE', rowKey, row);
                    }
                    else {
                        splice('CREATE', rowKey);
                    }
                    return;
                }
            }
            if (!common_1.someProp('rowKey', rowKey, dataMap[type])) {
                dataMap[type].push(row);
            }
        },
        clearSpecificRows: function (rowsMap) {
            common_1.forEachObject(function (_, key) {
                rowsMap[key].forEach(function (row) {
                    spliceAll(common_1.isObject(row) ? row.rowKey : row);
                });
            }, rowsMap);
        },
        clear: function (requestTypeCode) {
            if (requestTypeCode === 'MODIFY') {
                this.clearAll();
                return;
            }
            dataMap[requestTypeCode] = [];
        },
        clearAll: function () {
            dataMap.CREATE = [];
            dataMap.UPDATE = [];
            dataMap.DELETE = [];
        },
        isMixedOrder: function () {
            return mixedOrder;
        },
    };
}
exports.createManager = createManager;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlertMessage = exports.getConfirmMessage = void 0;
var tslib_1 = __webpack_require__(1);
var _1 = tslib_1.__importDefault(__webpack_require__(18));
var confirmMessageMap = {
    CREATE: 'net.confirmCreate',
    UPDATE: 'net.confirmUpdate',
    DELETE: 'net.confirmDelete',
    MODIFY: 'net.confirmModify',
};
var alertMessageMap = {
    CREATE: 'net.noDataToCreate',
    UPDATE: 'net.noDataToUpdate',
    DELETE: 'net.noDataToDelete',
    MODIFY: 'net.noDataToModify',
};
function getConfirmMessage(type, count) {
    return _1.default.get(confirmMessageMap[type], { count: String(count) });
}
exports.getConfirmMessage = getConfirmMessage;
function getAlertMessage(type) {
    return _1.default.get(alertMessageMap[type]);
}
exports.getAlertMessage = getAlertMessage;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createAjaxConfig = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
function createAjaxConfig(target) {
    var configKeys = [
        'contentType',
        'withCredentials',
        'mimeType',
        'headers',
        'serializer',
    ];
    return common_1.pick.apply(void 0, tslib_1.__spreadArrays([target], configKeys));
}
exports.createAjaxConfig = createAjaxConfig;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tslib_1 = __webpack_require__(1);
var grid_1 = tslib_1.__importDefault(__webpack_require__(61));
__webpack_require__(136);
grid_1.default.setLanguage('en');
module.exports = grid_1.default;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var create_1 = __webpack_require__(62);
var root_1 = __webpack_require__(83);
var create_2 = __webpack_require__(117);
var manager_1 = tslib_1.__importDefault(__webpack_require__(123));
var instance_1 = __webpack_require__(8);
var i18n_1 = tslib_1.__importDefault(__webpack_require__(18));
var validation_1 = __webpack_require__(127);
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
var observable_1 = __webpack_require__(5);
var eventBus_1 = __webpack_require__(7);
var data_1 = __webpack_require__(6);
var column_1 = __webpack_require__(11);
var serverSideDataProvider_1 = __webpack_require__(128);
var modifiedDataManager_1 = __webpack_require__(57);
var message_1 = __webpack_require__(58);
var paginationManager_1 = __webpack_require__(134);
var tree_1 = __webpack_require__(20);
var rowSpan_1 = __webpack_require__(13);
var googleAnalytics_1 = __webpack_require__(135);
var filter_1 = __webpack_require__(31);
var filter_2 = __webpack_require__(47);
var clipboard_1 = __webpack_require__(55);
var tree_2 = __webpack_require__(19);
/* eslint-disable global-require */
if (false) {}
/**
 * Grid public API
 * @param {Object} options
 *      @param {HTMLElement} el - The target element to create grid.
 *      @param {Array|Object} [options.data] - Grid data for making rows. When using the data source, sets to object.
 *      @param {Object} [options.pageOptions={}] The object for the pagination options.
 *      @param {Object} [options.header] - Options object for header.
 *      @param {number} [options.header.height=40] - The height of the header area.
 *      @param {number} [options.header.align=center] - Horizontal alignment of the header content.
 *              Available values are 'left', 'center', 'right'.
 *      @param {number} [options.header.valign=middle] - Vertical alignment of the row header content.
 *              Available values are 'top', 'middle', 'bottom'.
 *      @param {Array} [options.header.complexColumns] - This options creates new parent headers of the multiple columns
 *          which includes the headers of specified columns, and sets up the hierarchy.
 *          @param {string} [options.header.complexColumns.header] - The header of the complex column to be shown on the header.
 *          @param {string} [options.header.complexColumns.name] - The name of column that makes tree column.
 *          @param {Array} [options.header.complexColumns.childNames] - The name of the child header(subheader).
 *          @param {function} [options.header.complexColumns.renderer] - Sets the custom renderer to customize the header content.
 *          @param {string} [options.header.complexColumns.headerAlign=center] - Horizontal alignment of the header content.
 *              Available values are 'left', 'center', 'right'.
 *          @param {string} [options.header.complexColumns.headerVAlign=middle] - Vertical alignment of the row header content.
 *              Available values are 'top', 'middle', 'bottom'.
 *          @param {boolean} [options.header.complexColumns.hideChildHeaders=false] - If set to true, the child columns header are hidden.
 *          @param {boolean} [options.header.complexColumns.resizable=false] - If set to true, resize-handles of each complex columns will be shown.
 *      @param {string|number} [options.width='auto'] - Options for grid width.
 *      @param {string|number} [options.rowHeight=40] - The height of each rows.
 *          The height of each rows expands to dom's height. If set to number, the height is fixed and the minimum is 9.
 *      @param {number} [options.minRowHeight=40] - The minimum height of each rows.
 *      @param {string|number} [options.bodyHeight] - The height of body area. The default value is 'auto',
 *          the height of body area expands to total height of rows. If set to 'fitToParent', the height of the grid
 *          will expand to fit the height of parent element. If set to number, the height is fixed.
 *      @param {number} [options.minBodyHeight=130] - The minimum height of body area. When this value
 *          is larger than the body's height, it set to the body's height.
 *      @param {Object} [options.columnOptions] - Option object for all columns
 *      @param {number} [options.columnOptions.minWidth=50] - Minimum width of each columns
 *      @param {boolean} [options.columnOptions.resizable=false] - If set to true, resize-handles of each columns
 *          will be shown.
 *      @param {number} [options.columnOptions.frozenCount=0] - The number of frozen columns.
 *          The columns indexed from 0 to this value will always be shown on the left side.
 *          {@link Grid#setFrozenColumnCount} can be used for setting this value dynamically.
 *      @param {number} [options.columnOptions.frozenBorderWidth=1] - The value of frozen border width.
 *          When the frozen columns are created by "frozenCount" option, the frozen border width set.
 *      @param {Object} [options.treeColumnOptions] - Option object for the tree column.
 *      @param {string} [options.treeColumnOptions.name] - The name of column that makes tree column.
 *      @param {boolean} [options.treeColumnOptions.useIcon=true] - If set to true, the folder or file icon is created on
 *          the left side of the tree cell data.
 *      @param {boolean} [options.treeColumnOptions.useCascadingCheckbox] - If set to true, a cascading relationship is
 *          created in the checkbox between parent and child rows.
 *      @param {boolean} [options.treeColumnOptions.indentWidth=22] - Base indent width to set for child nodes
 *      @param {Object} [options.copyOptions] - Option object for clipboard copying
 *      @param {boolean} [options.copyOptions.useFormattedValue] - Whether to use formatted values or original values
 *          as a string to be copied to the clipboard
 *      @param {boolean} [options.copyOptions.useListItemText] - Copy select or checkbox cell values to 'text'
 *          rather than 'value' of the listItem option.
 *      @param {string|function} [options.copyOptions.customValue] - Copy text with 'formatter' in cell.
 *      @param {boolean} [options.useClientSort=true] - If set to true, sorting will be executed by client itself
 *          without server.
 *      @param {string} [options.editingEvent='dblclick'] - If set to 'click', editable cell in the view-mode will be
 *          changed to edit-mode by a single click.
 *      @param {boolean} [options.scrollX=true] - Specifies whether to show horizontal scrollbar.
 *      @param {boolean} [options.scrollY=true] - Specifies whether to show vertical scrollbar.
 *      @param {boolean} [options.showDummyRows=false] - If set to true, empty area will be filled with dummy rows.
 *      @param {string} [options.keyColumnName] - The name of the column to be used to identify each rows.
 *          If not specified, unique value for each rows will be created internally.
 *      @param {boolean} [options.heightResizable=false] - If set to true, a handle for resizing height will be shown.
 *      @param {string} [options.selectionUnit='cell'] - The unit of selection on Grid. ('cell', 'row')
 *      @param {Array} [options.rowHeaders] - Options for making the row header. The row header content is number of
 *          each row or input element. The value of each item is enable to set string type. (ex: ['rowNum', 'checkbox'])
 *          @param {string} [options.rowHeaders.type] - The type of the row header. ('rowNum', 'checkbox')
 *          @param {string} [options.rowHeaders.header] - The header of the row header.
 *          @param {number} [options.rowHeaders.width] - The width of the row header column. The unit is pixel.
 *              If this value isn't set, the column's width sets to default value.
 *          @param {string} [options.rowHeaders.align=left] - Horizontal alignment of the row header content.
 *              Available values are 'left', 'center', 'right'.
 *          @param {string} [options.rowHeaders.valign=middle] - Vertical alignment of the row header content.
 *              Available values are 'top', 'middle', 'bottom'.
 *          @param {function} [options.rowHeaders.renderer] - Sets the custom renderer to customize the header content.
 *      @param {Array} options.columns - The configuration of the grid columns.
 *          @param {string} options.columns.name - The name of the column.
 *          @param {boolean} [options.columns.ellipsis=false] - If set to true, ellipsis will be used
 *              for overflowing content.(This option will be deprecated)
 *          @param {string} [options.columns.align=left] - Horizontal alignment of the column content.
 *              Available values are 'left', 'center', 'right'.
 *          @param {string} [options.columns.valign=middle] - Vertical alignment of the column content.
 *              Available values are 'top', 'middle', 'bottom'.
 *          @param {string} [options.columns.className] - The name of the class to be used for all cells of
 *              the column.
 *          @param {string} [options.columns.header] - The header of the column to be shown on the header.
 *          @param {number} [options.columns.width] - The width of the column. The unit is pixel. If this value
 *              isn't set, the column's width is automatically resized.
 *          @param {number} [options.columns.minWidth=50] - The minimum width of the column. The unit is pixel.
 *          @param {boolean} [options.columns.hidden] - If set to true, the column will not be shown.
 *          @param {boolean} [options.columns.resizable] - If set to false, the width of the column
 *              will not be changed.
 *          @param {Object} [options.columns.validation] - The options to be used for validation.
 *              Validation is executed whenever data is changed or the {@link Grid#validate} is called.
 *          @param {boolean} [options.columns.validation.required=false] - If set to true, the data of the column
 *              will be checked to be not empty.
 *          @param {number|string} [options.columns.validation.dataType='string'] - Specifies the type of the cell value.
 *              Available types are 'string' and 'number'.
 *          @param {number} [options.columns.validation.min] - If set to numeric value, the data of the column
 *              will be checked to be greater than 'min' value.
 *              Available types are 'string' and 'number'.
 *          @param {number} [options.columns.validation.max] - If set to numeric value, the data of the column
 *              will be checked to be less than 'max' value.
 *          @param {RegExp} [options.columns.validation.regExp] - If set to regular expression, the data of the column
 *              will be checked using the regular expression.
 *          @param {function} [options.columns.validation.validatorFn] - If set to function, the data of the column
 *              will be checked using the result of the custom validator.
 *          @param {boolean} [options.columns.validation.unique] - If set to true, check the uniqueness on the data of the column.
 *          @param {string} [options.columns.defaultValue] - The default value to be shown when the column
 *              doesn't have a value.
 *          @param {function|string} [options.columns.formatter] - The function that formats the value of the cell.
 *              The return value of the function will be shown as the value of the cell. If set to 'listItemText',
 *              the value will be shown the text.
 *          @param {boolean} [options.columns.escapeHTML=false] - If set to true, the value of the cell
 *              will be encoded as HTML entities.
 *          @param {boolean} [options.columns.ignored=false] - If set to true, the value of the column will be
 *               ignored when setting up the list of modified rows.
 *          @param {boolean} [options.columns.sortable=false] - If set to true, sort button will be shown on
 *              the right side of the column header, which executes the sort action when clicked.
 *          @param {string} [options.columns.sortingType='asc'] - If set to 'desc', will execute descending sort initially
 *              when sort button is clicked.
 *          @param {function} [options.columns.comparator] - The custom comparator that sorts the data of the column.
 *              The return value should be same as the result of general 'compareFunction'.
 *          @param {function} [options.columns.onBeforeChange] - The function that will be
 *              called before changing the value of the cell. If stop() method in event object is called,
 *              the changing will be canceled.
 *          @param {function} [options.columns.onAfterChange] - The function that will be
 *              called after changing the value of the cell.
 *          @param {Object} [options.columns.editor] - The object for configuring editing UI.
 *              @param {string|function} [options.columns.editor.type='text'] - The string value that specifies
 *                  the type of the editing UI. Available values are 'text', 'password', 'select', 'radio', 'checkbox'.
 *                  When using the custom editor, sets to the customized renderer constructor.
 *              @param {Object} [options.columns.editor.options] - Option object using editor
 *                  @param {Array} [options.columns.editor.options.listItems] - Specifies the option items for the
 *                       'select', 'radio', 'checkbox' type. The item of the array must contain properties named
 *                       'text' and 'value'. (e.g. [{text: 'option1', value: 1}, {...}])
 *              @param {Object} [options.columns.copyOptions] - Option object for clipboard copying.
 *                  This option is column specific, and overrides the global copyOptions.
 *              @param {boolean} [options.columns.copyOptions.useFormattedValue] - Whether to use
 *                  formatted values or original values as a string to be copied to the clipboard
 *              @param {boolean} [options.columns.copyOptions.useListItemText] - Whether to use
 *                  concatenated text or original values as a string to be copied to the clipboard
 *              @param {function} [options.columns.copyOptions.customValue] - Whether to use
 *                  customized value from "customValue" callback or original values as a string to be copied to the clipboard
 *          @param {Array} [options.columns.relations] - Specifies relation between this and other column.
 *              @param {Array} [options.columns.relations.targetNames] - Array of the names of target columns.
 *              @param {function} [options.columns.relations.disabled] - If returns true, target columns
 *                  will be disabled.
 *              @param {function} [options.columns.relations.editable] - If returns true, target columns
 *                  will be editable.
 *              @param {function} [options.columns.relations.listItems] - The function whose return
 *                  value specifies the option list for the 'select', 'radio', 'checkbox' type.
 *                  The options list of target columns will be replaced with the return value of this function.
 *          @param {string} [options.columns.whiteSpace='nowrap'] - If set to 'normal', the text line is broken
 *              by fitting to the column's width. If set to 'pre', spaces are preserved and the text is braken by
 *              new line characters. If set to 'pre-wrap', spaces are preserved, the text line is broken by
 *              fitting to the column's width and new line characters. If set to 'pre-line', spaces are merged,
 *              the text line is broken by fitting to the column's width and new line characters.(This option will be deprecated)
 *          @param {boolean} [options.columns.rowSpan=false] - If set to true, apply dynamic rowspan to column data.
 *              If it is not a top-level relational column of a column relationship or the grid has tree data, dynamic rowspan is not applied.
 *      @param {Object} [options.summary] - The object for configuring summary area.
 *          @param {number} [options.summary.height] - The height of the summary area.
 *          @param {string} [options.summary.position='bottom'] - The position of the summary area. ('bottom', 'top')
 *          @param {(string|Object)} [options.summary.defaultContent]
 *              The configuring of summary cell for every column.
 *              This options can be overriden for each column by columnContent options.
 *              If type is string, the value is used as HTML of summary cell for every columns
 *              without auto-calculation.
 *              @param {boolean} [options.summary.defaultContent.useAutoSummary=true]
 *                  If set to true, the summary value of every column is served as a parameter to the template
 *                  function whenever data is changed.
 *              @param {function} [options.summary.defaultContent.template] - Template function which returns the
 *                  content(HTML) of the column of the summary. This function takes an K-V object as a parameter
 *                  which contains a summary values keyed by 'sum', 'avg', 'min', 'max' and 'cnt'.
 *          @param {Object} [options.summary.columnContent]
 *              The configuring of summary cell for each column.
 *              Sub options below are keyed by each column name.
 *              If type of value of this object is string, the value is used as HTML of summary cell for
 *              the column without auto-calculation.
 *              @param {boolean} [options.summary.columnContent.useAutoSummary=true]
 *                  If set to true, the summary value of each column is served as a parameter to the template
 *                  function whenever data is changed.
 *              @param {function} [options.summary.columnContent.template] - Template function which returns the
 *                  content(HTML) of the column of the summary. This function takes an K-V object as a parameter
 *                  which contains a summary values keyed by 'sum', 'avg', 'min', 'max' and 'cnt'.
 *      @param {boolean} [options.usageStatistics=true] Send the hostname to google analytics.
 *          If you do not want to send the hostname, this option set to false.
 *      @param {function} [options.onGridMounted] - The function that will be called after rendering the grid.
 *      @param {function} [options.onGridUpdated] - The function that will be called after updating the all data of the grid and rendering the grid.
 *      @param {function} [options.onGridBeforeDestroy] - The function that will be called before destroying the grid.
 *      @param {boolean} [options.draggable] - Whether to enable to drag the row for changing the order of rows.
 *      @param {Array} [options.contextMenu] - Option array for the context menu.
 */
var Grid = /** @class */ (function () {
    function Grid(options) {
        var _this = this;
        var el = options.el, _a = options.usageStatistics, usageStatistics = _a === void 0 ? true : _a;
        var id = instance_1.register(this);
        var store = create_1.createStore(id, options);
        var dispatch = create_2.createDispatcher(store);
        var eventBus = eventBus_1.createEventBus(id);
        var dataProvider = serverSideDataProvider_1.createProvider(store, dispatch, options.data);
        var dataManager = modifiedDataManager_1.createManager();
        var paginationManager = paginationManager_1.createPaginationManager();
        this.el = el;
        this.store = store;
        this._dispatch = dispatch;
        this.eventBus = eventBus;
        this.dataProvider = dataProvider;
        this.dataManager = dataManager;
        this.paginationManager = paginationManager;
        this.usageStatistics = usageStatistics;
        this.isActiveFilterFun = options.isActiveFilterFun;
        if (this.usageStatistics) {
            googleAnalytics_1.sendHostname();
        }
        instance_1.registerDataSources(id, dataProvider, dataManager, paginationManager);
        if (!manager_1.default.isApplied()) {
            manager_1.default.apply('default');
        }
        if (Array.isArray(options.data)) {
            this.dataManager.setOriginData(options.data);
        }
        var lifeCycleEvent = common_1.pick(options, 'onGridMounted', 'onGridBeforeDestroy', 'onGridUpdated');
        Object.keys(lifeCycleEvent).forEach(function (eventName) {
            _this.eventBus.on(eventName, lifeCycleEvent[eventName]);
        });
        this.gridEl = preact_1.render(preact_1.h(root_1.Root, { store: store, dispatch: dispatch, rootElement: el }), el);
        this.dispatch('setColumnWidthsByText');
        this.dispatch('updateRowSpan');
    }
    /**
     * Apply theme to all grid instances with the preset options of a given name.
     * @static
     * @param {string} presetName - preset theme name. Available values are 'default', 'striped' and 'clean'.
     * @param {Object} [extOptions] - if exist, extend preset options with this object.
     *     @param {Object} [extOptions.outline] - Styles for the table outline.
     *         @param {string} [extOptions.outline.border] - Color of the table outline.
     *         @param {boolean} [extOptions.outline.showVerticalBorder] - Whether vertical outlines of
     *             the table are visible.
     *     @param {Object} [extOptions.selection] - Styles for a selection layer.
     *         @param {string} [extOptions.selection.background] - Background color of a selection layer.
     *         @param {string} [extOptions.selection.border] - Border color of a selection layer.
     *     @param {Object} [extOptions.scrollbar] - Styles for scrollbars.
     *         @param {string} [extOptions.scrollbar.border] - Border color of scrollbars.
     *         @param {string} [extOptions.scrollbar.background] - Background color of scrollbars.
     *         @param {string} [extOptions.scrollbar.emptySpace] - Color of extra spaces except scrollbar.
     *         @param {string} [extOptions.scrollbar.thumb] - Color of thumbs in scrollbars.
     *         @param {string} [extOptions.scrollbar.active] - Color of arrows(for IE) or
     *              thumb:hover(for other browsers) in scrollbars.
     *     @param {Object} [extOptions.frozenBorder] - Styles for a frozen border.
     *         @param {string} [extOptions.frozenBorder.border] - Border color of a frozen border.
     *     @param {Object} [extOptions.area] - Styles for the table areas.
     *         @param {Object} [extOptions.area.header] - Styles for the header area in the table.
     *             @param {string} [extOptions.area.header.background] - Background color of the header area
     *                 in the table.
     *             @param {string} [extOptions.area.header.border] - Border color of the header area
     *                 in the table.
     *         @param {Object} [extOptions.area.body] - Styles for the body area in the table.
     *             @param {string} [extOptions.area.body.background] - Background color of the body area
     *                 in the table.
     *         @param {Object} [extOptions.area.summary] - Styles for the summary area in the table.
     *             @param {string} [extOptions.area.summary.background] - Background color of the summary area
     *                 in the table.
     *             @param {string} [extOptions.area.summary.border] - Border color of the summary area
     *                 in the table.
     *     @param {Object} [extOptions.row] - Styles for the table rows.
     *         @param {Object} [extOptions.row.even] - Styles for even row.
     *             @param {string} [extOptions.row.even.background] - background color of even row.
     *             @param {string} [extOptions.row.even.text] - text color of even row.
     *         @param {Object} [extOptions.row.odd] - Styles for odd row.
     *             @param {string} [extOptions.row.odd.background] - background color of cells in odd row.
     *             @param {string} [extOptions.row.odd.text] - text color of odd row.
     *         @param {Object} [extOptions.row.dummy] - Styles of dummy row.
     *             @param {string} [extOptions.row.dummy.background] - background color of dummy row.
     *         @param {Object} [extOptions.row.hover] - Styles of hovered row.
     *             @param {string} [extOptions.row.hover.background] - background color of hovered row.
     *     @param {Object} [extOptions.cell] - Styles for the table cells.
     *         @param {Object} [extOptions.cell.normal] - Styles for normal cells.
     *             @param {string} [extOptions.cell.normal.background] - Background color of normal cells.
     *             @param {string} [extOptions.cell.normal.border] - Border color of normal cells.
     *             @param {string} [extOptions.cell.normal.text] - Text color of normal cells.
     *             @param {boolean} [extOptions.cell.normal.showVerticalBorder] - Whether vertical borders of
     *                 normal cells are visible.
     *             @param {boolean} [extOptions.cell.normal.showHorizontalBorder] - Whether horizontal borders of
     *                 normal cells are visible.
     *         @param {Object} [extOptions.cell.header] - Styles for header cells.
     *             @param {string} [extOptions.cell.header.background] - Background color of header cells.
     *             @param {string} [extOptions.cell.header.border] - border color of header cells.
     *             @param {string} [extOptions.cell.header.text] - text color of header cells.
     *             @param {boolean} [extOptions.cell.header.showVerticalBorder] - Whether vertical borders of
     *                 header cells are visible.
     *             @param {boolean} [extOptions.cell.header.showHorizontalBorder] - Whether horizontal borders of
     *                 header cells are visible.
     *         @param {Object} [extOptions.cell.selectedHeader] - Styles for selected header cells.
     *             @param {string} [extOptions.cell.selectedHeader.background] - background color of selected header cells.
     *         @param {Object} [extOptions.cell.rowHeader] - Styles for row's header cells.
     *             @param {string} [extOptions.cell.rowHeader.background] - Background color of row's header cells.
     *             @param {string} [extOptions.cell.rowHeader.border] - border color of row's header cells.
     *             @param {string} [extOptions.cell.rowHeader.text] - text color of row's header cells.
     *             @param {boolean} [extOptions.cell.rowHeader.showVerticalBorder] - Whether vertical borders of
     *                 row's header cells are visible.
     *             @param {boolean} [extOptions.cell.rowHeader.showHorizontalBorder] - Whether horizontal borders of
     *                 row's header cells are visible.
     *         @param {Object} [extOptions.cell.selectedRowHeader] - Styles for selected row's header cells.
     *             @param {string} [extOptions.cell.selectedRowHeader.background] - background color of selected row's haed cells.
     *         @param {Object} [extOptions.cell.summary] - Styles for cells in the summary area.
     *             @param {string} [extOptions.cell.summary.background] - Background color of cells in the summary area.
     *             @param {string} [extOptions.cell.summary.border] - border color of cells in the summary area.
     *             @param {string} [extOptions.cell.summary.text] - text color of cells in the summary area.
     *             @param {boolean} [extOptions.cell.summary.showVerticalBorder] - Whether vertical borders of
     *                 cells in the summary area are visible.
     *             @param {boolean} [extOptions.cell.summary.showHorizontalBorder] - Whether horizontal borders of
     *                 cells in the summary area are visible.
     *         @param {Object} [extOptions.cell.focused] - Styles for a focused cell.
     *             @param {string} [extOptions.cell.focused.background] - background color of a focused cell.
     *             @param {string} [extOptions.cell.focused.border] - border color of a focused cell.
     *         @param {Object} [extOptions.cell.focusedInactive] - Styles for a inactive focus cell.
     *             @param {string} [extOptions.cell.focusedInactive.border] - border color of a inactive focus cell.
     *         @param {Object} [extOptions.cell.required] - Styles for required cells.
     *             @param {string} [extOptions.cell.required.background] - background color of required cells.
     *             @param {string} [extOptions.cell.required.text] - text color of required cells.
     *         @param {Object} [extOptions.cell.editable] - Styles for editable cells.
     *             @param {string} [extOptions.cell.editable.background] - background color of the editable cells.
     *             @param {string} [extOptions.cell.editable.text] - text color of the selected editable cells.
     *         @param {Object} [extOptions.cell.disabled] - Styles for disabled cells.
     *             @param {string} [extOptions.cell.disabled.background] - background color of disabled cells.
     *             @param {string} [extOptions.cell.disabled.text] - text color of disabled cells.
     *         @param {Object} [extOptions.cell.invalid] - Styles for invalid cells.
     *             @param {string} [extOptions.cell.invalid.background] - background color of invalid cells.
     *             @param {string} [extOptions.cell.invalid.text] - text color of invalid cells.
     *         @param {Object} [extOptions.cell.currentRow] - Styles for cells in a current row.(deprecated since version 4.4.0)
     *             @param {string} [extOptions.cell.currentRow.background] - background color of cells in a current row.
     *             @param {string} [extOptions.cell.currentRow.text] - text color of cells in a current row.
     *         @param {Object} [extOptions.cell.evenRow] - Styles for cells in even rows.(deprecated since version 4.4.0)
     *             @param {string} [extOptions.cell.evenRow.background] - background color of cells in even rows.
     *             @param {string} [extOptions.cell.evenRow.text] - text color of cells in even rows.
     *         @param {Object} [extOptions.cell.oddRow] - Styles for cells in even rows.(deprecated since version 4.4.0)
     *             @param {string} [extOptions.cell.oddRow.background] - background color of cells in odd rows.
     *             @param {string} [extOptions.cell.oddRow.text] - text color of cells in odd rows.
     *         @param {Object} [extOptions.cell.dummy] - Styles for dummy cells.(deprecated since version 4.4.0)
     *             @param {string} [extOptions.cell.dummy.background] - background color of dummy cells.
     * @example
     * var Grid = tui.Grid; // or require('tui-grid')
     *
     * Grid.applyTheme('striped', {
     *     grid: {
     *         border: '#aaa',
     *         text: '#333'
     *     },
     *     cell: {
     *         disabled: {
     *             text: '#999'
     *         }
     *     }
     * });
     */
    Grid.applyTheme = function (presetName, extOptions) {
        manager_1.default.apply(presetName, extOptions);
    };
    /**
     * Set language
     * @static
     * @param {string} localeCode - Code to set locale messages and
     *     this is the language or language-region combination (ex: en-US)
     * @param {Object} [data] - Messages using in Grid
     * @example
     * var Grid = tui.Grid; // or require('tui-grid')
     *
     * Grid.setLanguage('en'); // default and set English
     * Grid.setLanguage('ko'); // set Korean
     * Grid.setLanguage('en-US', { // set new language
     *      display: {
     *          noData: 'No data.',
     *          loadingData: 'Loading data.',
     *          resizeHandleGuide: 'You can change the width of the column by mouse drag, ' +
     *                              'and initialize the width by double-clicking.'
     *      },
     *      net: {
     *          confirmCreate: 'Are you sure you want to create {{count}} data?',
     *          confirmUpdate: 'Are you sure you want to update {{count}} data?',
     *          confirmDelete: 'Are you sure you want to delete {{count}} data?',
     *          confirmModify: 'Are you sure you want to modify {{count}} data?',
     *          noDataToCreate: 'No data to create.',
     *          noDataToUpdate: 'No data to update.',
     *          noDataToDelete: 'No data to delete.',
     *          noDataToModify: 'No data to modify.',
     *          failResponse: 'An error occurred while requesting data.\nPlease try again.'
     *      }
     * });
     */
    Grid.setLanguage = function (localeCode, data) {
        i18n_1.default.setLanguage(localeCode, data);
    };
    Grid.prototype.dispatch = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this._dispatch) {
            // @ts-ignore
            return this._dispatch.apply(this, arguments);
        }
    };
    /**
     * Set the width of the dimension.
     * @param {number} width - The width of the dimension
     */
    Grid.prototype.setWidth = function (width) {
        this.dispatch('setWidth', width, false);
    };
    /**
     * Set the height of the dimension.
     * @param {number} height - The height of the dimension
     */
    Grid.prototype.setHeight = function (height) {
        this.dispatch('setHeight', height);
    };
    /**
     * Set the height of body-area.
     * @param {number} bodyHeight - The number of pixel
     */
    Grid.prototype.setBodyHeight = function (bodyHeight) {
        this.dispatch('setBodyHeight', bodyHeight);
    };
    /**
     * Set options for header.
     * @param {Object} options - Options for header
     * @param {number} [options.height] -  The height value
     * @param {Array} [options.complexColumns] - The complex columns info
     */
    Grid.prototype.setHeader = function (_a) {
        var height = _a.height, complexColumns = _a.complexColumns;
        if (height) {
            this.dispatch('setHeaderHeight', height);
        }
        if (complexColumns) {
            this.dispatch('setComplexColumnHeaders', complexColumns);
        }
    };
    /**
     * Set the count of frozen columns.
     * @param {number} count - The count of columns to be frozen
     */
    Grid.prototype.setFrozenColumnCount = function (count) {
        this.dispatch('setFrozenColumnCount', count);
    };
    /**
     * Hide columns
     * @param {...string} arguments - Column names to hide
     */
    Grid.prototype.hideColumn = function (columnName) {
        this.dispatch('hideColumn', columnName);
    };
    /**
     * Show columns
     * @param {...string} arguments - Column names to show
     */
    Grid.prototype.showColumn = function (columnName) {
        this.dispatch('showColumn', columnName);
    };
    /**
     * Select cells or rows by range
     * @param {Object} range - Selection range
     *     @param {Array} [range.start] - Index info of start selection (ex: [rowIndex, columnIndex])
     *     @param {Array} [range.end] - Index info of end selection (ex: [rowIndex, columnIndex])
     */
    Grid.prototype.setSelectionRange = function (range) {
        this.dispatch('setSelection', range);
    };
    /**
     * get Selection range
     * @returns {Object | null} range - Selection range
     *     @returns {Array} [range.start] - Index info of start selection (ex: [rowIndex, columnIndex])
     *     @returns {Array} [range.end] - Index info of end selection (ex: [rowIndex, columnIndex])
     */
    Grid.prototype.getSelectionRange = function () {
        var rangeWithRowHeader = this.store.selection.rangeWithRowHeader;
        if (rangeWithRowHeader) {
            var column = rangeWithRowHeader.column, row = rangeWithRowHeader.row;
            return {
                start: [row[0], column[0]],
                end: [row[1], column[1]],
            };
        }
        return null;
    };
    /**
     * Return data of currently focused cell
     * @returns {number|string} rowKey - The unique key of the row
     * @returns {string} columnName - The name of the column
     * @returns {string} value - The value of the cell
     */
    Grid.prototype.getFocusedCell = function () {
        if (!this.store || !this.store.focus) {
            return undefined;
        }
        var _a = this.store.focus, columnName = _a.columnName, rowKey = _a.rowKey;
        var value = null;
        if (rowKey !== null && columnName !== null) {
            value = this.getValue(rowKey, columnName);
        }
        return { rowKey: rowKey, columnName: columnName, value: value };
    };
    /**
     * Remove focus from the focused cell.
     */
    Grid.prototype.blur = function () {
        this.dispatch('setFocusInfo', null, null, false);
    };
    /**
     * update by tangbin
     * setScrollPosition
     * @param {Number|null} scrollLeft - scrollLeft
     * @param {Number|null} scrollTop - scrollTop
     */
    Grid.prototype.setScrollPosition = function (scrollLeft, scrollTop) {
        var viewport = this.store.viewport;
        if (scrollLeft !== null) {
            viewport.scrollLeft = scrollLeft;
        }
        if (scrollTop !== null) {
            viewport.scrollTop = scrollTop;
        }
    };
    /**
     * update by tangbin
     * getScrollPosition
     * @returns {Object | null}
     *    @returns {Number|null} scrollLeft - scrollLeft
     *    @returns {Number|null} scrollTop - scrollTop
     */
    Grid.prototype.getScrollPosition = function () {
        if (!this.store) {
            return { scrollTop: 0, scrollLeft: 0 };
        }
        var viewport = this.store.viewport;
        return { scrollTop: viewport.scrollTop, scrollLeft: viewport.scrollLeft, };
    };
    /**
     * Focus to the cell identified by given rowKey and columnName.
     * @param {Number|String} rowKey - rowKey
     * @param {String} columnName - columnName
     * @param {Boolean} [setScroll=true] - if set to true, move scroll position to focused position
     * @returns {Boolean} true if focused cell is changed
     */
    Grid.prototype.focus = function (rowKey, columnName, setScroll) {
        var _this = this;
        if (setScroll === void 0) { setScroll = true; }
        var row = this.getRow(rowKey);
        if (!row || !data_1.getRowHeight(row, this.store.dimension.rowHeight)) {
            return false;
        }
        this.dispatch('setFocusInfo', rowKey, columnName, true);
        this.dispatch('setNavigating', false); //update by tangbin 不高亮选中
        if (setScroll) {
            // Use setTimeout to wait until the DOM element is actually mounted or updated.
            // For example, when expands the tree row at bottom of the grid area with scroll,
            // grid needs to wait for mounting the expanded tree DOM element to detect the accurate scrolling position.
            setTimeout(function () {
                _this.dispatch('setScrollToFocus');
            });
        }
        return true;
    };
    /**
     * Focus to the cell identified by given rowIndex and columnIndex.
     * @param {Number} rowIndex - rowIndex
     * @param {Number} columnIndex - columnIndex
     * @param {boolean} [setScroll=true] - if set to true, scroll to focused cell
     * @returns {Boolean} true if success
     */
    Grid.prototype.focusAt = function (rowIndex, columnIndex, setScroll) {
        if (!this.store) {
            return false;
        }
        var _a = data_1.getCellAddressByIndex(this.store, rowIndex, columnIndex), rowKey = _a.rowKey, columnName = _a.columnName;
        if (!common_1.isUndefined(rowKey) && columnName) {
            return this.focus(rowKey, columnName, setScroll);
        }
        return false;
    };
    /**
     * Make view ready to get keyboard input.
     */
    Grid.prototype.activateFocus = function () {
        this.dispatch('setNavigating', true);
    };
    /**
     * Set focus on the cell at the specified index of row and column and starts to edit.
     * @param {number|string} rowKey - The unique key of the row
     * @param {string} columnName - The name of the column
     * @param {boolean} [setScroll=true] - If set to true, the view will scroll to the cell element.
     */
    Grid.prototype.startEditing = function (rowKey, columnName, setScroll) {
        if (this.focus(rowKey, columnName, setScroll)) {
            if (this.store.focus.rowKey === rowKey && this.store.focus.columnName === columnName) {
                this.dispatch('startEditing', rowKey, columnName);
            }
        }
    };
    /**
     * Set focus on the cell at the specified index of row and column and starts to edit.
     * @param {number|string} rowIndex - The index of the row
     * @param {string} columnIndex - The index of the column
     * @param {boolean} [setScroll=true] - If set to true, the view will scroll to the cell element.
     */
    Grid.prototype.startEditingAt = function (rowIndex, columnIndex, setScroll) {
        var _a = data_1.getCellAddressByIndex(this.store, rowIndex, columnIndex), rowKey = _a.rowKey, columnName = _a.columnName;
        this.startEditing(rowKey, columnName, setScroll);
    };
    /**
     * Save editing value and finishes to edit.
     */
    Grid.prototype.finishEditing = function (rowKey, columnName, value) {
        // @TODO: should change the function signature as removing all current paramaters.
        // The signature will be as below.
        // ex) finishEditing()
        this.dispatch('saveAndFinishEditing', value);
    };
    /**
     * Cancel the editing.
     */
    Grid.prototype.cancelEditing = function () {
        var editingAddress = this.store.focus.editingAddress;
        if (editingAddress) {
            var rowKey = editingAddress.rowKey, columnName = editingAddress.columnName;
            var value = this.getValue(rowKey, columnName);
            this.dispatch('finishEditing', rowKey, columnName, value, { save: false });
        }
    };
    /**
     * Set the value of the cell identified by the specified rowKey and columnName.
     * @param {number|string} rowKey - The unique key of the row
     * @param {string} columnName - The name of the column
     * @param {number|string} value - The value to be set
     * @param {boolean} [checkCellState=false] - If set to true, only editable and not disabled cells will be affected.
     */
    Grid.prototype.setValue = function (rowKey, columnName, value, checkCellState) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dispatch('setValue', rowKey, columnName, value, checkCellState)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return the value of the cell identified by the rowKey and columnName.
     * @param {number|string} rowKey - The unique key of the target row.
     * @param {string} columnName - The name of the column
     * @returns {number|string|boolean|null} - The value of the cell
     */
    Grid.prototype.getValue = function (rowKey, columnName) {
        var _a;
        var _b = this.store, data = _b.data, column = _b.column, id = _b.id;
        var targetRow = data_1.findRowByRowKey(data, column, id, rowKey, false);
        if (targetRow) {
            return (_a = targetRow[columnName]) !== null && _a !== void 0 ? _a : null;
        }
        return null;
    };
    /**
     * Set the all values in the specified column.
     * @param {string} columnName - The name of the column
     * @param {number|string} columnValue - The value to be set
     * @param {boolean} [checkCellState=false] - If set to true, only editable and not disabled cells will be affected.
     */
    Grid.prototype.setColumnValues = function (columnName, columnValue, checkCellState) {
        this.dispatch('setColumnValues', columnName, columnValue, checkCellState);
    };
    /**
     * Return the HTMLElement of the cell identified by the rowKey and columnName.
     * @param {number|string} rowKey - The unique key of the row
     * @param {string} columnName - The name of the column
     * @returns {HTMLElement} - The HTMLElement of the cell element
     */
    Grid.prototype.getElement = function (rowKey, columnName) {
        return this.el.querySelector("." + dom_1.cls('cell') + "[" + dom_1.dataAttr.ROW_KEY + "=\"" + rowKey + "\"][" + dom_1.dataAttr.COLUMN_NAME + "=\"" + columnName + "\"]");
    };
    /**
     * Set the HTML string of given column summary.
     * The type of content is the same as the options.summary.columnContent of the constructor.
     * @param {string} columnName - column name
     * @param {string|object} columnContent - HTML string or options object.
     */
    Grid.prototype.setSummaryColumnContent = function (columnName, columnContent) {
        this.dispatch('setSummaryColumnContent', columnName, columnContent);
    };
    /**
     * Return the values of given column summary.
     * If the column name is not specified, all values of available columns are returned.
     * The shape of returning object looks like the example below.
     * @param {string} [columnName] - column name
     * @returns {Object}
     * @example
     * {
     *     sum: 1000,
     *     avg: 200,
     *     max: 300,
     *     min: 50,
     *     cnt: 5,
     *     filtered: {
     *       sum: 1000,
     *       avg: 200,
     *       max: 300,
     *       min: 50,
     *       cnt: 5
     *     }
     * }
     */
    Grid.prototype.getSummaryValues = function (columnName) {
        var summary = this.store.summary;
        var content = summary.summaryColumnContents[columnName];
        if (content && content.useAutoSummary) {
            return summary.summaryValues[columnName];
        }
        return null;
    };
    /**
     * Return a specific column model.
     * @param {string} columnName - The name of the column
     * @returns {Object|null} - A column model.
     */
    Grid.prototype.getColumn = function (columnName) {
        var column = common_1.find(function (_a) {
            var name = _a.name;
            return name === columnName;
        }, this.store.column.allColumns);
        return column ? observable_1.getOriginObject(column) : null;
    };
    /**
     * Return a list of the column model.
     * @returns {Array} - A list of the column model.
     */
    Grid.prototype.getColumns = function () {
        return this.store.column.allColumns
            .filter(function (_a) {
            var name = _a.name;
            return !column_1.isRowHeader(name);
        })
            .map(function (column) { return observable_1.getOriginObject(column); });
    };
    /**
     * Set the list of column model.
     * @param {Array} columns - A new list of column model
     */
    Grid.prototype.setColumns = function (columns) {
        this.dispatch('setColumns', columns);
    };
    /**
     * Set columns title
     * @param {Object} columnsMap - columns map to be change
     * @example
     * {
     *      columnName1: 'title1',
     *      columnName2: 'title2',
     *      columnName3: 'title3'
     * }
     */
    Grid.prototype.setColumnHeaders = function (columnsMap) {
        this.dispatch('changeColumnHeadersByName', columnsMap);
    };
    /**
     * Reset the width of each column by using initial setting of column models.
     * @param {Array.<number>} [widths] - An array of column widths to set. If there's no parameter, it reset auto-resizing column width.
     */
    Grid.prototype.resetColumnWidths = function (widths) {
        if (widths) {
            this.dispatch('resetColumnWidths', widths);
        }
        else {
            this.dispatch('setAutoResizingColumnWidths');
        }
    };
    /**
     * Return a list of all values in the specified column.
     * @param {string} columnName - The name of the column
     * @returns {(Array|string)} - A List of all values in the specified column. (or JSON string of the list)
     */
    Grid.prototype.getColumnValues = function (columnName) {
        return common_1.mapProp(columnName, this.store.data.rawData);
    };
    /**
     * Return the index of the column indentified by the column name.
     * @param {string} columnName - The unique key of the column
     * @returns {number} - The index of the column
     */
    Grid.prototype.getIndexOfColumn = function (columnName) {
        return common_1.findPropIndex('name', columnName, this.store.column.allColumns.filter(function (_a) {
            var name = _a.name;
            return !column_1.isRowHeader(name);
        }));
    };
    /**
     * Check the row identified by the specified rowKey.
     * @param {number|string} rowKey - The unique key of the row
     */
    Grid.prototype.check = function (rowKey) {
        this.dispatch('check', rowKey);
    };
    /**
     * Uncheck the row identified by the specified rowKey.
     * @param {number|string} rowKey - The unique key of the row
     */
    Grid.prototype.uncheck = function (rowKey) {
        this.dispatch('uncheck', rowKey);
    };
    /**
     * Check the rows between the specified rowKeys. If endRowKey is not passed, perform 'check' on the row of startRowKey.
     * @param {number|string} startRowKey - The unique key of the row
     * @param {number|string} [endRowKey] - The unique key of the row
     */
    Grid.prototype.checkBetween = function (startRowKey, endRowKey) {
        this.dispatch('setCheckboxBetween', true, startRowKey, endRowKey);
    };
    //update by tangbin
    Grid.prototype.checkboxRowKeys = function (rowKeys, value) {
        this.dispatch('setCheckboxRowKeys', rowKeys, value);
    };
    /**
     * Uncheck the rows between the specified rowKeys. If endRowKey is not passed, perform 'uncheck' on the row of startRowKey.
     * @param {number|string} startRowKey - The unique key of the row
     * @param {number|string} [endRowKey] - The unique key of the row
     */
    Grid.prototype.uncheckBetween = function (startRowKey, endRowKey) {
        this.dispatch('setCheckboxBetween', false, startRowKey, endRowKey);
    };
    /**
     * Check all rows.
     * @param {boolean} [allPage] - check all rows when using pagination. The default value is 'true'.
     */
    Grid.prototype.checkAll = function (allPage) {
        this.dispatch('checkAll', allPage);
    };
    /**
     * Uncheck all rows.
     * @param {boolean} [allPage] - Uncheck all rows when using pagination. The default value is 'true'.
     */
    Grid.prototype.uncheckAll = function (allPage) {
        this.dispatch('uncheckAll', allPage);
    };
    /**
     * Return a list of the rowKey of checked rows.
     * @returns {Array.<string|number>} - A list of the rowKey.
     */
    Grid.prototype.getCheckedRowKeys = function () {
        var rows = data_1.getCheckedRowInfoList(this.store).rows;
        return rows.map(function (_a) {
            var rowKey = _a.rowKey;
            return rowKey;
        });
    };
    /**
     * Return a list of the checked rows.
     * @returns {Array.<object>} - A list of the checked rows.
     */
    Grid.prototype.getCheckedRows = function () {
        var rows = data_1.getCheckedRowInfoList(this.store).rows;
        return rows.map(function (row) { return observable_1.getOriginObject(row); });
    };
    /**
     * Find rows by conditions
     * @param {Object|Function} conditions - object (key: column name, value: column value) or
     *     function that check the value and returns true/false result to find rows
     * @returns {Array} Row list
     * @example <caption>Conditions type is object.</caption>
     * grid.findRows({
     *     artist: 'Birdy',
     *     price: 10000
     * });
     * @example <caption>Conditions type is function.</caption>
     * grid.findRows((row) => {
     *     return (/b/ig.test(row.artist) && row.price > 10000);
     * });
     */
    Grid.prototype.findRows = function (conditions) {
        return data_1.getConditionalRows(this.store, conditions);
    };
    /**
     * Sort all rows by the specified column.
     * @param {string} columnName - The name of the column to be used to compare the rows
     * @param {boolean} [ascending] - Whether the sort order is ascending.
     *        If not specified, use the negative value of the current order.
     * @param {boolean} [multiple] - Whether using multiple sort
     */
    Grid.prototype.sort = function (columnName, ascending, multiple) {
        if (this.store.data.sortState.useClient) {
            this.dispatch('sort', columnName, ascending, multiple, false);
        }
        else {
            // @TODO: apply multi sort to dataSource
            this.dataProvider.sort(columnName, ascending, false);
        }
    };
    /**
     * If the parameter exists, unsort only column with columnName. If not exist, unsort all rows
     * @param {string} [columnName] - The name of the column to be used to compare the rows
     */
    Grid.prototype.unsort = function (columnName) {
        if (this.store.data.sortState.useClient) {
            this.dispatch('unsort', columnName);
        }
        else {
            this.dataProvider.unsort(columnName);
        }
    };
    /**
     * Get state of the sorted column in rows
     * @returns {{columns: [{columnName: string, ascending: boolean}], useClient: boolean}} Sorted column's state
     */
    Grid.prototype.getSortState = function () {
        return common_1.deepCopy(this.store.data.sortState);
    };
    /**
     * Copy to clipboard
     */
    Grid.prototype.copyToClipboard = function () {
        clipboard_1.execCopy(this.store);
    };
    /**
     * Validate all data and returns the result.
     * Return value is an array which contains only rows which have invalid cell data.
     * @returns {Array.<Object>} An array of error object
     * @example
     * // return value example
     * [
     *     {
     *         rowKey: 1,
     *         errors: [
     *             {
     *                 columnName: 'c1',
     *                 errorCode: ['REQUIRED'],
     *                 errorInfo: [{ code: 'REQUIRED' }]
     *             },
     *             {
     *                 columnName: 'c2',
     *                 errorCode: ['VALIDATOR_FN'],
     *                 errorInfo: [{ code: 'VALIDATOR_FN', customCode: 'CUSTOM_CODE' }]
     *             }
     *         ]
     *     },
     *     {
     *         rowKey: 3,
     *         errors: [
     *             {
     *                 columnName: 'c2',
     *                 errorCode: ['MIN'],
     *                 errorInfo: [{ code: 'MIN', min: 1000 }]
     *             }
     *         ]
     *     }
     * ]
     */
    Grid.prototype.validate = function () {
        return validation_1.getInvalidRows(this.store);
    };
    /**
     * Enable all rows.
     */
    Grid.prototype.enable = function () {
        this.dispatch('setDisabled', false);
    };
    /**
     * Disable all rows.
     */
    Grid.prototype.disable = function () {
        this.dispatch('setDisabled', true);
    };
    /**
     * Disable the row identified by the rowkey.
     * @param {number|string} rowKey - The unique key of the target row
     * @param {boolean} [withCheckbox] - change including checkbox. The default value is 'true'
     */
    Grid.prototype.disableRow = function (rowKey, withCheckbox) {
        if (withCheckbox === void 0) { withCheckbox = true; }
        this.dispatch('setRowDisabled', true, rowKey, withCheckbox);
    };
    /**
     * Enable the row identified by the rowKey.
     * @param {number|string} rowKey - The unique key of the target row
     * @param {boolean} [withCheckbox] - change including checkbox. The default value is 'true'
     */
    Grid.prototype.enableRow = function (rowKey, withCheckbox) {
        if (withCheckbox === void 0) { withCheckbox = true; }
        this.dispatch('setRowDisabled', false, rowKey, withCheckbox);
    };
    /**
     * Disable the row identified by the specified rowKey to not be able to check.
     * @param {number|string} rowKey - The unique key of the row.
     */
    Grid.prototype.disableRowCheck = function (rowKey) {
        this.dispatch('setRowCheckDisabled', true, rowKey);
    };
    /**
     * Enable the row identified by the rowKey to be able to check.
     * @param {number|string} rowKey - The unique key of the row
     */
    Grid.prototype.enableRowCheck = function (rowKey) {
        this.dispatch('setRowCheckDisabled', false, rowKey);
    };
    /**
     * Disable the column identified by the column name.
     * @param {string} columnName - column name
     */
    Grid.prototype.disableColumn = function (columnName) {
        this.dispatch('setColumnDisabled', true, columnName);
    };
    /**
     * Enable the column identified by the column name.
     * @param {string} columnName - column name
     */
    Grid.prototype.enableColumn = function (columnName) {
        this.dispatch('setColumnDisabled', false, columnName);
    };
    /**
     * Disable the cell identified by the row key and column name.
     * @param {number|string} rowKey - The unique key of the row.
     * @param {string} columnName - column name
     */
    Grid.prototype.disableCell = function (rowKey, columnName) {
        this.dispatch('setCellDisabled', true, rowKey, columnName);
    };
    /**
     * Enable the cell identified by the row key and column name.
     * @param {number|string} rowKey - The unique key of the row.
     * @param {string} columnName - column name
     */
    Grid.prototype.enableCell = function (rowKey, columnName) {
        this.dispatch('setCellDisabled', false, rowKey, columnName);
    };
    /**
     * Insert the new row with specified data to the end of table.
     * @param {Object} [row] - The data for the new row
     * @param {Object} [options] - Options
     * @param {number} [options.at] - The index at which new row will be inserted
     * @param {boolean} [options.extendPrevRowSpan] - If set to true and the previous row at target index
     *        has a rowspan data, the new row will extend the existing rowspan data.
     * @param {boolean} [options.focus] - If set to true, move focus to the new row after appending
     * @param {number|string} [options.parentRowKey] - Deprecated: Tree row key of the parent which appends given rows
     */
    Grid.prototype.appendRow = function (row, options) {
        if (row === void 0) { row = {}; }
        if (options === void 0) { options = {}; }
        var treeColumnName = this.store.column.treeColumnName;
        if (treeColumnName) {
            var offset = options.at, focus = options.focus, parentRowKey = options.parentRowKey;
            this.dispatch('appendTreeRow', row, { offset: offset, focus: focus, parentRowKey: parentRowKey });
        }
        else {
            this.dispatch('appendRow', row, options);
        }
        if (options.focus) {
            var rowIdx = common_1.isUndefined(options.at) ? this.getRowCount() - 1 : options.at;
            this.focusAt(rowIdx, 0);
        }
    };
    // xuedan
    Grid.prototype.setLoadingState = function (state) {
        this.dispatch('setLoadingState', state);
    };
    Grid.prototype.setLoading = function () {
        this.dispatch('setLoadingState', 'LOADING');
    };
    Grid.prototype.setLoadingDONE = function () {
        this.dispatch('setLoadingState', 'DONE');
    };
    /**
     * Insert the new row with specified data to the beginning of table.
     * @param {Object} [row] - The data for the new row
     * @param {Object} [options] - Options
     * @param {boolean} [options.focus] - If set to true, move focus to the new row after appending
     */
    Grid.prototype.prependRow = function (row, options) {
        if (options === void 0) { options = {}; }
        this.appendRow(row, tslib_1.__assign(tslib_1.__assign({}, options), { at: 0 }));
    };
    /**
     * Remove the row identified by the specified rowKey.
     * @param {number|string} rowKey - The unique key of the row
     * @param {boolean} [options.removeOriginalData] - If set to true, the original data will be removed.
     * @param {boolean} [options.keepRowSpanData] - If set to true, the value of the merged cells will not be
     *     removed although the target is first cell of them.
     */
    Grid.prototype.removeRow = function (rowKey, options) {
        if (options === void 0) { options = {}; }
        var treeColumnName = this.store.column.treeColumnName;
        if (treeColumnName) {
            this.removeTreeRow(rowKey);
        }
        else {
            this.dispatch('removeRow', rowKey, options);
        }
    };
    /**
     * Remove the rows identified by the specified rowKeys.
     * @param {Array<RowKey>} rowKeys - The array of unique keys of the row
     */
    Grid.prototype.removeRows = function (rowKeys) {
        var removeRowInfoList = data_1.getRemoveRowInfoList(this.store, rowKeys);
        var removeRowsCount = removeRowInfoList.rows.length;
        if (removeRowsCount > 0) {
            this.dispatch('removeRows', removeRowInfoList);
        }
    };
    /**
     * Return the object that contains all values in the specified row.
     * @param {number|string} rowKey - The unique key of the target row
     * @returns {Object} - The object that contains all values in the row.
     */
    Grid.prototype.getRow = function (rowKey) {
        return this.getRowAt(this.getIndexOfRow(rowKey));
    };
    /**
     * Return the object that contains all values in the row at specified index.
     * @param {number} rowIdx - The index of the row
     * @returns {Object} - The object that contains all values in the row.
     */
    Grid.prototype.getRowAt = function (rowIdx) {
        if (!this.store) {
            return undefined;
        }
        var row = this.store.data.rawData[rowIdx];
        return row ? observable_1.getOriginObject(row) : null;
    };
    /**
     * Return the index of the row indentified by the rowKey.
     * @param {number|string} rowKey - The unique key of the row
     * @returns {number} - The index of the row
     */
    Grid.prototype.getIndexOfRow = function (rowKey) {
        if (!this.store) {
            return undefined;
        }
        var _a = this.store, data = _a.data, column = _a.column, id = _a.id;
        return data_1.findIndexByRowKey(data, column, id, rowKey, false);
    };
    /**
     * Return a list of all rows.
     * @returns {Array} - A list of all rows
     */
    Grid.prototype.getData = function () {
        return this.store.data.rawData.map(function (row) { return data_1.getOmittedInternalProp(row); });
    };
    /**
     * Return a list of filtered rows.
     * @returns {Array} - A list of filtered rows
     */
    Grid.prototype.getFilteredData = function () {
        return this.store.data.filteredRawData.map(function (row) { return data_1.getOmittedInternalProp(row); });
    };
    /**
     * Return the total number of the rows.
     * @returns {number} - The total number of the rows
     */
    Grid.prototype.getRowCount = function () {
        return this.store.data.rawData.length;
    };
    /**
     * Remove all rows.
     */
    Grid.prototype.clear = function () {
        this.dispatch('clearData');
    };
    /**
     * Replace all rows with the specified list. This will not change the original data.
     * @param {Array} data - A list of new rows
     * @param {Object} [options] - Options
     *     @param {Object} [options.sortState] - If set the sortState, the sort state will be applied when the new rows are set.
     *       It is recommended that you do not use it unless you are getting the sorted data by communicating with the server without DataSource.
     *         @param {string} [options.sortState.columnName] - Target column name.
     *         @param {boolean} [options.sortState.ascending] - The ascending state of specific column which will apply to the grid.
     *         @param {boolean} [options.sortState.multiple] - Whether to use multiple sorting.
     *     @param {Object} [options.filterState] - If set the filterState, the filter state will be applied when the new rows are set.
     *       It is recommended that you do not use it unless you are getting the filtered data by communicating with the server without DataSource.
     *         @param {string} [options.filterState.columnName] - Target column name.
     *         @param {Object} [options.filterState.columnFilterState] - The column filter state of column which will apply to the grid.
     *             @param {string} [options.filterState.columnFilterState.code] - Code for column filter(ex. 'eq', 'gt').
     *             @param {string} [options.filterState.columnFilterState.value] - Input value for column filter.
     *     @param {Object} [options.pageState] - If set the pageState, the pagination state will be applied when the new rows are set.
     *       It is recommended that you do not use it unless you are getting the paginated data by communicating with the server without DataSource.
     *         @param {number} [options.pageState.page] - Target page number.
     *         @param {number} [options.pageState.totalCount] - The total pagination count.
     *         @param {number} [options.pageState.perPage] - Number of rows per page.
     */
    Grid.prototype.resetData = function (data, options) {
        if (options === void 0) { options = {}; }
        this.dispatch && this.dispatch('resetData', data, options);
    };
    /**
     * Add the specified css class to cell element identified by the rowKey and className
     * @param {number|string} rowKey - The unique key of the row
     * @param {string} columnName - The name of the column
     * @param {string} className - The css class name to add
     */
    Grid.prototype.addCellClassName = function (rowKey, columnName, className) {
        this.dispatch('addCellClassName', rowKey, columnName, className);
    };
    /**
     * Add the specified css class to all cell elements in the row identified by the rowKey
     * @param {number|string} rowKey - The unique key of the row
     * @param {string} className - The css class name to add
     */
    Grid.prototype.addRowClassName = function (rowKey, className) {
        this.dispatch('addRowClassName', rowKey, className);
    };
    /**
     * Remove the specified css class from the cell element indentified by the rowKey and columnName.
     * @param {number|string} rowKey - The unique key of the row
     * @param {string} columnName - The name of the column
     * @param {string} className - The css class name to be removed
     */
    Grid.prototype.removeCellClassName = function (rowKey, columnName, className) {
        this.dispatch('removeCellClassName', rowKey, columnName, className);
    };
    /**
     * Remove the specified css class from all cell elements in the row identified by the rowKey.
     * @param {number|string} rowKey - The unique key of the row
     * @param {string} className - The css class name to be removed
     */
    Grid.prototype.removeRowClassName = function (rowKey, className) {
        this.dispatch('removeRowClassName', rowKey, className);
    };
    /**
     * Return a list of class names of specific cell.
     * @param {number|string} rowKey - The unique key of the row
     * @param {string} columnName - The name of the column
     * @returns {Array} - A list of class names
     */
    Grid.prototype.getCellClassName = function (rowKey, columnName) {
        var _a;
        var targetRow = this.getRow(rowKey);
        var isExistColumnName = this.store.column.allColumns.some(function (_a) {
            var name = _a.name;
            return name === columnName;
        });
        if (!common_1.isNil(targetRow) && isExistColumnName) {
            var _b = targetRow._attributes.className, row = _b.row, column = _b.column;
            return tslib_1.__spreadArrays(row, ((_a = column[columnName]) !== null && _a !== void 0 ? _a : []));
        }
        return [];
    };
    /**
     * Return a list of class names of specific row.
     * @param {number|string} rowKey - The unique key of the row
     * @returns {Array} - A list of class names
     */
    Grid.prototype.getRowClassName = function (rowKey) {
        var targetRow = this.getRow(rowKey);
        return common_1.isNil(targetRow) ? [] : targetRow._attributes.className.row;
    };
    /**
     * Add custom event to grid.
     * @param {string} eventName - custom event name
     * @param {function} fn - event handler
     */
    Grid.prototype.on = function (eventName, fn) {
        this.eventBus.on(eventName, fn);
    };
    /**
     * Remove custom event to grid.
     * @param {string} eventName - custom event name
     * @param {function} fn - event handler
     */
    Grid.prototype.off = function (eventName, fn) {
        this.eventBus.off(eventName, fn);
    };
    /**
     * Return an instance of tui.Pagination.
     * @deprecated
     * @returns {tui.Pagination}
     */
    Grid.prototype.getPagination = function () {
        return this.paginationManager.getPagination();
    };
    /**
     * Set number of rows per page and reload current page
     * @param {number} perPage - Number of rows per page
     * @param {Params} data - Data(parameters) to send to the server
     */
    Grid.prototype.setPerPage = function (perPage, data) {
        var pagination = this.getPagination();
        if (pagination) {
            var pageOptions = this.store.data.pageOptions;
            if (pageOptions.useClient) {
                this.dispatch('updatePageOptions', { perPage: perPage, page: 1 });
                this.dispatch('updateHeights');
            }
            else {
                this.readData(1, tslib_1.__assign(tslib_1.__assign({}, data), { perPage: perPage }));
            }
        }
    };
    /**
     * Return true if there are at least one row modified.
     * @returns {boolean} - True if there are at least one row modified.
     */
    Grid.prototype.isModified = function () {
        return this.dataManager.isModified();
    };
    /**
     * Return the object that contains the lists of changed data compared to the original data.
     * The object has properties 'createdRows', 'updatedRows', 'deletedRows'.
     * @param {Object} [options] Options
     *     @param {boolean} [options.checkedOnly=false] - If set to true, only checked rows will be considered.
     *     @param {boolean} [options.withRawData=false] - If set to true, the data will contains
     *         the row data for internal use.
     *     @param {boolean} [options.rowKeyOnly=false] - If set to true, only keys of the changed
     *         rows will be returned.
     *     @param {Array} [options.ignoredColumns] - A list of column name to be excluded.
     * @returns {{createdRows: Array, updatedRows: Array, deletedRows: Array}} - Object that contains the result list.
     */
    Grid.prototype.getModifiedRows = function (options) {
        if (options === void 0) { options = {}; }
        var ignoredColumns = options.ignoredColumns;
        var originIgnoredColumns = this.store.column.ignoredColumns;
        options.ignoredColumns = Array.isArray(ignoredColumns)
            ? ignoredColumns.concat(originIgnoredColumns)
            : originIgnoredColumns;
        return this.dataManager.getAllModifiedData(options);
    };
    /**
     * Request 'readData' to the server. The last requested data will be extended with new data.
     * @param {Number} page - Page number
     * @param {Object} data - Data(parameters) to send to the server
     * @param {Boolean} resetData - If set to true, last requested data will be ignored.
     */
    Grid.prototype.readData = function (page, data, resetData) {
        if (data && data.sortColumn) {
            this.dataProvider.sort(data.sortColumn, data.sortAscending, false);
        }
        else {
            this.dataProvider.readData(page, data, resetData);
        }
    };
    /**
     * Send request to server to sync data
     * @param {String} requestType - 'createData|updateData|deleteData|modifyData'
     * @param {object} options - Options
     *      @param {String} [options.url] - URL to send the request
     *      @param {String} [options.method] - method to send the request
     *      @param {boolean} [options.checkedOnly=false] - Whether the request param only contains checked rows
     *      @param {boolean} [options.modifiedOnly=true] - Whether the request param only contains modified rows
     *      @param {boolean} [options.showConfirm=true] - Whether to show confirm dialog before sending request
     *      @param {boolean} [options.withCredentials=false] - Use withCredentials flag of XMLHttpRequest for ajax requests if true
     */
    Grid.prototype.request = function (requestType, options) {
        if (options === void 0) { options = {}; }
        this.dataProvider.request(requestType, options);
    };
    /**
     * Request 'readData' with last requested data.
     */
    Grid.prototype.reloadData = function () {
        this.dataProvider.reloadData();
    };
    /**
     * Restore the data to the original data.
     * (Original data is set by {@link Grid#resetData|resetData}
     */
    Grid.prototype.restore = function () {
        this.resetData(this.dataManager.getOriginData());
    };
    /**
     * Insert the new tree row with specified data.
     * @param {Object} [row] - The tree data for the new row
     * @param {Object} [options] - Options
     * @param {number|string} [options.parentRowKey] - Tree row key of the parent which appends given rows
     * @param {number} [options.offset] - The offset value to insert new tree row
     * @param {boolean} [options.focus] - If set to true, move focus to the new tree row after appending
     */
    Grid.prototype.appendTreeRow = function (row, options) {
        if (row === void 0) { row = {}; }
        if (options === void 0) { options = {}; }
        var treeColumnName = this.store.column.treeColumnName;
        var parentRowKey = options.parentRowKey;
        if (!treeColumnName || common_1.isUndefined(parentRowKey)) {
            return;
        }
        this.dispatch('appendTreeRow', row, options);
        if (options.focus) {
            var offset = options.offset;
            var childRows = tree_1.getChildRows(this.store, parentRowKey);
            if (childRows.length) {
                var rowKey = (common_1.isUndefined(offset)
                    ? childRows[childRows.length - 1]
                    : childRows[offset]).rowKey;
                var rowIdx = this.getIndexOfRow(rowKey);
                this.focusAt(rowIdx, 0);
            }
        }
    };
    /**
     * Remove the tree row identified by the specified rowKey.
     * @param {number|string} rowKey - The unique key of the row
     */
    Grid.prototype.removeTreeRow = function (rowKey) {
        var treeColumnName = this.store.column.treeColumnName;
        if (treeColumnName) {
            this.dispatch('removeTreeRow', rowKey);
        }
    };
    // xd
    Grid.prototype.removeContent = function () {
        this.dispatch('removeContent');
    };
    //xuedan
    Grid.prototype.replaceTreeRow = function (row, rowKey) {
        if (row === void 0) { row = {}; }
        var treeColumnName = this.store.column.treeColumnName;
        if (!treeColumnName) {
            return;
        }
        this.dispatch('replaceTreeRow', row, rowKey);
        // var rowIdx = this.getIndexOfRow(rowKey);
        // this.focusAt(rowIdx, 0);
    };
    /**
     * Expand tree row.
     * @param {number|string} rowKey - The unique key of the row
     * @param {boolean} recursive - true for recursively expand all descendant
     */
    Grid.prototype.expand = function (rowKey, recursive) {
        this.dispatch('expandByRowKey', rowKey, recursive);
    };
    /**
     * Expand all tree row.
     */
    Grid.prototype.expandAll = function () {
        this.dispatch('expandAll');
    };
    /**
     * Expand tree row.
     * @param {number|string} rowKey - The unique key of the row
     * @param {boolean} recursive - true for recursively expand all descendant
     */
    Grid.prototype.collapse = function (rowKey, recursive) {
        this.dispatch('collapseByRowKey', rowKey, recursive);
    };
    /**
     * Collapse all tree row.
     */
    Grid.prototype.collapseAll = function () {
        this.dispatch('collapseAll');
    };
    /**
     * Get the parent of the row which has the given row key.
     * @param {number|string} rowKey - The unique key of the row
     * @returns {Object} - the parent row
     */
    Grid.prototype.getParentRow = function (rowKey) {
        return tree_1.getParentRow(this.store, rowKey, true);
    };
    /**
     * Get the children of the row which has the given row key.
     * @param {number|string} rowKey - The unique key of the row
     * @returns {Array.<Object>} - the children rows
     */
    Grid.prototype.getChildRows = function (rowKey) {
        return tree_1.getChildRows(this.store, rowKey, true);
    };
    /**
     * Get the ancestors of the row which has the given row key.
     * @param {number|string} rowKey - The unique key of the row
     * @returns {Array.<TreeRow>} - the ancestor rows
     */
    Grid.prototype.getAncestorRows = function (rowKey) {
        return tree_1.getAncestorRows(this.store, rowKey);
    };
    /**
     * Get the descendants of the row which has the given row key.
     * @param {number|string} rowKey - The unique key of the row
     * @returns {Array.<Object>} - the descendant rows
     */
    Grid.prototype.getDescendantRows = function (rowKey) {
        return tree_1.getDescendantRows(this.store, rowKey);
    };
    /**
     * Get the depth of the row which has the given row key.
     * @param {number|string} rowKey - The unique key of the row
     * @returns {number} - the depth
     */
    Grid.prototype.getDepth = function (rowKey) {
        var _a = this.store, data = _a.data, column = _a.column, id = _a.id;
        var rawData = data.rawData;
        var row = data_1.findRowByRowKey(data, column, id, rowKey);
        return row ? tree_1.getDepth(rawData, row) : 0;
    };
    /**
     * Return the rowspan data of the cell identified by the rowKey and columnName.
     * @param {number|string} rowKey - The unique key of the row
     * @param {string} columnName - The name of the column
     * @returns {Object} - Row span data
     */
    Grid.prototype.getRowSpanData = function (rowKey, columnName) {
        return rowSpan_1.getRowSpanByRowKey(rowKey, columnName, this.store.data.rawData);
    };
    /**
     * reset original data to current data.
     * (Original data is set by {@link Grid#resetData|resetData}
     */
    Grid.prototype.resetOriginData = function () {
        this.dataManager.setOriginData(this.store.data.rawData);
    };
    /** Remove all checked rows.
     * @param {boolean} [showConfirm] - If set to true, confirm message will be shown before remove.
     * @returns {boolean} - True if there's at least one row removed.
     */
    Grid.prototype.removeCheckedRows = function (showConfirm) {
        var checkedRowInfoList = data_1.getCheckedRowInfoList(this.store);
        var deletedCount = checkedRowInfoList.rows.length;
        var confirmMessage = message_1.getConfirmMessage('DELETE', deletedCount);
        if (deletedCount > 0 && (!showConfirm || confirm(confirmMessage))) {
            this.dispatch('removeRows', checkedRowInfoList);
            return true;
        }
        return false;
    };
    /**
     * Refresh the layout view. Use this method when the view was rendered while hidden.
     */
    Grid.prototype.refreshLayout = function () {
        var containerEl = this.el.querySelector("." + dom_1.cls('container'));
        var parentElement = this.el.parentElement;
        this.dispatch('refreshLayout', containerEl, parentElement);
    };
    /**
     * Destroy the instance.
     */
    Grid.prototype.destroy = function () {
        preact_1.render('', this.el, this.gridEl);
        tree_2.clearTreeRowKeyMap(this.store.id);
        for (var key in this) {
            if (common_1.hasOwnProp(this, key)) {
                delete this[key];
            }
        }
    };
    /**
     * Set the option of column filter.
     * @param {string} columnName - columnName
     * @param {string | FilterOpt} filterOpt - filter type
     */
    Grid.prototype.setFilter = function (columnName, filterOpt) {
        this.dispatch('setFilter', columnName, filterOpt);
    };
    /**
     * Get filter state.
     * @returns {Array.<FilterState>} - filter state
     */
    Grid.prototype.getFilterState = function () {
        // @TODO: unify the structure to ResetOptions.filterState type definition
        return filter_2.getFilterState(this.store);
    };
    /**
     * Filter the data.
     * @param {string} columnName - column name to filter
     * @param {Array.<FilterState>} state - filter state
     * @example
     * grid.filter('name', [{code: 'eq', value: 3}, {code: 'eq', value: 4}]);
     */
    Grid.prototype.filter = function (columnName, state) {
        var filter = this.store.column.allColumnMap[columnName].filter;
        if (filter) {
            var type_1 = filter.type, operator = filter.operator;
            var conditionFn = state.map(function (_a) {
                var code = _a.code, value = _a.value;
                return filter_1.getFilterConditionFn(code, value, type_1);
            });
            this.dispatch('filter', columnName, filter_1.composeConditionFn(conditionFn, operator), state);
        }
    };
    /**
     * Remove filter state of specific column.
     * @param {string} columnName - column name to unfilter
     */
    Grid.prototype.unfilter = function (columnName) {
        this.dispatch('unfilter', columnName);
    };
    /**
     * Add class name to all cell data of specific column.
     * @param {string} columnName - column name to add className
     * @param {string} className - class name
     */
    Grid.prototype.addColumnClassName = function (columnName, className) {
        this.dispatch('addColumnClassName', columnName, className);
    };
    /**
     * Remove class name to all cell data of specific column.
     * @param {string} columnName - column name to add className
     * @param {string} className - class name
     */
    Grid.prototype.removeColumnClassName = function (columnName, className) {
        this.dispatch('removeColumnClassName', columnName, className);
    };
    /**
     * Return a list of class names of specific column.
     * @param {string} columnName - The name of the column
     * @returns {Array} - A list of class names
     */
    Grid.prototype.getColumnClassName = function (columnName) {
        var rawData = this.store.data.rawData;
        var classNamesOfFirstRow = rawData[0]._attributes.className.column[columnName];
        if (common_1.isEmpty(classNamesOfFirstRow)) {
            return [];
        }
        return rawData.slice(1).reduce(function (acc, row, _, arr) {
            var classNames = row._attributes.className.column[columnName];
            if (common_1.isEmpty(classNames) || common_1.isEmpty(acc)) {
                arr.splice(0);
                return [];
            }
            return acc.filter(function (className) { return common_1.includes(classNames, className); });
        }, classNamesOfFirstRow);
    };
    /**
     * Set new data to the row identified by the specified rowKey.
     * @param {number|string} rowKey - The unique key of the row
     * @param {object} row - The object that contains all values in the row.
     */
    Grid.prototype.setRow = function (rowKey, row) {
        var _a = this.store, data = _a.data, column = _a.column, id = _a.id;
        var rowIndex = data_1.findIndexByRowKey(data, column, id, rowKey, false);
        this.dispatch('setRow', rowIndex, row);
    };
    /**
     * Move the row identified by the specified rowKey to target index.
     * If data is sorted or filtered, this couldn't be used.
     * @param {number|string} rowKey - The unique key of the row
     * @param {number} targetIndex - Target index for moving
     * @param {Object} [options] - Options
     * @param {number} [options.appended] - This option for only tree data. Whether the row is appended to other row as the child.
     */
    Grid.prototype.moveRow = function (rowKey, targetIndex, options) {
        if (options === void 0) { options = { appended: false }; }
        var _a = this.store, column = _a.column, data = _a.data;
        if (column.treeColumnName) {
            var moveToLast = false;
            if (!options.appended) {
                if (targetIndex === data.rawData.length - 1) {
                    moveToLast = true;
                }
                else if (this.getIndexOfRow(rowKey) < targetIndex) {
                    targetIndex += 1;
                }
            }
            this.dispatch('moveTreeRow', rowKey, targetIndex, tslib_1.__assign(tslib_1.__assign({}, options), { moveToLast: moveToLast }));
        }
        else {
            this.dispatch('moveRow', rowKey, targetIndex);
        }
        this.dispatch('updateRowSpan');
    };
    /**
     * Set parameters to be sent with the request to communicate with the server.
     * @param {Object} params - parameters to send to the server
     */
    Grid.prototype.setRequestParams = function (params) {
        this.dataProvider.setRequestParams(params);
    };
    /**
     * clear the modified data that is returned as the result of 'getModifiedRows' method.
     * If the 'type' parameter is undefined, all modified data is cleared.
     * @param {string} type - The modified type
     */
    Grid.prototype.clearModifiedData = function (type) {
        if (type) {
            this.dataManager.clear(type);
        }
        else {
            this.dataManager.clearAll();
        }
    };
    /**
     * append rows.
     * @param {Array} data - A list of new rows
     */
    Grid.prototype.appendRows = function (data) {
        this.dispatch('appendRows', data);
    };
    /**
     * Return the formatted value of the cell identified by the rowKey and columnName.
     * @param {number|string} rowKey - The unique key of the target row.
     * @param {string} columnName - The name of the column
     * @returns {string|null} - The formatted value of the cell
     */
    Grid.prototype.getFormattedValue = function (rowKey, columnName) {
        return data_1.getFormattedValue(this.store, rowKey, columnName);
    };
    /**
     * Set total count of items for calculating the pagination.
     * @param {number} totalCount - total count
     */
    Grid.prototype.setPaginationTotalCount = function (totalCount) {
        this.dispatch('updatePageOptions', { totalCount: totalCount });
    };
    /**
     * Get total count of items with the current pagination
     * @returns {number} - total count
     */
    Grid.prototype.getPaginationTotalCount = function () {
        return this.store.data.pageOptions.totalCount;
    };
    /**
     * Export a file in the specified format
     * @param {string} format - Format of export file
     * @param {Object} [options] - Options for export
     *    @param {boolean} [options.includeHeader=true] - Whether to include headers
     *    @param {boolean} [options.includeHiddenColumns=false] - Whether to include hidden columns
     *    @param {string[]} [options.columnNames=[...allVisibleColumnNames]] - Columns names to export
     *    @param {boolean} [options.onlySelected=false] - Whether to export only the selected range
     *    @param {boolean} [options.onlyFiltered=true] - Whether to export only the filtered data
     *    @param {boolean} [options.useFormattedValue=false] - Whether to export formatted values or original values
     *    @param {','|';'|'\\t'|'|'} [options.delimiter=','] - Delimiter to export CSV
     *    @param {string} [options.fileName='grid-export'] - File name to export
     */
    Grid.prototype.export = function (format, options) {
        this.dispatch('execExport', format, options);
    };
    /**
     * Move the column identified by the specified column name to target index.
     * If there is hidden columns or use complex columns, this couldn't be used.
     * If the column of column name is row header column or tree column, this couldn't be used.
     * @param {string} columnName - The column name of the column
     * @param {number} targetIndex - Target index for moving
     */
    Grid.prototype.moveColumn = function (columnName, targetIndex) {
        var allColumns = this.store.column.allColumns;
        var column = common_1.find(function (_a) {
            var name = _a.name;
            return name === columnName;
        }, allColumns);
        if (!column ||
            targetIndex < 0 ||
            targetIndex >= allColumns.length ||
            column_1.isRowHeader(columnName) ||
            tree_1.isTreeColumnName(this.store.column, columnName)) {
            return;
        }
        this.dispatch('moveColumn', columnName, targetIndex);
    };
    return Grid;
}());
exports.default = Grid;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = void 0;
var observable_1 = __webpack_require__(5);
var data_1 = __webpack_require__(15);
var column_1 = __webpack_require__(34);
var dimension_1 = __webpack_require__(74);
var viewport_1 = __webpack_require__(75);
var columnCoords_1 = __webpack_require__(76);
var rowCoords_1 = __webpack_require__(77);
var focus_1 = __webpack_require__(78);
var summary_1 = __webpack_require__(46);
var selection_1 = __webpack_require__(79);
var renderState_1 = __webpack_require__(80);
var filterLayerState_1 = __webpack_require__(81);
var contextMenu_1 = __webpack_require__(82);
var dimension_2 = __webpack_require__(49);
var lazyObservable_1 = __webpack_require__(29);
var validation_1 = __webpack_require__(27);
function createStore(id, options) {
    validation_1.createNewValidationMap(id);
    var el = options.el, width = options.width, rowHeight = options.rowHeight, bodyHeight = options.bodyHeight, heightResizable = options.heightResizable, minRowHeight = options.minRowHeight, minBodyHeight = options.minBodyHeight, _a = options.columnOptions, columnOptions = _a === void 0 ? {} : _a, keyColumnName = options.keyColumnName, _b = options.rowHeaders, rowHeaders = _b === void 0 ? [] : _b, _c = options.copyOptions, copyOptions = _c === void 0 ? {} : _c, _d = options.summary, summaryOptions = _d === void 0 ? {} : _d, _e = options.selectionUnit, selectionUnit = _e === void 0 ? 'cell' : _e, _f = options.showDummyRows, showDummyRows = _f === void 0 ? false : _f, _g = options.editingEvent, editingEvent = _g === void 0 ? 'dblclick' : _g, _h = options.tabMode, tabMode = _h === void 0 ? 'moveAndEdit' : _h, scrollX = options.scrollX, scrollY = options.scrollY, _j = options.useClientSort, useClientSort = _j === void 0 ? true : _j, _k = options.pageOptions, pageOptions = _k === void 0 ? {} : _k, _l = options.treeColumnOptions, treeColumnOptions = _l === void 0 ? { name: '' } : _l, _m = options.header, header = _m === void 0 ? {} : _m, _o = options.disabled, disabled = _o === void 0 ? false : _o, _p = options.draggable, draggable = _p === void 0 ? false : _p, createMenuGroups = options.contextMenu;
    var frozenBorderWidth = columnOptions.frozenBorderWidth;
    var summaryHeight = summaryOptions.height, summaryPosition = summaryOptions.position;
    var _q = header.height, headerHeight = _q === void 0 ? 40 : _q, _r = header.complexColumns, complexColumns = _r === void 0 ? [] : _r, _s = header.align, align = _s === void 0 ? 'center' : _s, _t = header.valign, valign = _t === void 0 ? 'middle' : _t, _u = header.columns, columnHeaders = _u === void 0 ? [] : _u;
    var column = column_1.create({
        columns: options.columns,
        columnOptions: columnOptions,
        rowHeaders: rowHeaders,
        copyOptions: copyOptions,
        keyColumnName: keyColumnName,
        treeColumnOptions: treeColumnOptions,
        complexColumns: complexColumns,
        align: align,
        valign: valign,
        columnHeaders: columnHeaders,
        disabled: disabled,
        draggable: draggable,
    });
    var data = data_1.create({
        data: Array.isArray(options.data) ? options.data : [],
        column: column,
        pageOptions: pageOptions,
        useClientSort: useClientSort,
        id: id,
        disabled: disabled,
    });
    var dimension = dimension_1.create({
        column: column,
        width: width,
        domWidth: el ? el.clientWidth : undefined,
        rowHeight: rowHeight,
        bodyHeight: bodyHeight,
        minBodyHeight: minBodyHeight,
        minRowHeight: minRowHeight,
        heightResizable: heightResizable,
        frozenBorderWidth: frozenBorderWidth,
        summaryHeight: summaryHeight,
        summaryPosition: summaryPosition,
        scrollX: scrollX,
        scrollY: scrollY,
        headerHeight: headerHeight,
    });
    var columnCoords = columnCoords_1.create({ column: column, dimension: dimension });
    var rowCoords = rowCoords_1.create({ data: data, dimension: dimension });
    var viewport = viewport_1.create({
        data: data,
        column: column,
        dimension: dimension,
        rowCoords: rowCoords,
        columnCoords: columnCoords,
        showDummyRows: showDummyRows,
    });
    var focus = focus_1.create({
        data: data,
        column: column,
        dimension: dimension,
        columnCoords: columnCoords,
        rowCoords: rowCoords,
        editingEvent: editingEvent,
        tabMode: tabMode,
        id: id,
    });
    var summary = summary_1.create({ column: column, data: data, summary: summaryOptions });
    var selection = selection_1.create({
        selectionUnit: selectionUnit,
        columnCoords: columnCoords,
        column: column,
        dimension: dimension,
        rowCoords: rowCoords,
        data: data,
    });
    var filterLayerState = filterLayerState_1.create();
    var renderState = renderState_1.create();
    var contextMenu = contextMenu_1.create({ createMenuGroups: createMenuGroups });
    var store = observable_1.observable({
        id: id,
        data: data,
        column: column,
        dimension: dimension,
        columnCoords: columnCoords,
        rowCoords: rowCoords,
        viewport: viewport,
        focus: focus,
        summary: summary,
        selection: selection,
        renderState: renderState,
        filterLayerState: filterLayerState,
        contextMenu: contextMenu,
    });
    // manual observe to resolve circular references
    observable_1.observe(function () {
        dimension_2.setAutoBodyHeight(store);
    });
    // makes the data observable as changes viewport
    observable_1.observe(function () {
        lazyObservable_1.createObservableData(store);
    }, false, 'lazyObservable');
    return store;
}
exports.createStore = createStore;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.patchArrayMethods = void 0;
var observable_1 = __webpack_require__(5);
var common_1 = __webpack_require__(0);
var methods = ['splice', 'push', 'pop', 'shift', 'unshift'];
function patchArrayMethods(arr, obj, key) {
    methods.forEach(function (method) {
        var patchedMethod = common_1.hasOwnProp(arr, method) ? arr[method] : Array.prototype[method];
        var derivedPatchedMethod = !patchedMethod.registered && common_1.hasOwnProp(arr, method);
        // To prevent to stack the patched method recursively
        if (derivedPatchedMethod || !common_1.hasOwnProp(arr, method)) {
            arr[method] = function patch() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var result = patchedMethod.apply(this, args);
                observable_1.notify(obj, key);
                return result;
            };
            if (derivedPatchedMethod) {
                arr[method].registered = true;
            }
        }
    });
    return arr;
}
exports.patchArrayMethods = patchArrayMethods;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.listItemText = void 0;
var common_1 = __webpack_require__(0);
function getListItemText(listItems, value) {
    var item = common_1.findProp('value', value, listItems);
    return item ? item.text : '';
}
function listItemText(_a, relationListItems) {
    var column = _a.column, value = _a.value;
    var type = column.editor.options.type;
    var listItems = column.editor.options.listItems;
    if (Array.isArray(relationListItems)) {
        listItems = relationListItems;
    }
    if (type === 'checkbox') {
        return String(value)
            .split(',')
            .map(getListItemText.bind(null, listItems))
            .filter(function (text) { return Boolean(text); })
            .join(',');
    }
    return getListItemText(listItems, value);
}
exports.listItemText = listItemText;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRenderer = void 0;
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
var DefaultRenderer = /** @class */ (function () {
    function DefaultRenderer(props) {
        var el = document.createElement('div');
        var _a = props.columnInfo, ellipsis = _a.ellipsis, whiteSpace = _a.whiteSpace, renderer = _a.renderer;
        var className = '';
        this.props = props;
        this.el = el;
        if (renderer) {
            var attributes = renderer.attributes, styles = renderer.styles, classNames = renderer.classNames;
            if (attributes) {
                this.setAttrsOrStyles('attrs', attributes);
            }
            if (styles) {
                this.setAttrsOrStyles('styles', styles);
            }
            if (classNames) {
                className = " " + classNames.join(' ');
            }
        }
        el.className = dom_1.cls('cell-content') + className;
        // @TODO: we should remove below options and consider common the renderer option for style, attribute and class names
        if (ellipsis) {
            el.style.textOverflow = 'ellipsis';
        }
        if (whiteSpace) {
            el.style.whiteSpace = whiteSpace;
        }
        this.render(props);
    }
    DefaultRenderer.prototype.setAttrsOrStyles = function (type, targets) {
        var _this = this;
        Object.keys(targets).forEach(function (name) {
            var value = common_1.isFunction(targets[name]) ? targets[name](_this.props) : targets[name];
            if (type === 'attrs') {
                _this.el.setAttribute(name, value);
            }
            else {
                _this.el.style[name] = value;
            }
        });
    };
    DefaultRenderer.prototype.getElement = function () {
        return this.el;
    };
    DefaultRenderer.prototype.render = function (props) {
        this.el.innerHTML = "" + props.formattedValue;
    };
    return DefaultRenderer;
}());
exports.DefaultRenderer = DefaultRenderer;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.editorMap = void 0;
var text_1 = __webpack_require__(67);
var checkbox_1 = __webpack_require__(68);
var datePicker_1 = __webpack_require__(69);
exports.editorMap = {
    text: [text_1.TextEditor, { type: 'text' }],
    password: [text_1.TextEditor, { type: 'password' }],
    checkbox: [checkbox_1.CheckboxEditor, { type: 'checkbox' }],
    radio: [checkbox_1.CheckboxEditor, { type: 'radio' }],
    select: [text_1.TextEditor],
    datePicker: [datePicker_1.DatePickerEditor],
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TextEditor = void 0;
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
var TextEditor = /** @class */ (function () {
    function TextEditor(props) {
        var el = document.createElement('input');
        var options = props.columnInfo.editor.options;
        el.className = dom_1.cls('content-text');
        el.type = options.type;
        el.value = String(common_1.isNil(props.value) ? '' : props.value);
        this.el = el;
    }
    TextEditor.prototype.getElement = function () {
        return this.el;
    };
    TextEditor.prototype.getValue = function () {
        return this.el.value;
    };
    TextEditor.prototype.mounted = function () {
        this.el.select();
    };
    return TextEditor;
}());
exports.TextEditor = TextEditor;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxEditor = void 0;
var editor_1 = __webpack_require__(41);
var dom_1 = __webpack_require__(2);
var keyboard_1 = __webpack_require__(22);
var common_1 = __webpack_require__(0);
var dom_2 = __webpack_require__(42);
var LAYER_CLASSNAME = dom_1.cls('editor-checkbox-list-layer');
var LIST_ITEM_CLASSNAME = dom_1.cls('editor-checkbox');
var HOVERED_LIST_ITEM_CLASSNAME = dom_1.cls('editor-checkbox-hovered') + " " + LIST_ITEM_CLASSNAME;
var UNCHECKED_RADIO_LABEL_CLASSNAME = dom_1.cls('editor-label-icon-radio');
var CHECKED_RADIO_LABEL_CLASSNAME = dom_1.cls('editor-label-icon-radio-checked');
var UNCHECKED_CHECKBOX_LABEL_CLASSNAME = dom_1.cls('editor-label-icon-checkbox');
var CHECKED_CHECKBOX_LABEL_CLASSNAME = dom_1.cls('editor-label-icon-checkbox-checked');
var CheckboxEditor = /** @class */ (function () {
    function CheckboxEditor(props) {
        var _this = this;
        var _a, _b;
        this.isMounted = false;
        this.hoveredItemId = '';
        this.elementIds = [];
        this.initLayerPos = null;
        this.instantApplyCallback = null;
        this.onMouseover = function (ev) {
            var targetId = _this.getItemId(ev.target);
            if (targetId && targetId !== _this.hoveredItemId) {
                _this.highlightItem(targetId);
            }
        };
        this.onChange = function (ev) {
            var _a;
            var value = ev.target.value;
            _this.setLabelClass(value);
            // eslint-disable-next-line no-unused-expressions
            (_a = _this.instantApplyCallback) === null || _a === void 0 ? void 0 : _a.call(_this);
        };
        this.onKeydown = function (ev) {
            var keyName = keyboard_1.getKeyStrokeString(ev);
            if (keyboard_1.isArrowKey(keyName)) {
                ev.preventDefault();
                var elementIdx = common_1.findIndex(function (id) { return id === _this.hoveredItemId; }, _this.elementIds);
                var totalCount = _this.elementIds.length;
                var offset = totalCount + (keyName === 'down' || keyName === 'right' ? 1 : -1);
                var id = _this.elementIds[(elementIdx + offset) % totalCount];
                _this.highlightItem(id);
            }
            else {
                // except arrow key, pass the event to editing layer for using existing editing keyMap
                _this.portalEditingKeydown(ev);
            }
        };
        var columnInfo = props.columnInfo, width = props.width, formattedValue = props.formattedValue, portalEditingKeydown = props.portalEditingKeydown, instantApplyCallback = props.instantApplyCallback;
        var _c = (_b = (_a = columnInfo.editor) === null || _a === void 0 ? void 0 : _a.options) !== null && _b !== void 0 ? _b : {}, inputType = _c.type, instantApply = _c.instantApply;
        var el = document.createElement('div');
        var value = String(common_1.isNil(props.value) ? '' : props.value);
        el.className = dom_1.cls('layer-editing-inner');
        el.innerText = formattedValue;
        this.inputType = inputType;
        var listItems = editor_1.getListItems(props);
        var layer = this.createLayer(listItems, width);
        this.portalEditingKeydown = portalEditingKeydown;
        this.el = el;
        this.layer = layer;
        this.setValue(value);
        if (instantApply && inputType === 'radio') {
            this.instantApplyCallback = instantApplyCallback;
        }
    }
    CheckboxEditor.prototype.createLayer = function (listItems, width) {
        var _this = this;
        var layer = document.createElement('ul');
        layer.className = LAYER_CLASSNAME;
        layer.style.minWidth = width + "px";
        // To hide the initial layer which is having the position which is not calculated properly
        dom_2.setOpacity(layer, 0);
        listItems.forEach(function (_a) {
            var text = _a.text, value = _a.value;
            var id = "checkbox-" + value;
            var listItemEl = document.createElement('li');
            listItemEl.id = id;
            listItemEl.className = LIST_ITEM_CLASSNAME;
            listItemEl.appendChild(_this.createCheckboxLabel(value, text));
            _this.elementIds.push(id);
            layer.appendChild(listItemEl);
        });
        layer.addEventListener('change', this.onChange);
        layer.addEventListener('mouseover', this.onMouseover);
        layer.addEventListener('keydown', this.onKeydown);
        return layer;
    };
    CheckboxEditor.prototype.createCheckboxLabel = function (value, text) {
        var input = document.createElement('input');
        var label = document.createElement('label');
        var span = document.createElement('span');
        label.className =
            this.inputType === 'radio'
                ? UNCHECKED_RADIO_LABEL_CLASSNAME
                : UNCHECKED_CHECKBOX_LABEL_CLASSNAME;
        input.type = this.inputType;
        input.name = 'checkbox';
        input.value = String(value);
        span.innerText = text;
        label.appendChild(input);
        label.appendChild(span);
        return label;
    };
    CheckboxEditor.prototype.getItemId = function (target) {
        return target.id || target.parentElement.id;
    };
    CheckboxEditor.prototype.highlightItem = function (targetId) {
        if (this.hoveredItemId) {
            this.layer.querySelector("#" + this.hoveredItemId).className = LIST_ITEM_CLASSNAME;
        }
        this.hoveredItemId = targetId;
        var item = this.layer.querySelector("#" + targetId);
        item.className = HOVERED_LIST_ITEM_CLASSNAME;
        item.querySelector('input').focus();
    };
    CheckboxEditor.prototype.setLabelClass = function (inputValue) {
        var label = this.layer.querySelector("#checkbox-" + inputValue + " label");
        if (this.inputType === 'checkbox') {
            label.className = dom_1.hasClass(label, 'editor-label-icon-checkbox-checked')
                ? UNCHECKED_CHECKBOX_LABEL_CLASSNAME
                : CHECKED_CHECKBOX_LABEL_CLASSNAME;
        }
        else {
            var checkedLabel = this.layer.querySelector("." + CHECKED_RADIO_LABEL_CLASSNAME);
            if (checkedLabel) {
                checkedLabel.className = UNCHECKED_RADIO_LABEL_CLASSNAME;
            }
            label.className = CHECKED_RADIO_LABEL_CLASSNAME;
        }
    };
    CheckboxEditor.prototype.getCheckedInput = function () {
        return (this.layer.querySelector('input:checked') ||
            this.layer.querySelector('input'));
    };
    CheckboxEditor.prototype.moveDropdownLayer = function (gridRect) {
        if (this.initLayerPos) {
            dom_2.moveLayer(this.layer, this.initLayerPos, gridRect);
        }
    };
    CheckboxEditor.prototype.getElement = function () {
        return this.el;
    };
    CheckboxEditor.prototype.setValue = function (value) {
        var _this = this;
        String(value)
            .split(',')
            .forEach(function (inputValue) {
            var input = _this.layer.querySelector("input[value=\"" + inputValue + "\"]");
            if (input) {
                input.checked = true;
                _this.setLabelClass(inputValue);
            }
        });
    };
    CheckboxEditor.prototype.getValue = function () {
        var checkedInputs = this.layer.querySelectorAll('input:checked');
        var checkedValues = [];
        for (var i = 0, len = checkedInputs.length; i < len; i += 1) {
            checkedValues.push(checkedInputs[i].value);
        }
        return checkedValues.join(',');
    };
    CheckboxEditor.prototype.mounted = function () {
        // To prevent wrong stacked z-index context, layer append to grid container
        dom_2.getContainerElement(this.el).appendChild(this.layer);
        // @ts-ignore
        dom_2.setLayerPosition(this.el, this.layer);
        this.initLayerPos = {
            top: common_1.pixelToNumber(this.layer.style.top),
            left: common_1.pixelToNumber(this.layer.style.left),
        };
        var checkedInput = this.getCheckedInput();
        if (checkedInput) {
            this.highlightItem("checkbox-" + checkedInput.value);
        }
        this.isMounted = true;
        // To show the layer which has appropriate position
        dom_2.setOpacity(this.layer, 1);
    };
    CheckboxEditor.prototype.beforeDestroy = function () {
        this.layer.removeEventListener('change', this.onChange);
        this.layer.removeEventListener('mouseover', this.onMouseover);
        this.layer.removeEventListener('keydown', this.onKeydown);
        dom_2.getContainerElement(this.el).removeChild(this.layer);
        this.initLayerPos = null;
        this.isMounted = false;
    };
    return CheckboxEditor;
}());
exports.CheckboxEditor = CheckboxEditor;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DatePickerEditor = void 0;
var tslib_1 = __webpack_require__(1);
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
var dom_2 = __webpack_require__(42);
//update by tangbin
var TuiDatePicker = /** @class */ (function () {
    function TuiDatePicker(container, options) {
    }
    TuiDatePicker.prototype.open = function () {
    };
    TuiDatePicker.prototype.destroy = function () {
    };
    TuiDatePicker.prototype.on = function (eventName, handler) {
    };
    return TuiDatePicker;
}());
var DatePickerEditor = /** @class */ (function () {
    function DatePickerEditor(props) {
        var _this = this;
        this.isMounted = false;
        this.initLayerPos = null;
        this.instantApplyCallback = null;
        var usageStatistics = props.grid.usageStatistics, columnInfo = props.columnInfo, instantApplyCallback = props.instantApplyCallback;
        var value = String(common_1.isNil(props.value) ? '' : props.value);
        var el = document.createElement('div');
        el.className = dom_1.cls('layer-editing-inner');
        this.el = el;
        this.inputEl = this.createInputElement();
        var datepickerInputContainer = document.createElement('div');
        datepickerInputContainer.className = dom_1.cls('datepicker-input-container');
        datepickerInputContainer.appendChild(this.inputEl);
        this.el.appendChild(datepickerInputContainer);
        var layer = this.createLayer();
        this.layer = layer;
        var options = tslib_1.__assign({ showIcon: true }, columnInfo.editor.options);
        if (options.showIcon) {
            var icon = this.createIcon();
            this.iconEl = icon;
            this.inputEl.className = dom_1.cls('datepicker-input');
            datepickerInputContainer.appendChild(icon);
        }
        var date;
        if (!options.format) {
            options.format = 'yyyy-MM-dd';
        }
        if (options.instantApply) {
            this.instantApplyCallback = instantApplyCallback;
        }
        if (common_1.isNumber(value) || common_1.isString(value)) {
            date = new Date(value);
        }
        var defaultOptions = {
            date: date,
            type: 'date',
            input: {
                element: this.inputEl,
                format: options.format,
            },
            usageStatistics: usageStatistics,
        };
        this.datePickerEl = new TuiDatePicker(layer, common_1.deepMergedCopy(defaultOptions, options));
        this.datePickerEl.on('close', function () {
            var _a;
            _this.focus();
            // eslint-disable-next-line no-unused-expressions
            (_a = _this.instantApplyCallback) === null || _a === void 0 ? void 0 : _a.call(_this);
        });
    }
    DatePickerEditor.prototype.createInputElement = function () {
        var inputEl = document.createElement('input');
        inputEl.className = dom_1.cls('content-text');
        inputEl.type = 'text';
        return inputEl;
    };
    DatePickerEditor.prototype.createLayer = function () {
        var layer = document.createElement('div');
        layer.className = dom_1.cls('editor-datepicker-layer');
        // To hide the initial layer which is having the position which is not calculated properly
        dom_2.setOpacity(layer, 0);
        return layer;
    };
    DatePickerEditor.prototype.openDatePicker = function () {
        this.datePickerEl.open();
    };
    DatePickerEditor.prototype.createIcon = function () {
        var _this = this;
        var icon = document.createElement('i');
        icon.className = dom_1.cls('date-icon');
        icon.addEventListener('click', function () { return _this.openDatePicker(); });
        return icon;
    };
    DatePickerEditor.prototype.focus = function () {
        this.inputEl.focus();
    };
    DatePickerEditor.prototype.moveDropdownLayer = function (gridRect) {
        if (this.initLayerPos) {
            dom_2.moveLayer(this.layer, this.initLayerPos, gridRect);
        }
    };
    DatePickerEditor.prototype.getElement = function () {
        return this.el;
    };
    DatePickerEditor.prototype.getValue = function () {
        return this.inputEl.value;
    };
    DatePickerEditor.prototype.mounted = function () {
        // To prevent wrong stacked z-index context, layer append to grid container
        dom_2.getContainerElement(this.el).appendChild(this.layer);
        this.inputEl.select();
        this.datePickerEl.open();
        // `this.layer.firstElementChild` is real datePicker layer(it is need to get total height)
        dom_2.setLayerPosition(this.el, this.layer, this.layer.firstElementChild, true);
        this.initLayerPos = {
            top: common_1.pixelToNumber(this.layer.style.top),
            left: common_1.pixelToNumber(this.layer.style.left),
        };
        this.isMounted = true;
        // To show the layer which has appropriate position
        dom_2.setOpacity(this.layer, 1);
    };
    DatePickerEditor.prototype.beforeDestroy = function () {
        if (this.iconEl) {
            this.iconEl.removeEventListener('click', this.openDatePicker);
        }
        this.datePickerEl.destroy();
        dom_2.getContainerElement(this.el).removeChild(this.layer);
        this.initLayerPos = null;
        this.isMounted = false;
    };
    return DatePickerEditor;
}());
exports.DatePickerEditor = DatePickerEditor;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RowHeaderInputRenderer = void 0;
var dom_1 = __webpack_require__(2);
var RowHeaderInputRenderer = /** @class */ (function () {
    function RowHeaderInputRenderer(props) {
        var el = document.createElement('div');
        var input = document.createElement('input');
        var grid = props.grid, rowKey = props.rowKey, disabled = props.disabled;
        el.className = dom_1.cls('row-header-checkbox');
        input.type = 'checkbox';
        input.name = '_checked';
        input.disabled = disabled;
        input.addEventListener('click', function (ev) {
            if (ev.shiftKey) {
                grid[input.checked ? 'checkBetween' : 'uncheckBetween'](rowKey);
                return;
            }
            grid[input.checked ? 'check' : 'uncheck'](rowKey);
        });
        el.appendChild(input);
        this.el = el;
        this.input = input;
        this.render(props);
    }
    RowHeaderInputRenderer.prototype.getElement = function () {
        return this.el;
    };
    RowHeaderInputRenderer.prototype.render = function (props) {
        var value = props.value, disabled = props.disabled;
        this.input.checked = Boolean(value);
        this.input.disabled = disabled;
    };
    return RowHeaderInputRenderer;
}());
exports.RowHeaderInputRenderer = RowHeaderInputRenderer;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RowHeaderDraggableRenderer = void 0;
var dom_1 = __webpack_require__(2);
var ROW_COUNT = 3;
var COL_COUNT = 3;
var RowHeaderDraggableRenderer = /** @class */ (function () {
    function RowHeaderDraggableRenderer() {
        var el = document.createElement('div');
        el.className = dom_1.cls('row-header-draggable');
        this.el = el;
        this.renderDraggableIcon();
    }
    RowHeaderDraggableRenderer.prototype.getElement = function () {
        return this.el;
    };
    RowHeaderDraggableRenderer.prototype.renderDraggableIcon = function () {
        for (var i = 0; i < ROW_COUNT; i += 1) {
            var wrapper = document.createElement('div');
            wrapper.style.lineHeight = '0';
            for (var j = 0; j < COL_COUNT; j += 1) {
                var square = document.createElement('span');
                wrapper.appendChild(square);
            }
            this.el.appendChild(wrapper);
        }
    };
    return RowHeaderDraggableRenderer;
}());
exports.RowHeaderDraggableRenderer = RowHeaderDraggableRenderer;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sortRawData = exports.compare = void 0;
var common_1 = __webpack_require__(0);
function compare(valueA, valueB) {
    var isBlankA = common_1.isBlank(valueA);
    var isBlankB = common_1.isBlank(valueB);
    var convertedA = common_1.convertToNumber(valueA);
    var convertedB = common_1.convertToNumber(valueB);
    if (!common_1.isNumber(convertedA) || !common_1.isNumber(convertedB)) {
        convertedA = String(valueA);
        convertedB = String(valueB);
    }
    var result = 0;
    if (isBlankA && !isBlankB) {
        result = -1;
    }
    else if (!isBlankA && isBlankB) {
        result = 1;
    }
    else if (convertedA < convertedB) {
        result = -1;
    }
    else if (convertedA > convertedB) {
        result = 1;
    }
    return result;
}
exports.compare = compare;
function getComparators(columns) {
    var comparators = [];
    columns.forEach(function (column) {
        var columnName = column.columnName, ascending = column.ascending, customComparator = column.comparator;
        var comparator = customComparator || compare;
        comparators.push({
            name: columnName,
            comparator: ascending
                ? comparator
                : function (valueA, valueB, rowA, rowB) {
                    return -comparator(valueA, valueB, rowA, rowB);
                },
        });
    });
    return comparators;
}
function sortRawData(columns) {
    var comparators = getComparators(columns);
    return function (rowA, rowB) {
        for (var _i = 0, comparators_1 = comparators; _i < comparators_1.length; _i++) {
            var _a = comparators_1[_i], columnName = _a.name, comparator = _a.comparator;
            var result = comparator(rowA[columnName], rowB[columnName], rowA, rowB);
            if (result) {
                return result;
            }
        }
        return 0;
    };
}
exports.sortRawData = sortRawData;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangedScrollPosition = void 0;
function getHorizontalScrollPosition(rightSideWidth, cellPosRect, scrollLeft, tableBorderWidth) {
    var left = cellPosRect.left, right = cellPosRect.right;
    if (left < scrollLeft) {
        return left;
    }
    if (right > scrollLeft + rightSideWidth - tableBorderWidth) {
        return right - rightSideWidth + tableBorderWidth;
    }
    return null;
}
function getVerticalScrollPosition(height, cellPosRect, scrollTop, tableBorderWidth) {
    var top = cellPosRect.top, bottom = cellPosRect.bottom;
    if (top < scrollTop) {
        return top + tableBorderWidth;
    }
    if (bottom > scrollTop + height) {
        return bottom - height + tableBorderWidth;
    }
    return null;
}
function getChangedScrollPosition(store, side, changedCellPosRect) {
    var _a = store.dimension, bodyHeight = _a.bodyHeight, scrollXHeight = _a.scrollXHeight, scrollYWidth = _a.scrollYWidth, tableBorderWidth = _a.tableBorderWidth, areaWidth = store.columnCoords.areaWidth, focusedCellPostRect = store.focus.cellPosRect, viewport = store.viewport;
    var scrollLeft = viewport.scrollLeft, scrollTop = viewport.scrollTop;
    var cellPosRect = changedCellPosRect || focusedCellPostRect;
    var changedScrollLeft = side === 'R'
        ? getHorizontalScrollPosition(areaWidth.R - scrollYWidth, cellPosRect, scrollLeft, tableBorderWidth)
        : null;
    var changedScrollTop = getVerticalScrollPosition(bodyHeight - scrollXHeight, cellPosRect, scrollTop, tableBorderWidth);
    return [changedScrollLeft, changedScrollTop];
}
exports.getChangedScrollPosition = getChangedScrollPosition;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var observable_1 = __webpack_require__(5);
var common_1 = __webpack_require__(0);
function create(_a) {
    var column = _a.column, _b = _a.width, width = _b === void 0 ? 'auto' : _b, domWidth = _a.domWidth, _c = _a.rowHeight, rowHeight = _c === void 0 ? 40 : _c, _d = _a.bodyHeight, bodyHeight = _d === void 0 ? 'auto' : _d, _e = _a.minRowHeight, minRowHeight = _e === void 0 ? 40 : _e, _f = _a.minBodyHeight, minBodyHeight = _f === void 0 ? 130 : _f, _g = _a.frozenBorderWidth, frozenBorderWidth = _g === void 0 ? 1 : _g, _h = _a.heightResizable, heightResizable = _h === void 0 ? false : _h, _j = _a.scrollX, scrollX = _j === void 0 ? true : _j, _k = _a.scrollY, scrollY = _k === void 0 ? true : _k, _l = _a.summaryHeight, summaryHeight = _l === void 0 ? 0 : _l, _m = _a.summaryPosition, summaryPosition = _m === void 0 ? 'bottom' : _m, _o = _a.headerHeight, headerHeight = _o === void 0 ? 40 : _o;
    var bodyHeightVal = typeof bodyHeight === 'number' ? bodyHeight : 0;
    return observable_1.observable({
        offsetLeft: 0,
        offsetTop: 0,
        width: width === 'auto' ? domWidth : width,
        autoWidth: width === 'auto',
        minBodyHeight: minBodyHeight,
        bodyHeight: Math.max(bodyHeightVal, minBodyHeight),
        autoHeight: bodyHeight === 'auto',
        heightResizable: heightResizable,
        fitToParentHeight: bodyHeight === 'fitToParent',
        minRowHeight: minRowHeight,
        rowHeight: common_1.isNumber(rowHeight) ? Math.max(rowHeight, minRowHeight) : minRowHeight,
        autoRowHeight: rowHeight === 'auto',
        scrollX: scrollX,
        scrollY: scrollY,
        summaryHeight: summaryHeight,
        summaryPosition: summaryPosition,
        headerHeight: headerHeight,
        scrollbarWidth: 17,
        tableBorderWidth: 1,
        cellBorderWidth: 1,
        get scrollYWidth() {
            return this.scrollY ? this.scrollbarWidth : 0;
        },
        get scrollXHeight() {
            return this.scrollX ? this.scrollbarWidth : 0;
        },
        get frozenBorderWidth() {
            var visibleColumnsBySide = column.visibleColumnsBySide;
            var visibleLeftColumnCount = visibleColumnsBySide.L.length;
            return visibleLeftColumnCount > 0 ? frozenBorderWidth : 0;
        },
        get contentsWidth() {
            var columnLen = column.visibleColumnsWithRowHeader.length;
            var totalBorderWidth = columnLen * this.cellBorderWidth;
            return this.width - this.scrollYWidth - this.frozenBorderWidth - totalBorderWidth;
        },
    });
}
exports.create = create;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var observable_1 = __webpack_require__(5);
var common_1 = __webpack_require__(0);
var rowSpan_1 = __webpack_require__(13);
var data_1 = __webpack_require__(6);
function findIndexByPosition(offsets, position) {
    var rowOffset = common_1.findIndex(function (offset) { return offset > position; }, offsets);
    return rowOffset === -1 ? offsets.length - 1 : rowOffset - 1;
}
function calculateRange(_a) {
    var scrollPos = _a.scrollPos, totalSize = _a.totalSize, offsets = _a.offsets, data = _a.data, column = _a.column, rowCalculation = _a.rowCalculation;
    // safari uses negative scroll position for bouncing effect
    scrollPos = Math.max(scrollPos, 0);
    var start = findIndexByPosition(offsets, scrollPos);
    var end = findIndexByPosition(offsets, scrollPos + totalSize) + 1;
    var filteredRawData = data.filteredRawData, sortState = data.sortState, pageRowRange = data.pageRowRange;
    var dataLength = filteredRawData.length;
    if (rowCalculation && data_1.isClientPagination(data)) {
        start = pageRowRange[0], end = pageRowRange[1];
    }
    if (dataLength && dataLength >= start && rowCalculation && rowSpan_1.isRowSpanEnabled(sortState, column)) {
        var maxRowSpanCount = rowSpan_1.getMaxRowSpanCount(start, filteredRawData);
        var topRowSpanIndex = start - maxRowSpanCount;
        return [topRowSpanIndex >= 0 ? topRowSpanIndex : 0, end];
    }
    return [start, end];
}
function getCachedRange(cachedRange, newRange) {
    if (cachedRange && common_1.arrayEqual(cachedRange, newRange)) {
        return cachedRange;
    }
    return newRange;
}
function create(_a) {
    var data = _a.data, column = _a.column, dimension = _a.dimension, rowCoords = _a.rowCoords, columnCoords = _a.columnCoords, showDummyRows = _a.showDummyRows;
    return observable_1.observable({
        scrollLeft: 0,
        scrollTop: 0,
        scrollPixelScale: 40,
        get maxScrollLeft() {
            var scrollbarWidth = dimension.scrollbarWidth, cellBorderWidth = dimension.cellBorderWidth;
            var areaWidth = columnCoords.areaWidth, widths = columnCoords.widths;
            var totalRWidth = 0;
            widths.R.forEach(function (width) {
                totalRWidth += width + cellBorderWidth;
            });
            return totalRWidth - areaWidth.R + scrollbarWidth;
        },
        get maxScrollTop() {
            var bodyHeight = dimension.bodyHeight, scrollbarWidth = dimension.scrollbarWidth;
            var totalRowHeight = rowCoords.totalRowHeight;
            return totalRowHeight - bodyHeight + scrollbarWidth;
        },
        // only for right side columns
        get colRange() {
            var range = calculateRange({
                scrollPos: this.scrollLeft,
                totalSize: columnCoords.areaWidth.R,
                offsets: columnCoords.offsets.R,
                data: data,
                column: column,
            });
            return getCachedRange(this.__storage__.colRange, range);
        },
        // only for right side columns
        get columns() {
            var _a;
            return (_a = column.visibleColumnsBySideWithRowHeader.R).slice.apply(_a, this.colRange);
        },
        get offsetLeft() {
            return columnCoords.offsets.R[this.colRange[0]];
        },
        get rowRange() {
            var range = calculateRange({
                scrollPos: this.scrollTop,
                totalSize: dimension.bodyHeight,
                offsets: rowCoords.offsets,
                data: data,
                column: column,
                rowCalculation: true,
            });
            return getCachedRange(this.__storage__.rowRange, range);
        },
        get rows() {
            var _a;
            return (_a = data.filteredViewData).slice.apply(_a, this.rowRange);
        },
        get offsetTop() {
            return rowCoords.offsets[this.rowRange[0] - data.pageRowRange[0]];
        },
        get dummyRowCount() {
            var rowHeight = dimension.rowHeight, bodyHeight = dimension.bodyHeight, scrollXHeight = dimension.scrollXHeight, cellBorderWidth = dimension.cellBorderWidth;
            var totalRowHeight = rowCoords.totalRowHeight;
            var adjustedRowHeight = rowHeight + cellBorderWidth;
            var adjustedBodyHeight = bodyHeight - scrollXHeight;
            if (showDummyRows && totalRowHeight < adjustedBodyHeight) {
                return Math.ceil((adjustedBodyHeight - totalRowHeight) / adjustedRowHeight) + 1;
            }
            return 0;
        },
    });
}
exports.create = create;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var tslib_1 = __webpack_require__(1);
var observable_1 = __webpack_require__(5);
var common_1 = __webpack_require__(0);
function distributeExtraWidthEqually(extraWidth, targetIdxes, widths) {
    var targetLen = targetIdxes.length;
    var avgValue = Math.round(extraWidth / targetLen);
    var errorValue = avgValue * targetLen - extraWidth; // to correct total width
    var result = tslib_1.__spreadArrays(widths);
    targetIdxes.forEach(function (idx) {
        result[idx] += avgValue;
    });
    if (targetLen) {
        result[targetIdxes[targetLen - 1]] -= errorValue;
    }
    return result;
}
function fillEmptyWidth(contentWidth, widths) {
    var remainTotalWidth = contentWidth - common_1.sum(widths);
    var emptyIndexes = common_1.findIndexes(function (width) { return !width; }, widths);
    return distributeExtraWidthEqually(remainTotalWidth, emptyIndexes, widths);
}
function applyMinimumWidth(minWidths, widths) {
    return widths.map(function (width, index) { return Math.max(width, minWidths[index]); });
}
function reduceExcessColumnWidthSub(totalRemainWidth, availableList, widths) {
    var avgValue = Math.round(totalRemainWidth / availableList.length);
    var newAvailableList = [];
    availableList.forEach(function (_a) {
        var index = _a[0], width = _a[1];
        // note that totalRemainWidth and avgValue are negative number.
        if (width < Math.abs(avgValue)) {
            totalRemainWidth += width;
            widths[index] -= width;
        }
        else {
            newAvailableList.push([index, width]);
        }
    });
    // call recursively until all available width are less than average
    if (availableList.length > newAvailableList.length) {
        return reduceExcessColumnWidthSub(totalRemainWidth, newAvailableList, widths);
    }
    var columnIndexes = availableList.map(function (_a) {
        var index = _a[0];
        return index;
    });
    return distributeExtraWidthEqually(totalRemainWidth, columnIndexes, widths);
}
function adjustWidths(minWidths, fixedFlags, availableWidth, fitToReducedTotal, widths) {
    var columnLength = widths.length;
    var totalExtraWidth = availableWidth - common_1.sum(widths);
    var fixedCount = fixedFlags.filter(Boolean).length;
    var fixedIndexes = common_1.findIndexes(function (v) { return !v; }, fixedFlags);
    if (totalExtraWidth > 0 && columnLength > fixedCount) {
        return distributeExtraWidthEqually(totalExtraWidth, fixedIndexes, widths);
    }
    if (fitToReducedTotal && totalExtraWidth < 0) {
        var availableWidthInfos = fixedIndexes.map(function (index) { return [index, widths[index] - minWidths[index]]; });
        return reduceExcessColumnWidthSub(totalExtraWidth, availableWidthInfos, widths);
    }
    return widths;
}
function calculateWidths(columns, cellBorderWidth, contentsWidth) {
    var baseWidths = columns.map(function (_a) {
        var baseWidth = _a.baseWidth;
        return (baseWidth ? baseWidth - cellBorderWidth : 0);
    });
    var minWidths = columns.map(function (_a) {
        var minWidth = _a.minWidth;
        return minWidth - cellBorderWidth;
    });
    var fixedFlags = common_1.mapProp('fixedWidth', columns);
    return common_1.pipe(baseWidths, fillEmptyWidth.bind(null, contentsWidth), applyMinimumWidth.bind(null, minWidths), adjustWidths.bind(null, minWidths, fixedFlags, contentsWidth, true));
}
function calculateOffsets(widths, borderWidth) {
    var offsets = [0];
    for (var i = 1, len = widths.length; i < len; i += 1) {
        offsets[i] = offsets[i - 1] + widths[i - 1] + borderWidth;
    }
    return offsets;
}
function create(_a) {
    var column = _a.column, dimension = _a.dimension;
    return observable_1.observable({
        get widths() {
            var visibleColumnsWithRowHeader = column.visibleColumnsWithRowHeader, visibleFrozenCount = column.visibleFrozenCount;
            var widths = calculateWidths(visibleColumnsWithRowHeader, dimension.cellBorderWidth, dimension.contentsWidth);
            return {
                L: widths.slice(0, visibleFrozenCount),
                R: widths.slice(visibleFrozenCount),
            };
        },
        get offsets() {
            return {
                L: calculateOffsets(this.widths.L, dimension.cellBorderWidth),
                R: calculateOffsets(this.widths.R, dimension.cellBorderWidth),
            };
        },
        get areaWidth() {
            var visibleFrozenCount = column.visibleFrozenCount;
            var width = dimension.width, frozenBorderWidth = dimension.frozenBorderWidth, cellBorderWidth = dimension.cellBorderWidth;
            var leftAreaWidth = 0;
            if (visibleFrozenCount) {
                var leftBorderWidth = (visibleFrozenCount + 1) * cellBorderWidth;
                leftAreaWidth = common_1.sum(this.widths.L) + leftBorderWidth;
            }
            return {
                L: leftAreaWidth - frozenBorderWidth,
                R: width - leftAreaWidth,
            };
        },
        get totalColumnWidth() {
            return {
                L: common_1.last(this.offsets.L) + common_1.last(this.widths.L),
                R: common_1.last(this.offsets.R) + common_1.last(this.widths.R),
            };
        },
    });
}
exports.create = create;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var observable_1 = __webpack_require__(5);
var common_1 = __webpack_require__(0);
var data_1 = __webpack_require__(6);
function create(_a) {
    var _b;
    var data = _a.data, dimension = _a.dimension;
    var rowHeight = dimension.rowHeight;
    var pageOptions = data.pageOptions, pageRowRange = data.pageRowRange;
    return observable_1.observable({
        heights: pageOptions.useClient
            ? (_b = data.filteredRawData).slice.apply(_b, pageRowRange).map(function (row) { return data_1.getRowHeight(row, rowHeight); })
            : data.filteredRawData.map(function (row) { return data_1.getRowHeight(row, rowHeight); }),
        get offsets() {
            var offsets = [0];
            var heights = this.heights;
            for (var i = 1, len = heights.length; i < len; i += 1) {
                offsets[i] = offsets[i - 1] + heights[i - 1];
            }
            return offsets;
        },
        get totalRowHeight() {
            return this.heights.length ? common_1.last(this.offsets) + common_1.last(this.heights) : 0;
        },
    });
}
exports.create = create;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var observable_1 = __webpack_require__(5);
var common_1 = __webpack_require__(0);
var rowSpan_1 = __webpack_require__(13);
var data_1 = __webpack_require__(6);
function create(_a) {
    var column = _a.column, data = _a.data, dimension = _a.dimension, rowCoords = _a.rowCoords, columnCoords = _a.columnCoords, editingEvent = _a.editingEvent, tabMode = _a.tabMode, id = _a.id;
    return observable_1.observable({
        rowKey: null,
        columnName: null,
        prevRowKey: null,
        prevColumnName: null,
        editingAddress: null,
        editingEvent: editingEvent,
        navigating: false,
        forcedDestroyEditing: false,
        tabMode: tabMode,
        get side() {
            if (this.columnName === null) {
                return null;
            }
            return common_1.someProp('name', this.columnName, column.visibleColumnsBySideWithRowHeader.R)
                ? 'R'
                : 'L';
        },
        get columnIndex() {
            var _a = this, columnName = _a.columnName, side = _a.side;
            return columnName === null || side === null
                ? null
                : common_1.findPropIndex('name', columnName, column.visibleColumnsBySideWithRowHeader[side]);
        },
        get totalColumnIndex() {
            var visibleColumnsBySideWithRowHeader = column.visibleColumnsBySideWithRowHeader;
            var _a = this, columnIndex = _a.columnIndex, side = _a.side;
            if (columnIndex === null) {
                return columnIndex;
            }
            return side === 'R' ? columnIndex + visibleColumnsBySideWithRowHeader.L.length : columnIndex;
        },
        get rowIndex() {
            var rowKey = this.rowKey;
            if (common_1.isNull(rowKey)) {
                return null;
            }
            var index = data_1.findIndexByRowKey(data, column, id, rowKey);
            return data_1.isClientPagination(data) ? index - data.pageRowRange[0] : index;
        },
        get originalRowIndex() {
            var rowIndex = this.rowIndex;
            if (common_1.isNull(rowIndex)) {
                return null;
            }
            if (data_1.isClientPagination(data)) {
                return rowIndex + data.pageRowRange[0];
            }
            return rowIndex;
        },
        get cellPosRect() {
            var _a = this, columnIndex = _a.columnIndex, rowIndex = _a.rowIndex, side = _a.side, columnName = _a.columnName, rowKey = _a.rowKey;
            var filteredRawData = data.filteredRawData, sortState = data.sortState;
            var cellBorderWidth = dimension.cellBorderWidth;
            if (columnIndex === null || rowIndex === null || side === null || columnName === null) {
                return null;
            }
            var widths = columnCoords.widths, offsets = columnCoords.offsets;
            var borderWidth = widths[side].length - 1 === columnIndex ? 0 : cellBorderWidth;
            var left = offsets[side][columnIndex];
            var right = left + widths[side][columnIndex] + borderWidth;
            var top = rowCoords.offsets[rowIndex];
            var bottom = top + rowCoords.heights[rowIndex];
            var rowSpan = rowSpan_1.getRowSpanByRowKey(rowKey, columnName, filteredRawData);
            if (rowSpan_1.isRowSpanEnabled(sortState, column) && rowSpan) {
                var verticalPos = rowSpan_1.getVerticalPosWithRowSpan(columnName, rowSpan, rowCoords, filteredRawData);
                return { left: left, right: right, top: verticalPos[0], bottom: verticalPos[1] };
            }
            return { left: left, right: right, top: top, bottom: bottom };
        },
    });
}
exports.create = create;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var tslib_1 = __webpack_require__(1);
var observable_1 = __webpack_require__(5);
var selection_1 = __webpack_require__(21);
var data_1 = __webpack_require__(6);
function getOwnSideColumnRange(columnRange, side, visibleFrozenCount) {
    var _a = columnRange.map(function (columnIdx) { return columnIdx; }), start = _a[0], end = _a[1];
    if (side === 'L' && start < visibleFrozenCount) {
        return [start, Math.min(end, visibleFrozenCount - 1)];
    }
    if (side === 'R' && end >= visibleFrozenCount) {
        return [Math.max(start, visibleFrozenCount) - visibleFrozenCount, end - visibleFrozenCount];
    }
    return null;
}
function getVerticalStyles(rowRange, rowOffsets, rowHeights, cellBorderWidth) {
    var top = rowOffsets[rowRange[0]];
    var bottom = rowOffsets[rowRange[1]] + rowHeights[rowRange[1]];
    return { top: top, height: bottom - top - cellBorderWidth };
}
function getHorizontalStyles(columnRange, columnWidths, side, cellBorderWidth) {
    var left = 0;
    var width = 0;
    if (!columnRange) {
        return { left: left, width: width };
    }
    var widths = columnWidths[side];
    var startIndex = columnRange[0];
    var endIndex = Math.min(columnRange[1], widths.length - 1);
    for (var i = 0; i <= endIndex; i += 1) {
        if (i < startIndex) {
            left += widths[i] + cellBorderWidth;
        }
        else {
            width += widths[i] + cellBorderWidth;
        }
    }
    width -= cellBorderWidth;
    if (side === 'R' && endIndex === widths.length - 1) {
        width -= cellBorderWidth;
    }
    return { left: left, width: width };
}
function create(_a) {
    var selectionUnit = _a.selectionUnit, rowCoords = _a.rowCoords, columnCoords = _a.columnCoords, columnInfo = _a.column, dimension = _a.dimension, data = _a.data;
    return observable_1.observable({
        inputRange: null,
        unit: selectionUnit,
        type: 'cell',
        intervalIdForAutoScroll: null,
        get range() {
            if (!this.inputRange) {
                return null;
            }
            var columnWidths = columnCoords.widths;
            var row = selection_1.getSortedRange(this.inputRange.row);
            var column = selection_1.getSortedRange(this.inputRange.column);
            if (this.unit === 'row') {
                var endColumnIndex = columnWidths.L.length + columnWidths.R.length - 1;
                column = [0, endColumnIndex];
            }
            return { row: row, column: column };
        },
        get rangeBySide() {
            if (!this.range) {
                return null;
            }
            var visibleFrozenCount = columnInfo.visibleFrozenCount;
            var _a = this.range, column = _a.column, row = _a.row;
            return {
                L: { row: row, column: getOwnSideColumnRange(column, 'L', visibleFrozenCount) },
                R: { row: row, column: getOwnSideColumnRange(column, 'R', visibleFrozenCount) },
            };
        },
        get rangeAreaInfo() {
            if (!this.rangeBySide) {
                return null;
            }
            var cellBorderWidth = dimension.cellBorderWidth;
            var rowOffsets = rowCoords.offsets, rowHeights = rowCoords.heights;
            var columnWidths = columnCoords.widths;
            var _a = this.rangeBySide, leftRange = _a.L, rightRange = _a.R;
            var leftSideStyles = null;
            var rightSideStyles = null;
            //update by tangbin
            if (!this.range) {
                return null;
            }
            var _b = this.range, column = _b.column, row = _b.row;
            var background = "";
            if (column[0] == column[1] && row[0] == row[1]) {
                background = "white";
            }
            if (leftRange.column) {
                leftSideStyles = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, getVerticalStyles(leftRange.row, rowOffsets, rowHeights, cellBorderWidth)), getHorizontalStyles(leftRange.column, columnWidths, 'L', cellBorderWidth)), { background: background });
            }
            if (rightRange.column) {
                rightSideStyles = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, getVerticalStyles(rightRange.row, rowOffsets, rowHeights, cellBorderWidth)), getHorizontalStyles(rightRange.column, columnWidths, 'R', cellBorderWidth)), { background: background });
            }
            return {
                L: leftSideStyles,
                R: rightSideStyles,
            };
        },
        get rangeWithRowHeader() {
            if (!this.range) {
                return null;
            }
            var rowHeaderCount = columnInfo.rowHeaderCount;
            var _a = this.range, row = _a.row, column = _a.column;
            var columnStartIndex = Math.max(column[0] - rowHeaderCount, 0);
            var columnEndIndex = Math.max(column[1] - rowHeaderCount, 0);
            return {
                row: row,
                column: [columnStartIndex, columnEndIndex],
            };
        },
        get originalRange() {
            if (!this.range) {
                return null;
            }
            var pageOptions = data.pageOptions;
            var _a = this.range, row = _a.row, column = _a.column;
            if (data_1.isClientPagination(data)) {
                var perPage = pageOptions.perPage, page = pageOptions.page;
                var prevPageRowCount = perPage * (page - 1);
                return {
                    row: [row[0] + prevPageRowCount, row[1] + prevPageRowCount],
                    column: column,
                };
            }
            return this.range;
        },
    });
}
exports.create = create;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var observable_1 = __webpack_require__(5);
function create() {
    return observable_1.observable({ hoveredRowKey: null, cellHeightMap: {} });
}
exports.create = create;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var observable_1 = __webpack_require__(5);
function create() {
    return observable_1.observable({ activeColumnAddress: null, activeFilterState: null });
}
exports.create = create;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var observable_1 = __webpack_require__(5);
var i18n_1 = tslib_1.__importDefault(__webpack_require__(18));
function createDefaultContextMenu() {
    return [
        [
            {
                name: 'copy',
                label: i18n_1.default.get('contextMenu.copy'),
                action: 'copy',
            },
            {
                name: 'copyColumns',
                label: i18n_1.default.get('contextMenu.copyColumns'),
                action: 'copyColumns',
            },
            {
                name: 'copyRows',
                label: i18n_1.default.get('contextMenu.copyRows'),
                action: 'copyRows',
            },
        ],
    ];
}
function create(_a) {
    var createMenuGroups = _a.createMenuGroups;
    return observable_1.observable({
        posInfo: null,
        createMenuGroups: common_1.isNull(createMenuGroups)
            ? null
            : createMenuGroups || createDefaultContextMenu,
        get flattenTopMenuItems() {
            var _a;
            if (!this.posInfo) {
                return [];
            }
            var _b = this.posInfo, rowKey = _b.rowKey, columnName = _b.columnName;
            var menuGroups = (_a = this.createMenuGroups) === null || _a === void 0 ? void 0 : _a.call(this, { rowKey: rowKey, columnName: columnName });
            return menuGroups === null || menuGroups === void 0 ? void 0 : menuGroups.reduce(function (acc, group, groupIndex) {
                var menuItems = [];
                group.forEach(function (menuItem, itemIndex) {
                    menuItems.push(menuItem);
                    if (groupIndex < menuGroups.length - 1 && itemIndex === group.length - 1) {
                        menuItems.push({ name: 'separator' });
                    }
                });
                return acc.concat(menuItems);
            }, []);
        },
    });
}
exports.create = create;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Root = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var container_1 = __webpack_require__(84);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var eventBus_1 = __webpack_require__(7);
var Root = /** @class */ (function (_super) {
    tslib_1.__extends(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Root.prototype.getChildContext = function () {
        return {
            store: this.props.store,
            dispatch: this.props.dispatch,
        };
    };
    Root.prototype.componentDidMount = function () {
        var eventBus = eventBus_1.getEventBus(this.props.store.id);
        var gridEvent = new gridEvent_1.default();
        setTimeout(function () {
            /**
             * Occurs when the grid is mounted on DOM
             * @event Grid#onGridMounted
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('onGridMounted', gridEvent);
        });
    };
    Root.prototype.componentWillUnmount = function () {
        var eventBus = eventBus_1.getEventBus(this.props.store.id);
        var gridEvent = new gridEvent_1.default();
        /**
         * Occurs before the grid is detached from DOM
         * @event Grid#onGridBeforeDestroy
         * @property {Grid} instance - Current grid instance
         */
        eventBus.trigger('onGridBeforeDestroy', gridEvent);
    };
    Root.prototype.render = function () {
        return preact_1.h(container_1.Container, { rootElement: this.props.rootElement });
    };
    return Root;
}(preact_1.Component));
exports.Root = Root;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = exports.ContainerComp = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var leftSide_1 = __webpack_require__(85);
var rightSide_1 = __webpack_require__(103);
var stateLayer_1 = __webpack_require__(104);
var filterLayer_1 = __webpack_require__(105);
var contextMenu_1 = __webpack_require__(54);
var heightResizeHandle_1 = __webpack_require__(112);
var clipboard_1 = __webpack_require__(113);
var pagination_1 = __webpack_require__(114);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var eventBus_1 = __webpack_require__(7);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var browser_1 = __webpack_require__(39);
var common_1 = __webpack_require__(0);
var keyboard_1 = __webpack_require__(22);
var mouse_1 = __webpack_require__(116);
var bodyArea_1 = __webpack_require__(28);
var DOUBLE_TAP_DURATION = 200;
var TAP_THRESHOLD = 10;
var ContainerComp = /** @class */ (function (_super) {
    tslib_1.__extends(ContainerComp, _super);
    function ContainerComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.touchEvent = {
            start: false,
            move: false,
            eventInfo: {
                pageX: -1,
                pageY: -1,
                timestamp: 0,
            },
        };
        _this.handleTouchStart = function () {
            if (!_this.el || !browser_1.isMobile()) {
                return;
            }
            _this.touchEvent.start = true;
        };
        _this.handleTouchMove = function () {
            if (!_this.el || !browser_1.isMobile() || !_this.touchEvent.start) {
                return;
            }
            _this.touchEvent.move = true;
        };
        _this.getCellRowKey = function (elem) {
            var address = dom_1.getCellAddress(elem);
            if (address) {
                return address.rowKey;
            }
            return null;
        };
        _this.handleTouchEnd = function (event) {
            if (!_this.el || !browser_1.isMobile()) {
                return;
            }
            var timeStamp = event.timeStamp;
            var _a = event.changedTouches[0], pageX = _a.pageX, pageY = _a.pageY;
            var _b = _this.touchEvent, eventInfo = _b.eventInfo, start = _b.start, move = _b.move;
            if (start && !move) {
                var prevPageX = eventInfo.pageX, prevPageY = eventInfo.pageY, prevTimestamp = eventInfo.timestamp;
                if (timeStamp - prevTimestamp <= DOUBLE_TAP_DURATION) {
                    if (Math.abs(prevPageX - pageX) <= TAP_THRESHOLD &&
                        Math.abs(prevPageY - pageY) <= TAP_THRESHOLD) {
                        _this.startEditing(event.target);
                    }
                }
                else {
                    eventInfo.pageX = pageX;
                    eventInfo.pageY = pageY;
                    eventInfo.timestamp = timeStamp;
                }
            }
            _this.touchEvent.start = false;
            _this.touchEvent.move = false;
        };
        _this.handleMouseover = function (event) {
            var _a = _this.props, eventBus = _a.eventBus, dispatch = _a.dispatch, renderState = _a.renderState;
            var hoveredRowKey = renderState.hoveredRowKey;
            var gridEvent = new gridEvent_1.default({ event: event });
            var rowKey = _this.getCellRowKey(event.target);
            if (!common_1.isNull(rowKey)) {
                if (hoveredRowKey !== rowKey) {
                    dispatch('setHoveredRowKey', rowKey);
                }
            }
            /**
             * Occurs when a mouse pointer is moved onto the Grid.
             * The properties of the event object include the native MouseEvent object.
             * @event Grid#mouseover
             * @property {Event} nativeEvent - Event object
             * @property {string} targetType - Type of event target
             * @property {number} rowKey - rowKey of the target cell
             * @property {string} columnName - columnName of the target cell
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('mouseover', gridEvent);
        };
        _this.handleClick = function (event) {
            var _a = _this.props, eventBus = _a.eventBus, editingEvent = _a.editingEvent;
            var gridEvent = new gridEvent_1.default({ event: event });
            /**
             * Occurs when a mouse button is clicked on the Grid.
             * The properties of the event object include the native event object.
             * @event Grid#click
             * @property {Event} nativeEvent - Event object
             * @property {string} targetType - Type of event target
             * @property {number} rowKey - rowKey of the target cell
             * @property {string} columnName - columnName of the target cell
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('click', gridEvent);
            if (!gridEvent.isStopped() && editingEvent === 'click') {
                _this.startEditing(event.target);
            }
        };
        _this.handleMouseout = function (event) {
            var _a = _this.props, eventBus = _a.eventBus, dispatch = _a.dispatch, renderState = _a.renderState;
            var hoveredRowKey = renderState.hoveredRowKey;
            var gridEvent = new gridEvent_1.default({ event: event });
            if (!common_1.isNull(hoveredRowKey)) {
                dispatch('setHoveredRowKey', null);
            }
            /**
             * Occurs when a mouse pointer is moved off from the Grid.
             * The event object has all properties copied from the native MouseEvent.
             * @event Grid#mouseout
             * @property {Event} nativeEvent - Event object
             * @property {string} targetType - Type of event target
             * @property {number | string} rowKey - rowKey of the target cell
             * @property {string} columnName - columnName of the target cell
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('mouseout', gridEvent);
        };
        _this.handleMouseDown = function (event) {
            if (!_this.el) {
                return;
            }
            var _a = _this.props, dispatch = _a.dispatch, editing = _a.editing, eventBus = _a.eventBus, filtering = _a.filtering;
            var el = _this.el;
            var gridEvent = new gridEvent_1.default({ event: event });
            /**
             * Occurs when a mouse button is downed on the Grid.
             * The event object has all properties copied from the native MouseEvent.
             * @event Grid#mousedown
             * @property {Event} nativeEvent - Event object
             * @property {string} targetType - Type of event target
             * @property {number | string} rowKey - rowKey of the target cell
             * @property {string} columnName - columnName of the target cell
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('mousedown', gridEvent);
            if (!gridEvent.isStopped()) {
                dispatch('setNavigating', true);
                if (!editing && !filtering) {
                    event.preventDefault();
                }
                var _b = el.getBoundingClientRect(), top = _b.top, left = _b.left;
                dispatch('setOffsetTop', top + el.scrollTop);
                dispatch('setOffsetLeft', left + el.scrollLeft);
            }
        };
        _this.handleDblClick = function (event) {
            if (!_this.el || browser_1.isMobile()) {
                return;
            }
            var _a = _this.props, eventBus = _a.eventBus, editingEvent = _a.editingEvent;
            var gridEvent = new gridEvent_1.default({ event: event });
            /**
             * Occurs when a mouse button is double clicked on the Grid.
             * The properties of the event object include the native event object.
             * @event Grid#dblclick
             * @property {Event} nativeEvent - Event object
             * @property {string} targetType - Type of event target
             * @property {number} rowKey - rowKey of the target cell
             * @property {string} columnName - columnName of the target cell
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('dblclick', gridEvent);
            if (!gridEvent.isStopped() && editingEvent === 'dblclick') {
                _this.startEditing(event.target);
            }
        };
        _this.handleDocumentKeyDown = function (ev) {
            var keyName = keyboard_1.keyNameMap[ev.keyCode];
            if (keyName === 'esc') {
                _this.props.dispatch('setActiveColumnAddress', null);
                _this.props.dispatch('hideContextMenu');
            }
        };
        _this.handleDocumentMouseDown = function (ev) {
            var _a = _this.props, dispatch = _a.dispatch, filtering = _a.filtering;
            var target = ev.target;
            if (filtering &&
                !dom_1.findParentByClassName(target, 'btn-filter') &&
                !dom_1.findParentByClassName(target, 'filter-container') && // @ts-ignore
                !dom_1.findParentByClassName(target, 'filter')) {
                dispatch('setActiveColumnAddress', null);
            }
            if (!dom_1.findParentByClassName(target, 'context-menu')) {
                _this.props.dispatch('hideContextMenu');
            }
        };
        _this.syncWithDOMWidth = function () {
            if (!_this.el || !_this.props.rootElement) {
                return;
            }
            _this.props.dispatch('refreshLayout', _this.el, _this.props.rootElement.parentElement);
        };
        _this.handleContextMenu = function (ev) {
            if (dom_1.isParentExistWithClassNames(ev.target, [
                'cell-header',
                'cell-dummy',
                'context-menu',
            ]) ||
                !_this.context.store.contextMenu.createMenuGroups) {
                mouse_1.emitMouseup(_this.el);
                return;
            }
            var bodyArea = dom_1.findParentByClassName(ev.target, 'body-area'); // xd
            if (!bodyArea) {
                return;
            }
            ev.preventDefault();
            var _a = _this.props, offsetLeft = _a.offsetLeft, offsetTop = _a.offsetTop;
            var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
            var _b = dom_1.getCoordinateWithOffset(ev.pageX, ev.pageY), pageX = _b[0], pageY = _b[1];
            var side = dom_1.findParentByClassName(bodyArea, 'lside-area') ? 'L' : 'R';
            var scrollTop = bodyArea.scrollTop, scrollLeft = bodyArea.scrollLeft;
            var _c = bodyArea.getBoundingClientRect(), top = _c.top, left = _c.left;
            //update by tangbin
            pageX = bodyArea_1.toBodyZoom(pageX);
            pageY = bodyArea_1.toBodyZoom(pageY);
            var pos = {
                top: bodyArea_1.toBodyZoom(ev.clientY) - offsetTop,
                left: bodyArea_1.toBodyZoom(ev.clientX) - offsetLeft,
                bottom: bodyArea_1.toBodyZoom(innerHeight) - pageY,
                right: bodyArea_1.toBodyZoom(innerWidth) - pageX,
            };
            var elementInfo = { scrollTop: scrollTop, scrollLeft: scrollLeft, side: side, top: top, left: left };
            var eventInfo = { pageX: pageX, pageY: pageY };
            _this.props.dispatch('showContextMenu', pos, elementInfo, eventInfo);
        };
        return _this;
    }
    ContainerComp.prototype.startEditing = function (eventTarget) {
        var _a = this.props, dispatch = _a.dispatch, focusedRowKey = _a.focusedRowKey, focusedColumnName = _a.focusedColumnName;
        var address = dom_1.getCellAddress(eventTarget);
        if (address) {
            var rowKey = address.rowKey, columnName = address.columnName;
            if (focusedRowKey === rowKey && focusedColumnName === columnName) {
                dispatch('startEditing', rowKey, columnName);
            }
        }
    };
    ContainerComp.prototype.componentDidMount = function () {
        if (this.props.autoWidth) {
            window.addEventListener('resize', this.syncWithDOMWidth);
            // In Preact, the componentDidMount is called before the DOM elements are actually mounted.
            // https://github.com/preactjs/preact/issues/648
            // Use setTimeout to wait until the DOM element is actually mounted
            window.setTimeout(this.syncWithDOMWidth, 0);
        }
        document.addEventListener('mousedown', this.handleDocumentMouseDown);
        document.addEventListener('keydown', this.handleDocumentKeyDown);
    };
    ContainerComp.prototype.componentWillUnmount = function () {
        if (this.props.autoWidth) {
            window.removeEventListener('resize', this.syncWithDOMWidth);
        }
    };
    ContainerComp.prototype.shouldComponentUpdate = function (nextProps) {
        if (this.props.autoWidth && nextProps.autoWidth) {
            return false;
        }
        return true;
    };
    ContainerComp.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, summaryHeight = _b.summaryHeight, summaryPosition = _b.summaryPosition, heightResizable = _b.heightResizable, gridId = _b.gridId, width = _b.width, autoWidth = _b.autoWidth, scrollXHeight = _b.scrollXHeight, showLeftSide = _b.showLeftSide, scrollX = _b.scrollX, scrollY = _b.scrollY, pageOptions = _b.pageOptions;
        var style = { width: autoWidth ? '100%' : width };
        var attrs = (_a = {}, _a[dom_1.dataAttr.GRID_ID] = gridId, _a);
        return (preact_1.h("div", tslib_1.__assign({}, attrs, { style: style, class: dom_1.cls('container', [showLeftSide, 'show-lside-area']), onMouseDown: this.handleMouseDown, onDblClick: this.handleDblClick, onClick: this.handleClick, onMouseOut: this.handleMouseout, onMouseOver: this.handleMouseover, onTouchStart: this.handleTouchStart, onTouchMove: this.handleTouchMove, onTouchEnd: this.handleTouchEnd, onContextMenu: this.handleContextMenu, ref: function (el) {
                _this.el = el;
            } }),
            pageOptions.position === 'top' && preact_1.h(pagination_1.Pagination, null),
            preact_1.h("div", { class: dom_1.cls('content-area', [!!summaryHeight, summaryPosition === 'top' ? 'has-summary-top' : 'has-summary-bottom'], [!scrollX, 'no-scroll-x'], [!scrollY, 'no-scroll-y']) },
                preact_1.h(leftSide_1.LeftSide, null),
                preact_1.h(rightSide_1.RightSide, null),
                preact_1.h("div", { class: dom_1.cls('border-line', 'border-line-top') }),
                preact_1.h("div", { class: dom_1.cls('border-line', 'border-line-left') }),
                preact_1.h("div", { class: dom_1.cls('border-line', 'border-line-right') }),
                preact_1.h("div", { class: dom_1.cls('border-line', 'border-line-bottom'), style: { bottom: scrollXHeight } })),
            heightResizable && preact_1.h(heightResizeHandle_1.HeightResizeHandle, null),
            preact_1.h(stateLayer_1.StateLayer, null),
            preact_1.h(clipboard_1.Clipboard, null),
            pageOptions.position === 'bottom' && preact_1.h(pagination_1.Pagination, null),
            preact_1.h(filterLayer_1.FilterLayer, null),
            preact_1.h(contextMenu_1.ContextMenu, null)));
    };
    return ContainerComp;
}(preact_1.Component));
exports.ContainerComp = ContainerComp;
exports.Container = hoc_1.connect(function (_a) {
    var id = _a.id, dimension = _a.dimension, focus = _a.focus, columnCoords = _a.columnCoords, data = _a.data, filterLayerState = _a.filterLayerState, renderState = _a.renderState;
    return ({
        gridId: id,
        width: dimension.width,
        autoWidth: dimension.autoWidth,
        editing: !!focus.editingAddress,
        filtering: !!filterLayerState.activeColumnAddress,
        scrollXHeight: dimension.scrollX ? dimension.scrollbarWidth : 0,
        fitToParentHeight: dimension.fitToParentHeight,
        summaryHeight: dimension.summaryHeight,
        summaryPosition: dimension.summaryPosition,
        heightResizable: dimension.heightResizable,
        showLeftSide: !!columnCoords.areaWidth.L,
        editingEvent: focus.editingEvent,
        viewData: data.viewData,
        pageOptions: data.pageOptions,
        eventBus: eventBus_1.getEventBus(id),
        scrollX: dimension.scrollX,
        scrollY: dimension.scrollY,
        renderState: renderState,
        focusedRowKey: focus.rowKey,
        focusedColumnName: focus.columnName,
        offsetLeft: dimension.offsetLeft,
        offsetTop: dimension.offsetTop,
    });
})(ContainerComp);


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LeftSide = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var headerArea_1 = __webpack_require__(50);
var bodyArea_1 = __webpack_require__(28);
var summaryArea_1 = __webpack_require__(53);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var LeftSideComp = /** @class */ (function (_super) {
    tslib_1.__extends(LeftSideComp, _super);
    function LeftSideComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LeftSideComp.prototype.render = function (_a) {
        var width = _a.width, scrollX = _a.scrollX;
        var style = { width: width, display: 'block' };
        var summaryPosition = this.props.summaryPosition;
        return (preact_1.h("div", { class: dom_1.cls('lside-area'), style: style },
            preact_1.h(headerArea_1.HeaderArea, { side: "L" }),
            summaryPosition === 'top' && preact_1.h(summaryArea_1.SummaryArea, { side: "L" }),
            preact_1.h(bodyArea_1.BodyArea, { side: "L" }),
            summaryPosition === 'bottom' && preact_1.h(summaryArea_1.SummaryArea, { side: "L" }),
            scrollX && preact_1.h("div", { class: dom_1.cls('scrollbar-left-bottom') })));
    };
    return LeftSideComp;
}(preact_1.Component));
exports.LeftSide = hoc_1.connect(function (_a) {
    var columnCoords = _a.columnCoords, dimension = _a.dimension;
    return ({
        width: columnCoords.areaWidth.L,
        scrollX: dimension.scrollX,
        summaryPosition: dimension.summaryPosition,
    });
})(LeftSideComp);


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnResizer = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var common_1 = __webpack_require__(0);
var column_1 = __webpack_require__(12);
var WIDTH = 7;
var HALF_WIDTH = 3;
var ColumnResizerComp = /** @class */ (function (_super) {
    tslib_1.__extends(ColumnResizerComp, _super);
    function ColumnResizerComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dragStartX = -1;
        _this.draggingRange = [-1, -1];
        _this.draggingWidths = [];
        _this.handleMouseDown = function (ev, name) {
            var range = _this.getComplexHeaderRange(name);
            _this.draggingRange = range;
            _this.dragStartX = ev.pageX;
            _this.draggingWidths = _this.props.widths.slice(range[0], range[1] + 1);
            dom_1.setCursorStyle('col-resize');
            document.addEventListener('mousemove', _this.handleMouseMove);
            document.addEventListener('mouseup', _this.clearDocumentEvents);
            document.addEventListener('selectstart', _this.handleSelectStart);
        };
        _this.handleSelectStart = function (ev) {
            ev.preventDefault();
        };
        _this.handleMouseMove = function (ev) {
            var _a = _this.props, side = _a.side, dispatch = _a.dispatch;
            var resizeAmount = ev.pageX - _this.dragStartX;
            dispatch('setColumnWidth', side, _this.draggingRange, resizeAmount, _this.draggingWidths);
        };
        _this.clearDocumentEvents = function () {
            dom_1.setCursorStyle('');
            document.removeEventListener('mousemove', _this.handleMouseMove);
            document.removeEventListener('mouseup', _this.clearDocumentEvents);
            document.removeEventListener('selectstart', _this.handleSelectStart);
        };
        return _this;
    }
    ColumnResizerComp.prototype.componentWillUnmount = function () {
        this.clearDocumentEvents();
    };
    ColumnResizerComp.prototype.renderHandle = function (info, index) {
        var _a;
        var _this = this;
        var name = info.name, height = info.height, offsetX = info.offsetX, offsetY = info.offsetY, width = info.width, header = info.header;
        var attrs = (_a = {},
            _a[dom_1.dataAttr.COLUMN_INDEX] = index,
            _a[dom_1.dataAttr.COLUMN_NAME] = name,
            _a);
        return (preact_1.h("div", tslib_1.__assign({ class: dom_1.cls('column-resize-handle'), title: header }, attrs, { style: {
                height: height,
                width: WIDTH,
                left: offsetX + width - HALF_WIDTH,
                bottom: offsetY,
            }, onMouseDown: function (ev) { return _this.handleMouseDown(ev, name); } })));
    };
    ColumnResizerComp.prototype.isHideChildColumns = function (name) {
        return common_1.some(function (item) { return common_1.includes(item.childNames, name) && !!item.hideChildHeaders; }, this.props.complexColumns);
    };
    ColumnResizerComp.prototype.findComplexColumnStartIndex = function (name) {
        var _a = this.props, columns = _a.columns, complexColumns = _a.complexColumns, allColumnMap = _a.allColumnMap;
        var idx = common_1.findPropIndex('name', name, columns);
        if (idx === -1 && !allColumnMap[name].hidden) {
            var complexColumn = common_1.findProp('name', name, complexColumns);
            return this.findComplexColumnStartIndex(complexColumn.childNames[0]);
        }
        return idx;
    };
    ColumnResizerComp.prototype.findComplexColumnEndIndex = function (name) {
        var _a = this.props, columns = _a.columns, complexColumns = _a.complexColumns, allColumnMap = _a.allColumnMap;
        var idx = common_1.findPropIndex('name', name, columns);
        if (idx === -1 && !allColumnMap[name].hidden) {
            var childNames = common_1.findProp('name', name, complexColumns).childNames;
            return this.findComplexColumnEndIndex(childNames[childNames.length - 1]);
        }
        return idx;
    };
    ColumnResizerComp.prototype.getComplexHeaderRange = function (name) {
        var _this = this;
        var _a = this.props, columns = _a.columns, complexColumns = _a.complexColumns;
        var index = common_1.findPropIndex('name', name, columns);
        if (index === -1) {
            var startIndex_1 = Number.MAX_VALUE;
            var endIndex_1 = Number.MIN_VALUE;
            var childNames = common_1.findProp('name', name, complexColumns).childNames;
            childNames.forEach(function (childName) {
                startIndex_1 = Math.min(startIndex_1, _this.findComplexColumnStartIndex(childName));
                endIndex_1 = Math.max(startIndex_1, _this.findComplexColumnEndIndex(childName));
            });
            return [startIndex_1, endIndex_1];
        }
        return [index, index];
    };
    ColumnResizerComp.prototype.getResizerCoords = function (name) {
        var _a = this.props, offsets = _a.offsets, widths = _a.widths, columns = _a.columns, cellBorderWidth = _a.cellBorderWidth, complexColumns = _a.complexColumns;
        var _b = this.getComplexHeaderRange(name), startIndex = _b[0], endIndex = _b[1];
        var count = column_1.getChildHeaderCount(columns, complexColumns, name);
        var cellBorder = count ? count * cellBorderWidth : cellBorderWidth;
        return {
            width: common_1.sum(widths.slice(startIndex, endIndex + 1)),
            offsetX: offsets[startIndex] + cellBorder,
        };
    };
    ColumnResizerComp.prototype.getResizableColumnsInfo = function () {
        var _this = this;
        var _a = this.props, columns = _a.columns, complexColumns = _a.complexColumns, headerHeight = _a.headerHeight;
        var hierarchies = column_1.getComplexColumnsHierarchy(columns, complexColumns);
        var maxLen = column_1.getHierarchyMaxRowCount(hierarchies);
        var defaultHeight = headerHeight / maxLen;
        var nameMap = {};
        var resizerInfo = [];
        hierarchies.forEach(function (cols) {
            var len = cols.length;
            var offsetY = headerHeight;
            cols.forEach(function (col, idx) {
                var resizable = col.resizable, name = col.name, header = col.header;
                var height = idx === len - 1 ? defaultHeight * (maxLen - len + 1) : defaultHeight;
                offsetY -= height;
                if (resizable && !_this.isHideChildColumns(name) && !nameMap[name]) {
                    resizerInfo.push(tslib_1.__assign({ name: name,
                        header: header,
                        height: height,
                        offsetY: offsetY }, _this.getResizerCoords(name)));
                    nameMap[name] = true;
                }
            });
        });
        return resizerInfo;
    };
    ColumnResizerComp.prototype.render = function () {
        var _this = this;
        return (preact_1.h("div", { class: dom_1.cls('column-resize-container'), style: "display: block; margin-top: -35px; height: 35px;" }, this.getResizableColumnsInfo().map(function (info, index) { return _this.renderHandle(info, index); })));
    };
    return ColumnResizerComp;
}(preact_1.Component));
exports.ColumnResizer = hoc_1.connect(function (_a, _b) {
    var column = _a.column, columnCoords = _a.columnCoords, dimension = _a.dimension;
    var side = _b.side;
    return ({
        widths: columnCoords.widths[side],
        offsets: columnCoords.offsets[side],
        headerHeight: dimension.headerHeight,
        cellBorderWidth: dimension.cellBorderWidth,
        columns: column.visibleColumnsBySideWithRowHeader[side],
        complexColumns: column.complexColumnHeaders,
        allColumnMap: column.allColumnMap,
    });
})(ColumnResizerComp);


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexHeader = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var selection_1 = __webpack_require__(21);
var columnHeader_1 = __webpack_require__(51);
var column_1 = __webpack_require__(12);
var ComplexHeaderComp = /** @class */ (function (_super) {
    tslib_1.__extends(ComplexHeaderComp, _super);
    function ComplexHeaderComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComplexHeaderComp.prototype.isSelected = function (name) {
        var _a = this.props, focus = _a.focus, columnSelectionRange = _a.columnSelectionRange, columns = _a.columns, complexColumnHeaders = _a.complexColumnHeaders;
        if (focus.columnName == name) {
            return true;
        }
        if (!columnSelectionRange) {
            return false;
        }
        var selectionStart = columnSelectionRange[0], selectionEnd = columnSelectionRange[1];
        var _b = selection_1.getChildColumnRange(columns, complexColumnHeaders, name), columnStart = _b[0], columnEnd = _b[1];
        return (columnStart >= selectionStart &&
            columnStart <= selectionEnd &&
            columnEnd >= selectionStart &&
            columnEnd <= selectionEnd);
    };
    ComplexHeaderComp.prototype.createTableHeaderComponent = function (column, height, colspan, rowspan) {
        var name = column.name;
        return (preact_1.h(columnHeader_1.ColumnHeader, { key: name, height: height, colspan: colspan, rowspan: rowspan, columnInfo: column, selected: this.isSelected(name), grid: this.props.grid }));
    };
    ComplexHeaderComp.prototype.render = function () {
        var _this = this;
        var _a = this.props, columns = _a.columns, headerHeight = _a.headerHeight, cellBorderWidth = _a.cellBorderWidth, complexColumnHeaders = _a.complexColumnHeaders;
        var hierarchies = column_1.getComplexColumnsHierarchy(columns, complexColumnHeaders);
        var maxRowCount = column_1.getHierarchyMaxRowCount(hierarchies);
        var rows = new Array(maxRowCount);
        var columnNames = new Array(maxRowCount);
        var colspans = [];
        var rowHeight = (maxRowCount ? Math.floor((headerHeight - 1) / maxRowCount) : 0) - 1;
        var rowspan = 1;
        var height;
        hierarchies.forEach(function (hierarchy, i) {
            var length = hierarchies[i].length;
            var curHeight = 0;
            hierarchy.forEach(function (column, j) {
                var columnName = column.name;
                rowspan = length - 1 === j && maxRowCount - length + 1 > 1 ? maxRowCount - length + 1 : 1;
                height = rowHeight * rowspan;
                if (j === length - 1) {
                    height = headerHeight - curHeight - cellBorderWidth;
                }
                else {
                    curHeight += height + cellBorderWidth;
                }
                if (columnNames[j] === columnName) {
                    rows[j].pop();
                    colspans[j] += 1;
                }
                else {
                    colspans[j] = 1;
                }
                columnNames[j] = columnName;
                rows[j] = rows[j] || [];
                rows[j].push(_this.createTableHeaderComponent(column, height + cellBorderWidth, colspans[j], rowspan));
            });
        });
        return (preact_1.h("tbody", null, rows.map(function (row, index) { return (preact_1.h("tr", { key: "complex-header-" + index }, row)); })));
    };
    return ComplexHeaderComp;
}(preact_1.Component));
exports.ComplexHeader = hoc_1.connect(function (store, _a) {
    var side = _a.side;
    var _b = store.column, rowHeaderCount = _b.rowHeaderCount, visibleColumnsBySideWithRowHeader = _b.visibleColumnsBySideWithRowHeader, complexColumnHeaders = _b.complexColumnHeaders, _c = store.dimension, headerHeight = _c.headerHeight, cellBorderWidth = _c.cellBorderWidth, rangeBySide = store.selection.rangeBySide, focus = store.focus;
    return {
        focus: focus,
        headerHeight: headerHeight,
        cellBorderWidth: cellBorderWidth,
        columns: visibleColumnsBySideWithRowHeader[side],
        complexColumnHeaders: complexColumnHeaders,
        columnSelectionRange: rangeBySide && rangeBySide[side].column ? rangeBySide[side].column : null,
        rowHeaderCount: rowHeaderCount,
    };
})(ComplexHeaderComp);


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderCheckbox = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var HeaderCheckboxComp = /** @class */ (function (_super) {
    tslib_1.__extends(HeaderCheckboxComp, _super);
    function HeaderCheckboxComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleChange = function (ev) {
            var target = ev.target;
            var dispatch = _this.props.dispatch;
            if (target.checked) {
                dispatch('checkAll', false);
            }
            else {
                dispatch('uncheckAll', false);
            }
        };
        return _this;
    }
    HeaderCheckboxComp.prototype.componentDidMount = function () {
        this.setCheckboxState();
    };
    HeaderCheckboxComp.prototype.componentDidUpdate = function () {
        this.setCheckboxState();
    };
    HeaderCheckboxComp.prototype.setCheckboxState = function () {
        var _a = this.props, checkedAllRows = _a.checkedAllRows, disabled = _a.disabled;
        var input = this.el.querySelector('input[name=_checked]');
        if (input) {
            input.checked = checkedAllRows;
            input.disabled = disabled;
        }
    };
    HeaderCheckboxComp.prototype.render = function () {
        var _this = this;
        return (preact_1.h("span", { ref: function (el) {
                _this.el = el;
            }, dangerouslySetInnerHTML: { __html: this.props.header }, onChange: this.handleChange }));
    };
    return HeaderCheckboxComp;
}(preact_1.Component));
exports.HeaderCheckbox = hoc_1.connect(function (store) {
    var _a = store.data, checkedAllRows = _a.checkedAllRows, disabledAllCheckbox = _a.disabledAllCheckbox, allColumnMap = store.column.allColumnMap;
    return {
        header: allColumnMap._checked.header,
        checkedAllRows: checkedAllRows,
        disabled: disabledAllCheckbox,
    };
})(HeaderCheckboxComp);


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SortingButton = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var instance_1 = __webpack_require__(8);
var common_1 = __webpack_require__(0);
var SortingButtonComp = /** @class */ (function (_super) {
    tslib_1.__extends(SortingButtonComp, _super);
    function SortingButtonComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (ev) {
            var target = ev.target;
            var multiple = ev.ctrlKey || ev.metaKey;
            if (!dom_1.hasClass(target, 'btn-sorting')) {
                return;
            }
            var _a = _this.props, dispatch = _a.dispatch, sortState = _a.sortState, dataProvider = _a.dataProvider, defaultAscending = _a.defaultAscending;
            var columns = sortState.columns;
            var th = dom_1.findParentByClassName(target, 'cell');
            var columnName = th.getAttribute('data-column-name');
            var index = common_1.findPropIndex('columnName', columnName, columns);
            var ascending = index !== -1 ? !columns[index].ascending : defaultAscending;
            if (sortState.useClient) {
                dispatch('sort', columnName, ascending, multiple);
            }
            else {
                // @TODO: apply multi sort to dataSource
                dataProvider.sort(columnName, ascending, true);
            }
        };
        return _this;
    }
    SortingButtonComp.prototype.render = function () {
        var _a = this.props, active = _a.active, ascending = _a.ascending;
        return (preact_1.h("a", { class: dom_1.cls('btn-sorting', [active, ascending ? 'btn-sorting-up' : 'btn-sorting-down']), onClick: this.handleClick }));
    };
    return SortingButtonComp;
}(preact_1.Component));
exports.SortingButton = hoc_1.connect(function (store, props) {
    var sortState = store.data.sortState, id = store.id;
    var columnName = props.columnName, _a = props.sortingType, sortingType = _a === void 0 ? 'asc' : _a;
    var columns = sortState.columns;
    var index = common_1.findPropIndex('columnName', columnName, columns);
    var ascending = index !== -1 ? columns[index].ascending : true;
    return {
        sortState: sortState,
        ascending: ascending,
        dataProvider: instance_1.getDataProvider(id),
        defaultAscending: sortingType === 'asc',
        active: index !== -1,
    };
})(SortingButtonComp);


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SortingOrder = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var common_1 = __webpack_require__(0);
var SortingOrderComp = /** @class */ (function (_super) {
    tslib_1.__extends(SortingOrderComp, _super);
    function SortingOrderComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SortingOrderComp.prototype.render = function () {
        var _a = this.props, order = _a.order, showOrder = _a.showOrder;
        return showOrder && preact_1.h("span", { style: { color: '#bbb', fontWeight: 100 } }, order);
    };
    return SortingOrderComp;
}(preact_1.Component));
exports.SortingOrder = hoc_1.connect(function (store, props) {
    var columns = store.data.sortState.columns;
    var columnName = props.columnName;
    var order = common_1.findPropIndex('columnName', columnName, columns) + 1;
    var showOrder = !!order && columns.length > 1;
    return {
        order: order,
        showOrder: showOrder,
    };
})(SortingOrderComp);


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterButton = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var common_1 = __webpack_require__(0);
var DISTANCE_FROM_ICON_TO_LAYER = 9;
var FilterButtonComp = /** @class */ (function (_super) {
    tslib_1.__extends(FilterButtonComp, _super);
    function FilterButtonComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isActiveFilter = function () {
            var _a = _this.props, filters = _a.filters, columnName = _a.columnName;
            if (_this.props.grid && _this.props.grid.isActiveFilterFun) {
                return _this.props.grid.isActiveFilterFun(columnName);
            }
            return filters ? common_1.someProp('columnName', columnName, filters) : false;
        };
        _this.handleClick = function (ev) {
            var target = ev.target;
            if (!dom_1.hasClass(target, 'btn-filter')) {
                return;
            }
            var _a = _this.props, activeColumnAddress = _a.activeColumnAddress, columnName = _a.columnName, dispatch = _a.dispatch, offsetLeft = _a.offsetLeft;
            if (!activeColumnAddress || activeColumnAddress.name !== columnName) {
                var left = target.getBoundingClientRect().left - offsetLeft - DISTANCE_FROM_ICON_TO_LAYER;
                dispatch('saveAndFinishEditing');
                dispatch('setActiveColumnAddress', { name: columnName, left: left });
            }
        };
        return _this;
    }
    FilterButtonComp.prototype.render = function () {
        return (preact_1.h("a", { class: dom_1.cls('btn-filter', [this.isActiveFilter(), 'btn-filter-active']), onClick: this.handleClick }));
    };
    return FilterButtonComp;
}(preact_1.Component));
exports.FilterButton = hoc_1.connect(function (store, _a) {
    var columnName = _a.columnName;
    return ({
        activeColumnAddress: store.filterLayerState.activeColumnAddress,
        filters: store.data.filters,
        columnName: columnName,
        offsetLeft: store.dimension.offsetLeft,
    });
})(FilterButtonComp);


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyRows = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var bodyRow_1 = __webpack_require__(93);
var bodyDummyRow_1 = __webpack_require__(97);
var common_1 = __webpack_require__(0);
var hoc_1 = __webpack_require__(4);
var BodyRowsComp = /** @class */ (function (_super) {
    tslib_1.__extends(BodyRowsComp, _super);
    function BodyRowsComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BodyRowsComp.prototype.shouldComponentUpdate = function (nextProps) {
        return !common_1.shallowEqual(nextProps, this.props);
    };
    BodyRowsComp.prototype.render = function (_a) {
        var rows = _a.rows, rawData = _a.rawData, rowIndexOffset = _a.rowIndexOffset, columns = _a.columns, dummyRowCount = _a.dummyRowCount;
        var columnNames = columns.map(function (_a) {
            var name = _a.name;
            return name;
        });
        return (preact_1.h("tbody", null,
            rows.map(function (row, index) { return (preact_1.h(bodyRow_1.BodyRow, { key: row.uniqueKey, rowIndex: index + rowIndexOffset, viewRow: row, checked: rawData[index + rowIndexOffset]._attributes.checked, columns: columns })); }),
            common_1.range(dummyRowCount).map(function (index) { return (preact_1.h(bodyDummyRow_1.BodyDummyRow, { key: "dummy-" + index, index: rows.length + index, checked: false, columnNames: columnNames })); })));
    };
    return BodyRowsComp;
}(preact_1.Component));
exports.BodyRows = hoc_1.connect(function (_a, _b) {
    var viewport = _a.viewport, column = _a.column, data = _a.data;
    var side = _b.side;
    return ({
        rowIndexOffset: viewport.rowRange[0] - data.pageRowRange[0],
        rows: viewport.rows,
        rawData: data.rawData,
        columns: side === 'L' ? column.visibleColumnsBySideWithRowHeader.L : viewport.columns,
        dummyRowCount: viewport.dummyRowCount,
    });
})(BodyRowsComp);


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyRow = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
var rowSpanCell_1 = __webpack_require__(94);
var constant_1 = __webpack_require__(10);
var ROW_HEIGHT_DEBOUNCE_TIME = 10;
var BodyRowComp = /** @class */ (function (_super) {
    tslib_1.__extends(BodyRowComp, _super);
    function BodyRowComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // This debounced function is aimed to wait until setTimeout(.., 0) calls
        // from the all child BodyCell components is made.
        // 10ms is just an approximate number. (smaller than 10ms might be safe enough)
        _this.updateRowHeightDebounced = common_1.debounce(function () {
            var _a = _this.props, dispatch = _a.dispatch, rowIndex = _a.rowIndex, rowHeight = _a.rowHeight;
            dispatch('refreshRowHeight', rowIndex, rowHeight);
        }, ROW_HEIGHT_DEBOUNCE_TIME);
        return _this;
    }
    BodyRowComp.prototype.componentWillUnmount = function () {
        var _a = this.props, rowIndex = _a.rowIndex, autoRowHeight = _a.autoRowHeight, dispatch = _a.dispatch;
        if (autoRowHeight) {
            dispatch('removeRowHeight', rowIndex);
        }
    };
    BodyRowComp.prototype.render = function (_a) {
        var _this = this;
        var checked = _a.checked, rowIndex = _a.rowIndex, viewRow = _a.viewRow, columns = _a.columns, rowHeight = _a.rowHeight, autoRowHeight = _a.autoRowHeight, hoveredRowKey = _a.hoveredRowKey, focusedRowKey = _a.focusedRowKey;
        var isOddRow = rowIndex % 2 === 0;
        return (rowHeight > 0 && (preact_1.h("tr", { style: {
                height: rowHeight,
                lineHeight: autoRowHeight || rowHeight >= 40
                    ? ''
                    : rowHeight - constant_1.OCCUPIED_HEIGHT_BY_CELL_LAYOUY + "px",
            }, class: dom_1.cls([isOddRow, 'row-odd'], [!isOddRow, 'row-even'], [!common_1.isNull(hoveredRowKey) && hoveredRowKey === viewRow.rowKey, 'row-hover'], [!common_1.isNull(focusedRowKey) && focusedRowKey === viewRow.rowKey, 'cell-current-row'], [checked, 'row-checked']) }, columns.map(function (columnInfo) {
            // Pass row object directly instead of passing value of it only,
            // so that BodyCell component can watch the change of value using selector function.
            return (preact_1.h(rowSpanCell_1.RowSpanCell, { key: columnInfo.name, viewRow: viewRow, columnInfo: columnInfo, refreshRowHeight: autoRowHeight ? _this.updateRowHeightDebounced : null, rowIndex: rowIndex }));
        }))));
    };
    return BodyRowComp;
}(preact_1.Component));
exports.BodyRow = hoc_1.connect(function (_a, _b) {
    var rowCoords = _a.rowCoords, dimension = _a.dimension, renderState = _a.renderState, focus = _a.focus;
    var rowIndex = _b.rowIndex;
    return ({
        rowHeight: rowCoords.heights[rowIndex],
        autoRowHeight: dimension.autoRowHeight,
        cellBorderWidth: dimension.cellBorderWidth,
        hoveredRowKey: renderState.hoveredRowKey,
        focusedRowKey: focus.rowKey,
    });
})(BodyRowComp);


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RowSpanCell = exports.RowSpanCellComp = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var bodyCell_1 = __webpack_require__(95);
var rowSpan_1 = __webpack_require__(13);
var RowSpanCellComp = /** @class */ (function (_super) {
    tslib_1.__extends(RowSpanCellComp, _super);
    function RowSpanCellComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RowSpanCellComp.prototype.render = function () {
        var _a = this.props, columnInfo = _a.columnInfo, refreshRowHeight = _a.refreshRowHeight, rowSpan = _a.rowSpan, enableRowSpan = _a.enableRowSpan, viewRow = _a.viewRow, rowIndex = _a.rowIndex;
        var rowSpanAttr = null;
        if (enableRowSpan && rowSpan) {
            if (!rowSpan.mainRow) {
                return null;
            }
            rowSpanAttr = { rowSpan: rowSpan.spanCount };
        }
        return (preact_1.h(bodyCell_1.BodyCell, { viewRow: viewRow, columnInfo: columnInfo, refreshRowHeight: refreshRowHeight, rowSpanAttr: rowSpanAttr, rowIndex: rowIndex }));
    };
    return RowSpanCellComp;
}(preact_1.Component));
exports.RowSpanCellComp = RowSpanCellComp;
exports.RowSpanCell = hoc_1.connect(function (_a, _b) {
    var data = _a.data, column = _a.column;
    var viewRow = _b.viewRow, columnInfo = _b.columnInfo;
    var sortState = data.sortState;
    var rowSpan = (viewRow.rowSpanMap && viewRow.rowSpanMap[columnInfo.name]) || null;
    var enableRowSpan = rowSpan_1.isRowSpanEnabled(sortState, column);
    return { rowSpan: rowSpan, enableRowSpan: enableRowSpan };
})(RowSpanCellComp);


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyCell = exports.BodyCellComp = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var treeCellContents_1 = __webpack_require__(96);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var instance_1 = __webpack_require__(8);
var column_1 = __webpack_require__(11);
var common_1 = __webpack_require__(0);
var bodyArea_1 = __webpack_require__(28);
var BodyCellComp = /** @class */ (function (_super) {
    tslib_1.__extends(BodyCellComp, _super);
    function BodyCellComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleMouseMove = function (ev) {
            var _a = dom_1.getCoordinateWithOffset(ev.pageX, ev.pageY), pageX = _a[0], pageY = _a[1];
            pageX = bodyArea_1.toBodyZoom(pageX);
            pageY = bodyArea_1.toBodyZoom(pageY);
            _this.props.dispatch('dragMoveRowHeader', { pageX: pageX, pageY: pageY });
        };
        _this.handleMouseDown = function (name, rowKey) {
            if (!column_1.isRowNumColumn(name)) {
                return;
            }
            _this.props.dispatch('mouseDownRowHeader', rowKey);
            document.addEventListener('mousemove', _this.handleMouseMove);
            document.addEventListener('mouseup', _this.clearDocumentEvents);
            document.addEventListener('selectstart', _this.handleSelectStart);
        };
        _this.clearDocumentEvents = function () {
            _this.props.dispatch('dragEnd');
            dom_1.setCursorStyle('');
            document.removeEventListener('mousemove', _this.handleMouseMove);
            document.removeEventListener('mouseup', _this.clearDocumentEvents);
            document.removeEventListener('selectstart', _this.handleSelectStart);
        };
        _this.handleSelectStart = function (ev) {
            ev.preventDefault();
        };
        return _this;
    }
    BodyCellComp.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, grid = _a.grid, rowKey = _a.rowKey, renderData = _a.renderData, columnInfo = _a.columnInfo;
        if (this.td) { // @ts-ignore
            this.td.style.background = "";
        }
        // eslint-disable-next-line new-cap
        this.renderer = new columnInfo.renderer.type(tslib_1.__assign(tslib_1.__assign({ // @ts-ignore
            grid: grid,
            rowKey: rowKey,
            columnInfo: columnInfo }, renderData), { td: this.td, calculateRowHeight: function () {
                _this.calculateRowHeight(_this.props);
            } }));
        var rendererEl = this.renderer.getElement();
        this.el.appendChild(rendererEl);
        if (this.renderer.mounted) {
            this.renderer.mounted(this.el);
        }
        // this.calculateRowHeight(this.props);
    };
    BodyCellComp.prototype.shouldComponentUpdate = function (nextProps) {
        return !common_1.shallowEqual(this.props, nextProps);
    };
    BodyCellComp.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        var viewRow = nextProps.viewRow, renderData = nextProps.renderData, columnInfo = nextProps.columnInfo, rowKey = nextProps.rowKey, grid = nextProps.grid, columnWidths = nextProps.columnWidths;
        var _a = this.props, prevViewRow = _a.viewRow, prevRenderData = _a.renderData, prevColumnWidth = _a.columnWidths;
        if ((prevRenderData !== renderData ||
            viewRow.uniqueKey !== prevViewRow.uniqueKey ||
            columnWidths !== prevColumnWidth) &&
            this.renderer &&
            common_1.isFunction(this.renderer.render)) {
            this.renderer.render(tslib_1.__assign(tslib_1.__assign({ // @ts-ignore
                grid: grid,
                rowKey: rowKey,
                columnInfo: columnInfo }, renderData), { td: this.td, calculateRowHeight: function () {
                    _this.calculateRowHeight(_this.props);
                } }));
            // this.calculateRowHeight(nextProps);
        }
    };
    BodyCellComp.prototype.componentWillUnmount = function () {
        window.clearTimeout(this.timeout);
        if (this.renderer && common_1.isFunction(this.renderer.beforeDestroy)) {
            this.renderer.beforeDestroy();
        }
    };
    BodyCellComp.prototype.calculateRowHeight = function (props) {
        var rowIndex = props.rowIndex, columnInfo = props.columnInfo, refreshRowHeight = props.refreshRowHeight, defaultRowHeight = props.defaultRowHeight, dispatch = props.dispatch, cellBorderWidth = props.cellBorderWidth;
        if (refreshRowHeight) {
            // In Preact, the componentDidMount is called before the DOM elements are actually mounted.
            // https://github.com/preactjs/preact/issues/648
            // Use setTimeout to wait until the DOM element is actually mounted
            //  - If the width of grid is 'auto' actual width of grid is calculated from the
            //    Container component using setTimeout(fn, 0)
            //  - Delay 16ms for defer the function call later than the Container component.
            // window.clearTimeout(this.timeout);
            // this.timeout = window.setTimeout(() => {
            //   if (this.renderer.getElement().parentElement) {
            //     const height = this.renderer.getElement().clientHeight + cellBorderWidth;
            //     dispatch('setCellHeight', columnInfo.name, rowIndex, height, defaultRowHeight);
            //     refreshRowHeight(height);
            //   } else {
            //     this.calculateRowHeight(props);
            //   }
            // }, 200);
            // }, 16);
            if (this.renderer.getElement().parentElement) {
                var height = this.renderer.getElement().clientHeight + cellBorderWidth;
                dispatch('setCellHeight', columnInfo.name, rowIndex, height, defaultRowHeight);
                refreshRowHeight(height);
            }
        }
    };
    BodyCellComp.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, rowKey = _b.rowKey, _c = _b.renderData, disabled = _c.disabled, editable = _c.editable, invalidStates = _c.invalidStates, className = _c.className, _d = _b.columnInfo, align = _d.align, valign = _d.valign, name = _d.name, _e = _d.validation, validation = _e === void 0 ? {} : _e, treeInfo = _b.treeInfo, selectedRow = _b.selectedRow, rowSpanAttr = _b.rowSpanAttr;
        var style = {
            textAlign: align,
            verticalAlign: valign,
        };
        var attrs = (_a = {},
            _a[dom_1.dataAttr.ROW_KEY] = String(rowKey),
            _a[dom_1.dataAttr.COLUMN_NAME] = name,
            _a);
        var classNames = dom_1.cls('cell', 'cell-has-input', [editable, 'cell-editable'], [column_1.isRowHeader(name), 'cell-row-header'], [validation.required || false, 'cell-required'], [!!invalidStates.length, 'cell-invalid'], [disabled, 'cell-disabled'], [!!treeInfo, 'cell-has-tree']) + " " + className;
        return treeInfo ? (preact_1.h("td", tslib_1.__assign({ ref: function (el) {
                _this.td = el; //update by tangbin
            } }, attrs, { style: style, class: classNames }),
            preact_1.h("div", { class: dom_1.cls('tree-wrapper-relative') },
                preact_1.h("div", { class: dom_1.cls('tree-wrapper-valign-center'), style: { paddingLeft: treeInfo.indentWidth }, ref: function (el) {
                        _this.el = el;
                    } },
                    preact_1.h(treeCellContents_1.TreeCellContents, { treeInfo: treeInfo, rowKey: rowKey }))))) : (preact_1.h("td", tslib_1.__assign({}, attrs, rowSpanAttr, { style: style, class: classNames, ref: function (el) {
                _this.el = el;
                _this.td = el; //update by tangbin
            }, onMouseDown: function () { return _this.handleMouseDown(name, rowKey); } })));
    };
    return BodyCellComp;
}(preact_1.Component));
exports.BodyCellComp = BodyCellComp;
exports.BodyCell = hoc_1.connect(function (_a, _b) {
    var id = _a.id, column = _a.column, focus = _a.focus, selection = _a.selection, dimension = _a.dimension, columnCoords = _a.columnCoords;
    var viewRow = _b.viewRow, columnInfo = _b.columnInfo, rowIndex = _b.rowIndex;
    var rowKey = viewRow.rowKey, valueMap = viewRow.valueMap, treeInfo = viewRow.treeInfo;
    var treeColumnName = column.treeColumnName;
    var grid = instance_1.getInstance(id);
    var range = selection.range;
    var columnName = columnInfo.name;
    var defaultRowHeight = dimension.rowHeight, cellBorderWidth = dimension.cellBorderWidth;
    return tslib_1.__assign(tslib_1.__assign({ grid: grid,
        rowKey: rowKey,
        columnInfo: columnInfo, columnWidths: columnCoords.widths, defaultRowHeight: defaultRowHeight, renderData: (valueMap && valueMap[columnName]) || { invalidStates: [] } }, (columnName === treeColumnName ? { treeInfo: treeInfo } : null)), { selectedRow: focus.rowKey == rowKey ? true : (range ? rowIndex >= range.row[0] && rowIndex <= range.row[1] : false), cellBorderWidth: cellBorderWidth });
})(BodyCellComp);


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeCellContents = exports.TreeCellContentsComp = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var constant_1 = __webpack_require__(10);
var TreeCellContentsComp = /** @class */ (function (_super) {
    tslib_1.__extends(TreeCellContentsComp, _super);
    function TreeCellContentsComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function (ev) {
            ev.stopPropagation();
            var _a = _this.props, dispatch = _a.dispatch, rowKey = _a.rowKey;
            var target = ev.target;
            if (dom_1.findParentByClassName(target, 'tree-button-collapse')) {
                dispatch('selectionEnd');
                dispatch('expandByRowKey', rowKey, false);
            }
            else if (dom_1.findParentByClassName(target, 'tree-button-expand')) {
                dispatch('selectionEnd');
                dispatch('collapseByRowKey', rowKey, false);
            }
        };
        return _this;
    }
    TreeCellContentsComp.prototype.getIndentComponent = function (depth, leaf) {
        var indentItem = [];
        for (var i = 0, len = depth; i < len; i += 1) {
            indentItem.push(preact_1.h("span", { class: dom_1.cls('tree-depth') }, i === len - 1 && !leaf && (preact_1.h("button", { class: dom_1.cls('btn-tree'), style: { left: i * this.props.treeIndentWidth }, onDblClick: function (ev) { return ev.stopPropagation(); }, onClick: this.handleClick, type: "button" },
                preact_1.h("i", null)))));
        }
        return indentItem;
    };
    TreeCellContentsComp.prototype.render = function () {
        var _a = this.props, depth = _a.depth, indentWidth = _a.indentWidth, leaf = _a.leaf, expanded = _a.expanded, useIcon = _a.useIcon;
        return (preact_1.h("div", { class: dom_1.cls('tree-extra-content', [!leaf && expanded, 'tree-button-expand'], [!leaf && !expanded, 'tree-button-collapse']) },
            this.getIndentComponent(depth, leaf),
            useIcon && (preact_1.h("span", { class: dom_1.cls('tree-icon'), style: { left: indentWidth - constant_1.TREE_INDENT_WIDTH } },
                preact_1.h("i", null)))));
    };
    return TreeCellContentsComp;
}(preact_1.Component));
exports.TreeCellContentsComp = TreeCellContentsComp;
exports.TreeCellContents = hoc_1.connect(function (_a, _b) {
    var column = _a.column;
    var treeInfo = _b.treeInfo, rowKey = _b.rowKey;
    var _c = column.treeIcon, useIcon = _c === void 0 ? true : _c, _d = column.treeIndentWidth, treeIndentWidth = _d === void 0 ? constant_1.TREE_INDENT_WIDTH : _d;
    var depth = treeInfo.depth, indentWidth = treeInfo.indentWidth, leaf = treeInfo.leaf, _e = treeInfo.expanded, expanded = _e === void 0 ? false : _e;
    return {
        rowKey: rowKey,
        depth: depth,
        indentWidth: indentWidth,
        leaf: leaf,
        expanded: expanded,
        useIcon: useIcon,
        treeIndentWidth: treeIndentWidth,
    };
})(TreeCellContentsComp);


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyDummyRow = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var column_1 = __webpack_require__(11);
var BodyDummyRowComp = function (_a) {
    var columnNames = _a.columnNames, rowHeight = _a.rowHeight, index = _a.index, checked = _a.checked;
    var isOddRow = index % 2 === 0;
    return ( //tangbin2
    preact_1.h("tr", { style: { height: rowHeight }, class: dom_1.cls([isOddRow, 'row-odd'], [!isOddRow, 'row-even'], [checked, 'row-checked']) }, columnNames.map(function (name) {
        var _a;
        var attrs = (_a = {}, _a[dom_1.dataAttr.COLUMN_NAME] = name, _a);
        return (preact_1.h("td", tslib_1.__assign({}, attrs, { key: name + "-" + index, class: dom_1.cls('cell', 'cell-dummy', [column_1.isRowHeader(name), 'cell-row-header']) })));
    })));
};
exports.BodyDummyRow = hoc_1.connect(function (_a) {
    var rowHeight = _a.dimension.rowHeight;
    return ({
        rowHeight: rowHeight,
    });
})(BodyDummyRowComp);


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusLayer = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var FocusLayerComp = /** @class */ (function (_super) {
    tslib_1.__extends(FocusLayerComp, _super);
    function FocusLayerComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FocusLayerComp.prototype.render = function () {
        var _a = this.props, active = _a.active, cellPosRect = _a.cellPosRect, cellBorderWidth = _a.cellBorderWidth;
        if (cellPosRect === null) {
            return null;
        }
        var top = cellPosRect.top, left = cellPosRect.left, right = cellPosRect.right, bottom = cellPosRect.bottom;
        var height = bottom - top;
        var width = right - left;
        var leftStyle = {
            top: top,
            left: left,
            width: cellBorderWidth,
            height: height + cellBorderWidth,
        };
        var topStyle = {
            top: top === 0 ? cellBorderWidth : top,
            left: left,
            width: width + cellBorderWidth,
            height: cellBorderWidth,
        };
        var rightStyle = {
            top: top,
            left: left + width,
            width: cellBorderWidth,
            height: height + cellBorderWidth,
        };
        var bottomStyle = {
            top: top + height,
            left: left,
            width: width + cellBorderWidth,
            height: cellBorderWidth,
        };
        var buttonStyle = {
            top: top,
            left: left + width - 100,
            width: 10,
            height: height + cellBorderWidth,
            cursor: "pointer",
        };
        return (preact_1.h("div", { class: dom_1.cls('layer-focus', [!active, 'layer-focus-deactive']) },
            preact_1.h("div", { class: dom_1.cls('layer-focus-border'), style: leftStyle }),
            preact_1.h("div", { class: dom_1.cls('layer-focus-border'), style: topStyle }),
            preact_1.h("div", { class: dom_1.cls('layer-focus-border'), style: rightStyle }),
            preact_1.h("div", { class: dom_1.cls('layer-focus-border'), style: bottomStyle })));
    };
    return FocusLayerComp;
}(preact_1.Component));
exports.FocusLayer = hoc_1.connect(function (_a, _b) {
    var focus = _a.focus, dimension = _a.dimension;
    var side = _b.side;
    var cellPosRect = focus.cellPosRect, editingAddress = focus.editingAddress, navigating = focus.navigating;
    return {
        active: !!editingAddress || navigating,
        cellPosRect: side === focus.side ? cellPosRect : null,
        cellBorderWidth: dimension.cellBorderWidth,
    };
})(FocusLayerComp);


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionLayer = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var SelectionLayerComp = /** @class */ (function (_super) {
    tslib_1.__extends(SelectionLayerComp, _super);
    function SelectionLayerComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleMouseMove = function (ev) {
            var dispatch = _this.props.dispatch;
            var pageX = ev.pageX, pageY = ev.pageY;
            dispatch('setHoveredRowKeyByPosition', { pageX: pageX, pageY: pageY });
        };
        return _this;
    }
    SelectionLayerComp.prototype.render = function () {
        var styles = this.props.styles;
        return (preact_1.h("div", { onMouseMove: this.handleMouseMove }, !!styles && preact_1.h("div", { class: dom_1.cls('layer-selection'), style: styles })));
    };
    return SelectionLayerComp;
}(preact_1.Component));
exports.SelectionLayer = hoc_1.connect(function (_a, _b) {
    var rangeAreaInfo = _a.selection.rangeAreaInfo;
    var side = _b.side;
    var styles = rangeAreaInfo && rangeAreaInfo[side];
    return { styles: styles };
})(SelectionLayerComp);


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EditingLayer = exports.EditingLayerComp = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var keyboard_1 = __webpack_require__(22);
var common_1 = __webpack_require__(0);
var instance_1 = __webpack_require__(8);
var editor_1 = __webpack_require__(41);
var constant_1 = __webpack_require__(10);
var EditingLayerComp = /** @class */ (function (_super) {
    tslib_1.__extends(EditingLayerComp, _super);
    function EditingLayerComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.initBodyScrollPos = { initBodyScrollTop: 0, initBodyScrollLeft: 0 };
        _this.longestTextWidths = {};
        _this.handleKeyDown = function (ev) {
            var keyName = keyboard_1.getKeyStrokeString(ev);
            switch (keyName) {
                case 'enter':
                    if (_this.editor && _this.editor.isEnterEditorClose) {
                        var ret = _this.editor.isEnterEditorClose();
                        if (ret == false) {
                            return;
                        }
                    }
                    _this.saveAndFinishEditing(true);
                    break;
                case 'esc':
                    _this.cancelEditing();
                    break;
                case 'tab':
                    _this.moveTabFocus(ev, 'nextCell');
                    break;
                case 'shift-tab':
                    _this.moveTabFocus(ev, 'prevCell');
                    break;
                default:
                // do nothing;
            }
        };
        _this.saveAndFinishEditing = function (triggeredByKey) {
            if (triggeredByKey === void 0) { triggeredByKey = false; }
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a, dispatch, active, _b, rowKey, columnName, value;
                return tslib_1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = this.props, dispatch = _a.dispatch, active = _a.active;
                            if (!(this.editor && active)) return [3 /*break*/, 3];
                            _b = this.getEditingCellInfo(), rowKey = _b.rowKey, columnName = _b.columnName, value = _b.value;
                            return [4 /*yield*/, dispatch('setValue', rowKey, columnName, value)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, dispatch('finishEditing', rowKey, columnName, value, { save: true, triggeredByKey: triggeredByKey })];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return _this;
    }
    EditingLayerComp.prototype.moveTabFocus = function (ev, command) {
        var dispatch = this.props.dispatch;
        ev.preventDefault();
        dispatch('moveTabFocus', command);
        dispatch('setScrollToFocus');
    };
    EditingLayerComp.prototype.getEditingCellInfo = function () {
        var _a = this.props.editingAddress, rowKey = _a.rowKey, columnName = _a.columnName;
        var value = this.editor.getValue();
        return { rowKey: rowKey, columnName: columnName, value: value };
    };
    EditingLayerComp.prototype.cancelEditing = function () {
        if (!this.props.editingAddress) {
            return;
        }
        var _a = this.getEditingCellInfo(), rowKey = _a.rowKey, columnName = _a.columnName, value = _a.value;
        this.props.dispatch('finishEditing', rowKey, columnName, value, {
            save: false,
            triggeredByKey: true,
        });
    };
    EditingLayerComp.prototype.setInitScrollPos = function () {
        var _a = this.props, bodyScrollTop = _a.bodyScrollTop, bodyScrollLeft = _a.bodyScrollLeft;
        this.initBodyScrollPos = {
            initBodyScrollTop: bodyScrollTop,
            initBodyScrollLeft: bodyScrollLeft,
        };
    };
    EditingLayerComp.prototype.createEditor = function () {
        var _this = this;
        var _a;
        var _b = this.props, allColumnMap = _b.allColumnMap, filteredViewData = _b.filteredViewData, editingAddress = _b.editingAddress, grid = _b.grid, cellPosRect = _b.cellPosRect;
        var _c = editingAddress, rowKey = _c.rowKey, columnName = _c.columnName;
        var _d = cellPosRect, right = _d.right, left = _d.left;
        var columnInfo = allColumnMap[columnName];
        var _e = common_1.findProp('rowKey', rowKey, filteredViewData).valueMap[columnName], value = _e.value, formattedValue = _e.formattedValue;
        var EditorClass = columnInfo.editor.type;
        var width = Math.max(right - left - constant_1.HORIZONTAL_PADDING_OF_CELL, (_a = this.longestTextWidths[columnName]) !== null && _a !== void 0 ? _a : 0);
        var editorProps = {
            grid: grid,
            rowKey: rowKey,
            columnInfo: columnInfo,
            value: value,
            formattedValue: formattedValue,
            width: width,
            portalEditingKeydown: this.handleKeyDown,
            instantApplyCallback: this.saveAndFinishEditing,
        };
        var cellEditor = new EditorClass(editorProps);
        var editorEl = cellEditor.getElement();
        if (editorEl && this.contentEl) {
            this.contentEl.appendChild(editorEl);
            this.editor = cellEditor;
            if (cellEditor.mounted) {
                // To access the actual mounted DOM elements
                setTimeout(function () {
                    cellEditor.mounted();
                    _this.setInitScrollPos();
                });
            }
        }
    };
    EditingLayerComp.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, allColumnMap = _a.allColumnMap, grid = _a.grid;
        var dummyCellEditorProps = {
            grid: grid,
            rowKey: 0,
            value: 0,
            formattedValue: '0',
            width: 0,
            portalEditingKeydown: this.handleKeyDown,
            instantApplyCallback: function () { },
        };
        var bodyArea = document.querySelector("." + dom_1.cls('rside-area') + " ." + dom_1.cls('body-container') + " ." + dom_1.cls('table'));
        Object.keys(allColumnMap).forEach(function (columnName) {
            var columnInfo = allColumnMap[columnName];
            if (columnInfo.editor) {
                var listItems = editor_1.getListItems(tslib_1.__assign({ columnInfo: columnInfo }, dummyCellEditorProps));
                if (!common_1.isNil(listItems)) {
                    var longestItem = common_1.getLongestText(listItems.map(function (item) { return item.text; }));
                    _this.longestTextWidths[columnName] =
                        dom_1.getTextWidth(longestItem, bodyArea) + constant_1.HORIZONTAL_PADDING_OF_CELL;
                }
            }
        });
    };
    EditingLayerComp.prototype.componentDidUpdate = function (prevProps) {
        var _a;
        var _b = this.props, active = _b.active, editingAddress = _b.editingAddress, focusedColumnName = _b.focusedColumnName, bodyHeight = _b.bodyHeight, bodyWidth = _b.bodyWidth, bodyScrollTop = _b.bodyScrollTop, bodyScrollLeft = _b.bodyScrollLeft, headerHeight = _b.headerHeight, leftSideWidth = _b.leftSideWidth;
        if (!prevProps.active && active && (editingAddress === null || editingAddress === void 0 ? void 0 : editingAddress.columnName) === focusedColumnName) {
            this.createEditor();
        }
        if ((_a = this.editor) === null || _a === void 0 ? void 0 : _a.moveDropdownLayer) {
            this.editor.moveDropdownLayer(tslib_1.__assign({ bodyHeight: bodyHeight,
                bodyWidth: bodyWidth,
                bodyScrollTop: bodyScrollTop,
                bodyScrollLeft: bodyScrollLeft,
                headerHeight: headerHeight,
                leftSideWidth: leftSideWidth }, this.initBodyScrollPos));
        }
    };
    EditingLayerComp.prototype.componentWillReceiveProps = function (nextProps) {
        var _a, _b;
        var _c = this.props, prevFocusedColumnName = _c.focusedColumnName, prevFocusedRowKey = _c.focusedRowKey, prevActive = _c.active;
        var focusedColumnName = nextProps.focusedColumnName, focusedRowKey = nextProps.focusedRowKey, active = nextProps.active, forcedDestroyEditing = nextProps.forcedDestroyEditing;
        if ((prevActive && !active && forcedDestroyEditing) ||
            (prevActive &&
                (focusedColumnName !== prevFocusedColumnName || focusedRowKey !== prevFocusedRowKey))) {
            this.saveAndFinishEditing();
        }
        if (this.editor &&
            prevActive &&
            !active &&
            (common_1.isUndefined(this.editor.isMounted) || this.editor.isMounted)) {
            // eslint-disable-next-line no-unused-expressions
            (_b = (_a = this.editor).beforeDestroy) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
    };
    EditingLayerComp.prototype.render = function (_a) {
        var _this = this;
        var active = _a.active, cellPosRect = _a.cellPosRect, cellBorderWidth = _a.cellBorderWidth;
        if (!active) {
            return null;
        }
        var _b = cellPosRect, top = _b.top, left = _b.left, right = _b.right, bottom = _b.bottom;
        var height = bottom - top;
        var width = right - left;
        var editorStyles = {
            top: top ? top : cellBorderWidth,
            left: left,
            width: width + cellBorderWidth,
            height: top ? height + cellBorderWidth : height,
            lineHeight: top ? height - cellBorderWidth + "px" : height - cellBorderWidth * 2 + "px",
        };
        return (preact_1.h("div", { style: editorStyles, className: dom_1.cls('layer-editing', 'cell-content', 'cell-content-editor'), onKeyDown: this.handleKeyDown, ref: function (el) {
                _this.contentEl = el;
            } }));
    };
    return EditingLayerComp;
}(preact_1.Component));
exports.EditingLayerComp = EditingLayerComp;
exports.EditingLayer = hoc_1.connect(function (store, _a) {
    var side = _a.side;
    var data = store.data, column = store.column, id = store.id, focus = store.focus, dimension = store.dimension, viewport = store.viewport, columnCoords = store.columnCoords;
    var editingAddress = focus.editingAddress, focusSide = focus.side, focusedRowKey = focus.rowKey, focusedColumnName = focus.columnName, forcedDestroyEditing = focus.forcedDestroyEditing, cellPosRect = focus.cellPosRect;
    var scrollTop = viewport.scrollTop, scrollLeft = viewport.scrollLeft;
    var cellBorderWidth = dimension.cellBorderWidth, bodyHeight = dimension.bodyHeight, width = dimension.width, scrollXHeight = dimension.scrollXHeight, scrollYWidth = dimension.scrollYWidth, headerHeight = dimension.headerHeight;
    return {
        grid: instance_1.getInstance(id),
        active: side === focusSide && !common_1.isNull(editingAddress),
        focusedRowKey: focusedRowKey,
        focusedColumnName: focusedColumnName,
        forcedDestroyEditing: forcedDestroyEditing,
        cellPosRect: cellPosRect,
        cellBorderWidth: cellBorderWidth,
        editingAddress: editingAddress,
        filteredViewData: data.filteredViewData,
        allColumnMap: column.allColumnMap,
        bodyScrollTop: scrollTop,
        bodyScrollLeft: scrollLeft,
        bodyHeight: bodyHeight - scrollXHeight,
        bodyWidth: width - scrollYWidth,
        headerHeight: headerHeight,
        leftSideWidth: side === 'L' ? 0 : columnCoords.areaWidth.L,
    };
}, true)(EditingLayerComp);


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryBodyRow = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var summaryBodyCell_1 = __webpack_require__(102);
var common_1 = __webpack_require__(0);
var SummaryBodyRow = /** @class */ (function (_super) {
    tslib_1.__extends(SummaryBodyRow, _super);
    function SummaryBodyRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SummaryBodyRow.prototype.shouldComponentUpdate = function (nextProps) {
        return !common_1.shallowEqual(nextProps, this.props);
    };
    SummaryBodyRow.prototype.render = function (_a) {
        var columns = _a.columns;
        var columnNames = columns.map(function (_a) {
            var name = _a.name;
            return name;
        });
        return (preact_1.h("tbody", null,
            preact_1.h("tr", null, columnNames.map(function (name) { return (preact_1.h(summaryBodyCell_1.SummaryBodyCell, { key: name, columnName: name })); }))));
    };
    return SummaryBodyRow;
}(preact_1.Component));
exports.SummaryBodyRow = SummaryBodyRow;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryBodyCell = exports.SummaryBodyCellComp = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
var hoc_1 = __webpack_require__(4);
var column_1 = __webpack_require__(11);
var SummaryBodyCellComp = /** @class */ (function (_super) {
    tslib_1.__extends(SummaryBodyCellComp, _super);
    function SummaryBodyCellComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getTemplate = function () {
            var _a = _this.props, content = _a.content, summaryValue = _a.summaryValue, columnName = _a.columnName;
            if (!content || column_1.isRowHeader(columnName)) {
                return '';
            }
            var template = content.template;
            return typeof template === 'string' ? template : template(summaryValue);
        };
        return _this;
    }
    SummaryBodyCellComp.prototype.shouldComponentUpdate = function (nextProps) {
        return !common_1.shallowEqual(nextProps, this.props);
    };
    SummaryBodyCellComp.prototype.render = function () {
        var _a;
        var columnName = this.props.columnName;
        var attrs = (_a = {}, _a[dom_1.dataAttr.COLUMN_NAME] = columnName, _a);
        var template = this.getTemplate();
        return (preact_1.h("td", tslib_1.__assign({ class: dom_1.cls('cell', 'cell-summary'), dangerouslySetInnerHTML: { __html: typeof (template) == "string" ? template : "" }, ref: function (el) {
                if (typeof (template) == "object") {
                    el === null || el === void 0 ? void 0 : el.appendChild(template);
                }
            } }, attrs)));
    };
    return SummaryBodyCellComp;
}(preact_1.Component));
exports.SummaryBodyCellComp = SummaryBodyCellComp;
exports.SummaryBodyCell = hoc_1.connect(function (_a, _b) {
    var summary = _a.summary;
    var columnName = _b.columnName;
    var summaryColumnContents = summary.summaryColumnContents, summaryValues = summary.summaryValues;
    var content = summaryColumnContents[columnName];
    var summaryValue = summaryValues[columnName];
    return { content: content, summaryValue: summaryValue };
})(SummaryBodyCellComp);


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RightSide = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var bodyArea_1 = __webpack_require__(28);
var headerArea_1 = __webpack_require__(50);
var summaryArea_1 = __webpack_require__(53);
var hoc_1 = __webpack_require__(4);
var RightSideComp = /** @class */ (function (_super) {
    tslib_1.__extends(RightSideComp, _super);
    function RightSideComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RightSideComp.prototype.renderScrollbarYInnerBorder = function () {
        var _a = this.props, cornerTopHeight = _a.cornerTopHeight, bodyHeight = _a.bodyHeight, scrollXHeight = _a.scrollXHeight;
        var style = {
            top: cornerTopHeight,
            height: bodyHeight - scrollXHeight,
        };
        return preact_1.h("div", { class: dom_1.cls('scrollbar-y-inner-border'), style: style });
    };
    RightSideComp.prototype.renderScrollbarRightTop = function () {
        var style = { height: this.props.cornerTopHeight };
        return preact_1.h("div", { class: dom_1.cls('scrollbar-right-top'), style: style });
    };
    RightSideComp.prototype.renderScrollbarYOuterBorder = function () {
        return preact_1.h("div", { class: dom_1.cls('scrollbar-y-outer-border') });
    };
    RightSideComp.prototype.renderScrollbarRightBottom = function () {
        var style = { height: this.props.cornerBottomHeight };
        return preact_1.h("div", { class: dom_1.cls('scrollbar-right-bottom'), style: style });
    };
    RightSideComp.prototype.renderScrollbarFrozenBorder = function () {
        var _a = this.props, scrollXHeight = _a.scrollXHeight, frozenBorderWidth = _a.frozenBorderWidth, cellBorderWidth = _a.cellBorderWidth;
        var style = {
            height: scrollXHeight,
            width: frozenBorderWidth,
            marginLeft: frozenBorderWidth ? -(frozenBorderWidth + cellBorderWidth) : 0,
        };
        return preact_1.h("div", { class: dom_1.cls('scrollbar-frozen-border'), style: style });
    };
    RightSideComp.prototype.renderFrozenBorder = function () {
        var frozenBorderWidth = this.props.frozenBorderWidth;
        var style = {
            marginLeft: -frozenBorderWidth,
            width: frozenBorderWidth,
        };
        return preact_1.h("div", { class: dom_1.cls('frozen-border'), style: style });
    };
    RightSideComp.prototype.render = function () {
        var _a = this.props, marginLeft = _a.marginLeft, width = _a.width, summaryPosition = _a.summaryPosition, scrollY = _a.scrollY, scrollX = _a.scrollX, frozenBorderWidth = _a.frozenBorderWidth;
        var style = {
            display: 'block',
            marginLeft: marginLeft,
            width: width,
        };
        return (preact_1.h("div", { class: dom_1.cls('rside-area'), style: style },
            preact_1.h(headerArea_1.HeaderArea, { side: "R" }),
            summaryPosition === 'top' && preact_1.h(summaryArea_1.SummaryArea, { side: "R" }),
            preact_1.h(bodyArea_1.BodyArea, { side: "R" }),
            summaryPosition === 'bottom' && preact_1.h(summaryArea_1.SummaryArea, { side: "R" }),
            scrollY && this.renderScrollbarYInnerBorder(),
            scrollY && this.renderScrollbarYOuterBorder(),
            scrollY && this.renderScrollbarRightTop(),
            scrollX && this.renderScrollbarFrozenBorder(),
            (scrollX || scrollY) && this.renderScrollbarRightBottom(),
            !!frozenBorderWidth && this.renderFrozenBorder()));
    };
    return RightSideComp;
}(preact_1.Component));
exports.RightSide = hoc_1.connect(function (_a) {
    var dimension = _a.dimension, columnCoords = _a.columnCoords;
    var scrollbarWidth = dimension.scrollbarWidth, scrollX = dimension.scrollX, scrollY = dimension.scrollY, summaryHeight = dimension.summaryHeight, headerHeight = dimension.headerHeight, cellBorderWidth = dimension.cellBorderWidth, tableBorderWidth = dimension.tableBorderWidth, bodyHeight = dimension.bodyHeight, summaryPosition = dimension.summaryPosition, frozenBorderWidth = dimension.frozenBorderWidth;
    var cornerTopHeight = headerHeight;
    var cornerBottomHeight = scrollX ? scrollbarWidth : 0;
    if (scrollY && summaryHeight) {
        if (summaryPosition === 'top') {
            cornerTopHeight += summaryHeight + tableBorderWidth;
        }
        else {
            cornerBottomHeight += summaryHeight;
        }
    }
    var scrollXHeight = scrollX ? scrollbarWidth : 0;
    var width = columnCoords.areaWidth.R;
    var marginLeft = columnCoords.areaWidth.L + frozenBorderWidth;
    if (marginLeft && !frozenBorderWidth) {
        marginLeft -= cellBorderWidth;
        width += cellBorderWidth;
    }
    return {
        width: width,
        marginLeft: marginLeft,
        cornerTopHeight: cornerTopHeight,
        cornerBottomHeight: cornerBottomHeight,
        scrollXHeight: scrollXHeight,
        bodyHeight: bodyHeight,
        cellBorderWidth: cellBorderWidth,
        frozenBorderWidth: frozenBorderWidth,
        summaryPosition: summaryPosition,
        scrollX: scrollX,
        scrollY: scrollY,
    };
})(RightSideComp);


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.StateLayer = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(2);
var hoc_1 = __webpack_require__(4);
var i18n_1 = tslib_1.__importDefault(__webpack_require__(18));
var StateLayerComp = /** @class */ (function (_super) {
    tslib_1.__extends(StateLayerComp, _super);
    function StateLayerComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StateLayerComp.prototype.renderImage = function () {
        var _a;
        // @ts-ignore
        window.location.href = (_a = window.config) === null || _a === void 0 ? void 0 : _a.hServer;
        //render水印
        if (!this.base64Url) {
            // @ts-ignore
            function getPixelRatio(context) {
                if (!context) {
                    return 1;
                }
                var backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            }
            ;
            // @ts-ignore
            function toCode(str) {
                //定义密钥，36个字母和数字
                var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                var len = key.length; //获取密钥的长度
                var a = key.split(""); //把密钥字符串转换为字符数组
                var s = "", b, b1, b2, b3; //定义临时变量
                for (var i = 0; i < str.length; i++) { //遍历字符串
                    b = str.charCodeAt(i); //逐个提取每个字符，并获取Unicode编码值
                    b1 = b % len; //求Unicode编码值得余数
                    b = (b - b1) / len; //求最大倍数
                    b2 = b % len; //求最大倍数的于是
                    b = (b - b2) / len; //求最大倍数
                    b3 = b % len; //求最大倍数的余数
                    s += a[b3] + a[b2] + a[b1]; //根据余数值映射到密钥中对应下标位置的字符
                }
                return s; //返回这些映射的字符
            }
            // @ts-ignore
            function fromCode(str) {
                //定义密钥，36个字母和数字
                var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                var len = key.length; //获取密钥的长度
                var b, b1, b2, b3, d = 0, s; //定义临时变量
                s = new Array(Math.floor(str.length / 3)); //计算加密字符串包含的字符数，并定义数组
                b = s.length; //获取数组的长度
                for (var i = 0; i < b; i++) { //以数组的长度循环次数，遍历加密字符串
                    b1 = key.indexOf(str.charAt(d)); //截取周期内第一个字符串，计算在密钥中的下标值
                    d++;
                    b2 = key.indexOf(str.charAt(d)); //截取周期内第二个字符串，计算在密钥中的下标值
                    d++;
                    b3 = key.indexOf(str.charAt(d)); //截取周期内第三个字符串，计算在密钥中的下标值
                    d++;
                    s[i] = b1 * len * len + b2 * len + b3; //利用下标值，反推被加密字符的Unicode编码值
                }
                b = eval("String.fromCharCode(" + s.join(',') + ")"); // 用fromCharCode()算出字符串
                return b; //返回被解密的字符串
            }
            var _b = {}, _c = _b.gapX, gapX = _c === void 0 ? 212 : _c, _d = _b.gapY, gapY = _d === void 0 ? 222 : _d, _e = _b.width, width = _e === void 0 ? 120 : _e, _f = _b.height, height = _f === void 0 ? 64 : _f, _g = _b.rotate, rotate = _g === void 0 ? -22 : _g, // 默认旋转 -22 度
            _h = _b.content, // 默认旋转 -22 度
            content = _h === void 0 ? [fromCode("V2WQQXSC7PQ1UPJYCJTQQUMZ3Y6QDAQVEWUYUOLTOYUMZ"),
                fromCode("AC6ADIADIADEABWABLABLADLADLADLABKACZADCADOAC6AC7ADAACZAC7ABKAC1ADDADB")] : _h, _j = _b.offsetLeft, offsetLeft = _j === void 0 ? 0 : _j, _k = _b.offsetTop, offsetTop = _k === void 0 ? 0 : _k, _l = _b.fontStyle, fontStyle = _l === void 0 ? 'normal' : _l, _m = _b.fontWeight, fontWeight = _m === void 0 ? 'normal' : _m, _o = _b.fontColor, fontColor = _o === void 0 ? 'rgba(0,0,0,.15)' : _o, _p = _b.fontSize, fontSize = _p === void 0 ? 16 : _p, _q = _b.fontFamily, fontFamily = _q === void 0 ? 'sans-serif' : _q;
            var canvas = document.createElement('canvas');
            var ctx_1 = canvas.getContext('2d');
            var ratio = getPixelRatio(ctx_1);
            var canvasWidth = (gapX + width) * ratio + "px";
            var canvasHeight = (gapY + height) * ratio + "px";
            var canvasOffsetLeft = offsetLeft || gapX / 2;
            var canvasOffsetTop = offsetTop || gapY / 2;
            canvas.setAttribute('width', canvasWidth);
            canvas.setAttribute('height', canvasHeight);
            if (ctx_1) { // 旋转字符 rotate
                ctx_1.translate(canvasOffsetLeft * ratio, canvasOffsetTop * ratio);
                ctx_1.rotate((Math.PI / 180) * Number(rotate));
                var markWidth = width * ratio;
                var markHeight = height * ratio;
                var markSize = Number(fontSize) * ratio;
                ctx_1.font = fontStyle + " normal " + fontWeight + " " + markSize + "px/" + markHeight + "px " + fontFamily;
                ctx_1.fillStyle = fontColor;
                if (Array.isArray(content)) {
                    content === null || content === void 0 ? void 0 : content.forEach(function (item, index) { return ctx_1.fillText(item, 0, index * 50); });
                }
                else {
                    ctx_1.fillText(content, 0, 0);
                } //@ts-ignore
                this.backgroundSize = gapX + width; //@ts-ignore
                this.base64Url = canvas.toDataURL();
            }
        }
        return preact_1.h("div", { style: {
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                backgroundSize: this.backgroundSize + "px",
                pointerEvents: 'none',
                backgroundRepeat: 'repeat',
                backgroundImage: "url('" + this.base64Url + "')",
            } });
    };
    StateLayerComp.prototype.render = function (_a) {
        var loadingState = _a.loadingState, top = _a.top, height = _a.height, left = _a.left, right = _a.right;
        var display = loadingState === 'DONE' ? 'none' : 'block';
        var layerStyle = { display: display, top: top, height: height, left: left, right: right };
        var message = null;
        if (loadingState === 'EMPTY') {
            message = "无数据"; // i18n.get('display.noData');   // xd
        }
        else if (loadingState === 'LOADING') {
            message = i18n_1.default.get('display.loadingData');
        }
        layerStyle.display = "block"; //@ts-ignore
        layerStyle.pointerEvents = "none"; //@ts-ignore
        layerStyle.background = "transparent";
        return (preact_1.h("div", { class: dom_1.cls('layer-state'), style: layerStyle },
            preact_1.h("div", { class: dom_1.cls('layer-state-content') },
                preact_1.h("p", null, message),
                loadingState === 'LOADING' && preact_1.h("div", { class: dom_1.cls('layer-state-loading') }))));
    };
    return StateLayerComp;
}(preact_1.Component));
exports.StateLayer = hoc_1.connect(function (_a) {
    var data = _a.data, dimension = _a.dimension;
    var headerHeight = dimension.headerHeight, bodyHeight = dimension.bodyHeight, cellBorderWidth = dimension.cellBorderWidth, tableBorderWidth = dimension.tableBorderWidth, scrollXHeight = dimension.scrollXHeight, scrollYWidth = dimension.scrollYWidth;
    return {
        loadingState: data.loadingState,
        top: headerHeight + cellBorderWidth,
        height: bodyHeight - scrollXHeight - tableBorderWidth,
        left: 0,
        right: scrollYWidth + tableBorderWidth,
    };
})(StateLayerComp);


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterLayer = exports.FilterLayerComp = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var filterLayerInner_1 = __webpack_require__(106);
var FilterLayerComp = /** @class */ (function (_super) {
    tslib_1.__extends(FilterLayerComp, _super);
    function FilterLayerComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilterLayerComp.prototype.render = function (_a) {
        var activeColumnAddress = _a.activeColumnAddress, activeFilterState = _a.activeFilterState;
        return (activeColumnAddress &&
            activeFilterState && (preact_1.h(filterLayerInner_1.FilterLayerInner, { columnAddress: activeColumnAddress, filterState: activeFilterState })));
    };
    return FilterLayerComp;
}(preact_1.Component));
exports.FilterLayerComp = FilterLayerComp;
exports.FilterLayer = hoc_1.connect(function (_a) {
    var filterLayerState = _a.filterLayerState;
    var activeColumnAddress = filterLayerState.activeColumnAddress, activeFilterState = filterLayerState.activeFilterState;
    return { activeColumnAddress: activeColumnAddress, activeFilterState: activeFilterState };
})(FilterLayerComp);


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterLayerInner = exports.FilterLayerInnerComp = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var textFilter_1 = __webpack_require__(107);
var datePickerFilter_1 = __webpack_require__(108);
var filterOperator_1 = __webpack_require__(109);
var selectFilter_1 = __webpack_require__(110);
var common_1 = __webpack_require__(0);
var i18n_1 = tslib_1.__importDefault(__webpack_require__(18));
var FilterLayerInnerComp = /** @class */ (function (_super) {
    tslib_1.__extends(FilterLayerInnerComp, _super);
    function FilterLayerInnerComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { left: _this.props.columnAddress.left };
        _this.renderFilter = function (index) {
            var _a = _this.props, columnAddress = _a.columnAddress, filterState = _a.filterState, columnInfo = _a.columnInfo;
            var type = columnInfo.filter.type;
            switch (type) {
                case 'text':
                case 'number':
                    return (preact_1.h(textFilter_1.TextFilter, { columnAddress: columnAddress, filterState: filterState, filterIndex: index }));
                case 'date':
                    return (preact_1.h(datePickerFilter_1.DatePickerFilter, { columnAddress: columnAddress, filterState: filterState, filterIndex: index }));
                case 'select':
                    return preact_1.h(selectFilter_1.SelectFilter, { columnAddress: columnAddress, filterState: filterState });
                default:
                    return null;
            }
        };
        return _this;
    }
    //update by tangbin
    FilterLayerInnerComp.prototype.findParentByClassName = function (el, className) {
        var currentEl = el;
        while (currentEl && currentEl.className.split(' ').indexOf(className) == -1) {
            currentEl = currentEl.parentElement;
        }
        return currentEl;
    };
    FilterLayerInnerComp.prototype.componentDidMount = function () {
        var _a = this.props, columnInfo = _a.columnInfo, dispatch = _a.dispatch;
        var filterRenderer = columnInfo.filterRenderer;
        if (!filterRenderer || !this.filterEl) {
            return;
        }
        var FilterRendererClass = filterRenderer;
        var renderer = new FilterRendererClass({ columnInfo: columnInfo });
        var rendererEl = renderer.getElement();
        this.filterEl.appendChild(rendererEl);
        this.renderer = renderer;
        if (common_1.isFunction(renderer.mounted)) {
            renderer.mounted(this.filterEl);
        }
        //update by tangbin
        var left = this.el.getBoundingClientRect().left;
        var clientWidth = this.el.clientWidth;
        var tuiGrid = this.findParentByClassName(this.el, "tui-grid-container");
        var rect = tuiGrid === null || tuiGrid === void 0 ? void 0 : tuiGrid.getBoundingClientRect();
        if (rect && rect.left + rect.width < left + clientWidth) {
            this.setState({ left: rect.width - clientWidth });
        }
        // const { left } = this.el.getBoundingClientRect();
        // const { clientWidth } = this.el;
        // const { innerWidth } = window;
        //
        // if (innerWidth < left + clientWidth) {
        //   const orgLeft = this.state.left;
        //   this.setState({ left: orgLeft - (left + clientWidth - innerWidth) });
        // }
    };
    FilterLayerInnerComp.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.renderer) {
            this.renderer.render({ columnInfo: nextProps.columnInfo });
        }
    };
    FilterLayerInnerComp.prototype.componentWillUnmount = function () {
        if (this.renderer && common_1.isFunction(this.renderer.beforeDestroy)) {
            this.renderer.beforeDestroy();
        }
    };
    FilterLayerInnerComp.prototype.componentDidUpdate = function (prevProp) {
        var _a = this.props.columnAddress, currentColName = _a.name, currentLeft = _a.left;
        if (currentColName !== prevProp.columnAddress.name) {
            var left = this.el.getBoundingClientRect().left;
            var clientWidth = this.el.clientWidth;
            // const { innerWidth } = window;
            var tuiGrid = this.findParentByClassName(this.el, "tui-grid-container");
            var rect = tuiGrid === null || tuiGrid === void 0 ? void 0 : tuiGrid.getBoundingClientRect();
            var innerWidth = rect ? (rect.left + rect.width) : window.innerWidth;
            var diff = currentLeft - this.state.left;
            var resultLeft = currentLeft;
            // Positioning the filter layer inside the viewport when it is out of the viewport
            if (innerWidth < left + diff + clientWidth) {
                resultLeft = currentLeft - (left + diff + clientWidth - innerWidth);
            }
            if (rect && innerWidth < resultLeft + clientWidth) {
                resultLeft = rect.width - clientWidth;
            }
            this.setState({ left: resultLeft });
        }
    };
    FilterLayerInnerComp.prototype.render = function () {
        var _this = this;
        var _a = this.props, columnInfo = _a.columnInfo, renderSecondFilter = _a.renderSecondFilter, dispatch = _a.dispatch, currentColumnActive = _a.currentColumnActive, filterState = _a.filterState;
        var _b = columnInfo.filter, showApplyBtn = _b.showApplyBtn, showClearBtn = _b.showClearBtn;
        var left = this.state.left;
        //update by tangbin
        var filterRenderer = columnInfo.filterRenderer;
        if (filterRenderer) {
            return preact_1.h("div", { ref: function (el) { return _this.el = el; }, className: dom_1.cls('filter-container'), style: { left: left } },
                preact_1.h("div", null,
                    preact_1.h("span", { className: dom_1.cls('btn-filter', [currentColumnActive, 'btn-filter-active'], 'filter-icon') }),
                    preact_1.h("a", { className: dom_1.cls('btn-close'), onClick: function () { return dispatch('setActiveColumnAddress', null); } })),
                preact_1.h("div", { ref: function (el) { return _this.filterEl = el; } }));
        }
        return (preact_1.h("div", { className: dom_1.cls('filter-container'), style: { left: left }, ref: function (el) {
                _this.el = el;
            } },
            preact_1.h("div", null,
                preact_1.h("span", { className: dom_1.cls('btn-filter', [currentColumnActive, 'btn-filter-active'], 'filter-icon') }),
                preact_1.h("a", { className: dom_1.cls('btn-close'), onClick: function () {
                        dispatch('setActiveColumnAddress', null);
                    } })),
            this.renderFilter(0),
            renderSecondFilter && preact_1.h(filterOperator_1.FilterOperator, { filterState: filterState }),
            renderSecondFilter && this.renderFilter(1),
            preact_1.h("div", { className: dom_1.cls('filter-btn-container') },
                showClearBtn && (preact_1.h("button", { className: dom_1.cls('filter-btn', 'filter-btn-clear'), onClick: function () {
                        dispatch('clearActiveFilterState');
                    }, type: "button" }, i18n_1.default.get('filter.clear'))),
                showApplyBtn && (preact_1.h("button", { className: dom_1.cls('filter-btn', 'filter-btn-apply'), onClick: function () {
                        dispatch('applyActiveFilterState');
                    }, type: "button" }, i18n_1.default.get('filter.apply'))))));
    };
    return FilterLayerInnerComp;
}(preact_1.Component));
exports.FilterLayerInnerComp = FilterLayerInnerComp;
exports.FilterLayerInner = hoc_1.connect(function (store, _a) {
    var columnAddress = _a.columnAddress, filterState = _a.filterState;
    var data = store.data, column = store.column;
    var filters = data.filters;
    var allColumnMap = column.allColumnMap;
    var currentColumnActive = !!filters && common_1.some(function (item) { return item.columnName === columnAddress.name; }, filters);
    var renderSecondFilter = !!(filterState.type !== 'select' &&
        filterState.operator &&
        filterState.state[0] &&
        filterState.state[0].value.length);
    return {
        columnInfo: allColumnMap[columnAddress.name],
        columnAddress: columnAddress,
        filters: filters,
        renderSecondFilter: renderSecondFilter,
        currentColumnActive: currentColumnActive,
    };
})(FilterLayerInnerComp);


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TextFilter = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var filter_1 = __webpack_require__(31);
var common_1 = __webpack_require__(0);
var keyboard_1 = __webpack_require__(22);
var constant_1 = __webpack_require__(10);
var TextFilterComp = /** @class */ (function (_super) {
    tslib_1.__extends(TextFilterComp, _super);
    function TextFilterComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getPreviousValue = function () {
            var _a = _this.props, filterIndex = _a.filterIndex, filterState = _a.filterState;
            var state = filterState.state;
            var code = 'eq';
            var value = '';
            if (state.length && state[filterIndex]) {
                var _b = state[filterIndex], prevCode = _b.code, prevValue = _b.value;
                code = prevCode;
                value = String(prevValue);
            }
            return { value: value, code: code };
        };
        _this.handleChange = common_1.debounce(function (ev) {
            var dispatch = _this.props.dispatch;
            var keyCode = ev.keyCode;
            if (keyboard_1.isNonPrintableKey(keyCode)) {
                return;
            }
            var keyName = keyboard_1.keyNameMap[keyCode];
            if (keyName === 'enter') {
                dispatch('applyActiveFilterState');
            }
            else {
                var filterIndex = _this.props.filterIndex;
                var value = _this.inputEl.value;
                var code = _this.selectEl.value;
                dispatch('setActiveFilterState', { value: value, code: code }, filterIndex);
            }
        }, constant_1.FILTER_DEBOUNCE_TIME);
        return _this;
    }
    TextFilterComp.prototype.render = function () {
        var _this = this;
        var columnInfo = this.props.columnInfo;
        var _a = this.getPreviousValue(), code = _a.code, value = _a.value;
        var filterSelectOptions = filter_1.createFilterSelectOption();
        var selectOption = filterSelectOptions[columnInfo.filter.type];
        return (preact_1.h("div", null,
            preact_1.h("div", { className: dom_1.cls('filter-dropdown') },
                preact_1.h("select", { ref: function (ref) {
                        _this.selectEl = ref;
                    }, onChange: this.handleChange }, Object.keys(selectOption).map(function (key) {
                    return (preact_1.h("option", { value: key, key: key, selected: code === key }, selectOption[key]));
                }))),
            preact_1.h("input", { ref: function (ref) {
                    _this.inputEl = ref;
                }, type: "text", className: dom_1.cls('filter-input'), onInput: this.handleChange, value: value })));
    };
    return TextFilterComp;
}(preact_1.Component));
exports.TextFilter = hoc_1.connect(function (store, _a) {
    var filterIndex = _a.filterIndex, columnAddress = _a.columnAddress, filterState = _a.filterState;
    var column = store.column, data = store.data;
    var allColumnMap = column.allColumnMap;
    var filters = data.filters;
    return {
        columnInfo: allColumnMap[columnAddress.name],
        columnAddress: columnAddress,
        filterIndex: filterIndex,
        filters: filters,
        filterState: filterState,
    };
})(TextFilterComp);


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DatePickerFilter = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var instance_1 = __webpack_require__(8);
var dom_1 = __webpack_require__(2);
var filter_1 = __webpack_require__(31);
var common_1 = __webpack_require__(0);
var keyboard_1 = __webpack_require__(22);
var constant_1 = __webpack_require__(10);
//update by tangbin
var TuiDatePicker = /** @class */ (function () {
    function TuiDatePicker(container, options) {
    }
    TuiDatePicker.prototype.open = function () {
    };
    TuiDatePicker.prototype.destroy = function () {
    };
    TuiDatePicker.prototype.on = function (eventName, handler) {
    };
    return TuiDatePicker;
}());
var DatePickerFilterComp = /** @class */ (function (_super) {
    tslib_1.__extends(DatePickerFilterComp, _super);
    function DatePickerFilterComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.createDatePicker = function () {
            var _a = _this.props, columnInfo = _a.columnInfo, grid = _a.grid;
            var _b = columnInfo.filter.options, options = _b === void 0 ? {} : _b;
            var usageStatistics = grid.usageStatistics;
            var value = _this.getPreviousValue().value;
            var date;
            if (!options.format) {
                options.format = 'yyyy/MM/dd';
            }
            if (common_1.isString(value) && value.length) {
                date = new Date(value);
            }
            var defaultOptions = {
                date: date,
                type: 'date',
                input: {
                    element: _this.inputEl,
                    format: options.format,
                },
                usageStatistics: usageStatistics,
            };
            _this.datePickerEl = new TuiDatePicker(_this.calendarWrapper, common_1.deepMergedCopy(defaultOptions, options || {}));
            _this.datePickerEl.on('change', _this.handleChange);
        };
        _this.handleKeyUp = common_1.debounce(function (ev) {
            var keyCode = ev.keyCode;
            var keyName = keyboard_1.keyNameMap[keyCode];
            var dispatch = _this.props.dispatch;
            if (keyboard_1.isNonPrintableKey(keyCode)) {
                return;
            }
            if (keyName === 'enter') {
                dispatch('applyActiveFilterState');
            }
            else {
                _this.handleChange();
            }
        }, constant_1.FILTER_DEBOUNCE_TIME);
        _this.handleChange = function () {
            var dispatch = _this.props.dispatch;
            var filterIndex = _this.props.filterIndex;
            var value = _this.inputEl.value;
            var code = _this.selectEl.value;
            dispatch('setActiveFilterState', { value: value, code: code }, filterIndex);
        };
        _this.getPreviousValue = function () {
            var _a = _this.props, filterIndex = _a.filterIndex, filterState = _a.filterState;
            var state = filterState.state;
            var code = 'eq';
            var value = '';
            if (state.length && state[filterIndex]) {
                var _b = state[filterIndex], prevCode = _b.code, prevValue = _b.value;
                code = prevCode;
                value = String(prevValue);
            }
            return { value: value, code: code };
        };
        _this.openDatePicker = function () {
            _this.datePickerEl.open();
        };
        return _this;
    }
    DatePickerFilterComp.prototype.componentDidMount = function () {
        this.createDatePicker();
    };
    DatePickerFilterComp.prototype.componentWillUnmount = function () {
        this.datePickerEl.destroy();
    };
    DatePickerFilterComp.prototype.render = function () {
        var _this = this;
        var columnInfo = this.props.columnInfo;
        var options = columnInfo.filter.options;
        var showIcon = !(options && options.showIcon === false);
        var filterSelectOptions = filter_1.createFilterSelectOption();
        var selectOption = filterSelectOptions.date;
        var _a = this.getPreviousValue(), value = _a.value, code = _a.code;
        return (preact_1.h("div", null,
            preact_1.h("div", { className: dom_1.cls('filter-dropdown') },
                preact_1.h("select", { ref: function (ref) {
                        _this.selectEl = ref;
                    }, onChange: this.handleChange }, Object.keys(selectOption).map(function (key) {
                    return (preact_1.h("option", { value: key, key: key, selected: code === key }, selectOption[key]));
                }))),
            preact_1.h("div", { className: dom_1.cls('datepicker-input-container') },
                preact_1.h("input", { ref: function (ref) {
                        _this.inputEl = ref;
                    }, type: "text", className: dom_1.cls('filter-input', [showIcon, 'datepicker-input']), onKeyUp: this.handleKeyUp, value: value }),
                showIcon && preact_1.h("i", { className: dom_1.cls('date-icon'), onClick: this.openDatePicker })),
            preact_1.h("div", { ref: function (ref) {
                    _this.calendarWrapper = ref;
                }, style: { marginTop: '-4px' } })));
    };
    return DatePickerFilterComp;
}(preact_1.Component));
exports.DatePickerFilter = hoc_1.connect(function (store, _a) {
    var filterIndex = _a.filterIndex, columnAddress = _a.columnAddress, filterState = _a.filterState;
    var column = store.column, id = store.id, data = store.data;
    var allColumnMap = column.allColumnMap;
    var filters = data.filters;
    return {
        grid: instance_1.getInstance(id),
        columnInfo: allColumnMap[columnAddress.name],
        columnAddress: columnAddress,
        filterIndex: filterIndex,
        filters: filters,
        filterState: filterState,
    };
})(DatePickerFilterComp);


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterOperator = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var FilterOperatorComp = /** @class */ (function (_super) {
    tslib_1.__extends(FilterOperatorComp, _super);
    function FilterOperatorComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleChangeOperator = function (ev) {
            var value = ev.target.value;
            _this.props.dispatch('setActiveFilterOperator', value);
        };
        return _this;
    }
    FilterOperatorComp.prototype.render = function () {
        var _this = this;
        var operator = this.props.operator;
        return (preact_1.h("div", { className: dom_1.cls('filter-comparator-container') }, ['AND', 'OR'].map(function (operatorType) {
            var checked = operator === operatorType;
            return (preact_1.h("div", { key: operatorType, className: dom_1.cls('filter-comparator', [checked, 'filter-comparator-checked']) },
                preact_1.h("label", null,
                    preact_1.h("input", { type: "radio", name: "filterOperator", value: operatorType, checked: checked, onChange: _this.handleChangeOperator }),
                    preact_1.h("span", null, operatorType))));
        })));
    };
    return FilterOperatorComp;
}(preact_1.Component));
exports.FilterOperator = hoc_1.connect(function (_, _a) {
    var filterState = _a.filterState;
    return ({
        operator: filterState.operator || 'AND',
    });
})(FilterOperatorComp);


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectFilter = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var instance_1 = __webpack_require__(8);
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
var data_1 = __webpack_require__(6);
var constant_1 = __webpack_require__(10);
var i18n_1 = tslib_1.__importDefault(__webpack_require__(18));
var SelectFilterComp = /** @class */ (function (_super) {
    tslib_1.__extends(SelectFilterComp, _super);
    function SelectFilterComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            searchInput: '',
        };
        _this.handleChange = common_1.debounce(function (ev, value) {
            var dispatch = _this.props.dispatch;
            var checked = ev.target.checked;
            dispatch('setActiveSelectFilterState', value, checked);
        }, constant_1.FILTER_DEBOUNCE_TIME);
        _this.toggleAllColumnCheckbox = common_1.debounce(function (ev) {
            var checked = ev.target.checked;
            _this.props.dispatch('toggleSelectAllCheckbox', checked);
        }, constant_1.FILTER_DEBOUNCE_TIME);
        _this.searchColumnData = common_1.debounce(function (ev) {
            var value = ev.target.value;
            _this.setState({ searchInput: value });
        }, constant_1.FILTER_DEBOUNCE_TIME);
        return _this;
    }
    SelectFilterComp.prototype.render = function () {
        var _this = this;
        var _a = this.props, columnData = _a.columnData, isAllSelected = _a.isAllSelected;
        var searchInput = this.state.searchInput;
        var data = searchInput.length
            ? columnData.filter(function (item) { return String(item.value).indexOf(searchInput) !== -1; })
            : columnData;
        return (preact_1.h("div", { className: dom_1.cls('filter-list-container') },
            preact_1.h("input", { type: "text", className: dom_1.cls('filter-input'), placeholder: "Search...", onKeyUp: this.searchColumnData, value: searchInput ? String(searchInput) : '' }),
            preact_1.h("li", { className: dom_1.cls('filter-list-item', [isAllSelected, 'filter-list-item-checked']) },
                preact_1.h("label", null,
                    preact_1.h("input", { type: "checkbox", onChange: this.toggleAllColumnCheckbox, checked: isAllSelected }),
                    preact_1.h("span", null, i18n_1.default.get('filter.selectAll')))),
            preact_1.h("ul", { className: dom_1.cls('filter-list') }, data.map(function (item) {
                var value = item.value, text = item.text, checked = item.checked;
                return (preact_1.h("li", { className: dom_1.cls('filter-list-item', [checked, 'filter-list-item-checked']), key: text },
                    preact_1.h("label", null,
                        preact_1.h("input", { type: "checkbox", checked: checked, onChange: function (ev) { return _this.handleChange(ev, value); } }),
                        preact_1.h("span", null, text))));
            }))));
    };
    return SelectFilterComp;
}(preact_1.Component));
exports.SelectFilter = hoc_1.connect(function (store, _a) {
    var columnAddress = _a.columnAddress, filterState = _a.filterState;
    var column = store.column, id = store.id, data = store.data;
    var filters = data.filters, rawData = data.rawData;
    var allColumnMap = column.allColumnMap;
    var state = filterState.state;
    var columnName = columnAddress.name;
    var uniqueColumnData = data_1.getUniqColumnData(rawData, column, columnName);
    var columnData = uniqueColumnData
        .filter(function (value) { return value; })
        .map(function (value) { return ({
        value: value,
        text: String(value),
        checked: common_1.some(function (item) { return value === item.value; }, state),
    }); });
    var isExistEmptyValue = uniqueColumnData.some(function (value) { return common_1.isBlank(value); });
    if (isExistEmptyValue) {
        columnData.push({
            value: '',
            text: i18n_1.default.get('filter.emptyValue'),
            checked: common_1.some(function (_a) {
                var value = _a.value;
                return common_1.isBlank(value);
            }, state),
        });
    }
    return {
        grid: instance_1.getInstance(id),
        columnData: columnData,
        columnInfo: allColumnMap[columnName],
        columnAddress: columnAddress,
        filters: filters,
        isAllSelected: state.length === uniqueColumnData.length,
    };
})(SelectFilterComp);


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMenuItem = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var common_1 = __webpack_require__(0);
var contextMenu_1 = __webpack_require__(54);
var dom_1 = __webpack_require__(2);
var constant_1 = __webpack_require__(10);
var ContextMenuItemComp = /** @class */ (function (_super) {
    tslib_1.__extends(ContextMenuItemComp, _super);
    function ContextMenuItemComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = null;
        _this.showSubMenu = function (ev) {
            var _a;
            var menuItem = _this.props.menuItem;
            if ((_a = menuItem.subMenu) === null || _a === void 0 ? void 0 : _a.length) {
                var _b = ev.target, offsetWidth = _b.offsetWidth, offsetTop = _b.offsetTop, parentElement = _b.parentElement;
                var innerWidth = window.innerWidth, innerHeight = window.innerHeight, scrollX = window.scrollX, scrollY = window.scrollY;
                var bottom = innerHeight + scrollY - (offsetTop + constant_1.DEFAULT_SUB_CONTEXT_MENU_TOP);
                var right = innerWidth + scrollX - offsetWidth;
                var element = ev.target;
                do {
                    element = element.parentElement;
                    var parentOffsetTop = element.offsetTop, parentOffsetLeft = element.offsetLeft;
                    right -= parentOffsetLeft;
                    bottom -= parentOffsetTop;
                } while (!element.className.match(dom_1.cls('container')));
                var needReverse = _this.container.offsetWidth > right || parentElement.offsetLeft < 0;
                var resultPos = {
                    top: constant_1.DEFAULT_SUB_CONTEXT_MENU_TOP,
                    left: needReverse ? -parentElement.offsetWidth : offsetWidth,
                    right: needReverse ? right + offsetWidth : right,
                    bottom: bottom,
                };
                var subMenuInfo = { menuItems: menuItem.subMenu, pos: resultPos };
                _this.setState({ subMenuInfo: subMenuInfo });
            }
        };
        _this.hideSubMenu = function () {
            _this.setState({ subMenuInfo: null });
        };
        _this.execAction = function (ev) {
            var _a = _this.props, menuItem = _a.menuItem, dispatch = _a.dispatch;
            var action = menuItem.action;
            if (common_1.isString(action)) {
                _this.props.dispatch(action);
            }
            else if (action) {
                action();
            }
            ev.stopPropagation();
            dispatch('hideContextMenu');
        };
        return _this;
    }
    ContextMenuItemComp.prototype.createClassNames = function () {
        var _a = this.props.menuItem, subMenu = _a.subMenu, disabled = _a.disabled, _b = _a.classNames, classNames = _b === void 0 ? [] : _b;
        var classList = classNames.concat('menu-item');
        if (subMenu) {
            classList.push('has-submenu');
        }
        if (disabled) {
            classList.push('disabled');
        }
        return classList.join(' ');
    };
    ContextMenuItemComp.prototype.render = function (_a) {
        var _this = this;
        var menuItem = _a.menuItem;
        var name = menuItem.name, _b = menuItem.label, label = _b === void 0 ? '' : _b, disabled = menuItem.disabled;
        if (name === 'separator') {
            return preact_1.h("li", { class: "menu-item separator" });
        }
        // eslint-disable-next-line no-undefined
        var getListener = function (listener) { return (disabled ? undefined : listener); };
        var classNames = this.createClassNames();
        var subMenuInfo = this.state.subMenuInfo;
        return (preact_1.h("li", { ref: function (ref) {
                _this.container = ref;
            }, class: classNames, onClick: getListener(this.execAction), onMouseEnter: getListener(this.showSubMenu), onMouseLeave: getListener(this.hideSubMenu) },
            preact_1.h("span", { dangerouslySetInnerHTML: { __html: label } }),
            subMenuInfo && preact_1.h(contextMenu_1.ContextMenu, { menuItems: subMenuInfo.menuItems, pos: subMenuInfo.pos })));
    };
    return ContextMenuItemComp;
}(preact_1.Component));
exports.ContextMenuItem = hoc_1.connect()(ContextMenuItemComp);


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HeightResizeHandle = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var HeightResizeHandleComp = /** @class */ (function (_super) {
    tslib_1.__extends(HeightResizeHandleComp, _super);
    function HeightResizeHandleComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dragStartY = -1;
        _this.dragStartBodyHeight = -1;
        _this.handleMouseDown = function (ev) {
            _this.dragStartY = ev.pageY;
            _this.dragStartBodyHeight = _this.props.bodyHeight;
            dom_1.setCursorStyle('row-resize');
            document.addEventListener('mousemove', _this.handleMouseMove);
            document.addEventListener('mouseup', _this.clearDocumentEvents);
            document.addEventListener('selectstart', _this.handleSelectStart);
        };
        _this.handleSelectStart = function (ev) {
            ev.preventDefault();
        };
        _this.handleMouseMove = function (ev) {
            var distance = ev.pageY - _this.dragStartY;
            _this.props.dispatch('setBodyHeight', _this.dragStartBodyHeight + distance);
        };
        _this.clearDocumentEvents = function () {
            dom_1.setCursorStyle('');
            document.removeEventListener('mousemove', _this.handleMouseMove);
            document.removeEventListener('mouseup', _this.clearDocumentEvents);
            document.removeEventListener('selectstart', _this.handleSelectStart);
        };
        return _this;
    }
    HeightResizeHandleComp.prototype.render = function () {
        return (preact_1.h("div", { class: dom_1.cls('height-resize-handle'), onMouseDown: this.handleMouseDown },
            preact_1.h("button", { type: "button" },
                preact_1.h("span", null))));
    };
    return HeightResizeHandleComp;
}(preact_1.Component));
exports.HeightResizeHandle = hoc_1.connect(function (_a) {
    var dimension = _a.dimension;
    return ({
        bodyHeight: dimension.bodyHeight,
    });
})(HeightResizeHandleComp);


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Clipboard = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var keyboard_1 = __webpack_require__(22);
var browser_1 = __webpack_require__(39);
var clipboard_1 = __webpack_require__(40);
var common_1 = __webpack_require__(0);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var eventBus_1 = __webpack_require__(7);
var KEYDOWN_LOCK_TIME = 10;
var ClipboardComp = /** @class */ (function (_super) {
    tslib_1.__extends(ClipboardComp, _super);
    function ClipboardComp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isLocked = false;
        _this.lock = function () {
            _this.isLocked = true;
            setTimeout(_this.unlock.bind(_this), KEYDOWN_LOCK_TIME);
        };
        /**
         * Unlock
         * @private
         */
        _this.unlock = function () {
            _this.isLocked = false;
        };
        _this.onBlur = function () {
            _this.props.dispatch('setNavigating', false);
        };
        _this.dispatchKeyboardEvent = function (type, command) {
            var dispatch = _this.props.dispatch;
            switch (type) {
                case 'move':
                    dispatch('selectionEnd');
                    dispatch('moveFocus', command);
                    dispatch('setScrollToFocus');
                    break;
                case 'edit':
                    dispatch('editFocus', command);
                    dispatch('setScrollToFocus');
                    break;
                case 'select':
                    dispatch('moveSelection', command);
                    dispatch('setScrollToSelection');
                    break;
                case 'remove':
                    dispatch('removeContent');
                    break;
                /*
                 * Call directly because of timing issues
                 * - Step 1: When the keys(ctrl+c) are downed on grid, 'clipboard' is triggered.
                 * - Step 2: When 'clipboard' event is fired,
                 *           all browsers append copied data and focus to contenteditable element and
                 *           IE browsers set selection for triggering 'copy' event.
                 * - Step 3: Finally, when 'copy' event is fired on browsers,
                 *           setting copied data to ClipboardEvent.clipboardData or window.clipboardData(IE).
                 */
                case 'clipboard': {
                    if (!_this.el) {
                        return;
                    }
                    var store = _this.context.store;
                    _this.el.textContent = clipboard_1.getText(store);
                    if (dom_1.isSupportWindowClipboardData()) {
                        dom_1.setClipboardSelection(_this.el.childNodes[0]);
                    }
                    break;
                }
                default:
                    break;
            }
        };
        /**
         * Event handler for the keydown event
         * @param {Event} ev - Event
         * @private
         */
        _this.onKeyDown = function (ev) {
            if (_this.isLocked) {
                ev.preventDefault();
                return;
            }
            var _a = keyboard_1.keyEventGenerate(ev), type = _a.type, command = _a.command;
            if (!type) {
                return;
            }
            _this.lock();
            if (type !== 'clipboard') {
                ev.preventDefault();
            }
            if (!(type === 'clipboard' && command === 'paste')) {
                var _b = _this.props, rowKey = _b.rowKey, columnName = _b.columnName;
                var gridEvent = new gridEvent_1.default({ keyboardEvent: ev, rowKey: rowKey, columnName: columnName });
                /**
                 * Occurs when key down event is triggered.
                 * @event Grid#keydown
                 * @property {Grid} instance - Current grid instance
                 * @property {Object} keyboardEvent - Keyboard Event
                 * @property {Object} rowKey - Focused rowKey
                 * @property {Object} columnName - Focused column name
                 */
                _this.props.eventBus.trigger('keydown', gridEvent);
                if (!gridEvent.isStopped()) {
                    _this.dispatchKeyboardEvent(type, command);
                }
            }
        };
        _this.onCopy = function (ev) {
            if (!_this.el) {
                return;
            }
            var text = _this.el.textContent;
            if (dom_1.isSupportWindowClipboardData()) {
                window.clipboardData.setData('Text', text);
            }
            else if (ev.clipboardData) {
                ev.clipboardData.setData('text/plain', text);
            }
            ev.preventDefault();
        };
        _this.onPaste = function (ev) {
            var clipboardData = ev.clipboardData || window.clipboardData;
            if (!clipboardData) {
                return;
            }
            if (!browser_1.isEdge() && !dom_1.isSupportWindowClipboardData()) {
                ev.preventDefault();
                _this.pasteInOtherBrowsers(clipboardData);
            }
            else {
                _this.pasteInMSBrowser(clipboardData);
            }
        };
        return _this;
    }
    ClipboardComp.prototype.isClipboardFocused = function () {
        return document.hasFocus() && document.activeElement === this.el;
    };
    /**
     * Paste copied data in other browsers (chrome, safari, firefox)
     * [if] condition is copying from ms-excel,
     * [else] condition is copying from the grid or the copied data is plain text.
     */
    ClipboardComp.prototype.pasteInOtherBrowsers = function (clipboardData) {
        if (!this.el) {
            return;
        }
        var el = this.el;
        var html = clipboardData.getData('text/html');
        var data;
        if (html && html.indexOf('table') !== -1) {
            // step 1: Append copied data on contenteditable element to parsing correctly table data.
            el.innerHTML = html;
            // step 2: Make grid data from cell data of appended table element.
            var rows = el.querySelector('tbody').rows;
            data = dom_1.convertTableToData(rows);
            // step 3: Empty contenteditable element to reset.
            el.innerHTML = '';
        }
        else {
            data = common_1.convertTextToData(clipboardData.getData('text/plain'));
        }
        this.props.dispatch('paste', data);
    };
    /**
     * Paste copied data in MS-browsers (IE, edge)
     */
    ClipboardComp.prototype.pasteInMSBrowser = function (clipboardData) {
        var _this = this;
        var data = common_1.convertTextToData(clipboardData.getData('Text'));
        setTimeout(function () {
            if (!_this.el) {
                return;
            }
            var el = _this.el;
            if (el.querySelector('table')) {
                var rows = el.querySelector('tbody').rows;
                data = dom_1.convertTableToData(rows);
            }
            _this.props.dispatch('paste', data);
            el.innerHTML = '';
        }, 0);
    };
    ClipboardComp.prototype.componentDidUpdate = function () {
        var _this = this;
        setTimeout(function () {
            var _a = _this.props, navigating = _a.navigating, editing = _a.editing, filtering = _a.filtering;
            if (_this.el &&
                navigating &&
                !filtering &&
                !editing &&
                !_this.isClipboardFocused() &&
                !browser_1.isMobile()) {
                // @TODO: apply polifyll or alternative for IE, safari
                _this.el.focus({ preventScroll: true });
            }
        });
    };
    ClipboardComp.prototype.render = function () {
        var _this = this;
        return (preact_1.h("div", { class: dom_1.cls('clipboard'), onBlur: this.onBlur, onKeyDown: this.onKeyDown, onCopy: this.onCopy, onPaste: this.onPaste, contentEditable: true, ref: function (el) {
                _this.el = el;
            } }));
    };
    return ClipboardComp;
}(preact_1.Component));
exports.Clipboard = hoc_1.connect(function (_a) {
    var focus = _a.focus, filterLayerState = _a.filterLayerState, id = _a.id;
    return ({
        navigating: focus.navigating,
        rowKey: focus.rowKey,
        columnName: focus.columnName,
        editing: !!focus.editingAddress,
        filtering: !!filterLayerState.activeColumnAddress,
        eventBus: eventBus_1.getEventBus(id),
    });
})(ClipboardComp);


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
var tslib_1 = __webpack_require__(1);
var preact_1 = __webpack_require__(3);
var tui_pagination_1 = tslib_1.__importDefault(__webpack_require__(115));
var hoc_1 = __webpack_require__(4);
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
var instance_1 = __webpack_require__(8);
var eventBus_1 = __webpack_require__(7);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var PaginationComp = /** @class */ (function (_super) {
    tslib_1.__extends(PaginationComp, _super);
    function PaginationComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PaginationComp.prototype.shouldComponentUpdate = function (nextProps) {
        return !common_1.shallowEqual(this.props.pageOptions, nextProps.pageOptions);
    };
    PaginationComp.prototype.componentDidMount = function () {
        this.createPagination();
    };
    PaginationComp.prototype.componentWillReceiveProps = function (nextProps) {
        if (!this.el || !this.tuiPagination) {
            return;
        }
        var pageOptions = nextProps.pageOptions;
        var totalCount = pageOptions.totalCount, page = pageOptions.page, perPage = pageOptions.perPage;
        if (!common_1.isNumber(totalCount) || !common_1.isNumber(page) || !common_1.isNumber(perPage)) {
            return;
        }
        if (this.props.pageOptions.perPage !== perPage ||
            this.props.pageOptions.totalCount !== totalCount) {
            this.tuiPagination.setItemsPerPage(perPage);
            this.tuiPagination.reset(totalCount);
        }
        if (this.tuiPagination.getCurrentPage() !== page) {
            this.removeEventListener();
            this.tuiPagination.movePageTo(page);
            this.addEventListener();
        }
    };
    PaginationComp.prototype.componentWillUnmount = function () {
        if (this.tuiPagination) {
            this.removeEventListener();
        }
    };
    PaginationComp.prototype.createPagination = function () {
        var _a = this.props, pageOptions = _a.pageOptions, paginationHolder = _a.paginationHolder, usageStatistics = _a.grid.usageStatistics;
        var totalCount = pageOptions.totalCount, perPage = pageOptions.perPage;
        var options = tslib_1.__assign(tslib_1.__assign({}, pageOptions), { totalItems: totalCount, itemsPerPage: perPage, usageStatistics: usageStatistics });
        this.tuiPagination = new tui_pagination_1.default(this.el, options);
        this.addEventListener();
        paginationHolder.setPagination(this.tuiPagination);
    };
    PaginationComp.prototype.addEventListener = function () {
        var _a = this.props, dataProvider = _a.dataProvider, pageOptions = _a.pageOptions, dispatch = _a.dispatch, eventBus = _a.eventBus;
        this.tuiPagination.on('beforeMove', function (ev) {
            var page = ev.page;
            var gridEvent = new gridEvent_1.default({ page: page });
            /**
             * Occurs before moving the page.
             * @event Grid#beforePageMove
             * @property {number} page - Target page number
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('beforePageMove', gridEvent);
            if (!gridEvent.isStopped()) {
                if (pageOptions.useClient) {
                    dispatch('movePage', page);
                }
                else {
                    dataProvider.readData(page);
                }
            }
        });
        this.tuiPagination.on('afterMove', function (ev) {
            var gridEvent = new gridEvent_1.default({ page: ev.page });
            /**
             * Occurs after moving the page.
             * @event Grid#afterPageMove
             * @property {number} page - Target page number
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('afterPageMove', gridEvent);
        });
    };
    PaginationComp.prototype.removeEventListener = function () {
        this.tuiPagination.off('beforeMove');
        this.tuiPagination.off('afterMove');
    };
    PaginationComp.prototype.render = function () {
        var _this = this;
        return (preact_1.h("div", { ref: function (el) {
                _this.el = el;
            }, class: "tui-pagination " + dom_1.cls('pagination') }));
    };
    return PaginationComp;
}(preact_1.Component));
exports.Pagination = hoc_1.connect(function (_a) {
    var id = _a.id, data = _a.data;
    return ({
        pageOptions: data.pageOptions,
        dataProvider: instance_1.getDataProvider(id),
        paginationHolder: instance_1.getPaginationManager(id),
        grid: instance_1.getInstance(id),
        eventBus: eventBus_1.getEventBus(id),
    });
})(PaginationComp);


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * TOAST UI Pagination
 * @version 3.4.1
 * @author NHN FE Development Team <dl_javascript@nhn.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Extend the target object from other objects.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * @module object
 */

/**
 * Extend the target object from other objects.
 * @param {object} target - Object that will be extended
 * @param {...object} objects - Objects as sources
 * @returns {object} Extended object
 * @memberof module:object
 */
function extend(target, objects) { // eslint-disable-line no-unused-vars
  var hasOwnProp = Object.prototype.hasOwnProperty;
  var source, prop, i, len;

  for (i = 1, len = arguments.length; i < len; i += 1) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProp.call(source, prop)) {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}

module.exports = extend;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is undefined or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is undefined or not.
 * If the given variable is undefined, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is undefined?
 * @memberof module:type
 */
function isUndefined(obj) {
  return obj === undefined; // eslint-disable-line no-undefined
}

module.exports = isUndefined;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is an instance of Array or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is an instance of Array or not.
 * If the given variable is an instance of Array, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is array instance?
 * @memberof module:type
 */
function isArray(obj) {
  return obj instanceof Array;
}

module.exports = isArray;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each property of object(or element of array) which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(2);
var forEachArray = __webpack_require__(17);
var forEachOwnProperties = __webpack_require__(6);

/**
 * @module collection
 */

/**
 * Execute the provided callback once for each property of object(or element of array) which actually exist.
 * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of example).
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property(or The value of the element)
 *  2) The name of the property(or The index of the element)
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * var forEach = require('tui-code-snippet/collection/forEach'); // node, commonjs
 *
 * var sum = 0;
 *
 * forEach([1,2,3], function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 *
 * // In case of Array-like object
 * var array = Array.prototype.slice.call(arrayLike); // change to array
 * forEach(array, function(value){
 *     sum += value;
 * });
 */
function forEach(obj, iteratee, context) {
  if (isArray(obj)) {
    forEachArray(obj, iteratee, context);
  } else {
    forEachOwnProperties(obj, iteratee, context);
  }
}

module.exports = forEach;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a string or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a string or not.
 * If the given variable is a string, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is string?
 * @memberof module:type
 */
function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

module.exports = isString;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a function or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a function or not.
 * If the given variable is a function, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is function?
 * @memberof module:type
 */
function isFunction(obj) {
  return obj instanceof Function;
}

module.exports = isFunction;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each property of object which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Execute the provided callback once for each property of object which actually exist.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property
 *  2) The name of the property
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee  Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * var forEachOwnProperties = require('tui-code-snippet/collection/forEachOwnProperties'); // node, commonjs
 *
 * var sum = 0;
 *
 * forEachOwnProperties({a:1,b:2,c:3}, function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 */
function forEachOwnProperties(obj, iteratee, context) {
  var key;

  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}

module.exports = forEachOwnProperties;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview
 * This module provides a function to make a constructor
 * that can inherit from the other constructors like the CLASS easily.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var inherit = __webpack_require__(18);
var extend = __webpack_require__(0);

/**
 * @module defineClass
 */

/**
 * Help a constructor to be defined and to inherit from the other constructors
 * @param {*} [parent] Parent constructor
 * @param {Object} props Members of constructor
 *  @param {Function} props.init Initialization method
 *  @param {Object} [props.static] Static members of constructor
 * @returns {*} Constructor
 * @memberof module:defineClass
 * @example
 * var defineClass = require('tui-code-snippet/defineClass/defineClass'); // node, commonjs
 *
 * //-- #2. Use property --//
 * var Parent = defineClass({
 *     init: function() { // constuructor
 *         this.name = 'made by def';
 *     },
 *     method: function() {
 *         // ...
 *     },
 *     static: {
 *         staticMethod: function() {
 *              // ...
 *         }
 *     }
 * });
 *
 * var Child = defineClass(Parent, {
 *     childMethod: function() {}
 * });
 *
 * Parent.staticMethod();
 *
 * var parentInstance = new Parent();
 * console.log(parentInstance.name); //made by def
 * parentInstance.staticMethod(); // Error
 *
 * var childInstance = new Child();
 * childInstance.method();
 * childInstance.childMethod();
 */
function defineClass(parent, props) {
  var obj;

  if (!props) {
    props = parent;
    parent = null;
  }

  obj = props.init || function() {};

  if (parent) {
    inherit(obj, parent);
  }

  if (props.hasOwnProperty('static')) {
    extend(obj, props['static']);
    delete props['static'];
  }

  extend(obj.prototype, props);

  return obj;
}

module.exports = defineClass;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable complexity */
/**
 * @fileoverview Returns the first index at which a given element can be found in the array.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(2);

/**
 * @module array
 */

/**
 * Returns the first index at which a given element can be found in the array
 * from start index(default 0), or -1 if it is not present.
 * It compares searchElement to elements of the Array using strict equality
 * (the same method used by the ===, or triple-equals, operator).
 * @param {*} searchElement Element to locate in the array
 * @param {Array} array Array that will be traversed.
 * @param {number} startIndex Start index in array for searching (default 0)
 * @returns {number} the First index at which a given element, or -1 if it is not present
 * @memberof module:array
 * @example
 * var inArray = require('tui-code-snippet/array/inArray'); // node, commonjs
 *
 * var arr = ['one', 'two', 'three', 'four'];
 * var idx1 = inArray('one', arr, 3); // -1
 * var idx2 = inArray('one', arr); // 0
 */
function inArray(searchElement, array, startIndex) {
  var i;
  var length;
  startIndex = startIndex || 0;

  if (!isArray(array)) {
    return -1;
  }

  if (Array.prototype.indexOf) {
    return Array.prototype.indexOf.call(array, searchElement, startIndex);
  }

  length = array.length;
  for (i = startIndex; startIndex >= 0 && i < length; i += 1) {
    if (array[i] === searchElement) {
      return i;
    }
  }

  return -1;
}

module.exports = inArray;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var template = __webpack_require__(29);
var sendHostname = __webpack_require__(30);
var isFunction = __webpack_require__(5);

var util = {
  /**
   * Capitalize first letter
   * @param {string} str - String to change
   * @returns {string} Changed string
   */
  capitalizeFirstLetter: function(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1, str.length);
  },

  /**
   * Check the element is contained
   * @param {HTMLElement} find - Target element
   * @param {HTMLElement} parent - Wrapper element
   * @returns {boolean} Whether contained or not
   */
  isContained: function(find, parent) {
    if (!parent) {
      return false;
    }

    return find === parent ? true : parent.contains(find);
  },

  /**
   * Create an new element by template literals.
   * @param {string|function} tmpl - template
   * @param {Object} context - context
   * @returns {HTMLElement}
   */
  createElementByTemplate: function(tmpl, context) {
    var parent = document.createElement('div');
    var html = isFunction(tmpl) ? tmpl(context) : template(tmpl, context);
    parent.innerHTML = html;

    return parent.firstChild;
  },

  /**
   * Create a new function that, when called, has its this keyword set to the provided value.
   * @param {function} fn A original function before binding
   * @param {*} obj context of function in arguments[0]
   * @returns {function} A new bound function with context that is in arguments[1]
   */
  bind: function(fn, obj) {
    var slice = Array.prototype.slice;
    var args;

    if (fn.bind) {
      return fn.bind.apply(fn, slice.call(arguments, 1));
    }

    args = slice.call(arguments, 2);

    return function() {
      return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
    };
  },

  /**
   * Send hostname for GA
   * @ignore
   */
  sendHostName: function() {
    sendHostname('pagination', 'UA-129987462-1');
  }
};

module.exports = util;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview The entry file of Pagination components
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */



__webpack_require__(11);

module.exports = __webpack_require__(12);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var CustomEvents = __webpack_require__(13);
var defineClass = __webpack_require__(7);
var extend = __webpack_require__(0);
var isUndefined = __webpack_require__(1);

var View = __webpack_require__(20);
var util = __webpack_require__(9);

var defaultOption = {
  totalItems: 10,
  itemsPerPage: 10,
  visiblePages: 10,
  page: 1,
  centerAlign: false,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  usageStatistics: true
};

/**
 * Pagination class
 * @class Pagination
 * @param {string|HTMLElement|jQueryObject} container - Container element or selector.
 * In case of a string, it is considered as an id selector and find the element by id.
 * If there is no element, it is considered as a selector and find the element by querySelector().
 * Passing jQueryObject and considering an id selector at first will be deprecated in v4.0.0.
 * @param {object} options - Option object
 *     @param {number} [options.totalItems=10] Total item count
 *     @param {number} [options.itemsPerPage=10] Item count per page
 *     @param {number} [options.visiblePages=10] Display page link count
 *     @param {number} [options.page=1] Display page after pagination draw.
 *     @param {boolean}[options.centerAlign=false] Whether current page keep center or not
 *     @param {string} [options.firstItemClassName='first-child'] The class name of the first item
 *     @param {string} [options.lastItemClassName='last-child'] The class name of the last item
 *     @param {object} [options.template] A markup string set to make element. Refer to {@link https://github.com/nhn/tui.pagination/blob/master/docs/getting-started.md#how-to-use-template Getting Started: How to use template}.
 *         @param {string|function} [options.template.page] HTML template
 *         @param {string|function} [options.template.currentPage] HTML template
 *         @param {string|function} [options.template.moveButton] HTML template
 *         @param {string|function} [options.template.disabledMoveButton] HTML template
 *         @param {string|function} [options.template.moreButton] HTML template
 *     @param {boolean} [options.usageStatistics=true] Send the hostname to google analytics.
 *         If you do not want to send the hostname, this option set to false.
 * @example
 * // ES6
 * import Pagination from 'tui-pagination';
 *
 * // CommonJS
 * const Pagination = require('tui-pagination');
 *
 * // Browser
 * const Pagination = tui.Pagination;
 *
 * const container = document.getElementById('pagination');
 * const options = { // below default value of options
 *      totalItems: 10,
 *      itemsPerPage: 10,
 *      visiblePages: 10,
 *      page: 1,
 *      centerAlign: false,
 *      firstItemClassName: 'tui-first-child',
 *      lastItemClassName: 'tui-last-child',
 *      template: {
 *          page: '<a href="#" class="tui-page-btn">{{page}}</a>',
 *          currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
 *          moveButton:
 *              '<a href="#" class="tui-page-btn tui-{{type}}">' +
 *                  '<span class="tui-ico-{{type}}">{{type}}</span>' +
 *              '</a>',
 *          disabledMoveButton:
 *              '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
 *                  '<span class="tui-ico-{{type}}">{{type}}</span>' +
 *              '</span>',
 *          moreButton:
 *              '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
 *                  '<span class="tui-ico-ellip">...</span>' +
 *              '</a>'
 *      }
 * };
 * const pagination = new Pagination(container, options);
 */
var Pagination = defineClass(
  /** @lends Pagination.prototype */ {
    init: function(container, options) {
      /**
       * Option object
       * @type {object}
       * @private
       */
      this._options = extend({}, defaultOption, options);

      /**
       * Current page number
       * @type {number}
       * @private
       */
      this._currentPage = 0;

      /**
       * View instance
       * @type {View}
       * @private
       */
      this._view = new View(container, this._options, util.bind(this._onClickHandler, this));

      this._paginate();

      if (this._options.usageStatistics) {
        util.sendHostName();
      }
    },

    /**
     * Set current page
     * @param {number} page - Current page
     * @private
     */
    _setCurrentPage: function(page) {
      this._currentPage = page || this._options.page;
    },

    /**
     * Get last page number
     * @returns {number} Last page number
     * @private
     */
    _getLastPage: function() {
      var lastPage = Math.ceil(this._options.totalItems / this._options.itemsPerPage);

      return !lastPage ? 1 : lastPage;
    },

    /**
     * Index of list in total lists
     * @param {number} pageNumber - Page number
     * @returns {number} Page index or number
     * @private
     */
    _getPageIndex: function(pageNumber) {
      var left, pageIndex;

      if (this._options.centerAlign) {
        left = Math.floor(this._options.visiblePages / 2);
        pageIndex = pageNumber - left;
        pageIndex = Math.max(pageIndex, 1);
        pageIndex = Math.min(pageIndex, this._getLastPage() - this._options.visiblePages + 1);

        return pageIndex;
      }

      return Math.ceil(pageNumber / this._options.visiblePages);
    },

    /**
     * Get relative page
     * @param {string} moveType - Move type ('prev' or 'next')
     * @returns {number} Relative page number
     * @private
     */
    _getRelativePage: function(moveType) {
      var isPrevMove = moveType === 'prev';
      var currentPage = this.getCurrentPage();

      return isPrevMove ? currentPage - 1 : currentPage + 1;
    },

    /**
     * Get more page index
     * @param {string} moveType - Move type ('prev' or 'next')
     * @returns {number} Page index
     * @private
     */
    _getMorePageIndex: function(moveType) {
      var currentPageIndex = this._getPageIndex(this.getCurrentPage());
      var pageCount = this._options.visiblePages;
      var isPrevMove = moveType === 'prev';
      var pageIndex;

      if (this._options.centerAlign) {
        pageIndex = isPrevMove ? currentPageIndex - 1 : currentPageIndex + pageCount;
      } else {
        pageIndex = isPrevMove
          ? (currentPageIndex - 1) * pageCount
          : currentPageIndex * pageCount + 1;
      }

      return pageIndex;
    },
    /* eslint-enable complexity */

    /**
     * Get available page number from over number
     * If total page is 23, but input number is 30 => return 23
     * @param {number} page - Page number
     * @returns {number} Replaced pgae number
     * @private
     */
    _convertToValidPage: function(page) {
      var lastPageNumber = this._getLastPage();
      page = Math.max(page, 1);
      page = Math.min(page, lastPageNumber);

      return page;
    },

    /**
     * Create require view set, notify view to update
     * @param {number} page - Page number
     * @private
     */
    _paginate: function(page) {
      var viewData = this._makeViewData(page || this._options.page);
      this._setCurrentPage(page);
      this._view.update(viewData);
    },

    /**
     * Create and get view data
     * @param {number} page - Page number
     * @returns {object} view data
     * @private
     */
    _makeViewData: function(page) {
      var viewData = {};
      var lastPage = this._getLastPage();
      var currentPageIndex = this._getPageIndex(page);
      var lastPageListIndex = this._getPageIndex(lastPage);
      var edges = this._getEdge(page);

      viewData.leftPageNumber = edges.left;
      viewData.rightPageNumber = edges.right;

      viewData.prevMore = currentPageIndex > 1;
      viewData.nextMore = currentPageIndex < lastPageListIndex;

      viewData.page = page;
      viewData.currentPageIndex = page;
      viewData.lastPage = lastPage;
      viewData.lastPageListIndex = lastPage;

      return viewData;
    },

    /**
     * Get each edge page
     * @param {object} page - Page number
     * @returns {{left: number, right: number}} Edge page numbers
     * @private
     */
    _getEdge: function(page) {
      var leftPageNumber, rightPageNumber, left;
      var lastPage = this._getLastPage();
      var visiblePages = this._options.visiblePages;
      var currentPageIndex = this._getPageIndex(page);

      if (this._options.centerAlign) {
        left = Math.floor(visiblePages / 2);
        leftPageNumber = Math.max(page - left, 1);
        rightPageNumber = leftPageNumber + visiblePages - 1;

        if (rightPageNumber > lastPage) {
          leftPageNumber = Math.max(lastPage - visiblePages + 1, 1);
          rightPageNumber = lastPage;
        }
      } else {
        leftPageNumber = (currentPageIndex - 1) * visiblePages + 1;
        rightPageNumber = currentPageIndex * visiblePages;
        rightPageNumber = Math.min(rightPageNumber, lastPage);
      }

      return {
        left: leftPageNumber,
        right: rightPageNumber
      };
    },

    /**
     * Pagelist click event hadnler
     * @param {?string} buttonType - Button type
     * @param {?number} page - Page number
     * @private
     */
    /* eslint-disable complexity */
    _onClickHandler: function(buttonType, page) {
      switch (buttonType) {
        case 'first':
          page = 1;
          break;
        case 'prev':
          page = this._getRelativePage('prev');
          break;
        case 'next':
          page = this._getRelativePage('next');
          break;
        case 'prevMore':
          page = this._getMorePageIndex('prev');
          break;
        case 'nextMore':
          page = this._getMorePageIndex('next');
          break;
        case 'last':
          page = this._getLastPage();
          break;
        default:
          if (!page) {
            return;
          }
      }

      this.movePageTo(page);
    },
    /* eslint-enable complexity */

    /**
     * Reset pagination
     * @param {*} totalItems - Redraw page item count
     * @example
     * pagination.reset();
     * pagination.reset(100);
     */
    reset: function(totalItems) {
      if (isUndefined(totalItems)) {
        totalItems = this._options.totalItems;
      }

      this._options.totalItems = totalItems;
      this._paginate(1);
    },

    /**
     * Move to specific page, redraw list.
     * Before move fire beforeMove event, After move fire afterMove event.
     * @param {Number} targetPage - Target page
     * @example
     * pagination.movePageTo(10);
     */
    movePageTo: function(targetPage) {
      targetPage = this._convertToValidPage(targetPage);

      /**
       * @event Pagination#beforeMove
       * @type {object} evt - Custom event object
       * @property {number} page - Moved page
       * @example
       * paganation.on('beforeMove', (event) => {
       *     const currentPage = event.page;
       *
       *     if (currentPage === 10) {
       *         return false;
       *         // return true;
       *     }
       * });
       */
      if (!this.invoke('beforeMove', { page: targetPage })) {
        return;
      }

      this._paginate(targetPage);

      /**
       * @event Pagination#afterMove
       * @type {object} evt - Custom event object
       * @property {number} page - Moved page
       * @example
       * paganation.on('afterMove', (event) => {
       *      const currentPage = event.page;
       *      console.log(currentPage);
       * });
       */
      this.fire('afterMove', { page: targetPage });
    },

    /**
     * Set total count of items
     * @param {number} itemCount - Total item count
     */
    setTotalItems: function(itemCount) {
      this._options.totalItems = itemCount;
    },

    /**
     * Set count of items per page
     * @param {number} itemCount - Item count
     */
    setItemsPerPage: function(itemCount) {
      this._options.itemsPerPage = itemCount;
    },

    /**
     * Get current page
     * @returns {number} Current page
     */
    getCurrentPage: function() {
      return this._currentPage || this._options.page;
    }
  }
);

CustomEvents.mixin(Pagination);

module.exports = Pagination;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This module provides some functions for custom events. And it is implemented in the observer design pattern.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var extend = __webpack_require__(0);
var isExisty = __webpack_require__(14);
var isString = __webpack_require__(4);
var isObject = __webpack_require__(16);
var isArray = __webpack_require__(2);
var isFunction = __webpack_require__(5);
var forEach = __webpack_require__(3);

var R_EVENTNAME_SPLIT = /\s+/g;

/**
 * @class
 * @example
 * // node, commonjs
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents');
 */
function CustomEvents() {
  /**
     * @type {HandlerItem[]}
     */
  this.events = null;

  /**
     * only for checking specific context event was binded
     * @type {object[]}
     */
  this.contexts = null;
}

/**
 * Mixin custom events feature to specific constructor
 * @param {function} func - constructor
 * @example
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents'); // node, commonjs
 *
 * var model;
 * function Model() {
 *     this.name = '';
 * }
 * CustomEvents.mixin(Model);
 *
 * model = new Model();
 * model.on('change', function() { this.name = 'model'; }, this);
 * model.fire('change');
 * alert(model.name); // 'model';
 */
CustomEvents.mixin = function(func) {
  extend(func.prototype, CustomEvents.prototype);
};

/**
 * Get HandlerItem object
 * @param {function} handler - handler function
 * @param {object} [context] - context for handler
 * @returns {HandlerItem} HandlerItem object
 * @private
 */
CustomEvents.prototype._getHandlerItem = function(handler, context) {
  var item = {handler: handler};

  if (context) {
    item.context = context;
  }

  return item;
};

/**
 * Get event object safely
 * @param {string} [eventName] - create sub event map if not exist.
 * @returns {(object|array)} event object. if you supplied `eventName`
 *  parameter then make new array and return it
 * @private
 */
CustomEvents.prototype._safeEvent = function(eventName) {
  var events = this.events;
  var byName;

  if (!events) {
    events = this.events = {};
  }

  if (eventName) {
    byName = events[eventName];

    if (!byName) {
      byName = [];
      events[eventName] = byName;
    }

    events = byName;
  }

  return events;
};

/**
 * Get context array safely
 * @returns {array} context array
 * @private
 */
CustomEvents.prototype._safeContext = function() {
  var context = this.contexts;

  if (!context) {
    context = this.contexts = [];
  }

  return context;
};

/**
 * Get index of context
 * @param {object} ctx - context that used for bind custom event
 * @returns {number} index of context
 * @private
 */
CustomEvents.prototype._indexOfContext = function(ctx) {
  var context = this._safeContext();
  var index = 0;

  while (context[index]) {
    if (ctx === context[index][0]) {
      return index;
    }

    index += 1;
  }

  return -1;
};

/**
 * Memorize supplied context for recognize supplied object is context or
 *  name: handler pair object when off()
 * @param {object} ctx - context object to memorize
 * @private
 */
CustomEvents.prototype._memorizeContext = function(ctx) {
  var context, index;

  if (!isExisty(ctx)) {
    return;
  }

  context = this._safeContext();
  index = this._indexOfContext(ctx);

  if (index > -1) {
    context[index][1] += 1;
  } else {
    context.push([ctx, 1]);
  }
};

/**
 * Forget supplied context object
 * @param {object} ctx - context object to forget
 * @private
 */
CustomEvents.prototype._forgetContext = function(ctx) {
  var context, contextIndex;

  if (!isExisty(ctx)) {
    return;
  }

  context = this._safeContext();
  contextIndex = this._indexOfContext(ctx);

  if (contextIndex > -1) {
    context[contextIndex][1] -= 1;

    if (context[contextIndex][1] <= 0) {
      context.splice(contextIndex, 1);
    }
  }
};

/**
 * Bind event handler
 * @param {(string|{name:string, handler:function})} eventName - custom
 *  event name or an object {eventName: handler}
 * @param {(function|object)} [handler] - handler function or context
 * @param {object} [context] - context for binding
 * @private
 */
CustomEvents.prototype._bindEvent = function(eventName, handler, context) {
  var events = this._safeEvent(eventName);
  this._memorizeContext(context);
  events.push(this._getHandlerItem(handler, context));
};

/**
 * Bind event handlers
 * @param {(string|{name:string, handler:function})} eventName - custom
 *  event name or an object {eventName: handler}
 * @param {(function|object)} [handler] - handler function or context
 * @param {object} [context] - context for binding
 * //-- #1. Get Module --//
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents'); // node, commonjs
 *
 * //-- #2. Use method --//
 * // # 2.1 Basic Usage
 * CustomEvents.on('onload', handler);
 *
 * // # 2.2 With context
 * CustomEvents.on('onload', handler, myObj);
 *
 * // # 2.3 Bind by object that name, handler pairs
 * CustomEvents.on({
 *     'play': handler,
 *     'pause': handler2
 * });
 *
 * // # 2.4 Bind by object that name, handler pairs with context object
 * CustomEvents.on({
 *     'play': handler
 * }, myObj);
 */
CustomEvents.prototype.on = function(eventName, handler, context) {
  var self = this;

  if (isString(eventName)) {
    // [syntax 1, 2]
    eventName = eventName.split(R_EVENTNAME_SPLIT);
    forEach(eventName, function(name) {
      self._bindEvent(name, handler, context);
    });
  } else if (isObject(eventName)) {
    // [syntax 3, 4]
    context = handler;
    forEach(eventName, function(func, name) {
      self.on(name, func, context);
    });
  }
};

/**
 * Bind one-shot event handlers
 * @param {(string|{name:string,handler:function})} eventName - custom
 *  event name or an object {eventName: handler}
 * @param {function|object} [handler] - handler function or context
 * @param {object} [context] - context for binding
 */
CustomEvents.prototype.once = function(eventName, handler, context) {
  var self = this;

  if (isObject(eventName)) {
    context = handler;
    forEach(eventName, function(func, name) {
      self.once(name, func, context);
    });

    return;
  }

  function onceHandler() { // eslint-disable-line require-jsdoc
    handler.apply(context, arguments);
    self.off(eventName, onceHandler, context);
  }

  this.on(eventName, onceHandler, context);
};

/**
 * Splice supplied array by callback result
 * @param {array} arr - array to splice
 * @param {function} predicate - function return boolean
 * @private
 */
CustomEvents.prototype._spliceMatches = function(arr, predicate) {
  var i = 0;
  var len;

  if (!isArray(arr)) {
    return;
  }

  for (len = arr.length; i < len; i += 1) {
    if (predicate(arr[i]) === true) {
      arr.splice(i, 1);
      len -= 1;
      i -= 1;
    }
  }
};

/**
 * Get matcher for unbind specific handler events
 * @param {function} handler - handler function
 * @returns {function} handler matcher
 * @private
 */
CustomEvents.prototype._matchHandler = function(handler) {
  var self = this;

  return function(item) {
    var needRemove = handler === item.handler;

    if (needRemove) {
      self._forgetContext(item.context);
    }

    return needRemove;
  };
};

/**
 * Get matcher for unbind specific context events
 * @param {object} context - context
 * @returns {function} object matcher
 * @private
 */
CustomEvents.prototype._matchContext = function(context) {
  var self = this;

  return function(item) {
    var needRemove = context === item.context;

    if (needRemove) {
      self._forgetContext(item.context);
    }

    return needRemove;
  };
};

/**
 * Get matcher for unbind specific hander, context pair events
 * @param {function} handler - handler function
 * @param {object} context - context
 * @returns {function} handler, context matcher
 * @private
 */
CustomEvents.prototype._matchHandlerAndContext = function(handler, context) {
  var self = this;

  return function(item) {
    var matchHandler = (handler === item.handler);
    var matchContext = (context === item.context);
    var needRemove = (matchHandler && matchContext);

    if (needRemove) {
      self._forgetContext(item.context);
    }

    return needRemove;
  };
};

/**
 * Unbind event by event name
 * @param {string} eventName - custom event name to unbind
 * @param {function} [handler] - handler function
 * @private
 */
CustomEvents.prototype._offByEventName = function(eventName, handler) {
  var self = this;
  var andByHandler = isFunction(handler);
  var matchHandler = self._matchHandler(handler);

  eventName = eventName.split(R_EVENTNAME_SPLIT);

  forEach(eventName, function(name) {
    var handlerItems = self._safeEvent(name);

    if (andByHandler) {
      self._spliceMatches(handlerItems, matchHandler);
    } else {
      forEach(handlerItems, function(item) {
        self._forgetContext(item.context);
      });

      self.events[name] = [];
    }
  });
};

/**
 * Unbind event by handler function
 * @param {function} handler - handler function
 * @private
 */
CustomEvents.prototype._offByHandler = function(handler) {
  var self = this;
  var matchHandler = this._matchHandler(handler);

  forEach(this._safeEvent(), function(handlerItems) {
    self._spliceMatches(handlerItems, matchHandler);
  });
};

/**
 * Unbind event by object(name: handler pair object or context object)
 * @param {object} obj - context or {name: handler} pair object
 * @param {function} handler - handler function
 * @private
 */
CustomEvents.prototype._offByObject = function(obj, handler) {
  var self = this;
  var matchFunc;

  if (this._indexOfContext(obj) < 0) {
    forEach(obj, function(func, name) {
      self.off(name, func);
    });
  } else if (isString(handler)) {
    matchFunc = this._matchContext(obj);

    self._spliceMatches(this._safeEvent(handler), matchFunc);
  } else if (isFunction(handler)) {
    matchFunc = this._matchHandlerAndContext(handler, obj);

    forEach(this._safeEvent(), function(handlerItems) {
      self._spliceMatches(handlerItems, matchFunc);
    });
  } else {
    matchFunc = this._matchContext(obj);

    forEach(this._safeEvent(), function(handlerItems) {
      self._spliceMatches(handlerItems, matchFunc);
    });
  }
};

/**
 * Unbind custom events
 * @param {(string|object|function)} eventName - event name or context or
 *  {name: handler} pair object or handler function
 * @param {(function)} handler - handler function
 * @example
 * //-- #1. Get Module --//
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents'); // node, commonjs
 *
 * //-- #2. Use method --//
 * // # 2.1 off by event name
 * CustomEvents.off('onload');
 *
 * // # 2.2 off by event name and handler
 * CustomEvents.off('play', handler);
 *
 * // # 2.3 off by handler
 * CustomEvents.off(handler);
 *
 * // # 2.4 off by context
 * CustomEvents.off(myObj);
 *
 * // # 2.5 off by context and handler
 * CustomEvents.off(myObj, handler);
 *
 * // # 2.6 off by context and event name
 * CustomEvents.off(myObj, 'onload');
 *
 * // # 2.7 off by an Object.<string, function> that is {eventName: handler}
 * CustomEvents.off({
 *   'play': handler,
 *   'pause': handler2
 * });
 *
 * // # 2.8 off the all events
 * CustomEvents.off();
 */
CustomEvents.prototype.off = function(eventName, handler) {
  if (isString(eventName)) {
    // [syntax 1, 2]
    this._offByEventName(eventName, handler);
  } else if (!arguments.length) {
    // [syntax 8]
    this.events = {};
    this.contexts = [];
  } else if (isFunction(eventName)) {
    // [syntax 3]
    this._offByHandler(eventName);
  } else if (isObject(eventName)) {
    // [syntax 4, 5, 6]
    this._offByObject(eventName, handler);
  }
};

/**
 * Fire custom event
 * @param {string} eventName - name of custom event
 */
CustomEvents.prototype.fire = function(eventName) {  // eslint-disable-line
  this.invoke.apply(this, arguments);
};

/**
 * Fire a event and returns the result of operation 'boolean AND' with all
 *  listener's results.
 *
 * So, It is different from {@link CustomEvents#fire}.
 *
 * In service code, use this as a before event in component level usually
 *  for notifying that the event is cancelable.
 * @param {string} eventName - Custom event name
 * @param {...*} data - Data for event
 * @returns {boolean} The result of operation 'boolean AND'
 * @example
 * var map = new Map();
 * map.on({
 *     'beforeZoom': function() {
 *         // It should cancel the 'zoom' event by some conditions.
 *         if (that.disabled && this.getState()) {
 *             return false;
 *         }
 *         return true;
 *     }
 * });
 *
 * if (this.invoke('beforeZoom')) {    // check the result of 'beforeZoom'
 *     // if true,
 *     // doSomething
 * }
 */
CustomEvents.prototype.invoke = function(eventName) {
  var events, args, index, item;

  if (!this.hasListener(eventName)) {
    return true;
  }

  events = this._safeEvent(eventName);
  args = Array.prototype.slice.call(arguments, 1);
  index = 0;

  while (events[index]) {
    item = events[index];

    if (item.handler.apply(item.context, args) === false) {
      return false;
    }

    index += 1;
  }

  return true;
};

/**
 * Return whether at least one of the handlers is registered in the given
 *  event name.
 * @param {string} eventName - Custom event name
 * @returns {boolean} Is there at least one handler in event name?
 */
CustomEvents.prototype.hasListener = function(eventName) {
  return this.getListenerLength(eventName) > 0;
};

/**
 * Return a count of events registered.
 * @param {string} eventName - Custom event name
 * @returns {number} number of event
 */
CustomEvents.prototype.getListenerLength = function(eventName) {
  var events = this._safeEvent(eventName);

  return events.length;
};

module.exports = CustomEvents;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is existing or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(1);
var isNull = __webpack_require__(15);

/**
 * Check whether the given variable is existing or not.
 * If the given variable is not null and not undefined, returns true.
 * @param {*} param - Target for checking
 * @returns {boolean} Is existy?
 * @memberof module:type
 * @example
 * var isExisty = require('tui-code-snippet/type/isExisty'); // node, commonjs
 *
 * isExisty(''); //true
 * isExisty(0); //true
 * isExisty([]); //true
 * isExisty({}); //true
 * isExisty(null); //false
 * isExisty(undefined); //false
*/
function isExisty(param) {
  return !isUndefined(param) && !isNull(param);
}

module.exports = isExisty;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is null or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is null or not.
 * If the given variable(arguments[0]) is null, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is null?
 * @memberof module:type
 */
function isNull(obj) {
  return obj === null;
}

module.exports = isNull;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is an object or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is an object or not.
 * If the given variable is an object, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is object?
 * @memberof module:type
 */
function isObject(obj) {
  return obj === Object(obj);
}

module.exports = isObject;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each element present in the array(or Array-like object) in ascending order.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Execute the provided callback once for each element present
 * in the array(or Array-like object) in ascending order.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the element
 *  2) The index of the element
 *  3) The array(or Array-like object) being traversed
 * @param {Array|Arguments|NodeList} arr The array(or Array-like object) that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * var forEachArray = require('tui-code-snippet/collection/forEachArray'); // node, commonjs
 *
 * var sum = 0;
 *
 * forEachArray([1,2,3], function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 */
function forEachArray(arr, iteratee, context) {
  var index = 0;
  var len = arr.length;

  context = context || null;

  for (; index < len; index += 1) {
    if (iteratee.call(context, arr[index], index, arr) === false) {
      break;
    }
  }
}

module.exports = forEachArray;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Provide a simple inheritance in prototype-oriented.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var createObject = __webpack_require__(19);

/**
 * Provide a simple inheritance in prototype-oriented.
 * Caution :
 *  Don't overwrite the prototype of child constructor.
 *
 * @param {function} subType Child constructor
 * @param {function} superType Parent constructor
 * @memberof module:inheritance
 * @example
 * var inherit = require('tui-code-snippet/inheritance/inherit'); // node, commonjs
 *
 * // Parent constructor
 * function Animal(leg) {
 *     this.leg = leg;
 * }
 * Animal.prototype.growl = function() {
 *     // ...
 * };
 *
 * // Child constructor
 * function Person(name) {
 *     this.name = name;
 * }
 *
 * // Inheritance
 * inherit(Person, Animal);
 *
 * // After this inheritance, please use only the extending of property.
 * // Do not overwrite prototype.
 * Person.prototype.walk = function(direction) {
 *     // ...
 * };
 */
function inherit(subType, superType) {
  var prototype = createObject(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}

module.exports = inherit;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Create a new object with the specified prototype object and properties.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * @module inheritance
 */

/**
 * Create a new object with the specified prototype object and properties.
 * @param {Object} obj This object will be a prototype of the newly-created object.
 * @returns {Object}
 * @memberof module:inheritance
 */
function createObject(obj) {
  function F() {} // eslint-disable-line require-jsdoc
  F.prototype = obj;

  return new F();
}

module.exports = createObject;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var forEach = __webpack_require__(3);
var defineClass = __webpack_require__(7);
var getTarget = __webpack_require__(21);
var on = __webpack_require__(22);
var preventDefault = __webpack_require__(24);
var addClass = __webpack_require__(25);
var extend = __webpack_require__(0);
var isString = __webpack_require__(4);
var isHTMLNode = __webpack_require__(28);

var util = __webpack_require__(9);

var defaultTemplate = {
  page: '<a href="#" class="tui-page-btn">{{page}}</a>',
  currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
  moveButton:
    '<a href="#" class="tui-page-btn tui-{{type}}">' +
    '<span class="tui-ico-{{type}}">{{type}}</span>' +
    '</a>',
  disabledMoveButton:
    '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
    '<span class="tui-ico-{{type}}">{{type}}</span>' +
    '</span>',
  moreButton:
    '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
    '<span class="tui-ico-ellip">...</span>' +
    '</a>'
};
var moveButtons = ['first', 'prev', 'next', 'last'];
var moreButtons = ['prev', 'next'];

var INVALID_CONTAINER_ELEMENT = 'The container element is invalid.';

/**
 * Pagination view class
 * @class View
 * @param {string|HTMLElement|jQueryObject} container - Container element or id selector
 * @param {object} options - Option object
 *     @param {number} [options.totalItems=10] Total item count
 *     @param {number} [options.itemsPerPage=10] Item count per page
 *     @param {number} [options.visiblePages=10] Display page link count
 *     @param {number} [options.page=1] Display page after pagination draw.
 *     @param {boolean}[options.centerAlign=false] Whether current page keep center or not
 *     @param {string} [options.firstItemClassName='first-child'] The class name of the first item
 *     @param {string} [options.lastItemClassName='last-child'] The class name of the last item
 *     @param {object} [options.template] A markup string set to make element
 *         @param {string|function} [options.template.page] HTML template
 *         @param {string|function} [options.template.currentPage] HTML template
 *         @param {string|function} [options.template.moveButton] HTML template
 *         @param {string|function} [options.template.disabledMoveButton] HTML template
 *         @param {string|function} [options.template.moreButton] HTML template
 * @param {function} handler - Event handler
 * @ignore
 */
var View = defineClass(
  /** @lends View.prototype */ {
    init: function(container, options, handler) {
      /**
       * Root element
       * @type {HTMLElement}
       * @private
       */
      this._containerElement = null;

      /**
       * First item's class name
       * @type {string}
       * @private
       */
      this._firstItemClassName = options.firstItemClassName;

      /**
       * Last item's class name
       * @type {string}
       * @private
       */
      this._lastItemClassName = options.lastItemClassName;

      /**
       * Default template
       * @type {object.<string, string|function>}
       * @private
       */
      this._template = extend({}, defaultTemplate, options.template);

      /**
       * Map of buttons
       * @type {object.<string, HTMLElement>}
       * @private
       */
      this._buttons = {};

      /**
       * Enabled page elements list
       * @type {array}
       * @private
       */

      this._enabledPageElements = [];

      this._setRootElement(container);
      this._setMoveButtons();
      this._setDisabledMoveButtons();
      this._setMoreButtons();
      this._attachClickEvent(handler);
    },
    /* eslint-enable complexity */

    /**
     * Set root element
     * @param {string|HTMLElement|jQueryObject} container - Container element or id selector
     * @private
     */
    _setRootElement: function(container) {
      if (isString(container)) {
        container = document.getElementById(container) || document.querySelector(container);
      } else if (container.jquery) {
        container = container[0];
      }

      if (!isHTMLNode(container)) {
        throw new Error(INVALID_CONTAINER_ELEMENT);
      }

      this._containerElement = container;
    },

    /**
     * Assign move buttons to option
     * @private
     */
    _setMoveButtons: function() {
      forEach(
        moveButtons,
        function(type) {
          this._buttons[type] = util.createElementByTemplate(this._template.moveButton, {
            type: type
          });
        },
        this
      );
    },

    /**
     * Assign disabled move buttons to option
     * @private
     */
    _setDisabledMoveButtons: function() {
      forEach(
        moveButtons,
        function(type) {
          var key = 'disabled' + util.capitalizeFirstLetter(type);
          this._buttons[key] = util.createElementByTemplate(this._template.disabledMoveButton, {
            type: type
          });
        },
        this
      );
    },

    /**
     * Assign more buttons to option
     * @private
     */
    _setMoreButtons: function() {
      forEach(
        moreButtons,
        function(type) {
          var key = type + 'More';
          this._buttons[key] = util.createElementByTemplate(this._template.moreButton, {
            type: type
          });
        },
        this
      );
    },
    /* eslint-enable camelcase */

    /**
     * Get container element
     * @returns {HTMLElement} Container element
     * @private
     */
    _getContainerElement: function() {
      return this._containerElement;
    },

    /**
     * Append first button on container element
     * @param {object} viewData - View data to render pagination
     * @private
     */
    _appendFirstButton: function(viewData) {
      var button;

      if (viewData.page > 1) {
        button = this._buttons.first;
      } else {
        button = this._buttons.disabledFirst;
      }

      this._getContainerElement().appendChild(button);
    },

    /**
     * Append previous button on container element
     * @param {object} viewData - View data to render pagination
     * @private
     */
    _appendPrevButton: function(viewData) {
      var button;

      if (viewData.currentPageIndex > 1) {
        button = this._buttons.prev;
      } else {
        button = this._buttons.disabledPrev;
      }

      this._getContainerElement().appendChild(button);
    },

    /**
     * Append next button on container element
     * @param {object} viewData - View data to render pagination
     * @private
     */
    _appendNextButton: function(viewData) {
      var button;

      if (viewData.currentPageIndex < viewData.lastPageListIndex) {
        button = this._buttons.next;
      } else {
        button = this._buttons.disabledNext;
      }

      this._getContainerElement().appendChild(button);
    },

    /**
     * Append last button on container element
     * @param {object} viewData - View data to render pagination
     * @private
     */
    _appendLastButton: function(viewData) {
      var button;

      if (viewData.page < viewData.lastPage) {
        button = this._buttons.last;
      } else {
        button = this._buttons.disabledLast;
      }

      this._getContainerElement().appendChild(button);
    },

    /**
     * Append previous more button on container element
     * @param {object} viewData - View data to render pagination
     * @private
     */
    _appendPrevMoreButton: function(viewData) {
      var button;

      if (viewData.prevMore) {
        button = this._buttons.prevMore;
        addClass(button, this._firstItemClassName);
        this._getContainerElement().appendChild(button);
      }
    },

    /**
     * Append next more button on container element
     * @param {object} viewData - View data to render pagination
     * @private
     */
    _appendNextMoreButton: function(viewData) {
      var button;

      if (viewData.nextMore) {
        button = this._buttons.nextMore;
        addClass(button, this._lastItemClassName);
        this._getContainerElement().appendChild(button);
      }
    },

    /**
     * Append page number elements on container element
     * @param {object} viewData - View data to render pagination
     * @private
     */
    // eslint-disable-next-line complexity
    _appendPages: function(viewData) {
      var firstPage = viewData.leftPageNumber;
      var lastPage = viewData.rightPageNumber;
      var pageItem, i;

      for (i = firstPage; i <= lastPage; i += 1) {
        if (i === viewData.page) {
          pageItem = util.createElementByTemplate(this._template.currentPage, { page: i });
        } else {
          pageItem = util.createElementByTemplate(this._template.page, { page: i });
          this._enabledPageElements.push(pageItem);
        }

        if (i === firstPage && !viewData.prevMore) {
          addClass(pageItem, this._firstItemClassName);
        }
        if (i === lastPage && !viewData.nextMore) {
          addClass(pageItem, this._lastItemClassName);
        }
        this._getContainerElement().appendChild(pageItem);
      }
    },

    /**
     * Attach click event
     * @param {function} callback - Callback function
     * @private
     */
    _attachClickEvent: function(callback) {
      var rootElement = this._getContainerElement();

      on(
        rootElement,
        'click',
        function(ev) {
          var target = getTarget(ev);
          var page, buttonType;

          preventDefault(ev);

          buttonType = this._getButtonType(target);

          if (!buttonType) {
            page = this._getPageNumber(target);
          }

          callback(buttonType, page);
        },
        this
      );
    },

    /**
     * Get button type to move button elements
     * @param {HTMLElement} targetElement - Each move button element
     * @returns {?string} Button type
     * @private
     */
    _getButtonType: function(targetElement) {
      var buttonType;
      var buttons = this._buttons;

      forEach(
        buttons,
        function(button, type) {
          if (util.isContained(targetElement, button)) {
            buttonType = type;

            return false;
          }

          return true;
        },
        this
      );

      return buttonType;
    },
    /* eslint-enable no-lonely-if */

    /**
     * Get number to page elements
     * @param {HTMLElement} targetElement - Each page element
     * @returns {?number} Page number
     * @private
     */
    _getPageNumber: function(targetElement) {
      var targetPage = this._findPageElement(targetElement);
      var page;

      if (targetPage) {
        page = parseInt(targetPage.innerText, 10);
      }

      return page;
    },

    /**
     * Find target element from page elements
     * @param {HTMLElement} targetElement - Each page element
     * @returns {HTMLElement} Found element
     * @ignore
     */
    _findPageElement: function(targetElement) {
      var i = 0;
      var length = this._enabledPageElements.length;
      var pickedItem;

      for (; i < length; i += 1) {
        pickedItem = this._enabledPageElements[i];

        if (util.isContained(targetElement, pickedItem)) {
          return pickedItem;
        }
      }

      return null;
    },

    /**
     * Reset container element
     * @private
     */
    _empty: function() {
      this._enabledPageElements = [];

      forEach(
        this._buttons,
        function(buttonElement, type) {
          this._buttons[type] = buttonElement.cloneNode(true);
        },
        this
      );

      this._getContainerElement().innerHTML = '';
    },

    /**
     * Update view
     * @param {object} viewData - View data to render pagination
     * @ignore
     */
    update: function(viewData) {
      this._empty();
      this._appendFirstButton(viewData);
      this._appendPrevButton(viewData);
      this._appendPrevMoreButton(viewData);
      this._appendPages(viewData);
      this._appendNextMoreButton(viewData);
      this._appendNextButton(viewData);
      this._appendLastButton(viewData);
    }
  }
);

module.exports = View;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Get a target element from an event object.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Get a target element from an event object.
 * @param {Event} e - event object
 * @returns {HTMLElement} - target element
 * @memberof module:domEvent
 */
function getTarget(e) {
  return e.target || e.srcElement;
}

module.exports = getTarget;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Bind DOM events
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isString = __webpack_require__(4);
var forEach = __webpack_require__(3);

var safeEvent = __webpack_require__(23);

/**
 * Bind DOM events.
 * @param {HTMLElement} element - element to bind events
 * @param {(string|object)} types - Space splitted events names or eventName:handler object
 * @param {(function|object)} handler - handler function or context for handler method
 * @param {object} [context] context - context for handler method.
 * @memberof module:domEvent
 * @example
 * var div = document.querySelector('div');
 * 
 * // Bind one event to an element.
 * on(div, 'click', toggle);
 * 
 * // Bind multiple events with a same handler to multiple elements at once.
 * // Use event names splitted by a space.
 * on(div, 'mouseenter mouseleave', changeColor);
 * 
 * // Bind multiple events with different handlers to an element at once.
 * // Use an object which of key is an event name and value is a handler function.
 * on(div, {
 *   keydown: highlight,
 *   keyup: dehighlight
 * });
 * 
 * // Set a context for handler method.
 * var name = 'global';
 * var repository = {name: 'CodeSnippet'};
 * on(div, 'drag', function() {
 *  console.log(this.name);
 * }, repository);
 * // Result when you drag a div: "CodeSnippet"
 */
function on(element, types, handler, context) {
  if (isString(types)) {
    forEach(types.split(/\s+/g), function(type) {
      bindEvent(element, type, handler, context);
    });

    return;
  }

  forEach(types, function(func, type) {
    bindEvent(element, type, func, handler);
  });
}

/**
 * Bind DOM events
 * @param {HTMLElement} element - element to bind events
 * @param {string} type - events name
 * @param {function} handler - handler function or context for handler method
 * @param {object} [context] context - context for handler method.
 * @private
 */
function bindEvent(element, type, handler, context) {
  /**
     * Event handler
     * @param {Event} e - event object
     */
  function eventHandler(e) {
    handler.call(context || element, e || window.event);
  }

  if ('addEventListener' in element) {
    element.addEventListener(type, eventHandler);
  } else if ('attachEvent' in element) {
    element.attachEvent('on' + type, eventHandler);
  }
  memorizeHandler(element, type, handler, eventHandler);
}

/**
 * Memorize DOM event handler for unbinding.
 * @param {HTMLElement} element - element to bind events
 * @param {string} type - events name
 * @param {function} handler - handler function that user passed at on() use
 * @param {function} wrappedHandler - handler function that wrapped by domevent for implementing some features
 * @private
 */
function memorizeHandler(element, type, handler, wrappedHandler) {
  var events = safeEvent(element, type);
  var existInEvents = false;

  forEach(events, function(obj) {
    if (obj.handler === handler) {
      existInEvents = true;

      return false;
    }

    return true;
  });

  if (!existInEvents) {
    events.push({
      handler: handler,
      wrappedHandler: wrappedHandler
    });
  }
}

module.exports = on;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Get event collection for specific HTML element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var EVENT_KEY = '_feEventKey';

/**
 * Get event collection for specific HTML element
 * @param {HTMLElement} element - HTML element
 * @param {string} type - event type
 * @returns {array}
 * @private
 */
function safeEvent(element, type) {
  var events = element[EVENT_KEY];
  var handlers;

  if (!events) {
    events = element[EVENT_KEY] = {};
  }

  handlers = events[type];
  if (!handlers) {
    handlers = events[type] = [];
  }

  return handlers;
}

module.exports = safeEvent;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Prevent default action
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Prevent default action
 * @param {Event} e - event object
 * @memberof module:domEvent
 */
function preventDefault(e) {
  if (e.preventDefault) {
    e.preventDefault();

    return;
  }

  e.returnValue = false;
}

module.exports = preventDefault;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Add css class to element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEach = __webpack_require__(3);
var inArray = __webpack_require__(8);
var getClass = __webpack_require__(26);
var setClassName = __webpack_require__(27);

/**
 * domUtil module
 * @module domUtil
 */

/**
 * Add css class to element
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {...string} cssClass - css classes to add
 * @memberof module:domUtil
 */
function addClass(element) {
  var cssClass = Array.prototype.slice.call(arguments, 1);
  var classList = element.classList;
  var newClass = [];
  var origin;

  if (classList) {
    forEach(cssClass, function(name) {
      element.classList.add(name);
    });

    return;
  }

  origin = getClass(element);

  if (origin) {
    cssClass = [].concat(origin.split(/\s+/), cssClass);
  }

  forEach(cssClass, function(cls) {
    if (inArray(cls, newClass) < 0) {
      newClass.push(cls);
    }
  });

  setClassName(element, newClass);
}

module.exports = addClass;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Get HTML element's design classes.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(1);

/**
 * Get HTML element's design classes.
 * @param {(HTMLElement|SVGElement)} element target element
 * @returns {string} element css class name
 * @memberof module:domUtil
 */
function getClass(element) {
  if (!element || !element.className) {
    return '';
  }

  if (isUndefined(element.className.baseVal)) {
    return element.className;
  }

  return element.className.baseVal;
}

module.exports = getClass;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Set className value
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(2);
var isUndefined = __webpack_require__(1);

/**
 * Set className value
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {(string|string[])} cssClass - class names
 * @private
 */
function setClassName(element, cssClass) {
  cssClass = isArray(cssClass) ? cssClass.join(' ') : cssClass;

  cssClass = cssClass.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

  if (isUndefined(element.className.baseVal)) {
    element.className = cssClass;

    return;
  }

  element.className.baseVal = cssClass;
}

module.exports = setClassName;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a instance of HTMLNode or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a instance of HTMLNode or not.
 * If the given variables is a instance of HTMLNode, return true.
 * @param {*} html - Target for checking
 * @returns {boolean} Is HTMLNode ?
 * @memberof module:type
 */
function isHTMLNode(html) {
  if (typeof HTMLElement === 'object') {
    return (html && (html instanceof HTMLElement || !!html.nodeType));
  }

  return !!(html && html.nodeType);
}

module.exports = isHTMLNode;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Convert text by binding expressions with context.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var inArray = __webpack_require__(8);
var forEach = __webpack_require__(3);
var isArray = __webpack_require__(2);
var isString = __webpack_require__(4);
var extend = __webpack_require__(0);

// IE8 does not support capture groups.
var EXPRESSION_REGEXP = /{{\s?|\s?}}/g;
var BRACKET_NOTATION_REGEXP = /^[a-zA-Z0-9_@]+\[[a-zA-Z0-9_@"']+\]$/;
var BRACKET_REGEXP = /\[\s?|\s?\]/;
var DOT_NOTATION_REGEXP = /^[a-zA-Z_]+\.[a-zA-Z_]+$/;
var DOT_REGEXP = /\./;
var STRING_NOTATION_REGEXP = /^["']\w+["']$/;
var STRING_REGEXP = /"|'/g;
var NUMBER_REGEXP = /^-?\d+\.?\d*$/;

var EXPRESSION_INTERVAL = 2;

var BLOCK_HELPERS = {
  'if': handleIf,
  'each': handleEach,
  'with': handleWith
};

var isValidSplit = 'a'.split(/a/).length === 3;

/**
 * Split by RegExp. (Polyfill for IE8)
 * @param {string} text - text to be splitted\
 * @param {RegExp} regexp - regular expression
 * @returns {Array.<string>}
 */
var splitByRegExp = (function() {
  if (isValidSplit) {
    return function(text, regexp) {
      return text.split(regexp);
    };
  }

  return function(text, regexp) {
    var result = [];
    var prevIndex = 0;
    var match, index;

    if (!regexp.global) {
      regexp = new RegExp(regexp, 'g');
    }

    match = regexp.exec(text);
    while (match !== null) {
      index = match.index;
      result.push(text.slice(prevIndex, index));

      prevIndex = index + match[0].length;
      match = regexp.exec(text);
    }
    result.push(text.slice(prevIndex));

    return result;
  };
})();

/**
 * Find value in the context by an expression.
 * @param {string} exp - an expression
 * @param {object} context - context
 * @returns {*}
 * @private
 */
// eslint-disable-next-line complexity
function getValueFromContext(exp, context) {
  var splitedExps;
  var value = context[exp];

  if (exp === 'true') {
    value = true;
  } else if (exp === 'false') {
    value = false;
  } else if (STRING_NOTATION_REGEXP.test(exp)) {
    value = exp.replace(STRING_REGEXP, '');
  } else if (BRACKET_NOTATION_REGEXP.test(exp)) {
    splitedExps = exp.split(BRACKET_REGEXP);
    value = getValueFromContext(splitedExps[0], context)[getValueFromContext(splitedExps[1], context)];
  } else if (DOT_NOTATION_REGEXP.test(exp)) {
    splitedExps = exp.split(DOT_REGEXP);
    value = getValueFromContext(splitedExps[0], context)[splitedExps[1]];
  } else if (NUMBER_REGEXP.test(exp)) {
    value = parseFloat(exp);
  }

  return value;
}

/**
 * Extract elseif and else expressions.
 * @param {Array.<string>} ifExps - args of if expression
 * @param {Array.<string>} sourcesInsideBlock - sources inside if block
 * @returns {object} - exps: expressions of if, elseif, and else / sourcesInsideIf: sources inside if, elseif, and else block.
 * @private
 */
function extractElseif(ifExps, sourcesInsideBlock) {
  var exps = [ifExps];
  var sourcesInsideIf = [];
  var otherIfCount = 0;
  var start = 0;

  // eslint-disable-next-line complexity
  forEach(sourcesInsideBlock, function(source, index) {
    if (source.indexOf('if') === 0) {
      otherIfCount += 1;
    } else if (source === '/if') {
      otherIfCount -= 1;
    } else if (!otherIfCount && (source.indexOf('elseif') === 0 || source === 'else')) {
      exps.push(source === 'else' ? ['true'] : source.split(' ').slice(1));
      sourcesInsideIf.push(sourcesInsideBlock.slice(start, index));
      start = index + 1;
    }
  });

  sourcesInsideIf.push(sourcesInsideBlock.slice(start));

  return {
    exps: exps,
    sourcesInsideIf: sourcesInsideIf
  };
}

/**
 * Helper function for "if". 
 * @param {Array.<string>} exps - array of expressions split by spaces
 * @param {Array.<string>} sourcesInsideBlock - array of sources inside the if block
 * @param {object} context - context
 * @returns {string}
 * @private
 */
function handleIf(exps, sourcesInsideBlock, context) {
  var analyzed = extractElseif(exps, sourcesInsideBlock);
  var result = false;
  var compiledSource = '';

  forEach(analyzed.exps, function(exp, index) {
    result = handleExpression(exp, context);
    if (result) {
      compiledSource = compile(analyzed.sourcesInsideIf[index], context);
    }

    return !result;
  });

  return compiledSource;
}

/**
 * Helper function for "each".
 * @param {Array.<string>} exps - array of expressions split by spaces
 * @param {Array.<string>} sourcesInsideBlock - array of sources inside the each block
 * @param {object} context - context
 * @returns {string}
 * @private
 */
function handleEach(exps, sourcesInsideBlock, context) {
  var collection = handleExpression(exps, context);
  var additionalKey = isArray(collection) ? '@index' : '@key';
  var additionalContext = {};
  var result = '';

  forEach(collection, function(item, key) {
    additionalContext[additionalKey] = key;
    additionalContext['@this'] = item;
    extend(context, additionalContext);

    result += compile(sourcesInsideBlock.slice(), context);
  });

  return result;
}

/**
 * Helper function for "with ... as"
 * @param {Array.<string>} exps - array of expressions split by spaces
 * @param {Array.<string>} sourcesInsideBlock - array of sources inside the with block
 * @param {object} context - context
 * @returns {string}
 * @private
 */
function handleWith(exps, sourcesInsideBlock, context) {
  var asIndex = inArray('as', exps);
  var alias = exps[asIndex + 1];
  var result = handleExpression(exps.slice(0, asIndex), context);

  var additionalContext = {};
  additionalContext[alias] = result;

  return compile(sourcesInsideBlock, extend(context, additionalContext)) || '';
}

/**
 * Extract sources inside block in place.
 * @param {Array.<string>} sources - array of sources
 * @param {number} start - index of start block
 * @param {number} end - index of end block
 * @returns {Array.<string>}
 * @private
 */
function extractSourcesInsideBlock(sources, start, end) {
  var sourcesInsideBlock = sources.splice(start + 1, end - start);
  sourcesInsideBlock.pop();

  return sourcesInsideBlock;
}

/**
 * Handle block helper function
 * @param {string} helperKeyword - helper keyword (ex. if, each, with)
 * @param {Array.<string>} sourcesToEnd - array of sources after the starting block
 * @param {object} context - context
 * @returns {Array.<string>}
 * @private
 */
function handleBlockHelper(helperKeyword, sourcesToEnd, context) {
  var executeBlockHelper = BLOCK_HELPERS[helperKeyword];
  var helperCount = 1;
  var startBlockIndex = 0;
  var endBlockIndex;
  var index = startBlockIndex + EXPRESSION_INTERVAL;
  var expression = sourcesToEnd[index];

  while (helperCount && isString(expression)) {
    if (expression.indexOf(helperKeyword) === 0) {
      helperCount += 1;
    } else if (expression.indexOf('/' + helperKeyword) === 0) {
      helperCount -= 1;
      endBlockIndex = index;
    }

    index += EXPRESSION_INTERVAL;
    expression = sourcesToEnd[index];
  }

  if (helperCount) {
    throw Error(helperKeyword + ' needs {{/' + helperKeyword + '}} expression.');
  }

  sourcesToEnd[startBlockIndex] = executeBlockHelper(
    sourcesToEnd[startBlockIndex].split(' ').slice(1),
    extractSourcesInsideBlock(sourcesToEnd, startBlockIndex, endBlockIndex),
    context
  );

  return sourcesToEnd;
}

/**
 * Helper function for "custom helper".
 * If helper is not a function, return helper itself.
 * @param {Array.<string>} exps - array of expressions split by spaces (first element: helper)
 * @param {object} context - context
 * @returns {string}
 * @private
 */
function handleExpression(exps, context) {
  var result = getValueFromContext(exps[0], context);

  if (result instanceof Function) {
    return executeFunction(result, exps.slice(1), context);
  }

  return result;
}

/**
 * Execute a helper function.
 * @param {Function} helper - helper function
 * @param {Array.<string>} argExps - expressions of arguments
 * @param {object} context - context
 * @returns {string} - result of executing the function with arguments
 * @private
 */
function executeFunction(helper, argExps, context) {
  var args = [];
  forEach(argExps, function(exp) {
    args.push(getValueFromContext(exp, context));
  });

  return helper.apply(null, args);
}

/**
 * Get a result of compiling an expression with the context.
 * @param {Array.<string>} sources - array of sources split by regexp of expression.
 * @param {object} context - context
 * @returns {Array.<string>} - array of sources that bind with its context
 * @private
 */
function compile(sources, context) {
  var index = 1;
  var expression = sources[index];
  var exps, firstExp, result;

  while (isString(expression)) {
    exps = expression.split(' ');
    firstExp = exps[0];

    if (BLOCK_HELPERS[firstExp]) {
      result = handleBlockHelper(firstExp, sources.splice(index, sources.length - index), context);
      sources = sources.concat(result);
    } else {
      sources[index] = handleExpression(exps, context);
    }

    index += EXPRESSION_INTERVAL;
    expression = sources[index];
  }

  return sources.join('');
}

/**
 * Convert text by binding expressions with context.
 * <br>
 * If expression exists in the context, it will be replaced.
 * ex) '{{title}}' with context {title: 'Hello!'} is converted to 'Hello!'.
 * An array or object can be accessed using bracket and dot notation.
 * ex) '{{odds\[2\]}}' with context {odds: \[1, 3, 5\]} is converted to '5'.
 * ex) '{{evens\[first\]}}' with context {evens: \[2, 4\], first: 0} is converted to '2'.
 * ex) '{{project\["name"\]}}' and '{{project.name}}' with context {project: {name: 'CodeSnippet'}} is converted to 'CodeSnippet'.
 * <br>
 * If replaced expression is a function, next expressions will be arguments of the function.
 * ex) '{{add 1 2}}' with context {add: function(a, b) {return a + b;}} is converted to '3'.
 * <br>
 * It has 3 predefined block helpers '{{helper ...}} ... {{/helper}}': 'if', 'each', 'with ... as ...'.
 * 1) 'if' evaluates conditional statements. It can use with 'elseif' and 'else'.
 * 2) 'each' iterates an array or object. It provides '@index'(array), '@key'(object), and '@this'(current element).
 * 3) 'with ... as ...' provides an alias.
 * @param {string} text - text with expressions
 * @param {object} context - context
 * @returns {string} - text that bind with its context
 * @memberof module:domUtil
 * @example
 * var template = require('tui-code-snippet/domUtil/template');
 * 
 * var source = 
 *     '<h1>'
 *   +   '{{if isValidNumber title}}'
 *   +     '{{title}}th'
 *   +   '{{elseif isValidDate title}}'
 *   +     'Date: {{title}}'
 *   +   '{{/if}}'
 *   + '</h1>'
 *   + '{{each list}}'
 *   +   '{{with addOne @index as idx}}'
 *   +     '<p>{{idx}}: {{@this}}</p>'
 *   +   '{{/with}}'
 *   + '{{/each}}';
 * 
 * var context = {
 *   isValidDate: function(text) {
 *     return /^\d{4}-(0|1)\d-(0|1|2|3)\d$/.test(text);
 *   },
 *   isValidNumber: function(text) {
 *     return /^\d+$/.test(text);
 *   }
 *   title: '2019-11-25',
 *   list: ['Clean the room', 'Wash the dishes'],
 *   addOne: function(num) {
 *     return num + 1;
 *   }
 * };
 * 
 * var result = template(source, context);
 * console.log(result); // <h1>Date: 2019-11-25</h1><p>1: Clean the room</p><p>2: Wash the dishes</p>
 */
function template(text, context) {
  return compile(splitByRegExp(text, EXPRESSION_REGEXP), context);
}

module.exports = template;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Send hostname on DOMContentLoaded.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(1);
var imagePing = __webpack_require__(31);

var ms7days = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if the date has passed 7 days
 * @param {number} date - milliseconds
 * @returns {boolean}
 * @private
 */
function isExpired(date) {
  var now = new Date().getTime();

  return now - date > ms7days;
}

/**
 * Send hostname on DOMContentLoaded.
 * To prevent hostname set tui.usageStatistics to false.
 * @param {string} appName - application name
 * @param {string} trackingId - GA tracking ID
 * @ignore
 */
function sendHostname(appName, trackingId) {
  var url = 'https://www.google-analytics.com/collect';
  var hostname = location.hostname;
  var hitType = 'event';
  var eventCategory = 'use';
  var applicationKeyForStorage = 'TOAST UI ' + appName + ' for ' + hostname + ': Statistics';
  var date = window.localStorage.getItem(applicationKeyForStorage);

  // skip if the flag is defined and is set to false explicitly
  if (!isUndefined(window.tui) && window.tui.usageStatistics === false) {
    return;
  }

  // skip if not pass seven days old
  if (date && !isExpired(date)) {
    return;
  }

  window.localStorage.setItem(applicationKeyForStorage, new Date().getTime());

  setTimeout(function() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      imagePing(url, {
        v: 1,
        t: hitType,
        tid: trackingId,
        cid: hostname,
        dp: hostname,
        dh: appName,
        el: appName,
        ec: eventCategory
      });
    }
  }, 1000);
}

module.exports = sendHostname;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Request image ping.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEachOwnProperties = __webpack_require__(6);

/**
 * @module request
 */

/**
 * Request image ping.
 * @param {String} url url for ping request
 * @param {Object} trackingInfo infos for make query string
 * @returns {HTMLElement}
 * @memberof module:request
 * @example
 * var imagePing = require('tui-code-snippet/request/imagePing'); // node, commonjs
 *
 * imagePing('https://www.google-analytics.com/collect', {
 *     v: 1,
 *     t: 'event',
 *     tid: 'trackingid',
 *     cid: 'cid',
 *     dp: 'dp',
 *     dh: 'dh'
 * });
 */
function imagePing(url, trackingInfo) {
  var trackingElement = document.createElement('img');
  var queryString = '';
  forEachOwnProperties(trackingInfo, function(value, key) {
    queryString += '&' + key + '=' + value;
  });
  queryString = queryString.substring(1);

  trackingElement.src = url + '?' + queryString;

  trackingElement.style.display = 'none';
  document.body.appendChild(trackingElement);
  document.body.removeChild(trackingElement);

  return trackingElement;
}

module.exports = imagePing;


/***/ })
/******/ ]);
});

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.emitMouseup = void 0;
function emitMouseup(el) {
    var mouseupEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
    });
    el.dispatchEvent(mouseupEvent);
}
exports.emitMouseup = emitMouseup;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createDispatcher = void 0;
var tslib_1 = __webpack_require__(1);
var viewport = tslib_1.__importStar(__webpack_require__(25));
var dimension = tslib_1.__importStar(__webpack_require__(49));
var data = tslib_1.__importStar(__webpack_require__(14));
var column = tslib_1.__importStar(__webpack_require__(33));
var keyboard = tslib_1.__importStar(__webpack_require__(118));
var mouse = tslib_1.__importStar(__webpack_require__(120));
var focus = tslib_1.__importStar(__webpack_require__(17));
var summary = tslib_1.__importStar(__webpack_require__(26));
var selection = tslib_1.__importStar(__webpack_require__(16));
var renderState = tslib_1.__importStar(__webpack_require__(48));
var tree = tslib_1.__importStar(__webpack_require__(32));
var sort = tslib_1.__importStar(__webpack_require__(30));
var filter = tslib_1.__importStar(__webpack_require__(35));
var pagination = tslib_1.__importStar(__webpack_require__(36));
var contextMenu = tslib_1.__importStar(__webpack_require__(121));
var exportData = tslib_1.__importStar(__webpack_require__(56));
var rowSpan = tslib_1.__importStar(__webpack_require__(24));
var dispatchMap = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, viewport), dimension), data), column), mouse), focus), keyboard), summary), selection), renderState), tree), sort), filter), pagination), contextMenu), exportData), rowSpan);
function createDispatcher(store) {
    return function dispatch(fname) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // @ts-ignore
                    return [4 /*yield*/, dispatchMap[fname].apply(dispatchMap, tslib_1.__spreadArrays([store], args))];
                    case 1:
                        // @ts-ignore
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
}
exports.createDispatcher = createDispatcher;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataByKeyMap = exports.paste = exports.removeContent = exports.moveSelection = exports.moveTabFocus = exports.editFocus = exports.moveFocus = void 0;
var tslib_1 = __webpack_require__(1);
var keyboard_1 = __webpack_require__(119);
var focus_1 = __webpack_require__(17);
var selection_1 = __webpack_require__(16);
var column_1 = __webpack_require__(11);
var rowSpan_1 = __webpack_require__(13);
var instance_1 = __webpack_require__(8);
var eventBus_1 = __webpack_require__(7);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var data_1 = __webpack_require__(6);
var validation_1 = __webpack_require__(27);
var clipboard_1 = __webpack_require__(40);
var common_1 = __webpack_require__(0);
var summary_1 = __webpack_require__(26);
var data_2 = __webpack_require__(14);
function moveFocus(store, command) {
    var focus = store.focus, data = store.data, visibleColumnsWithRowHeader = store.column.visibleColumnsWithRowHeader, id = store.id;
    var rowIndex = focus.rowIndex, columnIndex = focus.totalColumnIndex;
    if (rowIndex === null || columnIndex === null) {
        return;
    }
    var _a = keyboard_1.getNextCellIndex(store, command, [rowIndex, columnIndex]), nextRowIndex = _a[0], nextColumnIndex = _a[1];
    var nextColumnName = visibleColumnsWithRowHeader[nextColumnIndex].name;
    if (!column_1.isRowHeader(nextColumnName)) {
        focus.navigating = true;
        focus_1.changeFocus(store, data_1.getRowKeyByIndexWithPageRange(data, nextRowIndex), nextColumnName, id);
    }
}
exports.moveFocus = moveFocus;
function editFocus(store, command) {
    var _a = store.focus, rowKey = _a.rowKey, columnName = _a.columnName;
    if (rowKey === null || columnName === null) {
        return;
    }
    if (command === 'currentCell') {
        focus_1.startEditing(store, rowKey, columnName);
    }
    else if (command === 'nextCell' || command === 'prevCell') {
        // move prevCell or nextCell by tab keyMap
        moveTabFocus(store, command);
    }
}
exports.editFocus = editFocus;
function moveTabFocus(store, command) {
    var focus = store.focus, data = store.data, column = store.column, id = store.id;
    var visibleColumnsWithRowHeader = column.visibleColumnsWithRowHeader;
    var rowKey = focus.rowKey, columnName = focus.columnName, rowIndex = focus.rowIndex, columnIndex = focus.totalColumnIndex;
    if (rowKey === null || columnName === null || rowIndex === null || columnIndex === null) {
        return;
    }
    var _a = keyboard_1.getNextCellIndex(store, command, [rowIndex, columnIndex]), nextRowIndex = _a[0], nextColumnIndex = _a[1];
    var nextRowKey = data_1.getRowKeyByIndexWithPageRange(data, nextRowIndex);
    var nextColumnName = visibleColumnsWithRowHeader[nextColumnIndex].name;
    if (!column_1.isRowHeader(nextColumnName)) {
        focus.navigating = true;
        focus_1.changeFocus(store, nextRowKey, nextColumnName, id);
        if (focus.tabMode === 'moveAndEdit' &&
            focus.rowKey === nextRowKey &&
            focus.columnName === nextColumnName) {
            setTimeout(function () {
                focus_1.startEditing(store, nextRowKey, nextColumnName);
            });
        }
    }
}
exports.moveTabFocus = moveTabFocus;
function moveSelection(store, command) {
    var _a;
    var selection = store.selection, focus = store.focus, data = store.data, column = store.column, id = store.id;
    var visibleColumnsWithRowHeader = column.visibleColumnsWithRowHeader, rowHeaderCount = column.rowHeaderCount;
    var filteredViewData = data.filteredViewData, sortState = data.sortState;
    var focusRowIndex = focus.rowIndex, totalFocusColumnIndex = focus.totalColumnIndex;
    var currentInputRange = selection.inputRange;
    if (focusRowIndex === null || totalFocusColumnIndex === null) {
        return;
    }
    if (!currentInputRange) {
        currentInputRange = selection.inputRange = {
            row: [focusRowIndex, focusRowIndex],
            column: [totalFocusColumnIndex, totalFocusColumnIndex],
        };
    }
    var rowLength = filteredViewData.length;
    var columnLength = visibleColumnsWithRowHeader.length;
    var rowStartIndex = currentInputRange.row[0];
    var rowIndex = currentInputRange.row[1];
    var columnStartIndex = currentInputRange.column[0];
    var columnIndex = currentInputRange.column[1];
    var nextCellIndexes;
    if (command === 'all') {
        rowStartIndex = 0;
        columnStartIndex = rowHeaderCount;
        nextCellIndexes = [rowLength - 1, columnLength - 1];
    }
    else {
        nextCellIndexes = keyboard_1.getNextCellIndex(store, command, [rowIndex, columnIndex]);
        if (rowSpan_1.isRowSpanEnabled(sortState, column)) {
            nextCellIndexes = keyboard_1.getNextCellIndexWithRowSpan(store, command, rowIndex, [columnStartIndex, columnIndex], nextCellIndexes);
        }
    }
    var nextRowIndex = nextCellIndexes[0], nextColumnIndex = nextCellIndexes[1];
    var nextColumnName = visibleColumnsWithRowHeader[nextColumnIndex].name;
    var startRowIndex = rowStartIndex;
    var endRowIndex = nextRowIndex;
    if (command !== 'all') {
        _a = rowSpan_1.getRowRangeWithRowSpan([startRowIndex, endRowIndex], [columnStartIndex, nextColumnIndex], column, focus.rowIndex, data), startRowIndex = _a[0], endRowIndex = _a[1];
    }
    if (!column_1.isRowHeader(nextColumnName)) {
        var inputRange = {
            row: [startRowIndex, endRowIndex],
            column: [columnStartIndex, nextColumnIndex],
        };
        selection_1.changeSelectionRange(selection, inputRange, id);
    }
}
exports.moveSelection = moveSelection;
function removeContent(store) {
    var column = store.column, data = store.data;
    var range = keyboard_1.getRemoveRange(store);
    if (!range) {
        return;
    }
    var _a = range.column, columnStart = _a[0], columnEnd = _a[1], _b = range.row, rowStart = _b[0], rowEnd = _b[1];
    var changeValueFns = [];
    var prevChanges = [];
    var nextChanges = [];
    data.filteredRawData.slice(rowStart, rowEnd + 1).forEach(function (row, index) {
        column.visibleColumnsWithRowHeader.slice(columnStart, columnEnd + 1).forEach(function (_a) {
            var name = _a.name;
            var rowIndex = index + rowStart;
            if (data_1.isEditableCell(store, rowIndex, name)) {
                var _b = data_1.createChangeInfo(store, row, name, '', rowIndex), prevChange = _b.prevChange, nextChange = _b.nextChange, changeValue = _b.changeValue;
                prevChanges.push(prevChange);
                nextChanges.push(nextChange);
                changeValueFns.push(changeValue);
            }
        });
    });
    updateDataByKeyMap(store, 'delete', { prevChanges: prevChanges, nextChanges: nextChanges, changeValueFns: changeValueFns });
}
exports.removeContent = removeContent;
function applyCopiedData(store, copiedData, range) {
    var data = store.data, column = store.column;
    var filteredRawData = data.filteredRawData, filteredViewData = data.filteredViewData;
    var visibleColumnsWithRowHeader = column.visibleColumnsWithRowHeader;
    var _a = range.row, startRowIndex = _a[0], endRowIndex = _a[1], _b = range.column, startColumnIndex = _b[0], endColumnIndex = _b[1];
    var columnNames = common_1.mapProp('name', visibleColumnsWithRowHeader);
    var changeValueFns = [];
    var prevChanges = [];
    var nextChanges = [];
    for (var rowIndex = 0; rowIndex + startRowIndex <= endRowIndex; rowIndex += 1) {
        var rawRowIndex = rowIndex + startRowIndex;
        for (var columnIndex = 0; columnIndex + startColumnIndex <= endColumnIndex; columnIndex += 1) {
            var name = columnNames[columnIndex + startColumnIndex];
            if (filteredViewData.length && data_1.isEditableCell(store, rawRowIndex, name)) {
                var targetRow = filteredRawData[rawRowIndex];
                var _c = data_1.createChangeInfo(store, targetRow, name, copiedData[rowIndex][columnIndex], rawRowIndex), prevChange = _c.prevChange, nextChange = _c.nextChange, changeValue = _c.changeValue;
                prevChanges.push(prevChange);
                nextChanges.push(nextChange);
                changeValueFns.push(changeValue);
            }
        }
    }
    updateDataByKeyMap(store, 'paste', { prevChanges: prevChanges, nextChanges: nextChanges, changeValueFns: changeValueFns });
}
function paste(store, copiedData) {
    var selection = store.selection, id = store.id, viewData = store.data.viewData;
    var originalRange = selection.originalRange;
    if (originalRange) {
        copiedData = clipboard_1.copyDataToRange(originalRange, copiedData);
    }
    var rangeToPaste = clipboard_1.getRangeToPaste(store, copiedData);
    var endRowIndex = rangeToPaste.row[1];
    if (endRowIndex > viewData.length - 1) {
        // appendRows(
        //   store,
        //   [...Array(endRowIndex - viewData.length + 1)].map(() => ({}))
        // );
        return;
    }
    applyCopiedData(store, copiedData, rangeToPaste);
    selection_1.changeSelectionRange(selection, rangeToPaste, id);
}
exports.paste = paste;
function updateDataByKeyMap(store, origin, changeInfo) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var id, data, column, rawData, filteredRawData, prevChanges, nextChanges, changeValueFns, eventBus, manager, gridEvent, index;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = store.id, data = store.data, column = store.column;
                    rawData = data.rawData, filteredRawData = data.filteredRawData;
                    prevChanges = changeInfo.prevChanges, nextChanges = changeInfo.nextChanges, changeValueFns = changeInfo.changeValueFns;
                    eventBus = eventBus_1.getEventBus(id);
                    manager = instance_1.getDataManager(id);
                    gridEvent = new gridEvent_1.default({ origin: origin, changes: prevChanges });
                    /**
                     * Occurs before one or more cells is changed
                     * @event Grid#beforeChange
                     * @property {string} origin - The type of change('paste', 'delete', 'cell')
                     * @property {Array.<object>} changes - rowKey, column name, original values and next values before changing the values
                     * @property {Grid} instance - Current grid instance
                     */
                    return [4 /*yield*/, eventBus.trigger('beforeChange', gridEvent)];
                case 1:
                    /**
                     * Occurs before one or more cells is changed
                     * @event Grid#beforeChange
                     * @property {string} origin - The type of change('paste', 'delete', 'cell')
                     * @property {Array.<object>} changes - rowKey, column name, original values and next values before changing the values
                     * @property {Grid} instance - Current grid instance
                     */
                    _a.sent();
                    if (gridEvent.isStopped()) {
                        return [2 /*return*/];
                    }
                    index = null;
                    changeValueFns.forEach(function (changeValue) {
                        var targetRowIndex = changeValue();
                        if (index !== targetRowIndex) {
                            index = targetRowIndex;
                            manager.push('UPDATE', filteredRawData[index]);
                        }
                    });
                    summary_1.updateAllSummaryValues(store);
                    validation_1.forceValidateUniquenessOfColumns(rawData, column);
                    data_2.updateHeights(store);
                    gridEvent = new gridEvent_1.default({ origin: origin, changes: nextChanges });
                    /**
                     * Occurs after one or more cells is changed
                     * @event Grid#afterChange
                     * @property {string} origin - The type of change('paste', 'delete', 'cell')
                     * @property {Array.<object>} changes - rowKey, column name, previous values and changed values after changing the values
                     * @property {Grid} instance - Current grid instance
                     */
                    return [4 /*yield*/, eventBus.trigger('afterChange', gridEvent)];
                case 2:
                    /**
                     * Occurs after one or more cells is changed
                     * @event Grid#afterChange
                     * @property {string} origin - The type of change('paste', 'delete', 'cell')
                     * @property {Array.<object>} changes - rowKey, column name, previous values and changed values after changing the values
                     * @property {Grid} instance - Current grid instance
                     */
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateDataByKeyMap = updateDataByKeyMap;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextCellIndexWithRowSpan = exports.getRemoveRange = exports.getNextCellIndex = void 0;
var common_1 = __webpack_require__(0);
var rowSpan_1 = __webpack_require__(13);
var selection_1 = __webpack_require__(21);
var data_1 = __webpack_require__(6);
function getPrevRowIndex(rowIndex, heights) {
    var index = rowIndex;
    while (index > 0) {
        index -= 1;
        if (heights[index]) {
            break;
        }
    }
    return index;
}
function getNextRowIndex(rowIndex, heights) {
    var index = rowIndex;
    while (index < heights.length - 1) {
        index += 1;
        if (heights[index]) {
            break;
        }
    }
    return index;
}
function getNextCellIndex(store, command, _a) {
    var rowIndex = _a[0], columnIndex = _a[1];
    var data = store.data, column = store.column, heights = store.rowCoords.heights;
    var visibleColumnsWithRowHeader = column.visibleColumnsWithRowHeader, rowHeaderCount = column.rowHeaderCount;
    var sortState = data.sortState, filteredRawData = data.filteredRawData, pageRowRange = data.pageRowRange;
    var lastRowIndex = (data_1.isClientPagination(data) ? pageRowRange[1] - pageRowRange[0] : filteredRawData.length) - 1;
    var columnName = visibleColumnsWithRowHeader[columnIndex].name;
    var lastRow = lastRowIndex === rowIndex;
    var lastColumn = visibleColumnsWithRowHeader.length - 1 === columnIndex;
    var firstRow = rowIndex === 0;
    var firstColumn = columnIndex === rowHeaderCount;
    switch (command) {
        case 'up':
            if (rowSpan_1.isRowSpanEnabled(sortState, column)) {
                rowIndex = rowSpan_1.getRowSpanTopIndex(rowIndex, columnName, filteredRawData);
            }
            rowIndex = getPrevRowIndex(rowIndex, heights);
            break;
        case 'down':
            if (rowSpan_1.isRowSpanEnabled(sortState, column)) {
                rowIndex = rowSpan_1.getRowSpanBottomIndex(rowIndex, columnName, filteredRawData);
            }
            rowIndex = getNextRowIndex(rowIndex, heights);
            break;
        case 'left':
            columnIndex -= 1;
            break;
        case 'right':
            columnIndex += 1;
            break;
        case 'firstCell':
            columnIndex = rowHeaderCount;
            rowIndex = 0;
            break;
        case 'lastCell':
            columnIndex = visibleColumnsWithRowHeader.length - 1;
            rowIndex = lastRowIndex;
            break;
        case 'pageUp': {
            rowIndex = 0;
            break;
        }
        case 'pageDown': {
            rowIndex = lastRowIndex;
            break;
        }
        case 'firstColumn':
            columnIndex = rowHeaderCount;
            break;
        case 'lastColumn':
            columnIndex = visibleColumnsWithRowHeader.length - 1;
            break;
        case 'nextCell':
            if (lastRow && lastColumn) {
                break;
            }
            if (lastColumn) {
                if (rowSpan_1.isRowSpanEnabled(sortState, column)) {
                    rowIndex = rowSpan_1.getRowSpanBottomIndex(rowIndex, columnName, filteredRawData);
                }
                rowIndex = getNextRowIndex(rowIndex, heights);
                columnIndex = rowHeaderCount;
            }
            else {
                columnIndex += 1;
            }
            break;
        case 'prevCell':
            if (firstRow && firstColumn) {
                break;
            }
            if (firstColumn) {
                if (rowSpan_1.isRowSpanEnabled(sortState, column)) {
                    rowIndex = rowSpan_1.getRowSpanTopIndex(rowIndex, columnName, filteredRawData);
                }
                rowIndex = getPrevRowIndex(rowIndex, heights);
                columnIndex = visibleColumnsWithRowHeader.length - 1;
            }
            else {
                columnIndex -= 1;
            }
            break;
        default:
            break;
    }
    rowIndex = common_1.clamp(rowIndex, 0, lastRowIndex);
    columnIndex = common_1.clamp(columnIndex, 0, visibleColumnsWithRowHeader.length - 1);
    return [rowIndex, columnIndex];
}
exports.getNextCellIndex = getNextCellIndex;
function getRemoveRange(store) {
    var focus = store.focus, selection = store.selection;
    var totalColumnIndex = focus.totalColumnIndex, originalRowIndex = focus.originalRowIndex;
    var originalRange = selection.originalRange;
    if (originalRange) {
        return originalRange;
    }
    if (!common_1.isNull(totalColumnIndex) && !common_1.isNull(originalRowIndex)) {
        return {
            column: [totalColumnIndex, totalColumnIndex],
            row: [originalRowIndex, originalRowIndex],
        };
    }
    return null;
}
exports.getRemoveRange = getRemoveRange;
function getNextCellIndexWithRowSpan(store, command, currentRowIndex, columnRange, cellIndexes) {
    var rowIndex = cellIndexes[0];
    var columnIndex = cellIndexes[1];
    var _a = selection_1.getSortedRange(columnRange), startColumnIndex = _a[0], endColumnIndex = _a[1];
    for (var index = startColumnIndex; index <= endColumnIndex; index += 1) {
        var nextRowIndex = getNextCellIndex(store, command, [currentRowIndex, index])[0];
        if ((command === 'up' && nextRowIndex < rowIndex) ||
            (command === 'down' && nextRowIndex > rowIndex)) {
            rowIndex = nextRowIndex;
        }
    }
    return [rowIndex, columnIndex];
}
exports.getNextCellIndexWithRowSpan = getNextCellIndexWithRowSpan;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.dragMoveRowHeader = exports.mouseDownRowHeader = exports.dragMoveHeader = exports.mouseDownHeader = exports.mouseDownBody = exports.dragEnd = exports.dragMoveBody = exports.selectionEnd = exports.setNavigating = void 0;
var common_1 = __webpack_require__(0);
var column_1 = __webpack_require__(11);
var focus_1 = __webpack_require__(17);
var selection_1 = __webpack_require__(16);
var rowSpan_1 = __webpack_require__(13);
var selection_2 = __webpack_require__(21);
var data_1 = __webpack_require__(6);
var mouse_1 = __webpack_require__(37);
function stopAutoScroll(selection) {
    var intervalIdForAutoScroll = selection.intervalIdForAutoScroll;
    if (intervalIdForAutoScroll !== null) {
        clearInterval(intervalIdForAutoScroll);
        selection.intervalIdForAutoScroll = null;
    }
}
function isAutoScrollable(overflowX, overflowY) {
    return !(overflowX === 0 && overflowY === 0);
}
function adjustScrollLeft(overflowX, viewport) {
    var scrollPixelScale = viewport.scrollPixelScale, scrollLeft = viewport.scrollLeft, maxScrollLeft = viewport.maxScrollLeft;
    if (overflowX < 0) {
        viewport.scrollLeft = Math.max(0, scrollLeft - scrollPixelScale);
    }
    else if (overflowX > 0) {
        viewport.scrollLeft = Math.min(maxScrollLeft, scrollLeft + scrollPixelScale);
    }
}
function adjustScrollTop(overflowY, viewport) {
    var scrollTop = viewport.scrollTop, maxScrollTop = viewport.maxScrollTop, scrollPixelScale = viewport.scrollPixelScale;
    if (overflowY < 0) {
        viewport.scrollTop = Math.max(0, scrollTop - scrollPixelScale);
    }
    else if (overflowY > 0) {
        viewport.scrollTop = Math.min(maxScrollTop, scrollTop + scrollPixelScale);
    }
}
function adjustScroll(viewport, overflow) {
    if (overflow.x) {
        adjustScrollLeft(overflow.x, viewport);
    }
    if (overflow.y) {
        adjustScrollTop(overflow.y, viewport);
    }
}
function setScrolling(_a, bodyWidth, selection, dimension, viewport) {
    var pageX = _a.pageX, pageY = _a.pageY;
    var overflow = mouse_1.getOverflowFromMousePosition(pageX, pageY, bodyWidth, dimension);
    stopAutoScroll(selection);
    if (isAutoScrollable(overflow.x, overflow.y)) {
        selection.intervalIdForAutoScroll = setInterval(adjustScroll.bind(null, viewport, overflow));
    }
}
function setNavigating(_a, navigating) {
    var focus = _a.focus;
    focus.navigating = navigating;
}
exports.setNavigating = setNavigating;
function selectionEnd(_a) {
    var selection = _a.selection;
    selection.inputRange = null;
}
exports.selectionEnd = selectionEnd;
function updateSelection(store, dragData) {
    var _a;
    var viewport = store.viewport, selection = store.selection, column = store.column, id = store.id, data = store.data, focus = store.focus;
    var scrollTop = viewport.scrollTop, scrollLeft = viewport.scrollLeft;
    var pageX = dragData.pageX, pageY = dragData.pageY;
    var curInputRange = selection.inputRange;
    var startRowIndex, startColumnIndex, endRowIndex;
    var viewInfo = { pageX: pageX, pageY: pageY, scrollTop: scrollTop, scrollLeft: scrollLeft };
    var endColumnIndex = mouse_1.findColumnIndexByPosition(store, viewInfo);
    endRowIndex = mouse_1.findRowIndexByPosition(store, viewInfo);
    if (curInputRange === null) {
        var totalColumnIndex = focus.totalColumnIndex, rowIndex = focus.rowIndex;
        startColumnIndex = totalColumnIndex;
        startRowIndex = rowIndex;
    }
    else {
        startRowIndex = curInputRange.row[0];
        startColumnIndex = curInputRange.column[0];
    }
    if (startColumnIndex < 0 || endColumnIndex < 0 || startRowIndex < 0 || endRowIndex < 0) {
        return;
    }
    _a = rowSpan_1.getRowRangeWithRowSpan([startRowIndex, endRowIndex], [startColumnIndex, endColumnIndex], column, store.focus.rowIndex, data), startRowIndex = _a[0], endRowIndex = _a[1];
    var inputRange = {
        row: [startRowIndex, endRowIndex],
        column: [startColumnIndex, endColumnIndex],
    };
    selection_1.changeSelectionRange(selection, inputRange, id);
}
function finishEditingByHeaderSelection(store, rowKey, columnName) {
    var editingAddress = store.focus.editingAddress;
    if (editingAddress) {
        if (editingAddress.rowKey === rowKey && editingAddress.columnName === columnName) {
            focus_1.saveAndFinishEditing(store);
        }
    }
}
function dragMoveBody(store, dragStartData, dragData, elementInfo) {
    var dimension = store.dimension, columnCoords = store.columnCoords, selection = store.selection, viewport = store.viewport;
    var areaWidth = columnCoords.areaWidth;
    var _a = mouse_1.getColumnNameRange(store, dragStartData, dragData, elementInfo), startColumnName = _a[0], endColumnName = _a[1];
    if (!column_1.isRowHeader(startColumnName) && !column_1.isRowHeader(endColumnName)) {
        updateSelection(store, dragData);
        setScrolling(dragData, areaWidth.L + areaWidth.R, selection, dimension, viewport);
    }
}
exports.dragMoveBody = dragMoveBody;
function dragEnd(_a) {
    var selection = _a.selection;
    stopAutoScroll(selection);
}
exports.dragEnd = dragEnd;
function mouseDownBody(store, elementInfo, eventInfo) {
    var data = store.data, column = store.column, columnCoords = store.columnCoords, rowCoords = store.rowCoords, id = store.id;
    var filteredRawData = data.filteredRawData;
    if (!filteredRawData.length) {
        return;
    }
    var pageX = eventInfo.pageX, pageY = eventInfo.pageY, shiftKey = eventInfo.shiftKey;
    var visibleColumnsBySideWithRowHeader = column.visibleColumnsBySideWithRowHeader;
    var side = elementInfo.side, scrollLeft = elementInfo.scrollLeft, scrollTop = elementInfo.scrollTop, left = elementInfo.left, top = elementInfo.top;
    var offsetLeft = pageX - left + scrollLeft;
    var offsetTop = pageY - top + scrollTop;
    var columnIndex = common_1.findOffsetIndex(columnCoords.offsets[side], offsetLeft);
    var columnName = visibleColumnsBySideWithRowHeader[side][columnIndex].name;
    if (!column_1.isRowHeader(columnName)) {
        if (shiftKey) {
            var dragData = { pageX: pageX, pageY: pageY };
            updateSelection(store, dragData);
        }
        else {
            var rowIndex = common_1.findOffsetIndex(rowCoords.offsets, offsetTop);
            selectionEnd(store);
            focus_1.changeFocus(store, data_1.getRowKeyByIndexWithPageRange(data, rowIndex), columnName, id);
        }
    }
}
exports.mouseDownBody = mouseDownBody;
function mouseDownHeader(store, name, parentHeader) {
    var _a;
    var data = store.data, selection = store.selection, id = store.id, column = store.column, rowCoords = store.rowCoords;
    var filteredRawData = data.filteredRawData;
    if (!filteredRawData.length) {
        return;
    }
    var visibleColumnsWithRowHeader = column.visibleColumnsWithRowHeader, complexColumnHeaders = column.complexColumnHeaders;
    var endRowIndex = rowCoords.heights.length - 1;
    var startColumnIndex, endColumnIndex, columnName;
    if (parentHeader) {
        _a = selection_2.getChildColumnRange(visibleColumnsWithRowHeader, complexColumnHeaders, name), startColumnIndex = _a[0], endColumnIndex = _a[1];
        columnName = visibleColumnsWithRowHeader[startColumnIndex].name;
    }
    else {
        startColumnIndex = endColumnIndex = common_1.findPropIndex('name', name, visibleColumnsWithRowHeader);
        columnName = name;
    }
    var inputRange = {
        row: [0, endRowIndex],
        column: [startColumnIndex, endColumnIndex],
    };
    var rowKey = data_1.getRowKeyByIndexWithPageRange(data, 0);
    finishEditingByHeaderSelection(store, rowKey, columnName);
    focus_1.changeFocus(store, rowKey, columnName, id);
    selection_1.changeSelectionRange(selection, inputRange, id);
}
exports.mouseDownHeader = mouseDownHeader;
function dragMoveHeader(store, dragData, startSelectedName) {
    var dimension = store.dimension, viewport = store.viewport, columnCoords = store.columnCoords, selection = store.selection, column = store.column, id = store.id;
    var scrollTop = viewport.scrollTop, scrollLeft = viewport.scrollLeft;
    var areaWidth = columnCoords.areaWidth;
    var visibleColumnsWithRowHeader = column.visibleColumnsWithRowHeader, complexColumnHeaders = column.complexColumnHeaders;
    var pageX = dragData.pageX, pageY = dragData.pageY;
    var curInputRange = selection.inputRange;
    if (common_1.isNull(curInputRange)) {
        return;
    }
    var _a = selection_2.getChildColumnRange(visibleColumnsWithRowHeader, complexColumnHeaders, startSelectedName), startColumnIdx = _a[0], endColumnIdx = _a[1];
    var viewInfo = { pageX: pageX, pageY: pageY, scrollTop: scrollTop, scrollLeft: scrollLeft };
    var columnIndex = mouse_1.findColumnIndexByPosition(store, viewInfo);
    var rowIndex = curInputRange.row[1];
    if (columnIndex < startColumnIdx) {
        startColumnIdx = columnIndex;
    }
    if (columnIndex > endColumnIdx) {
        endColumnIdx = columnIndex;
    }
    if (columnIndex >= 0) {
        var inputRange = {
            row: [0, rowIndex],
            column: [startColumnIdx, endColumnIdx],
        };
        selection_1.changeSelectionRange(selection, inputRange, id);
        setScrolling(dragData, areaWidth.L + areaWidth.R, selection, dimension, viewport);
    }
}
exports.dragMoveHeader = dragMoveHeader;
function mouseDownRowHeader(store, rowKey) {
    var selection = store.selection, id = store.id, column = store.column, data = store.data;
    var visibleColumnsWithRowHeader = column.visibleColumnsWithRowHeader, rowHeaderCount = column.rowHeaderCount;
    var rowIndex = data_1.findIndexByRowKey(data, column, id, rowKey);
    var rowIndexPerPage = data_1.getRowIndexPerPage(data, rowIndex);
    var endColumnIndex = visibleColumnsWithRowHeader.length - 1;
    var _a = rowSpan_1.getRowRangeWithRowSpan([rowIndexPerPage, rowIndexPerPage], [rowHeaderCount, endColumnIndex], column, null, data), startRowIndex = _a[0], endRowIndex = _a[1];
    var inputRange = {
        row: [startRowIndex, endRowIndex],
        column: [rowHeaderCount, endColumnIndex],
    };
    var editingRowKey = data.filteredRawData[rowIndex].rowKey;
    var editingColumnName = visibleColumnsWithRowHeader[rowHeaderCount].name;
    finishEditingByHeaderSelection(store, editingRowKey, editingColumnName);
    focus_1.changeFocus(store, editingRowKey, editingColumnName, id);
    selection_1.changeSelectionRange(selection, inputRange, id);
}
exports.mouseDownRowHeader = mouseDownRowHeader;
function dragMoveRowHeader(store, dragData) {
    var _a;
    var viewport = store.viewport, selection = store.selection, id = store.id, data = store.data, column = store.column;
    var scrollTop = viewport.scrollTop, scrollLeft = viewport.scrollLeft;
    var rowHeaderCount = column.rowHeaderCount;
    var pageX = dragData.pageX, pageY = dragData.pageY;
    var curInputRange = selection.inputRange;
    if (curInputRange === null) {
        return;
    }
    var viewInfo = { pageX: pageX, pageY: pageY, scrollTop: scrollTop, scrollLeft: scrollLeft };
    var columnIndex = curInputRange.column[1];
    var startRowIndex = curInputRange.row[0];
    var endRowIndex = mouse_1.findRowIndexByPosition(store, viewInfo);
    _a = rowSpan_1.getRowRangeWithRowSpan([startRowIndex, endRowIndex], [rowHeaderCount, columnIndex], column, null, data), startRowIndex = _a[0], endRowIndex = _a[1];
    var inputRange = {
        row: [startRowIndex, endRowIndex],
        column: [rowHeaderCount, columnIndex],
    };
    selection_1.changeSelectionRange(selection, inputRange, id);
}
exports.dragMoveRowHeader = dragMoveRowHeader;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.excelExport = exports.csvExport = exports.copyRows = exports.copyColumns = exports.copy = exports.hideContextMenu = exports.showContextMenu = void 0;
var clipboard_1 = __webpack_require__(55);
var export_1 = __webpack_require__(56);
var common_1 = __webpack_require__(0);
var data_1 = __webpack_require__(6);
function showContextMenu(_a, pos, elementInfo, eventInfo) {
    var contextMenu = _a.contextMenu, data = _a.data, column = _a.column, columnCoords = _a.columnCoords, rowCoords = _a.rowCoords;
    var pageX = eventInfo.pageX, pageY = eventInfo.pageY;
    var visibleColumnsBySideWithRowHeader = column.visibleColumnsBySideWithRowHeader;
    var side = elementInfo.side, scrollLeft = elementInfo.scrollLeft, scrollTop = elementInfo.scrollTop, left = elementInfo.left, top = elementInfo.top;
    var offsetLeft = pageX - left + scrollLeft;
    var offsetTop = pageY - top + scrollTop;
    var columnIndex = common_1.findOffsetIndex(columnCoords.offsets[side], offsetLeft);
    var columnName = visibleColumnsBySideWithRowHeader[side][columnIndex].name;
    var rowIndex = common_1.findOffsetIndex(rowCoords.offsets, offsetTop);
    var rowKey = data_1.getRowKeyByIndexWithPageRange(data, rowIndex);
    contextMenu.posInfo = { pos: pos, rowKey: rowKey, columnName: columnName };
}
exports.showContextMenu = showContextMenu;
function hideContextMenu(_a) {
    var contextMenu = _a.contextMenu;
    contextMenu.posInfo = null;
}
exports.hideContextMenu = hideContextMenu;
function copy(store) {
    clipboard_1.execCopy(store);
}
exports.copy = copy;
function copyColumns(store) {
    var data = store.data, selection = store.selection, focus = store.focus;
    var originalRange = selection.originalRange;
    var columnRange = originalRange
        ? [originalRange.column[0], originalRange.column[1]]
        : [focus.totalColumnIndex, focus.totalColumnIndex];
    var rowRange = [0, data.filteredRawData.length - 1];
    clipboard_1.execCopy(store, { rowRange: rowRange, columnRange: columnRange });
}
exports.copyColumns = copyColumns;
function copyRows(store) {
    var selection = store.selection, focus = store.focus, column = store.column;
    var originalRange = selection.originalRange;
    var columnRange = [0, column.visibleColumnsWithRowHeader.length - 1];
    var rowRange = originalRange
        ? [originalRange.row[0], originalRange.row[1]]
        : [focus.originalRowIndex, focus.originalRowIndex];
    clipboard_1.execCopy(store, { rowRange: rowRange, columnRange: columnRange });
}
exports.copyRows = copyRows;
function csvExport(store) {
    export_1.execExport(store, 'csv');
}
exports.csvExport = csvExport;
function excelExport(store) {
    export_1.execExport(store, 'xlsx');
}
exports.excelExport = excelExport;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetData = exports.getHeaderDataFromComplexColumn = exports.removeUnnecessaryColumns = exports.getNamesAndHeadersOfColumnsByOptions = exports.createExportEvent = void 0;
var tslib_1 = __webpack_require__(1);
var column_1 = __webpack_require__(11);
var common_1 = __webpack_require__(0);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var column_2 = __webpack_require__(12);
var data_1 = __webpack_require__(23);
function getColumnInfoDictionary(store, columnNames) {
    var colmnInfos = {};
    store.column.allColumns.forEach(function (columnInfo) {
        if (common_1.includes(columnNames, columnInfo.name)) {
            colmnInfos[columnInfo.name] = columnInfo;
        }
    });
    return colmnInfos;
}
function getValue(row, colmnInfos, columName, useFormattedValue, index) {
    if (column_1.isRowNumColumn(columName)) {
        return "No." + (index + 1);
    }
    var origianlValue = row[columName];
    var formattedValue = data_1.createFormattedValue(row, colmnInfos[columName]);
    return useFormattedValue && String(origianlValue) !== formattedValue
        ? formattedValue
        : origianlValue;
}
function createExportEvent(eventType, eventParams) {
    var exportFormat = eventParams.exportFormat, exportOptions = eventParams.exportOptions, data = eventParams.data, exportFn = eventParams.exportFn;
    var props = {};
    switch (eventType) {
        /**
         * Occurs before export
         * @event Grid#beforeExport
         * @property {'csv' | 'xlsx'} exportFormat - Export format
         * @property {Object} exportOptions - Used export options
         *    @property {boolean} exportOptions.includeHeader - Whether to include headers
         *    @property {boolean} exportOptions.includeHiddenColumns - Whether to include hidden columns
         *    @property {string[]} exportOptions.columnNames - Columns names to export
         *    @property {boolean} exportOptions.onlySelected - Whether to export only the selected range
         *    @property {boolean} exportOptions.onlyFiltered - Whether to export only the filtered data
         *    @property {','|';'|'\t'|'|'} exportOptions.delimiter - Delimiter to export CSV
         *    @property {string} exportOptions.fileName - File name to export
         * @property {string[][]} data - Data to be finally exported
         * @property {function} exportFn - Callback function to export modified data
         * @property {Grid} instance - Current grid instance
         */
        case 'beforeExport':
            props = { exportFormat: exportFormat, exportOptions: exportOptions, data: data, exportFn: exportFn };
            break;
        /**
         * Occurs after export
         * @event Grid#afterExport
         * @property {'csv' | 'xlsx'} exportFormat - Export format
         * @property {Object} exportOptions - Used export options
         *    @property {boolean} exportOptions.includeHeader - Whether to include headers
         *    @property {boolean} exportOptions.includeHiddenColumns - Whether to include hidden columns
         *    @property {string[]} exportOptions.columnNames - Columns names to export
         *    @property {boolean} exportOptions.onlySelected - Whether to export only the selected range
         *    @property {boolean} exportOptions.onlyFiltered - Whether to export only the filtered data
         *    @property {','|';'|'\t'|'|'} exportOptions.delimiter - Delimiter to export CSV
         *    @property {string} exportOptions.fileName - File name to export
         * @property {string[][]} data - Data to be finally exported
         * @property {Grid} instance - Current grid instance
         */
        case 'afterExport':
            props = { exportFormat: exportFormat, exportOptions: exportOptions, data: data };
            break;
        default: // do nothing
    }
    return new gridEvent_1.default(props);
}
exports.createExportEvent = createExportEvent;
function getNamesAndHeadersOfColumnsByOptions(column, columnNames, includeHiddenColumns, onlySelected, originalRange) {
    var regSort = /\(desc\)|\(asc\)/;
    var allColumns = column.allColumns;
    var targetColumnNames = [];
    var targetColumnHeaders = [];
    if (onlySelected && originalRange) {
        var _a = originalRange.column, start = _a[0], end = _a[1];
        allColumns
            .filter(function (colInfo) { return includeHiddenColumns || !colInfo.hidden; })
            .slice(start, end + 1)
            .forEach(function (colInfo) {
            targetColumnNames.push(colInfo.name);
            targetColumnHeaders.push(colInfo.header);
        });
    }
    else if (columnNames.length === 0) {
        allColumns
            .filter(function (colInfo) {
            return (includeHiddenColumns || !colInfo.hidden) &&
                !(column_1.isCheckboxColumn(colInfo.name) || column_1.isDragColumn(colInfo.name));
        })
            .forEach(function (colInfo) {
            targetColumnNames.push(colInfo.name);
            targetColumnHeaders.push(colInfo.header);
        });
    }
    else {
        targetColumnNames = columnNames.slice(0);
        targetColumnHeaders = allColumns
            .filter(function (colInfo) { return common_1.includes(targetColumnNames, colInfo.name); })
            .map(function (colInfo) { return colInfo.header.replace(regSort, ''); });
    }
    return { targetColumnNames: targetColumnNames, targetColumnHeaders: targetColumnHeaders };
}
exports.getNamesAndHeadersOfColumnsByOptions = getNamesAndHeadersOfColumnsByOptions;
function removeUnnecessaryColumns(hierarchy, columnNames) {
    return hierarchy.filter(function (colInfos) { return common_1.includes(columnNames, colInfos[colInfos.length - 1].name); });
}
exports.removeUnnecessaryColumns = removeUnnecessaryColumns;
function getHeaderDataFromComplexColumn(column, columnNames) {
    var hierachy = column_2.getComplexColumnsHierarchy(column.allColumns, column.complexColumnHeaders);
    var filteredHierachy = removeUnnecessaryColumns(hierachy, columnNames);
    return column_2.convertHierarchyToData(filteredHierachy);
}
exports.getHeaderDataFromComplexColumn = getHeaderDataFromComplexColumn;
function getTargetData(store, rows, columnNames, onlySelected, useFormattedValue) {
    var colmnInfoDictionary = getColumnInfoDictionary(store, columnNames);
    var originalRange = store.selection.originalRange;
    var targetRows = rows;
    if (onlySelected && originalRange) {
        var _a = originalRange.row, rowStart = _a[0], rowEnd = _a[1];
        targetRows = rows.slice(rowStart, rowEnd + 1);
    }
    return targetRows.map(function (row, index) {
        return columnNames.map(function (colName) {
            return getValue(row, colmnInfoDictionary, colName, useFormattedValue, index);
        });
    });
}
exports.getTargetData = getTargetData;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var preset_1 = __webpack_require__(124);
var common_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(2);
var styleGen = tslib_1.__importStar(__webpack_require__(125));
var STYLE_ELEMENT_ID = 'tui-grid-theme-style';
var presetOptions = {
    default: preset_1.presetDefault,
    striped: preset_1.striped,
    clean: preset_1.clean,
};
var styleGenMethodMap = {
    outline: styleGen.outline,
    frozenBorder: styleGen.frozenBorder,
    scrollbar: styleGen.scrollbar,
    heightResizeHandle: styleGen.heightResizeHandle,
    pagination: styleGen.pagination,
    selection: styleGen.selection,
};
var styleGenAreaMethodMap = {
    header: styleGen.headerArea,
    body: styleGen.bodyArea,
    summary: styleGen.summaryArea,
};
var styleGenRowMethodMap = {
    odd: styleGen.rowOdd,
    even: styleGen.rowEven,
    dummy: styleGen.rowDummy,
    hover: styleGen.rowHover,
    checked: styleGen.rowChecked,
};
var styleGenCellMethodMap = {
    normal: styleGen.cell,
    editable: styleGen.cellEditable,
    header: styleGen.cellHeader,
    rowHeader: styleGen.cellRowHeader,
    summary: styleGen.cellSummary,
    required: styleGen.cellRequired,
    disabled: styleGen.cellDisabled,
    invalid: styleGen.cellInvalid,
    selectedHeader: styleGen.cellSelectedHeader,
    selectedRowHeader: styleGen.cellSelectedRowHeader,
    focused: styleGen.cellFocused,
    focusedInactive: styleGen.cellFocusedInactive,
    // deprecate
    oddRow: styleGen.rowOdd,
    evenRow: styleGen.rowEven,
    currentRow: styleGen.cellCurrentRow,
    dummy: styleGen.rowDummy,
    checkedRow: styleGen.rowChecked,
};
function buildCssString(options) {
    var area = options.area, cell = options.cell, row = options.row;
    var styles = [];
    Object.keys(styleGenMethodMap).forEach(function (key) {
        var keyWithType = key;
        var value = options[keyWithType];
        if (value) {
            var fn = styleGen[keyWithType];
            styles.push(fn(value));
        }
    });
    if (area) {
        Object.keys(styleGenAreaMethodMap).forEach(function (key) {
            var keyWithType = key;
            var value = area[keyWithType];
            if (value) {
                var fn = styleGenAreaMethodMap[keyWithType];
                styles.push(fn(value));
            }
        });
    }
    if (cell) {
        Object.keys(styleGenCellMethodMap).forEach(function (key) {
            var keyWithType = key;
            var value = cell[keyWithType];
            if (value) {
                var fn = styleGenCellMethodMap[keyWithType];
                styles.push(fn(value));
            }
        });
    }
    if (row) {
        // Written later to override the row style in cell style
        Object.keys(styleGenRowMethodMap).forEach(function (key) {
            var keyWithType = key;
            var value = row[keyWithType];
            if (value) {
                var fn = styleGenRowMethodMap[keyWithType];
                styles.push(fn(value));
            }
        });
    }
    return styles.join('');
}
function setDocumentStyle(options) {
    var cssString = buildCssString(options);
    var elem = document.getElementById(STYLE_ELEMENT_ID);
    if (elem && elem.parentNode) {
        elem.parentNode.removeChild(elem);
    }
    dom_1.appendStyleElement(STYLE_ELEMENT_ID, cssString);
}
exports.default = {
    /**
     * Creates a style element using theme options identified by given name,
     * and appends it to the document.
     * @param themeName - preset theme name
     * @param extOptions - if exist, extend preset theme options with it.
     */
    apply: function (themeName, extOptions) {
        var options = presetOptions[themeName];
        if (!options) {
            options = presetOptions['default'];
        }
        if (extOptions) {
            options = common_1.deepMergedCopy(options, extOptions);
        }
        setDocumentStyle(options);
    },
    /**
     * Returns whether the style of a theme is applied.
     */
    isApplied: function () {
        return !!document.getElementById(STYLE_ELEMENT_ID);
    },
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.striped = exports.clean = exports.presetDefault = void 0;
var common_1 = __webpack_require__(0);
exports.presetDefault = {
    selection: {
        background: '#00A9ff',
        border: '#00a9ff',
    },
    heightResizeHandle: {
        border: '#fff',
        background: '#fff',
    },
    pagination: {
        border: 'transparent',
        background: 'transparent',
    },
    scrollbar: {
        border: '#eee',
        background: '#fff',
        emptySpace: '#f9f9f9',
        thumb: '#ddd',
        active: '#ddd',
    },
    outline: {
        border: '#aaa',
        showVerticalBorder: false,
    },
    frozenBorder: {
        border: '#aaa',
    },
    area: {
        header: {
            border: '#ccc',
            background: '#fff',
        },
        body: {
            background: '#fff',
        },
        summary: {
            border: '#eee',
            background: '#fff',
        },
    },
    cell: {
        normal: {
            background: '#f4f4f4',
            border: '#eee',
            text: '#333',
            showVerticalBorder: false,
            showHorizontalBorder: true,
        },
        header: {
            background: '#fff',
            border: '#eee',
            text: '#222',
            showVerticalBorder: true,
            showHorizontalBorder: true,
        },
        rowHeader: {
            background: '#fff',
            border: '#eee',
            text: '#333',
            showVerticalBorder: false,
            showHorizontalBorder: true,
        },
        summary: {
            background: '#fff',
            border: '#eee',
            text: '#333',
            showVerticalBorder: false,
        },
        selectedHeader: {
            background: '#e5f6ff',
        },
        selectedRowHeader: {
            background: '#e5f6ff',
        },
        focused: {
            border: '#00a9ff',
        },
        focusedInactive: {
            border: '#aaa',
        },
        required: {
            background: '#fffdeb',
        },
        editable: {
            background: '#fff',
        },
        disabled: {
            background: '#f9f9f9',
            text: '#c1c1c1',
        },
        dummy: {
            background: '#fff',
        },
        invalid: {
            background: '#ffe5e5',
        },
        evenRow: {},
        oddRow: {},
        currentRow: {},
    },
    rowHover: {
        background: 'none',
    },
};
exports.clean = common_1.deepMergedCopy(exports.presetDefault, {
    outline: {
        border: '#eee',
        showVerticalBorder: false,
    },
    frozenBorder: {
        border: '#ddd',
    },
    area: {
        header: {
            border: '#eee',
            background: '#f9f9f9',
        },
        body: {
            background: '#fff',
        },
        summary: {
            border: '#fff',
            background: '#fff',
        },
    },
    cell: {
        normal: {
            background: '#fff',
            border: '#eee',
            showVerticalBorder: false,
            showHorizontalBorder: false,
        },
        header: {
            background: '#f9f9f9',
            border: '#eee',
            showVerticalBorder: true,
            showHorizontalBorder: true,
        },
        rowHeader: {
            border: '#eee',
            showVerticalBorder: false,
            showHorizontalBorder: false,
        },
    },
});
exports.striped = common_1.deepMergedCopy(exports.presetDefault, {
    outline: {
        border: '#eee',
        showVerticalBorder: false,
    },
    frozenBorder: {
        border: '#ccc',
    },
    area: {
        header: {
            border: '#fff',
            background: '#eee',
        },
        body: {
            background: '#fff',
        },
        summary: {
            border: '#fff',
            background: '#fff',
        },
    },
    cell: {
        normal: {
            background: '#fff',
            border: '#fff',
            showVerticalBorder: false,
            showHorizontalBorder: false,
        },
        header: {
            background: '#eee',
            border: '#fff',
            showVerticalBorder: true,
            showHorizontalBorder: true,
        },
        rowHeader: {
            border: '#fff',
            showVerticalBorder: false,
            showHorizontalBorder: false,
        },
        oddRow: {
            background: '#fff',
        },
        evenRow: {
            background: '#f4f4f4',
        },
    },
});


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.cellCurrentRow = exports.cellInvalid = exports.cellDisabled = exports.cellRequired = exports.cellEditable = exports.cellFocusedInactive = exports.cellFocused = exports.cellSelectedRowHeader = exports.cellSelectedHeader = exports.rowDummy = exports.rowHover = exports.rowChecked = exports.rowOdd = exports.rowEven = exports.cellSummary = exports.cellRowHeader = exports.cellHeader = exports.cell = exports.summaryArea = exports.bodyArea = exports.headerArea = exports.selection = exports.pagination = exports.heightResizeHandle = exports.scrollbar = exports.frozenBorder = exports.outline = void 0;
var tslib_1 = __webpack_require__(1);
var dom_1 = __webpack_require__(2);
var cssRuleBuilder_1 = __webpack_require__(126);
function bgTextRuleString(className, options) {
    var background = options.background, text = options.text;
    return cssRuleBuilder_1.createClassRule(className).bg(background).text(text).build();
}
function bgBorderRuleString(className, options) {
    var background = options.background, border = options.border;
    return cssRuleBuilder_1.createClassRule(className).bg(background).border(border).build();
}
function outline(options) {
    var border = options.border, showVerticalBorder = options.showVerticalBorder;
    var borderTopRule = cssRuleBuilder_1.createClassRule('border-line-top').add('border-top', "1px solid " + border);
    var borderBottomRule = cssRuleBuilder_1.createNestedClassRule(' .', ['no-scroll-x', 'border-line-bottom']).add('border-bottom', "1px solid " + border);
    var rules = [borderTopRule, borderBottomRule];
    var borderLeftRule, borderRightRule;
    if (showVerticalBorder) {
        borderLeftRule = cssRuleBuilder_1.createClassRule('border-line-left').add('border-left', "1px solid " + border);
        borderRightRule = cssRuleBuilder_1.createNestedClassRule(' .', ['no-scroll-y', 'border-line-right']).add('border-right', "1px solid " + border);
        rules = rules.concat([borderLeftRule, borderRightRule]);
    }
    return cssRuleBuilder_1.buildAll(rules);
}
exports.outline = outline;
function frozenBorder(options) {
    return cssRuleBuilder_1.createClassRule('frozen-border').bg(options.border).build();
}
exports.frozenBorder = frozenBorder;
function scrollbar(options) {
    var border = options.border, emptySpace = options.emptySpace;
    var webkitScrollbarRules = cssRuleBuilder_1.createWebkitScrollbarRules("." + dom_1.cls('container'), options);
    var ieScrollbarRule = cssRuleBuilder_1.createIEScrollbarRule("." + dom_1.cls('container'), options);
    var xInnerBorderRule = cssRuleBuilder_1.createClassRule('border-line-bottom').add('border-bottom', "1px solid " + border);
    var xOuterBorderRule = cssRuleBuilder_1.createClassRule('content-area').border(border);
    var yInnerBorderRule = cssRuleBuilder_1.createClassRule('scrollbar-y-inner-border').bg(border);
    var yOuterBorderRule = cssRuleBuilder_1.createClassRule('scrollbar-y-outer-border').bg(border);
    var spaceRightTopRule = cssRuleBuilder_1.createClassRule('scrollbar-right-top').bg(emptySpace).border(border);
    var spaceRightBottomRule = cssRuleBuilder_1.createClassRule('scrollbar-right-bottom')
        .bg(emptySpace)
        .border(border);
    var spaceLeftBottomRule = cssRuleBuilder_1.createClassRule('scrollbar-left-bottom')
        .bg(emptySpace)
        .border(border);
    var frozenBorderRule = cssRuleBuilder_1.createClassRule('scrollbar-frozen-border').bg(emptySpace).border(border);
    return cssRuleBuilder_1.buildAll(tslib_1.__spreadArrays(webkitScrollbarRules, [
        ieScrollbarRule,
        xInnerBorderRule,
        xOuterBorderRule,
        yInnerBorderRule,
        yOuterBorderRule,
        spaceRightTopRule,
        spaceRightBottomRule,
        spaceLeftBottomRule,
        frozenBorderRule,
    ]));
}
exports.scrollbar = scrollbar;
function heightResizeHandle(options) {
    return bgBorderRuleString('height-resize-handle', options);
}
exports.heightResizeHandle = heightResizeHandle;
function pagination(options) {
    return bgBorderRuleString('pagination', options);
}
exports.pagination = pagination;
function selection(options) {
    return bgBorderRuleString('layer-selection', options);
}
exports.selection = selection;
function headerArea(options) {
    return cssRuleBuilder_1.createClassRule('header-area').bg(options.background).border(options.border).build();
}
exports.headerArea = headerArea;
function bodyArea(options) {
    return cssRuleBuilder_1.createClassRule('body-area').bg(options.background).build();
}
exports.bodyArea = bodyArea;
function summaryArea(options) {
    var border = options.border, background = options.background;
    var contentAreaRule = cssRuleBuilder_1.createClassRule('summary-area').bg(background).border(border);
    var bodyAreaRule = cssRuleBuilder_1.createNestedClassRule(' .', ['has-summary-top', 'body-area']).border(border);
    return cssRuleBuilder_1.buildAll([contentAreaRule, bodyAreaRule]);
}
exports.summaryArea = summaryArea;
function cell(options) {
    return cssRuleBuilder_1.createClassRule('cell')
        .bg(options.background)
        .border(options.border)
        .borderWidth(options)
        .text(options.text)
        .build();
}
exports.cell = cell;
function cellHeader(options) {
    var background = options.background, border = options.border, text = options.text;
    var tableRule = cssRuleBuilder_1.createNestedClassRule(' .', [
        'show-lside-area',
        'lside-area',
        'header-area',
        'table',
    ]).verticalBorderStyle(options, 'right');
    var cellRule = cssRuleBuilder_1.createClassRule('cell-header')
        .bg(background)
        .border(border)
        .borderWidth(options)
        .text(text);
    return cssRuleBuilder_1.buildAll([tableRule, cellRule]);
}
exports.cellHeader = cellHeader;
function cellRowHeader(options) {
    var background = options.background, border = options.border, text = options.text;
    var tableRule = cssRuleBuilder_1.createNestedClassRule(' .', [
        'show-lside-area',
        'lside-area',
        'body-area',
        'table',
    ]).verticalBorderStyle(options, 'right');
    var cellRule = cssRuleBuilder_1.createClassRule('cell-row-header')
        .bg(background)
        .border(border)
        .borderWidth(options)
        .text(text);
    return cssRuleBuilder_1.buildAll([tableRule, cellRule]);
}
exports.cellRowHeader = cellRowHeader;
function cellSummary(options) {
    var background = options.background, border = options.border, text = options.text;
    var tableRule = cssRuleBuilder_1.createNestedClassRule(' .', [
        'show-lside-area',
        'lside-area',
        'summary-area',
        'table',
    ]).verticalBorderStyle(options, 'right');
    var cellRule = cssRuleBuilder_1.createClassRule('cell-summary')
        .bg(background)
        .border(border)
        .borderWidth(options)
        .text(text);
    return cssRuleBuilder_1.buildAll([tableRule, cellRule]);
}
exports.cellSummary = cellSummary;
function rowEven(options) {
    return cssRuleBuilder_1.create('.tui-grid-row-even>td').bg(options.background).build();
}
exports.rowEven = rowEven;
function rowOdd(options) {
    return cssRuleBuilder_1.create('.tui-grid-row-odd>td').bg(options.background).build();
}
exports.rowOdd = rowOdd;
//update by tangbin
function rowChecked(options) {
    return cssRuleBuilder_1.create('.tui-grid-row-checked>td').bg(options.background).build();
}
exports.rowChecked = rowChecked;
function rowHover(options) {
    return cssRuleBuilder_1.create('.tui-grid-row-hover>.tui-grid-cell').bg(options.background).build();
}
exports.rowHover = rowHover;
function rowDummy(options) {
    return bgTextRuleString('cell-dummy', options);
}
exports.rowDummy = rowDummy;
function cellSelectedHeader(options) {
    return cssRuleBuilder_1.createNestedClassRule('.', ['cell-header', 'cell-selected'])
        .bg(options.background)
        .text(options.text)
        .build();
}
exports.cellSelectedHeader = cellSelectedHeader;
function cellSelectedRowHeader(options) {
    return cssRuleBuilder_1.createNestedClassRule('.', ['cell-row-header', 'cell-selected'])
        .bg(options.background)
        .text(options.text)
        .build();
}
exports.cellSelectedRowHeader = cellSelectedRowHeader;
function cellFocused(options) {
    var border = options.border;
    var focusLayerRule = cssRuleBuilder_1.createClassRule('layer-focus-border').bg(border);
    var editingLayerRule = cssRuleBuilder_1.createClassRule('layer-editing').border(border);
    return cssRuleBuilder_1.buildAll([focusLayerRule, editingLayerRule]);
}
exports.cellFocused = cellFocused;
function cellFocusedInactive(options) {
    return cssRuleBuilder_1.createNestedClassRule(' .', ['layer-focus-deactive', 'layer-focus-border'])
        .bg(options.border)
        .build();
}
exports.cellFocusedInactive = cellFocusedInactive;
function cellEditable(options) {
    return bgTextRuleString('cell-editable', options);
}
exports.cellEditable = cellEditable;
function cellRequired(options) {
    return bgTextRuleString('cell-required', options);
}
exports.cellRequired = cellRequired;
function cellDisabled(options) {
    return bgTextRuleString('cell-disabled', options);
}
exports.cellDisabled = cellDisabled;
function cellInvalid(options) {
    var background = options.background, text = options.text;
    return cssRuleBuilder_1.createNestedClassRule('.', ['cell-invalid', 'cell']).bg(background).text(text).build();
}
exports.cellInvalid = cellInvalid;
function cellCurrentRow(options) {
    return bgTextRuleString('cell-current-row', options);
}
exports.cellCurrentRow = cellCurrentRow;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAll = exports.createIEScrollbarRule = exports.createWebkitScrollbarRules = exports.createNestedClassRule = exports.createClassRule = exports.create = void 0;
var dom_1 = __webpack_require__(2);
var common_1 = __webpack_require__(0);
/**
 * create css rule string and returns it
 * @module {theme/cssBuilder}
 * @param selector - css selector
 * @param property - css property
 * @param  value - css value
 * @ignore
 */
var CSSRuleBuilder = /** @class */ (function () {
    function CSSRuleBuilder(selector) {
        this.selector = '';
        this.propValues = [];
        this.init(selector);
    }
    CSSRuleBuilder.prototype.init = function (selector) {
        if (!(typeof selector === 'string') || !selector) {
            throw new Error('The Selector must be a string and not be empty.');
        }
        this.selector = selector;
        this.propValues = [];
    };
    /**
     * Add a set of css property and value.
     * @param property - css property
     * @param  value - css value
     */
    CSSRuleBuilder.prototype.add = function (property, value) {
        if (value) {
            this.propValues.push(property + ":" + value);
        }
        return this;
    };
    /**
     * Shortcut for add('border-color', value)
     */
    CSSRuleBuilder.prototype.border = function (value) {
        return this.add('border-color', value);
    };
    /**
     * Add a border-width style to the rule.
     * @param options - visible options
     * @param [options.showVerticalBorder] - whether the vertical border is visible
     * @param [options.showHorizontalBorder] - whether the horizontal border is visible
     */
    CSSRuleBuilder.prototype.borderWidth = function (options) {
        var vertical = options.showVerticalBorder;
        var horizontal = options.showHorizontalBorder;
        var value;
        if (common_1.isBoolean(vertical)) {
            value = vertical ? '1px' : '0';
            this.add('border-left-width', value).add('border-right-width', value);
        }
        if (common_1.isBoolean(horizontal)) {
            value = horizontal ? '1px' : '0';
            this.add('border-top-width', value).add('border-bottom-width', value);
        }
        return this;
    };
    /**
     * Add a vertical border style to the rule.
     * @param options - visible options
     * @param [options.showVerticalBorder] - whether the vertical border is visible
     * @param position - Position of the vertical border ('right' or 'left')
     */
    CSSRuleBuilder.prototype.verticalBorderStyle = function (options, position) {
        var vertical = options.showVerticalBorder;
        var value;
        if (common_1.isBoolean(vertical) && position) {
            value = vertical ? 'solid' : 'hidden';
            this.add("border-" + position + "-style", value);
        }
        return this;
    };
    /**
     * Shortcut for add('background-color', value)
     */
    CSSRuleBuilder.prototype.bg = function (value) {
        return this.add('background-color', value);
    };
    /**
     * Shortcut for add('color', value)
     */
    CSSRuleBuilder.prototype.text = function (value) {
        return this.add('color', value);
    };
    /**
     * Create a CSS rule string with a selector and prop-values.
     */
    CSSRuleBuilder.prototype.build = function () {
        var result = '';
        if (this.propValues.length) {
            result = this.selector + "{" + this.propValues.join(';') + "}";
        }
        return result;
    };
    return CSSRuleBuilder;
}());
/**
 * Creates new Builder instance.
 */
function create(selector) {
    return new CSSRuleBuilder(selector);
}
exports.create = create;
/**
 * Creates a new Builder instance with a class name selector.
 */
function createClassRule(className) {
    return create("." + dom_1.cls(className));
}
exports.createClassRule = createClassRule;
/**
 * Creates a new Builder instance with a nested class name.
 * @param selector - selector to compose class names
 * @param classNames - classNames
 */
function createNestedClassRule(selector, classNames) {
    return create("." + classNames.map(function (className) { return dom_1.cls(className); }).join(selector));
}
exports.createNestedClassRule = createNestedClassRule;
/**
 * Creates an array of new Builder instances for the -webkit-scrollbar styles.
 */
function createWebkitScrollbarRules(selector, options) {
    return [
        create(selector + " ::-webkit-scrollbar").bg(options.background),
        create(selector + " ::-webkit-scrollbar-thumb").bg(options.thumb),
        create(selector + " ::-webkit-scrollbar-thumb:hover").bg(options.active),
    ];
}
exports.createWebkitScrollbarRules = createWebkitScrollbarRules;
/**
 * Creates a builder instance for the IE scrollbar styles.
 */
function createIEScrollbarRule(selector, options) {
    var bgProps = [
        'scrollbar-3dlight-color',
        'scrollbar-darkshadow-color',
        'scrollbar-track-color',
        'scrollbar-shadow-color',
    ];
    var thumbProps = ['scrollbar-face-color', 'scrollbar-highlight-color'];
    var ieScrollbarRule = create(selector);
    bgProps.forEach(function (prop) {
        ieScrollbarRule.add(prop, options.background);
    });
    thumbProps.forEach(function (prop) {
        ieScrollbarRule.add(prop, options.thumb);
    });
    ieScrollbarRule.add('scrollbar-arrow-color', options.active);
    return ieScrollbarRule;
}
exports.createIEScrollbarRule = createIEScrollbarRule;
/**
 * Build all rules and returns the concatenated string.
 */
function buildAll(rules) {
    return rules
        .map(function (rule) {
        return rule.build();
    })
        .join('');
}
exports.buildAll = buildAll;


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvalidRows = void 0;
var lazyObservable_1 = __webpack_require__(29);
function getInvalidRows(store) {
    // @TODO: find more practical way to make observable
    lazyObservable_1.createObservableData(store, true);
    var data = store.data, column = store.column;
    var invalidRows = [];
    data.viewData.forEach(function (_a) {
        var rowKey = _a.rowKey, valueMap = _a.valueMap;
        var invalidColumns = column.validationColumns.filter(function (_a) {
            var name = _a.name;
            return !!valueMap[name].invalidStates.length;
        });
        if (invalidColumns.length) {
            var errors = invalidColumns.map(function (_a) {
                var name = _a.name;
                var invalidStates = valueMap[name].invalidStates;
                return {
                    columnName: name,
                    errorInfo: invalidStates,
                    errorCode: invalidStates.map(function (_a) {
                        var code = _a.code;
                        return code;
                    }),
                };
            });
            invalidRows.push({ rowKey: rowKey, errors: errors });
        }
    });
    return invalidRows;
}
exports.getInvalidRows = getInvalidRows;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createProvider = void 0;
var common_1 = __webpack_require__(0);
var mutationRequest_1 = __webpack_require__(129);
var getterRequest_1 = __webpack_require__(133);
var ajaxConfig_1 = __webpack_require__(59);
function createConfig(store, dispatch, dataSource) {
    var lastRequiredData = { perPage: store.data.pageOptions.perPage };
    var requestParams = {};
    var api = dataSource.api, _a = dataSource.hideLoadingBar, hideLoadingBar = _a === void 0 ? false : _a;
    var ajaxConfig = ajaxConfig_1.createAjaxConfig(dataSource);
    Object.keys(api).forEach(function (key) {
        api[key] = common_1.deepMergedCopy(ajaxConfig, api[key]);
    });
    var getLastRequiredData = function () { return lastRequiredData; };
    var setLastRequiredData = function (params) {
        lastRequiredData = params;
    };
    var getRequestParams = function () { return requestParams; };
    var setRequestParams = function (params) {
        requestParams = params;
    };
    return {
        api: api,
        hideLoadingBar: hideLoadingBar,
        store: store,
        dispatch: dispatch,
        setLastRequiredData: setLastRequiredData,
        getLastRequiredData: getLastRequiredData,
        setRequestParams: setRequestParams,
        getRequestParams: getRequestParams,
    };
}
function createFallbackProvider() {
    // dummy function
    var errorFn = function () {
        throw new Error('Cannot execute server side API. To use this API, DataSource should be set');
    };
    return {
        request: errorFn,
        readData: errorFn,
        reloadData: errorFn,
        setRequestParams: errorFn,
        sort: errorFn,
        unsort: errorFn,
    };
}
function createProvider(store, dispatch, data) {
    var provider = createFallbackProvider();
    if (!Array.isArray(data) && common_1.isObject(data)) {
        var api = data.api, _a = data.initialRequest, initialRequest = _a === void 0 ? true : _a;
        if (!common_1.isObject(api === null || api === void 0 ? void 0 : api.readData)) {
            throw new Error('GET API should be configured in DataSource to get data');
        }
        var config = createConfig(store, dispatch, data);
        // set curried function
        provider.request = mutationRequest_1.request.bind(null, config);
        provider.readData = getterRequest_1.readData.bind(null, config);
        provider.reloadData = getterRequest_1.reloadData.bind(null, config);
        provider.sort = getterRequest_1.sort.bind(null, config);
        provider.unsort = getterRequest_1.unsort.bind(null, config);
        provider.setRequestParams = config.setRequestParams;
        if (initialRequest) {
            getterRequest_1.readData(config, 1, api.readData.initParams);
        }
    }
    return provider;
}
exports.createProvider = createProvider;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
var tslib_1 = __webpack_require__(1);
var common_1 = __webpack_require__(0);
var gridAjax_1 = __webpack_require__(130);
var eventBus_1 = __webpack_require__(7);
var instance_1 = __webpack_require__(8);
var modifiedDataManager_1 = __webpack_require__(57);
var data_1 = __webpack_require__(6);
var confirm_1 = __webpack_require__(132);
var ajaxConfig_1 = __webpack_require__(59);
var requestTypeCodeMap = {
    createData: 'CREATE',
    updateData: 'UPDATE',
    deleteData: 'DELETE',
    modifyData: 'MODIFY',
};
function createRequestParams(store, type, requestOptions) {
    var column = store.column, data = store.data, id = store.id;
    var checkedOnly = requestOptions.checkedOnly, modifiedOnly = requestOptions.modifiedOnly;
    var modifiedOptions = { checkedOnly: checkedOnly, ignoredColumns: column.ignoredColumns };
    if (modifiedOnly) {
        var manager = instance_1.getDataManager(id);
        return type === 'MODIFY'
            ? manager.getAllModifiedData(modifiedOptions)
            : manager.getModifiedData(type, modifiedOptions);
    }
    return { rows: modifiedDataManager_1.getDataWithOptions(data.rawData, modifiedOptions) };
}
function createRequestOptions(ajaxConfig, requestOptions) {
    if (requestOptions === void 0) { requestOptions = {}; }
    var defaultOptions = {
        checkedOnly: false,
        modifiedOnly: true,
        showConfirm: true,
        withCredentials: ajaxConfig.withCredentials,
    };
    return tslib_1.__assign(tslib_1.__assign({}, defaultOptions), requestOptions);
}
function send(config, sendOptions) {
    var store = config.store, dispatch = config.dispatch, hideLoadingBar = config.hideLoadingBar, getRequestParams = config.getRequestParams;
    var id = store.id;
    var commonRequestParams = getRequestParams();
    var manager = instance_1.getDataManager(id);
    var url = sendOptions.url, method = sendOptions.method, options = sendOptions.options, params = sendOptions.params, requestTypeCode = sendOptions.requestTypeCode, ajaxConfig = sendOptions.ajaxConfig;
    var showConfirm = options.showConfirm, withCredentials = options.withCredentials;
    if (!showConfirm || confirm_1.confirmMutation(requestTypeCode, params)) {
        var callback = function () { return dispatch('setLoadingState', data_1.getLoadingState(store.data.rawData)); };
        if (!hideLoadingBar) {
            dispatch('setLoadingState', 'LOADING');
        }
        gridAjax_1.gridAjax(tslib_1.__assign(tslib_1.__assign({ method: method, url: common_1.isFunction(url) ? url() : url, params: tslib_1.__assign(tslib_1.__assign({}, commonRequestParams), params), success: function () { return manager.clearSpecificRows(params); }, preCallback: callback, postCallback: callback, eventBus: eventBus_1.getEventBus(id) }, ajaxConfig), { withCredentials: common_1.isUndefined(withCredentials) ? ajaxConfig.withCredentials : withCredentials }));
    }
}
function request(config, requestType, requestOptions) {
    var _a, _b;
    var store = config.store, api = config.api;
    var url = requestOptions.url || ((_a = api[requestType]) === null || _a === void 0 ? void 0 : _a.url);
    var method = requestOptions.method || ((_b = api[requestType]) === null || _b === void 0 ? void 0 : _b.method);
    if (!url || !method) {
        throw new Error('url and method should be essential for request.');
    }
    var requestTypeCode = requestTypeCodeMap[requestType];
    var ajaxConfig = ajaxConfig_1.createAjaxConfig(api[requestType] || {});
    var options = createRequestOptions(ajaxConfig, requestOptions);
    var params = createRequestParams(store, requestTypeCode, options);
    send(config, { url: url, method: method, options: options, params: params, requestTypeCode: requestTypeCode, ajaxConfig: ajaxConfig });
}
exports.request = request;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.gridAjax = void 0;
var tslib_1 = __webpack_require__(1);
var serializer_1 = __webpack_require__(131);
var gridEvent_1 = tslib_1.__importDefault(__webpack_require__(9));
var common_1 = __webpack_require__(0);
var ENCODED_SPACE_REGEXP = /%20/g;
var QS_DELIM_REGEXP = /\?/;
function hasRequestBody(method) {
    return /^(?:POST|PUT|PATCH)$/.test(method.toUpperCase());
}
function getSerialized(params, serializer) {
    return common_1.isFunction(serializer) ? serializer(params) : serializer_1.serialize(params);
}
function handleReadyStateChange(xhr, options) {
    var eventBus = options.eventBus, success = options.success, preCallback = options.preCallback, postCallback = options.postCallback;
    // eslint-disable-next-line eqeqeq
    if (xhr.readyState != XMLHttpRequest.DONE) {
        return;
    }
    preCallback();
    var gridEvent = new gridEvent_1.default({ xhr: xhr });
    /**
     * Occurs when the response is received from the server
     * @event Grid#response
     * @type {module:event/gridEvent}
     * @property {XmlHttpRequest} xhr - XmlHttpRequest
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('response', gridEvent);
    if (gridEvent.isStopped()) {
        return;
    }
    if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        if (response.result) {
            /**
             * Occurs after the response event, if the result is true
             * @event Grid#successResponse
             * @type {module:event/gridEvent}
             * @property {XmlHttpRequest} xhr - XmlHttpRequest
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('successResponse', gridEvent);
            if (gridEvent.isStopped()) {
                return;
            }
            success(response);
        }
        else if (!response.result) {
            /**
             * Occurs after the response event, if the result is false
             * @event Grid#failResponse
             * @type {module:event/gridEvent}
             * @property {XmlHttpRequest} xhr - XmlHttpRequest
             * @property {Grid} instance - Current grid instance
             */
            eventBus.trigger('failResponse', gridEvent);
            if (gridEvent.isStopped()) {
                return;
            }
        }
    }
    else {
        /**
         * Occurs after the response event, if the response is Error
         * @event Grid#errorResponse
         * @type {module:event/gridEvent}
         * @property {XmlHttpRequest} xhr - XmlHttpRequest
         * @property {Grid} instance - Current grid instance
         */
        eventBus.trigger('errorResponse', gridEvent);
        if (gridEvent.isStopped()) {
            return;
        }
    }
    postCallback();
}
function open(xhr, options) {
    var url = options.url, method = options.method, serializer = options.serializer, _a = options.params, params = _a === void 0 ? {} : _a;
    var requestUrl = url;
    if (!hasRequestBody(method)) {
        // serialize query string
        var qs = (QS_DELIM_REGEXP.test(url) ? '&' : '?') + getSerialized(params, serializer);
        requestUrl = "" + url + qs;
    }
    xhr.open(method, requestUrl);
}
function applyConfig(xhr, options) {
    var method = options.method, contentType = options.contentType, mimeType = options.mimeType, headers = options.headers, _a = options.withCredentials, withCredentials = _a === void 0 ? false : _a;
    // set withCredentials
    xhr.withCredentials = withCredentials;
    // overide MIME type
    if (mimeType) {
        xhr.overrideMimeType(mimeType);
    }
    // set user defined request headers
    if (common_1.isObject(headers)) {
        Object.keys(headers).forEach(function (name) {
            if (headers[name]) {
                xhr.setRequestHeader(name, headers[name]);
            }
        });
    }
    // set 'Content-Type' when request has body
    if (hasRequestBody(method)) {
        xhr.setRequestHeader('Content-Type', contentType + "; charset=UTF-8");
    }
    // set 'x-requested-with' header to prevent CSRF in old browser
    xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
}
function send(xhr, options) {
    var method = options.method, eventBus = options.eventBus, serializer = options.serializer, preCallback = options.preCallback, _a = options.params, params = _a === void 0 ? {} : _a, _b = options.contentType, contentType = _b === void 0 ? 'application/x-www-form-urlencoded' : _b;
    var body = null;
    if (hasRequestBody(method)) {
        // The space character '%20' is replaced to '+', because application/x-www-form-urlencoded follows rfc-1866
        body =
            contentType.indexOf('application/x-www-form-urlencoded') !== -1
                ? getSerialized(params, serializer).replace(ENCODED_SPACE_REGEXP, '+')
                : JSON.stringify(params);
    }
    xhr.onreadystatechange = function () { return handleReadyStateChange(xhr, options); };
    var gridEvent = new gridEvent_1.default({ xhr: xhr });
    /**
     * Occurs before the http request is sent
     * @event Grid#beforeRequest
     * @type {module:event/gridEvent}
     * @property {XMLHttpRequest} xhr - Current XMLHttpRequest instance
     * @property {Grid} instance - Current grid instance
     */
    eventBus.trigger('beforeRequest', gridEvent);
    if (gridEvent.isStopped()) {
        preCallback();
        return;
    }
    xhr.send(body);
}
function gridAjax(options) {
    var xhr = new XMLHttpRequest();
    [open, applyConfig, send].forEach(function (fn) { return fn(xhr, options); });
}
exports.gridAjax = gridAjax;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = void 0;
var common_1 = __webpack_require__(0);
/**
 * 1. Array format
 *
 * The default array format to serialize is 'bracket'.
 * However in case of nested array, only the deepest format follows the 'bracket', the rest follow 'indice' format.
 *
 * - basic
 *   { a: [1, 2, 3] } => a[]=1&a[]=2&a[]=3
 * - nested
 *   { a: [1, 2, [3]] } => a[]=1&a[]=2&a[2][]=3
 *
 * 2. Object format
 *
 * The default object format to serialize is 'bracket' notation and doesn't allow the 'dot' notation.
 *
 * - basic
 *   { a: { b: 1, c: 2 } } => a[b]=1&a[c]=2
 */
function encodePairs(key, value) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(common_1.isNil(value) ? '' : value);
}
function serializeParams(key, value, serializedList) {
    if (Array.isArray(value)) {
        value.forEach(function (arrVal, index) {
            serializeParams(key + "[" + (common_1.isObject(arrVal) ? index : '') + "]", arrVal, serializedList);
        });
    }
    else if (common_1.isObject(value)) {
        Object.keys(value).forEach(function (objKey) {
            serializeParams(key + "[" + objKey + "]", value[objKey], serializedList);
        });
    }
    else {
        serializedList.push(encodePairs(key, value));
    }
}
function serialize(params) {
    if (!params || common_1.isEmpty(params)) {
        return '';
    }
    var serializedList = [];
    Object.keys(params).forEach(function (key) {
        serializeParams(key, params[key], serializedList);
    });
    return serializedList.join('&');
}
exports.serialize = serialize;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmMutation = void 0;
var message_1 = __webpack_require__(58);
function confirmMutation(type, params) {
    var count = Object.keys(params).reduce(function (acc, key) { return acc + params[key].length; }, 0);
    return count ? confirm(message_1.getConfirmMessage(type, count)) : alert(message_1.getAlertMessage(type));
}
exports.confirmMutation = confirmMutation;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.unsort = exports.sort = exports.reloadData = exports.readData = void 0;
var tslib_1 = __webpack_require__(1);
var tree_1 = __webpack_require__(32);
var tree_2 = __webpack_require__(20);
var common_1 = __webpack_require__(0);
var data_1 = __webpack_require__(6);
var sort_1 = __webpack_require__(30);
var sort_2 = __webpack_require__(44);
function validateResponse(responseData) {
    if (common_1.isUndefined(responseData)) {
        throw new Error('The response data is empty to rerender grid');
    }
}
function handleSuccessReadData(config, response) {
    var dispatch = config.dispatch, getLastRequiredData = config.getLastRequiredData, store = config.store;
    var responseData = response.data;
    var _a = getLastRequiredData(), perPage = _a.perPage, _b = _a.sortColumn, sortColumn = _b === void 0 ? 'sortKey' : _b, _c = _a.sortAscending, sortAscending = _c === void 0 ? true : _c;
    validateResponse(responseData);
    var contents = responseData.contents, pagination = responseData.pagination;
    if (data_1.isScrollPagination(store.data)) {
        dispatch('appendRows', contents);
    }
    else {
        var options = {};
        if (sortColumn !== 'sortKey') {
            options.sortState = { columnName: sortColumn, ascending: sortAscending, multiple: true };
        }
        dispatch('resetData', contents, options);
    }
    if (pagination) {
        dispatch('updatePageOptions', tslib_1.__assign(tslib_1.__assign({}, pagination), { perPage: perPage }));
    }
}
function handleSuccessReadTreeData(config, response) {
    var dispatch = config.dispatch, store = config.store, getLastRequiredData = config.getLastRequiredData;
    var responseData = response.data;
    validateResponse(responseData);
    var parentRowKey = getLastRequiredData().parentRowKey;
    var column = store.column, id = store.id, data = store.data;
    responseData.contents.forEach(function (row) { return dispatch('appendTreeRow', row, { parentRowKey: parentRowKey }); });
    var row = data_1.findRowByRowKey(data, column, id, parentRowKey);
    if (row && !tree_2.getChildRowKeys(row).length) {
        tree_1.removeExpandedAttr(row);
    }
}
function readData(config, page, data, resetData) {
    if (data === void 0) { data = {}; }
    if (resetData === void 0) { resetData = false; }
    var store = config.store, getLastRequiredData = config.getLastRequiredData;
    var lastRequiredData = getLastRequiredData();
    var treeColumnName = store.column.treeColumnName;
    var perPage = store.data.pageOptions.perPage;
    var params = resetData ? tslib_1.__assign(tslib_1.__assign({ perPage: perPage }, data), { page: page }) : tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, lastRequiredData), data), { page: page });
    var successCallback = handleSuccessReadData;
    if (treeColumnName && !common_1.isUndefined(data.parentRowKey)) {
        successCallback = handleSuccessReadTreeData;
        delete params.page;
        delete params.perPage;
    }
    sendRequest(config, params, successCallback);
}
exports.readData = readData;
function reloadData(config) {
    readData(config, config.getLastRequiredData().page || 1);
}
exports.reloadData = reloadData;
function sort(config, sortColumn, sortAscending, cancelable) {
    var store = config.store;
    var cancelSort = sort_2.isCancelSort(store, sortColumn, sortAscending, cancelable);
    var gridEvent = sort_1.emitBeforeSort(store, cancelSort, {
        columnName: sortColumn,
        ascending: sortAscending,
        multiple: false,
    });
    if (gridEvent.isStopped()) {
        return;
    }
    var params = { perPage: store.data.pageOptions.perPage, page: 1 };
    if (!cancelSort) {
        params.sortColumn = sortColumn;
        params.sortAscending = sortAscending;
    }
    var successCallback = function (successConfig, response) {
        handleSuccessReadData(successConfig, response);
        sort_1.emitAfterSort(store, cancelSort, sortColumn);
    };
    sendRequest(config, params, successCallback);
}
exports.sort = sort;
function unsort(config, sortColumn) {
    if (sortColumn === void 0) { sortColumn = 'sortKey'; }
    var store = config.store;
    var gridEvent = sort_1.emitBeforeSort(store, true, {
        columnName: sortColumn,
        multiple: false,
    });
    if (gridEvent.isStopped()) {
        return;
    }
    var params = { perPage: store.data.pageOptions.perPage, page: 1 };
    var successCallback = function (successConfig, response) {
        handleSuccessReadData(successConfig, response);
        sort_1.emitAfterSort(store, true, sortColumn);
    };
    sendRequest(config, params, successCallback);
}
exports.unsort = unsort;
// xuedan
function sendRequest(config, params, successCallback) {
    // const { store, dispatch, api, setLastRequiredData, hideLoadingBar, getRequestParams } = config;
    // const commonRequestParams = getRequestParams();
    //
    // const ajaxConfig = createAjaxConfig(api.readData);
    // const { method, url } = api.readData;
    // const callback = () => dispatch('setLoadingState', getLoadingState(store.data.rawData));
    //
    // setLastRequiredData(params);
    //
    // if (!hideLoadingBar) {
    //   dispatch('setLoadingState', 'LOADING');
    // }
    //
    // gridAjax({
    //   method,
    //   url: isFunction(url) ? url() : url,
    //   params: { ...commonRequestParams, ...params },
    //   success: successCallback.bind(null, config),
    //   preCallback: callback,
    //   postCallback: callback,
    //   eventBus: getEventBus(store.id),
    //   ...ajaxConfig,
    // });
}


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginationManager = void 0;
// import TuiPagination from 'tui-pagination';
//update by tangbin
var TuiPagination = /** @class */ (function () {
    function TuiPagination(element, options) {
    }
    TuiPagination.prototype.getCurrentPage = function () {
        return 1;
    };
    TuiPagination.prototype.movePageTo = function (targetPage) {
    };
    TuiPagination.prototype.reset = function (totalItems) {
    };
    TuiPagination.prototype.setItemsPerPage = function (itemCount) {
    };
    TuiPagination.prototype.setTotalItems = function (itemCount) {
    };
    TuiPagination.prototype.on = function (eventType, callback) {
    };
    TuiPagination.prototype.off = function (eventType) {
    };
    return TuiPagination;
}());
function createPaginationManager() {
    var pagination = null;
    return {
        setPagination: function (targetPagination) {
            pagination = targetPagination;
        },
        getPagination: function () {
            return pagination;
        },
    };
}
exports.createPaginationManager = createPaginationManager;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHostname = void 0;
var common_1 = __webpack_require__(0);
var MS_7_DAYS = 7 * 24 * 60 * 60 * 1000;
function isExpired(date) {
    var now = new Date().getTime();
    return now - date > MS_7_DAYS;
}
function imagePing(url, trackingInfo) {
    var queryString = Object.keys(trackingInfo)
        .map(function (id, index) {
        var idWithType = id;
        return "" + (index ? '&' : '') + idWithType + "=" + trackingInfo[idWithType];
    })
        .join('');
    var trackingElement = document.createElement('img');
    trackingElement.src = url + "?" + queryString;
    trackingElement.style.display = 'none';
    document.body.appendChild(trackingElement);
    document.body.removeChild(trackingElement);
    return trackingElement;
}
function getDate(applicationKeyForStorage) {
    try {
        return window.localStorage.getItem(applicationKeyForStorage);
    }
    catch (e) {
        // Returns null to do nothing if the browser is set to block third-party cookies.
        return null;
    }
}
function sendHostname() {
    var hostname = location.hostname;
    var applicationKeyForStorage = "TOAST UI grid for " + hostname + ": Statistics";
    var date = getDate(applicationKeyForStorage);
    if ((date && !isExpired(Number(date))) || common_1.isNull(date)) {
        return;
    }
    window.localStorage.setItem(applicationKeyForStorage, String(new Date().getTime()));
    setTimeout(function () {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            imagePing('https://www.google-analytics.com/collect', {
                v: 1,
                t: 'event',
                tid: 'UA-129951906-1',
                cid: hostname,
                dp: hostname,
                dh: 'grid',
                el: 'grid',
                ec: 'use',
            });
        }
    }, 1000);
}
exports.sendHostname = sendHostname;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })
/******/ ]);
});