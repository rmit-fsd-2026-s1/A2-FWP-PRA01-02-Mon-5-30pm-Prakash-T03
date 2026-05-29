"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HirerDocument = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let HirerDocument = class HirerDocument {
};
exports.HirerDocument = HirerDocument;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], HirerDocument.prototype, "hirerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], HirerDocument.prototype, "isBusinessApplicant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", String)
], HirerDocument.prototype, "abn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], HirerDocument.prototype, "driverLicenseName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "mediumtext", nullable: true }),
    __metadata("design:type", String)
], HirerDocument.prototype, "driverLicenseData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], HirerDocument.prototype, "publicLiabilityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "mediumtext", nullable: true }),
    __metadata("design:type", String)
], HirerDocument.prototype, "publicLiabilityData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], HirerDocument.prototype, "businessCertName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "mediumtext", nullable: true }),
    __metadata("design:type", String)
], HirerDocument.prototype, "businessCertData", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 3, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], HirerDocument.prototype, "credibilityScore", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.User, (user) => user.document, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "hirerId" }),
    __metadata("design:type", User_1.User)
], HirerDocument.prototype, "user", void 0);
exports.HirerDocument = HirerDocument = __decorate([
    (0, typeorm_1.Entity)("hirer_documents")
], HirerDocument);
