"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var catMode, catElectro, catAlimentaire, user, sellerId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Seeding Marketplace...');
                    return [4 /*yield*/, prisma.category.create({
                            data: { name: 'Mode' },
                        })];
                case 1:
                    catMode = _a.sent();
                    return [4 /*yield*/, prisma.category.create({
                            data: { name: 'Électronique' },
                        })];
                case 2:
                    catElectro = _a.sent();
                    return [4 /*yield*/, prisma.category.create({
                            data: { name: 'Alimentaire' },
                        })];
                case 3:
                    catAlimentaire = _a.sent();
                    return [4 /*yield*/, prisma.user.findFirst()];
                case 4:
                    user = _a.sent();
                    if (!!user) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'seller@zenda.tg',
                                passwordHash: 'dummy_hash',
                            }
                        })];
                case 5:
                    user = _a.sent();
                    _a.label = 6;
                case 6:
                    sellerId = user.id;
                    // Create Products
                    return [4 /*yield*/, prisma.product.createMany({
                            data: [
                                {
                                    sellerId: sellerId,
                                    categoryId: catMode.id,
                                    title: 'T-shirt Zenda Noir',
                                    description: 'T-shirt en coton bio avec le logo Zenda.',
                                    price: 5000,
                                    stock: 50,
                                    condition: 'NEW',
                                    images: ['https://placehold.co/400x400/111111/FFFFFF/png?text=T-shirt+Zenda'],
                                },
                                {
                                    sellerId: sellerId,
                                    categoryId: catElectro.id,
                                    title: 'Smartphone X Pro',
                                    description: 'Smartphone dernière génération 128Go.',
                                    price: 150000,
                                    stock: 10,
                                    condition: 'USED_LIKE_NEW',
                                    images: ['https://placehold.co/400x400/333333/FFFFFF/png?text=Smartphone'],
                                },
                                {
                                    sellerId: sellerId,
                                    categoryId: catAlimentaire.id,
                                    title: 'Sac de Riz 25kg',
                                    description: 'Riz parfumé de première qualité.',
                                    price: 22000,
                                    stock: 100,
                                    condition: 'NEW',
                                    images: ['https://placehold.co/400x400/222222/FFFFFF/png?text=Riz+25kg'],
                                }
                            ],
                        })];
                case 7:
                    // Create Products
                    _a.sent();
                    console.log('Seeding finished.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
