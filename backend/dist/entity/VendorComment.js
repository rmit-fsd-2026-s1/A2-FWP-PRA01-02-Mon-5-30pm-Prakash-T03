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
exports.VendorComment = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Application_1 = require("./Application");
let VendorComment = class VendorComment {
};
exports.VendorComment = VendorComment;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], VendorComment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], VendorComment.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], VendorComment.prototype, "hirerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], VendorComment.prototype, "applicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], VendorComment.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], VendorComment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.authoredComments, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "vendorId" }),
    __metadata("design:type", User_1.User)
], VendorComment.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.receivedComments, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "hirerId" }),
    __metadata("design:type", User_1.User)
], VendorComment.prototype, "hirer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Application_1.Application, (app) => app.comments, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "applicationId" }),
    __metadata("design:type", Application_1.Application)
], VendorComment.prototype, "application", void 0);
exports.VendorComment = VendorComment = __decorate([
    (0, typeorm_1.Entity)("vendor_comments")
], VendorComment);
