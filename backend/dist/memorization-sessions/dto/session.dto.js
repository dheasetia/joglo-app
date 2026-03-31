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
exports.UpdateSessionDto = exports.CreateSessionDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateSessionDto {
    sessionDate;
    sessionType;
    studentId;
    halaqahId;
    startPage;
    endPage;
    score;
    notes;
    recommendation;
    isApprovedForNextStep;
}
exports.CreateSessionDto = CreateSessionDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "sessionDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SessionType),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "sessionType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "halaqahId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSessionDto.prototype, "startPage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSessionDto.prototype, "endPage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSessionDto.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Recommendation),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "recommendation", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateSessionDto.prototype, "isApprovedForNextStep", void 0);
class UpdateSessionDto {
    sessionDate;
    sessionType;
    startPage;
    endPage;
    score;
    notes;
    recommendation;
    isApprovedForNextStep;
}
exports.UpdateSessionDto = UpdateSessionDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSessionDto.prototype, "sessionDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.SessionType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSessionDto.prototype, "sessionType", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSessionDto.prototype, "startPage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSessionDto.prototype, "endPage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSessionDto.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSessionDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Recommendation),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSessionDto.prototype, "recommendation", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSessionDto.prototype, "isApprovedForNextStep", void 0);
//# sourceMappingURL=session.dto.js.map