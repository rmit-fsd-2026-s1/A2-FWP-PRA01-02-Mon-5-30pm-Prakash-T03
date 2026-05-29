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
exports.Application = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Venue_1 = require("./Venue");
const VendorComment_1 = require("./VendorComment");
let Application = class Application {
};
exports.Application = Application;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Application.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Application.prototype, "hirerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Application.prototype, "venueId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Application.prototype, "eventName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Application.prototype, "guestCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], Application.prototype, "eventDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], Application.prototype, "eventTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], Application.prototype, "durationHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, default: "pending" }),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "vendorComment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Application.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Application.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.applications, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "hirerId" }),
    __metadata("design:type", User_1.User)
], Application.prototype, "hir", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Venue_1.Venue, (venue) => venue.applications, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "venueId" }),
    __metadata("design:type", Venue_1.Venue)
], Application.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => VendorComment_1.VendorComment, (comment) => comment.application),
    __metadata("design:type", Array)
], Application.prototype, "comments", void 0);
exports.Application = Application = __decorate([
    (0, typeorm_1.Entity)("applications")
], Application);
