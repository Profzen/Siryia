"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteMemberDto = exports.CreateCompanyDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateCompanyDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _isInformal_decorators;
    var _isInformal_initializers = [];
    var _isInformal_extraInitializers = [];
    var _bio_decorators;
    var _bio_initializers = [];
    var _bio_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _rccm_decorators;
    var _rccm_initializers = [];
    var _rccm_extraInitializers = [];
    var _taxId_decorators;
    var _taxId_initializers = [];
    var _taxId_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateCompanyDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.isInformal = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _isInformal_initializers, void 0));
                this.bio = (__runInitializers(this, _isInformal_extraInitializers), __runInitializers(this, _bio_initializers, void 0));
                this.phone = (__runInitializers(this, _bio_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.email = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.rccm = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _rccm_initializers, void 0));
                this.taxId = (__runInitializers(this, _rccm_extraInitializers), __runInitializers(this, _taxId_initializers, void 0));
                this.address = (__runInitializers(this, _taxId_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                __runInitializers(this, _address_extraInitializers);
            }
            return CreateCompanyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Company name' }), (0, class_validator_1.IsString)()];
            _isInformal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether the company is an informal collective', required: false }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _bio_decorators = [(0, swagger_1.ApiProperty)({ description: 'Company bio/description', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _phone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact phone number', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact email address', required: false }), (0, class_validator_1.IsEmail)(), (0, class_validator_1.IsOptional)()];
            _rccm_decorators = [(0, swagger_1.ApiProperty)({ description: 'RCCM registry number (required for formal companies)', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _taxId_decorators = [(0, swagger_1.ApiProperty)({ description: 'NIF tax ID (required for formal companies)', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _address_decorators = [(0, swagger_1.ApiProperty)({ description: 'Physical address', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _isInformal_decorators, { kind: "field", name: "isInformal", static: false, private: false, access: { has: function (obj) { return "isInformal" in obj; }, get: function (obj) { return obj.isInformal; }, set: function (obj, value) { obj.isInformal = value; } }, metadata: _metadata }, _isInformal_initializers, _isInformal_extraInitializers);
            __esDecorate(null, null, _bio_decorators, { kind: "field", name: "bio", static: false, private: false, access: { has: function (obj) { return "bio" in obj; }, get: function (obj) { return obj.bio; }, set: function (obj, value) { obj.bio = value; } }, metadata: _metadata }, _bio_initializers, _bio_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _rccm_decorators, { kind: "field", name: "rccm", static: false, private: false, access: { has: function (obj) { return "rccm" in obj; }, get: function (obj) { return obj.rccm; }, set: function (obj, value) { obj.rccm = value; } }, metadata: _metadata }, _rccm_initializers, _rccm_extraInitializers);
            __esDecorate(null, null, _taxId_decorators, { kind: "field", name: "taxId", static: false, private: false, access: { has: function (obj) { return "taxId" in obj; }, get: function (obj) { return obj.taxId; }, set: function (obj, value) { obj.taxId = value; } }, metadata: _metadata }, _taxId_initializers, _taxId_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateCompanyDto = CreateCompanyDto;
var InviteMemberDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    return _a = /** @class */ (function () {
            function InviteMemberDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.role = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                __runInitializers(this, _role_extraInitializers);
            }
            return InviteMemberDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Email of the user to invite' }), (0, class_validator_1.IsEmail)()];
            _role_decorators = [(0, swagger_1.ApiProperty)({ description: 'Role of the member (e.g. OWNER, ADMIN, EMPLOYEE)' }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.InviteMemberDto = InviteMemberDto;
