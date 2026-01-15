# API Contracts: Dark/Light Theme Switcher

**Feature**: 009-theme-switcher
**Date**: 2026-01-15
**Phase**: Phase 1 - Design

## Overview

This feature is entirely client-side (React SPA) with no server API interactions. Therefore, "contracts" represent the programmatic interfaces (TypeScript types, React hooks, context APIs) that other parts of the application will consume.

---

## Contract Categories

This directory contains:

1. **types-contract.ts**: TypeScript type definitions (ThemeMode, etc.)
2. **context-contract.ts**: React Context API specification (ThemeContext)
3. **hook-contract.ts**: Custom hook interface (useThemeMode)
4. **component-contract.ts**: Component props and behavior (ThemeSwitcher)
5. **storage-contract.ts**: localStorage interface specification

---

## Contract Stability

| Contract | Stability | Breaking Change Policy |
|----------|-----------|------------------------|
| types-contract.ts | **Stable** | No breaking changes allowed; extend with new types only |
| context-contract.ts | **Stable** | No breaking changes allowed; additive changes only |
| hook-contract.ts | **Stable** | Return type can be extended; function signature immutable |
| component-contract.ts | **Semi-stable** | Props can be extended; required props immutable |
| storage-contract.ts | **Internal** | Implementation detail; can change freely |

---

## Usage

These contracts define the public API for the theme switching feature. They serve as:

1. **Design documentation** during implementation planning
2. **Test specifications** for TDD (write tests against contracts)
3. **Integration points** for other features consuming theme state
4. **Type definitions** imported by TypeScript code

---

## Related Documents

- [data-model.md](../data-model.md): Entity definitions and state management
- [research.md](../research.md): Technical decisions and alternatives
- [tasks.md](../tasks.md): Implementation checklist (generated later)
