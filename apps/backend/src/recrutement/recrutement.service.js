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
exports.RecrutementService = void 0;
var common_1 = require("@nestjs/common");
var RecrutementService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RecrutementService = _classThis = /** @class */ (function () {
        function RecrutementService_1(prisma, paymentService) {
            this.prisma = prisma;
            this.paymentService = paymentService;
        }
        RecrutementService_1.prototype.createRequest = function (clientId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.serviceRequest.create({
                            data: {
                                clientId: clientId,
                                title: dto.title,
                                description: dto.description,
                                budget: dto.budget,
                                status: 'OPEN',
                            },
                        })];
                });
            });
        };
        RecrutementService_1.prototype.findAllRequests = function (categoryId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Return all open requests
                    return [2 /*return*/, this.prisma.serviceRequest.findMany({
                            where: {
                                status: 'OPEN',
                                // If category is needed, we would need to add categoryId to ServiceRequest model or link it.
                                // Wait, looking at schema, ServiceRequest doesn't have categoryId. We'll skip filtering for now.
                            },
                            include: {
                                client: {
                                    select: {
                                        id: true,
                                        email: true,
                                        profile: true,
                                    }
                                },
                                _count: {
                                    select: { proposals: true }
                                }
                            },
                            orderBy: { createdAt: 'desc' },
                        })];
                });
            });
        };
        RecrutementService_1.prototype.findOneRequest = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.serviceRequest.findUnique({
                                where: { id: id },
                                include: {
                                    client: {
                                        select: {
                                            id: true,
                                            email: true,
                                            profile: true,
                                        }
                                    },
                                    proposals: {
                                        include: {
                                            provider: {
                                                select: {
                                                    id: true,
                                                    email: true,
                                                    profile: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Besoin introuvable');
                            }
                            return [2 /*return*/, request];
                    }
                });
            });
        };
        RecrutementService_1.prototype.createProposal = function (providerId, requestId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var request, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.serviceRequest.findUnique({
                                where: { id: requestId },
                            })];
                        case 1:
                            request = _a.sent();
                            if (!request) {
                                throw new common_1.NotFoundException('Besoin introuvable');
                            }
                            if (request.status !== 'OPEN') {
                                throw new common_1.BadRequestException('Ce besoin n\'est plus ouvert aux propositions');
                            }
                            return [4 /*yield*/, this.prisma.proposal.findFirst({
                                    where: {
                                        serviceRequestId: requestId,
                                        providerId: providerId,
                                    }
                                })];
                        case 2:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.BadRequestException('Vous avez déjà soumis une proposition pour ce besoin');
                            }
                            // 3. Create proposal
                            return [2 /*return*/, this.prisma.proposal.create({
                                    data: {
                                        serviceRequestId: requestId,
                                        providerId: providerId,
                                        amount: dto.amount,
                                        message: dto.message,
                                        status: 'PENDING',
                                    },
                                })];
                    }
                });
            });
        };
        RecrutementService_1.prototype.acceptProposal = function (clientId, proposalId, providerName, phone) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (prisma) { return __awaiter(_this, void 0, void 0, function () {
                            var proposal, paymentResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, prisma.proposal.findUnique({
                                            where: { id: proposalId },
                                            include: { request: true },
                                        })];
                                    case 1:
                                        proposal = _a.sent();
                                        if (!proposal) {
                                            throw new common_1.NotFoundException('Proposition introuvable');
                                        }
                                        if (proposal.request.clientId !== clientId) {
                                            throw new common_1.ForbiddenException('Seul l\'auteur du besoin peut accepter une proposition');
                                        }
                                        if (proposal.request.status !== 'OPEN') {
                                            throw new common_1.BadRequestException('Le besoin est déjà fermé ou en cours');
                                        }
                                        // 1. Mark proposal as accepted and request as IN_PROGRESS
                                        return [4 /*yield*/, prisma.proposal.update({
                                                where: { id: proposalId },
                                                data: { status: 'ACCEPTED' }
                                            })];
                                    case 2:
                                        // 1. Mark proposal as accepted and request as IN_PROGRESS
                                        _a.sent();
                                        return [4 /*yield*/, prisma.serviceRequest.update({
                                                where: { id: proposal.request.id },
                                                data: { status: 'IN_PROGRESS' }
                                            })];
                                    case 3:
                                        _a.sent();
                                        // Reject all other proposals for this request
                                        return [4 /*yield*/, prisma.proposal.updateMany({
                                                where: {
                                                    serviceRequestId: proposal.request.id,
                                                    id: { not: proposalId },
                                                    status: 'PENDING'
                                                },
                                                data: { status: 'REJECTED' }
                                            })];
                                    case 4:
                                        // Reject all other proposals for this request
                                        _a.sent();
                                        return [4 /*yield*/, this.paymentService.initiateEscrowPayment(clientId, Number(proposal.amount), providerName, // 'TMONEY' or 'MOOV'
                                            undefined, phone)];
                                    case 5:
                                        paymentResult = _a.sent();
                                        // Pour lier le paiement au service request (simplifié pour ce MVP, on devrait stocker le paymentId dans ServiceRequest ou lier le Payment à ServiceRequest)
                                        // Pour l'instant, on laisse tel quel car le système Payment est conçu pour les Orders (orderId).
                                        // Dans le futur, adapter le modèle Payment pour supporter un serviceRequestId.
                                        return [2 /*return*/, {
                                                success: true,
                                                proposalId: proposalId,
                                                payment: paymentResult,
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        RecrutementService_1.prototype.completeRequest = function (clientId, requestId, paymentIdToRelease) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.serviceRequest.findUnique({
                                where: { id: requestId },
                                include: { proposals: { where: { status: 'ACCEPTED' } } }
                            })];
                        case 1:
                            request = _a.sent();
                            if (!request)
                                throw new common_1.NotFoundException('Besoin introuvable');
                            if (request.clientId !== clientId)
                                throw new common_1.ForbiddenException('Non autorisé');
                            if (request.status !== 'IN_PROGRESS')
                                throw new common_1.BadRequestException('Ce besoin n\'est pas en cours');
                            // Mettre à jour le statut
                            return [4 /*yield*/, this.prisma.serviceRequest.update({
                                    where: { id: requestId },
                                    data: { status: 'COMPLETED' }
                                })];
                        case 2:
                            // Mettre à jour le statut
                            _a.sent();
                            // Libérer le séquestre
                            return [2 /*return*/, this.paymentService.releaseEscrow(paymentIdToRelease, clientId)];
                    }
                });
            });
        };
        RecrutementService_1.prototype.cancelRequest = function (clientId, requestId) {
            return __awaiter(this, void 0, void 0, function () {
                var request;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.serviceRequest.findUnique({
                                where: { id: requestId }
                            })];
                        case 1:
                            request = _a.sent();
                            if (!request)
                                throw new common_1.NotFoundException('Besoin introuvable');
                            if (request.clientId !== clientId)
                                throw new common_1.ForbiddenException('Non autorisé');
                            if (request.status === 'COMPLETED')
                                throw new common_1.BadRequestException('Besoin déjà terminé');
                            return [2 /*return*/, this.prisma.serviceRequest.update({
                                    where: { id: requestId },
                                    data: { status: 'CANCELLED' }
                                })];
                    }
                });
            });
        };
        RecrutementService_1.prototype.submitReview = function (userId, requestId, rating, comment) {
            return __awaiter(this, void 0, void 0, function () {
                var request, acceptedProposal, isClient, isProvider, targetId, existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.serviceRequest.findUnique({
                                where: { id: requestId },
                                include: { proposals: { where: { status: 'ACCEPTED' } } }
                            })];
                        case 1:
                            request = _a.sent();
                            if (!request)
                                throw new common_1.NotFoundException('Besoin introuvable');
                            if (request.status !== 'COMPLETED')
                                throw new common_1.BadRequestException('Le besoin doit être terminé pour être noté');
                            acceptedProposal = request.proposals[0];
                            if (!acceptedProposal)
                                throw new common_1.BadRequestException('Aucune proposition acceptée');
                            isClient = request.clientId === userId;
                            isProvider = acceptedProposal.providerId === userId;
                            if (!isClient && !isProvider)
                                throw new common_1.ForbiddenException('Non autorisé à noter cette mission');
                            targetId = isClient ? acceptedProposal.providerId : request.clientId;
                            return [4 /*yield*/, this.prisma.review.findFirst({
                                    where: { reviewerId: userId, serviceRequestId: requestId }
                                })];
                        case 2:
                            existing = _a.sent();
                            if (existing)
                                throw new common_1.BadRequestException('Vous avez déjà noté cette mission');
                            return [2 /*return*/, this.prisma.review.create({
                                    data: {
                                        reviewerId: userId,
                                        targetId: targetId,
                                        serviceRequestId: requestId,
                                        rating: rating,
                                        comment: comment,
                                    }
                                })];
                    }
                });
            });
        };
        return RecrutementService_1;
    }());
    __setFunctionName(_classThis, "RecrutementService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecrutementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecrutementService = _classThis;
}();
exports.RecrutementService = RecrutementService;
