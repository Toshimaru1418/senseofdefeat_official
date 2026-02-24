# SENSE OF DEFEAT - Project TODO

## Core Game Features

- [x] Retro pixel art game engine (canvas-based)
- [x] Player movement (left/right/jump/shoot)
- [x] Enemy sprites and collision detection
- [x] Stage gimmick doors (profile/discography/live/contact)
- [x] Game HUD (HP bar, score, stage label)
- [x] Title screen
- [x] Game over screen with continue
- [x] Mobile controls (touch buttons)
- [x] BGM toggle
- [x] Minimap

## Modal Content

- [x] Profile modal (band members)
- [x] Discography modal (releases)
- [x] Live info modal (upcoming/past shows)
- [x] Contact modal (booking/press/fan mail)

## Backend / Database

- [x] DB schema for live_events, discography, admin_settings
- [x] DB migration pushed
- [x] tRPC router for live events CRUD
- [x] tRPC router for discography CRUD
- [x] Admin password verification endpoint
- [x] DB helper functions in server/db.ts

## Admin Panel

- [x] Password-protected admin page (/admin)
- [x] Live events manager (add/edit/delete)
- [x] Discography manager (add/edit/delete)
- [x] Settings panel (change password, logout)
- [x] Manus OAuth login required for admin access

## Frontend API Integration

- [x] LiveModal fetches data from DB (with fallback to static data)
- [x] DiscographyModal fetches data from DB (with fallback to static data)
- [x] Ticket URL links in LiveModal
- [x] Streaming URL links in DiscographyModal
- [x] トップページをスクロールなし・1画面表示に変更（Home.tsx + TitleScreen.tsx）

## Flyer Image Feature

- [x] DBスキーマにflyerImageUrl・flyerImageKeyカラムを追加
- [x] S3ファイルアップロードtRPC mutationを追加
- [x] 管理パネルのライブ編集フォームにフライヤー画像アップロードUIを追加
- [x] ゲーム内LiveModalにフライヤー画像を表示
