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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
var common_1 = require("@nestjs/common");
var KycService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var KycService = _classThis = /** @class */ (function () {
        function KycService_1(prisma, storage, kycVerifier) {
            this.prisma = prisma;
            this.storage = storage;
            this.kycVerifier = kycVerifier;
            this.logger = new common_1.Logger(KycService.name);
            this.BUCKET_NAME = 'kyc-documents';
        }
        KycService_1.prototype.uploadDocument = function (userId, documentType, file) {
            return __awaiter(this, void 0, void 0, function () {
                var path, fileUrl, doc;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!['ID_CARD', 'PASSPORT', 'SELFIE', 'RCCM'].includes(documentType)) {
                                throw new common_1.BadRequestException('Type de document invalide');
                            }
                            path = "".concat(userId, "/").concat(Date.now(), "-").concat(file.originalname);
                            return [4 /*yield*/, this.storage.uploadFile(this.BUCKET_NAME, path, file)];
                        case 1:
                            fileUrl = _a.sent();
                            return [4 /*yield*/, this.prisma.kycDocument.create({
                                    data: {
                                        userId: userId,
                                        documentType: documentType,
                                        fileUrl: path, // We store the path, not the signed URL
                                        status: 'PENDING',
                                    },
                                })];
                        case 2:
                            doc = _a.sent();
                            this.logger.log("Document ".concat(documentType, " upload\u00E9 pour l'utilisateur ").concat(userId));
                            // Si c'est un selfie, on tente une vérification automatique mockée avec l'ID card la plus récente (si elle existe)
                            if (documentType === 'SELFIE') {
                                this.triggerAutoVerification(userId).catch(function (e) { return _this.logger.error(e); });
                            }
                            return [2 /*return*/, doc];
                    }
                });
            });
        };
        KycService_1.prototype.getStatus = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, documents;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.profile.findUnique({ where: { userId: userId } })];
                        case 1:
                            profile = _a.sent();
                            return [4 /*yield*/, this.prisma.kycDocument.findMany({ where: { userId: userId } })];
                        case 2:
                            documents = _a.sent();
                            return [2 /*return*/, {
                                    kycLevel: (profile === null || profile === void 0 ? void 0 : profile.kycLevel) || 1,
                                    kycStatus: (profile === null || profile === void 0 ? void 0 : profile.kycStatus) || 'PENDING',
                                    documents: documents,
                                }];
                    }
                });
            });
        };
        KycService_1.prototype.getPendingDocuments = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Retourne la file d'attente pour les modérateurs
                    return [2 /*return*/, this.prisma.kycDocument.findMany({
                            where: { status: 'PENDING' },
                            include: { user: { select: { email: true, profile: true } } },
                            orderBy: { createdAt: 'asc' },
                        })];
                });
            });
        };
        KycService_1.prototype.approveDocument = function (docId) {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.kycDocument.update({
                                where: { id: docId },
                                data: { status: 'VERIFIED' },
                            })];
                        case 1:
                            doc = _a.sent();
                            // Optionnel: Mettre à jour le statut global de l'utilisateur
                            return [4 /*yield*/, this.updateUserProfileStatus(doc.userId)];
                        case 2:
                            // Optionnel: Mettre à jour le statut global de l'utilisateur
                            _a.sent();
                            this.logger.log("Document ".concat(docId, " approuv\u00E9"));
                            return [2 /*return*/, doc];
                    }
                });
            });
        };
        KycService_1.prototype.rejectDocument = function (docId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.kycDocument.update({
                                where: { id: docId },
                                data: { status: 'REJECTED', rejectionReason: reason },
                            })];
                        case 1:
                            doc = _a.sent();
                            return [4 /*yield*/, this.prisma.profile.update({
                                    where: { userId: doc.userId },
                                    data: { kycStatus: 'REJECTED' },
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Document ".concat(docId, " rejet\u00E9: ").concat(reason));
                            return [2 /*return*/, doc];
                    }
                });
            });
        };
        /**
         * Pour consultation sécurisée par le modérateur
         */
        KycService_1.prototype.getSignedUrl = function (docId) {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.kycDocument.findUnique({ where: { id: docId } })];
                        case 1:
                            doc = _a.sent();
                            if (!doc)
                                throw new common_1.NotFoundException('Document introuvable');
                            return [2 /*return*/, this.storage.createSignedUrl(this.BUCKET_NAME, doc.fileUrl)];
                    }
                });
            });
        };
        KycService_1.prototype.triggerAutoVerification = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var docs, idCard, selfie, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.kycDocument.findMany({
                                where: { userId: userId, status: 'PENDING' },
                                orderBy: { createdAt: 'desc' }
                            })];
                        case 1:
                            docs = _a.sent();
                            idCard = docs.find(function (d) { return d.documentType === 'ID_CARD' || d.documentType === 'PASSPORT'; });
                            selfie = docs.find(function (d) { return d.documentType === 'SELFIE'; });
                            if (!(idCard && selfie)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.kycVerifier.verifyIdentity(idCard.fileUrl, selfie.fileUrl)];
                        case 2:
                            result = _a.sent();
                            if (!result.isValid) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.kycDocument.updateMany({
                                    where: { id: { in: [idCard.id, selfie.id] } },
                                    data: { status: 'VERIFIED' }
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.updateUserProfileStatus(userId)];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 5: return [4 /*yield*/, this.prisma.kycDocument.updateMany({
                                where: { id: { in: [idCard.id, selfie.id] } },
                                data: { status: 'REJECTED', rejectionReason: result.reason }
                            })];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.profile.update({
                                    where: { userId: userId },
                                    data: { kycStatus: 'REJECTED' }
                                })];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        KycService_1.prototype.updateUserProfileStatus = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Si l'utilisateur a au moins un document validé (simplification pour le MVP)
                        return [4 /*yield*/, this.prisma.profile.update({
                                where: { userId: userId },
                                data: {
                                    kycStatus: 'VERIFIED',
                                    kycLevel: 2 // Passe au niveau vérifié
                                },
                            })];
                        case 1:
                            // Si l'utilisateur a au moins un document validé (simplification pour le MVP)
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return KycService_1;
    }());
    __setFunctionName(_classThis, "KycService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KycService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KycService = _classThis;
}();
exports.KycService = KycService;
