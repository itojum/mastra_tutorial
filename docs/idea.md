## 🧠 **プロジェクト概要：OpsMate（オプスメイト）**

### 🎯 なにを解決するの？

> サークル・団体・NPOなどの**運営に伴う煩雑な事務作業**を、
> **自然言語で指示するだけで自動化・一元管理**できるAIアシスタントBot

---

### 🧩 想定ユースケース（例）

* 「来週のイベント作って、Google Calendarに登録して」
* 「フォームで出欠を取りたい」
* 「提出状況をスプレッドシートに反映して、Discordで通知して」
* 「この人の過去の参加履歴を教えて」

→ これらを**自然言語で依頼するだけで、複数のMCPを連携して処理してくれるBot**

---

## 🔧 技術構成

| 機能領域        | 内容                                                |
| ----------- | ------------------------------------------------- |
| 🧠 中核AI     | **Mastra**（自然言語 → MCP命令への変換）                      |
| 🔗 MCP連携    | Discord / Google Calendar / Spreadsheet / Form など |
| 📬 インターフェース | 主に **Discord Bot（チャット操作）** + Optional Web UI      |
| 🧰 ストレージ    | 状態保存が必要な場合にFirebase or Supabase（検討中）              |
| 🧠 拡張機能     | 各操作を記録・再利用可能な「コマンド履歴」や「テンプレ化」も視野                  |

---

## 🗃️ 管理対象データ（構想）

* 📆 イベント（日時・場所・主催者など）
* 📝 出欠フォーム（Google Form連携）
* 📊 回答データ（Google Spreadsheet）
* 📣 通知メッセージ（Discord）
* 🧑‍🤝‍🧑 メンバー情報（Slack名簿的な）

---

## 🤝 ターゲット

| 層         | 利用イメージ                  |
| --------- | ----------------------- |
| 学生サークル運営  | 行事・飲み会・総会などの連絡・出欠管理     |
| 地域NPO     | 会合・イベント・ボランティア募集などの周知   |
| 学校・ゼミ・研究室 | 実験日程調整・レポート提出状況チェック etc |

---

## 🌱 MVPフェーズで実装するもの（最小構成）

1. Discord Botで自然言語コマンドを受け取る
2. Mastraで解析 → MCPのFunction呼び出し
3. Google Calendarに予定を登録
4. Google Form出欠URLを作成・送信
5. 回答をスプレッドシートに反映
6. Discordに結果通知

---

## 🌈 今後の可能性（拡張イメージ）

* ✅ **「運営スクリプト」化（再利用・自動化）**
* ✅ **Web UIでの履歴/記録参照やレポート閲覧**
* ✅ **出欠率・参加傾向などの分析ダッシュボード**
* ✅ **音声操作やLINE対応などのマルチインターフェース化**

---

## 🧭 まとめ一行で！

> **OpsMateは、自然言語で事務作業を操れる、運営者のためのAI補佐官Bot**！
