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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoConnection_1 = require("../src/config/mongoConnection");
const auth_1 = require("../src/data/auth");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, mongoConnection_1.dbConnection)();
    if (!db) {
        throw new Error('Error: No database connection created');
    }
    yield db.dropDatabase();
    for (let i = 0; i < 200; i++) {
        const res = yield (0, auth_1.register)(`User${i}`, `Password@${i}`);
    }
    yield (0, mongoConnection_1.closeConnection)();
}))();
