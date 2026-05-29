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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Venue_1 = require("./Venue");
const Application_1 = require("./Application");
const HirerDocument_1 = require("./HirerDocument");
const VendorComment_1 = require("./VendorComment");
const HireHistory_1 = require("./HireHistory");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Venue_1.Venue, (venue) => venue.vendor),
    __metadata("design:type", Array)
], User.prototype, "venues", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Application_1.Application, (application) => application.hir),
    __metadata("design:type", Array)
], User.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => HirerDocument_1.HirerDocument, (doc) => doc.user),
    __metadata("design:type", HirerDocument_1.HirerDocument)
], User.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => VendorComment_1.VendorComment, (comment) => comment.vendor),
    __metadata("design:type", Array)
], User.prototype, "authoredComments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => VendorComment_1.VendorComment, (comment) => comment.hirer),
    __metadata("design:type", Array)
], User.prototype, "receivedComments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HireHistory_1.HireHistory, (history) => history.hirer),
    __metadata("design:type", Array)
], User.prototype, "hirerHistory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HireHistory_1.HireHistory, (history) => history.vendor),
    __metadata("design:type", Array)
], User.prototype, "vendorHistory", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("users")
], User);
