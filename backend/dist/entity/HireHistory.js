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
exports.HireHistory = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Venue_1 = require("./Venue");
let HireHistory = class HireHistory {
};
exports.HireHistory = HireHistory;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], HireHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], HireHistory.prototype, "hirerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], HireHistory.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], HireHistory.prototype, "venueId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], HireHistory.prototype, "eventName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], HireHistory.prototype, "dateOfHire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], HireHistory.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.hirerHistory, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "hirerId" }),
    __metadata("design:type", User_1.User)
], HireHistory.prototype, "hirer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.vendorHistory, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "vendorId" }),
    __metadata("design:type", User_1.User)
], HireHistory.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Venue_1.Venue, (venue) => venue.hireHistory, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "venueId" }),
    __metadata("design:type", Venue_1.Venue)
], HireHistory.prototype, "venue", void 0);
exports.HireHistory = HireHistory = __decorate([
    (0, typeorm_1.Entity)("hire_history")
], HireHistory);
