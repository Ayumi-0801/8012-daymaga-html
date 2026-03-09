# ポートフォリオ用 README（Static HTML）

### **1. プロジェクト概要**
- どんなサイト（サービス）か:  
  コンサルティング領域に特化した専門情報メディア「DayMaga」の静的HTMLコーディング案件です。
	デザインガンプはデイトラの課題を利用しています。
- 制作の目的:  
  ポートフォリオ用の実装作品として、複数ページ構成のメディアサイトを静的HTML / Sass / JavaScript で構築することを目的としています。
- 簡単な特徴:  
  レスポンシブ対応、FLOCSS + BEM 構成、Gulp によるビルド自動化、複数ページ対応、公開用 `public/` ディレクトリ分離。

---

### **2. 使用技術と環境情報**
- 言語: HTML / Sass / JavaScript  
- ツール: Node.js / Gulp / BrowserSync  
- 使用したタスク: Sass コンパイル, autoprefixer, CSSプロパティ並び替え, media query まとめ, JS圧縮, HTML整形・圧縮, BrowserSync, rev によるハッシュ付与, HTML参照書き換え  
- Node.js バージョン: v22.18.0  
- Gulp バージョン: v5.0.1  

---

### **3. CSS Validation**

- Validator: W3C CSS Validation Service  
- URL: https://jigsaw.w3.org/css-validator/  
- Checked: 2026-02-18  
- Profile: CSS Level 3 + SVG  
- Validation Scope:
  - 共通CSS（`style.scss` → `style.css`）
  - ページ単位CSS（`page-home.scss` / `page-archive.scss` / `page-tag.scss` / `page-single.scss`）
  - 各CSSファイル単位で個別検証
- Result: Error なし  
- Warnings: Vendor extensions のみ（-webkit, -moz 系）

※ ローカル環境構築中のため、ファイル単位で検証を実施。

---

### **4. セットアップ手順**
```bash
# リポジトリをクローン後
npm i

# 1) 監視＋自動リロードで開発
npx gulp dev
#  → public/ を生成・監視し、BrowserSync で自動リロード

# 2) 本番ビルド
npx gulp build
#  → public/ を作り直し、CSS/JS の minify・HTML圧縮・rev付きファイル生成を実施
```

※ `package.json` では `npm run dev` / `npm run build` も利用可能です。  
※ ローカル確認は MAMP の `http://localhost:8012/` でも可能です。

---

### **5. 公開範囲（DocumentRoot）とデモリンク / スクリーンショット**
- 公開範囲: `public/` 以下
- デモリンク: https://www.stg-ayunatsu-web.tech/8012-daymaga-html/
- スクリーンショット: 要確認

---

### **6. ディレクトリ構成**
```text
src/
├─ index.html
├─ archive.html
├─ tag.html
├─ single.html
├─ scripts/
│  └─ app.js
├─ styles/
│  ├─ style.scss
│  ├─ page-home.scss
│  ├─ page-archive.scss
│  ├─ page-tag.scss
│  ├─ page-single.scss
│  ├─ global/
│  │  ├─ _settings.scss
│  │  ├─ _variables.scss
│  │  ├─ _mixins.scss
│  │  └─ _index.scss
│  ├─ foundation/
│  │  ├─ _base.scss
│  │  ├─ _destyle.scss
│  │  └─ _index.scss
│  ├─ layout/
│  │  ├─ _container.scss
│  │  └─ _index.scss
│  ├─ common/
│  │  └─ _index.scss
│  └─ object/
│     ├─ component/
│     ├─ project/
│     │  ├─ home/
│     │  ├─ archive/
│     │  ├─ tag/
│     │  └─ single/
│     └─ utility/
└─ assets/
   └─ img/

public/
├─ index.html
├─ archive.html
├─ tag.html
├─ single.html
└─ assets/
   ├─ css/
   ├─ js/
   └─ img/
```

---

### **7. CSS設計ルール**
- FLOCSS + BEM
  - Component: `c-`
  - Project: `p-`
  - Utility: `u-`
  - BEM: `__`（Element）, `--`（Modifier）
- 読み込み順: Global → Foundation → Layout → Object
- 各フォルダには `_index.scss` を設置し、エントリSCSSから一括読み込み
- mobile-first を前提とし、ブレークポイントは `min-width` ベースで管理

---

### **8. reset.cssについて**
- 使用リセット: destyle.css（MIT）
- バージョン: v4.0.1
- 出典URL: https://github.com/nicolas-cusan/destyle.css

- reset.css は外部CDNではなく、`src/styles/foundation/_destyle.scss` としてプロジェクト内に取り込んで使用
- ベーススタイルは `foundation/_base.scss` と組み合わせて管理

---

### **9. 開発ポートと MAMP ポートの使い分け**
- BrowserSync 側
  - `npx gulp dev` 実行時に起動
  - `SITE_URL` 未指定時は `public/` を静的サーバーとして利用
  - `SITE_URL` 指定時はプロキシ起動に対応
  - 編集検知による自動リロードが有効
- MAMP 側
  - URL: `http://localhost:8012/`
  - DocumentRoot: `/Applications/MAMP/htdocs/8012-daymaga-html/public`
  - 本番に近い確認環境として使用

---

### **10. 運用メモ**
- Sass のビルド対象: `src/styles/*.scss`（`_*.scss` は対象外）
- ページ単位CSSは `page-home.scss`、`page-archive.scss`、`page-tag.scss`、`page-single.scss`
- HTML は `src/**/*.html` を `public/` へ出力
- 画像は `src/assets/img/` から `public/assets/img/` へコピー
- JS は `src/scripts/**/*.js` を `public/assets/js/` へ出力
- 本番ビルド時は `.min.css` / `.min.js` に対して rev によるハッシュ付与と HTML の参照書き換えを実施

---

### **11. 学習ポイント / 工夫した点**
- 学んだこと: FLOCSS 構成によるスタイル設計、複数ページ構成の静的サイト管理、Gulp を用いたビルドフロー構築
- 工夫点: 共通スタイルとページ別スタイルを分離し、`public/` を公開用ディレクトリとして明確に分けている点
- 今後改善したい点: スクリーンショットなど公開情報の整理

---

### **12. コードレビュー体制（AI活用）**

本プロジェクトでは、OpenAI Codex を第三者レビュワーとして活用しています。

■ 活用目的
- 構文ミスや仕様逸脱の検出
- CSS設計（FLOCSS + BEM）の整合性確認
- HTML / CSS / JS の整合性確認
- 可読性・保守性観点の指摘

■ 運用方針
- AIの提案は必ず一次情報（MDN / W3C仕様）と照合
- 自動生成コードの丸写しは行わない
- Validator / Lighthouse などと併用し多角的に確認する

AIを「補助ツール」ではなく「レビュー観点の拡張」として活用しています。

---

### **13. ライセンス**
- 自作部分は MIT ライセンス
- 使用ライブラリ:
  - autoprefixer (MIT)
  - browser-sync (MIT)
  - destyle.css (MIT)
  - Sass (MIT)

---

## プロジェクトメモ
- Pattern: Static HTML
- Port   : 8012
- URL    : http://localhost:8012/
- DocRoot: /Applications/MAMP/htdocs/8012-daymaga-html/public
