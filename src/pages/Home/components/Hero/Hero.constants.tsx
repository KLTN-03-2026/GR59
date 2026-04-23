import React from "react";
import { Waves, Buildings, HouseLine, Money, TrendUp, Crown } from "phosphor-react";
import type { Province, BudgetOption } from "./Hero.types";

export const VIETNAM_PROVINCES: Province[] = [
  { name: "Đà Nẵng", desc: "Thành phố của những cây cầu", icon: <Waves color="#0ea5e9" weight="bold" /> },
  { name: "Thừa Thiên Huế", desc: "Cố đô cổ kính, trầm mặc", icon: <Buildings color="#a855f7" weight="bold" /> },
  { name: "Quảng Nam", desc: "Phố cổ Hội An & Mỹ Sơn", icon: <HouseLine color="#f59e0b" weight="bold" /> },
];

export const BUDGET_OPTIONS: BudgetOption[] = [
  { value: "economy", label: "Tiết kiệm", icon: <Money color="#22c55e" />, desc: "Dưới 5 triệu VNĐ" },
  { value: "midrange", label: "Phổ thông", icon: <TrendUp color="#3b82f6" />, desc: "Từ 5 - 15 triệu VNĐ" },
  { value: "luxury", label: "Cao cấp", icon: <Crown color="#f59e0b" />, desc: "Trên 15 triệu VNĐ" },
];
