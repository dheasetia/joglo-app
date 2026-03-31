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
exports.UpdateExamDto = exports.CreateExamDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateExamDto {
    examDate;
    examType;
    title;
    studentId;
    halaqahId;
    startPage;
    endPage;
    startJuz;
    endJuz;
    periodStart;
    periodEnd;
    score;
    notes;
    recommendation;
    resultStatus;
}
exports.CreateExamDto = CreateExamDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "examDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ExamType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "examType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "halaqahId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "startPage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "endPage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "startJuz", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "endJuz", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "periodStart", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "periodEnd", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Recommendation),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "recommendation", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ExamResultStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "resultStatus", void 0);
class UpdateExamDto {
    examDate;
    examType;
    title;
    startPage;
    endPage;
    startJuz;
    endJuz;
    periodStart;
    periodEnd;
    score;
    notes;
    recommendation;
    resultStatus;
}
exports.UpdateExamDto = UpdateExamDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExamDto.prototype, "examDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ExamType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExamDto.prototype, "examType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExamDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateExamDto.prototype, "startPage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateExamDto.prototype, "endPage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateExamDto.prototype, "startJuz", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateExamDto.prototype, "endJuz", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExamDto.prototype, "periodStart", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExamDto.prototype, "periodEnd", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateExamDto.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExamDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.Recommendation),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExamDto.prototype, "recommendation", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ExamResultStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateExamDto.prototype, "resultStatus", void 0);
//# sourceMappingURL=exam.dto.js.map