# ポートフォリオ用 README（Static HTML）

### **1. プロジェクト概要**
- どんなサイト（サービス）か:  
  （例：ランディングページ、個人サイト、練習用の模写コーディングなど）
- 制作の目的:  
  （例：学習用／ポートフォリオ展示用）
- 簡単な特徴:  
  （例：レスポンシブ対応、FLOCSS + BEM 構成、Gulp 自動化）

---

### **2. 使用技術と環境情報**
- 言語: HTML / Sass / JavaScript  
- ツール: Node.js / Gulp  
- 使用したタスク: Sass コンパイル, autoprefixer, media query まとめ, JS圧縮, HTML 整形・圧縮, BrowserSync  
- Node.js バージョン: vXX.x.x  
- Gulp バージョン: v5.x  

---

---

### **3. CSS Validation**

- Validator: W3C CSS Validation Service  
- URL: https://jigsaw.w3.org/css-validator/  
- Checked: 2026-02-18  
- Profile: CSS Level 3 + SVG  
- Validation Scope:
  - 共通CSS（style.scss → style.css）
  - ページ単位CSS（例: top.scss など）
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
#  → public/ を生成・監視、BrowserSync で自動リロード

# 2) 1回だけ開発ビルド（整形・minify、ハッシュなし／sourcemapあり）
npx gulp build
#  → public/ を作り直すだけ（監視はしない）

# 3) 本番ビルド（ハッシュ付きファイル名／HTML圧縮／sourcemap削除）
NODE_ENV=production npx gulp build
#  出力例：
#   public/assets/css/style-<hash>.min.css
#   public/assets/js/app-<hash>.min.js
#   public/*.html は参照がハッシュ付きに自動書き換え済み
```

---

### **5. 公開範囲（DocumentRoot）とデモリンク / スクリーンショット**
- 公開範囲: public/ 以下
- デモリンク: https://your-portfolio.github.io/project-name/
- スクリーンショット: 

---

### **6. ディレクトリ構成**
```
src/
├─ index.html
├─ styles/
│  ├─ style.scss
│  ├─ global/
│  │  ├─ _variables.scss
│  │  ├─ _mixins.scss
│  │  └─ _index.scss
│  ├─ foundation/
│  │  ├─ _base.scss
│  │  └─ _index.scss
│  ├─ layout/
│  │  ├─ _container.scss
│  │  └─ _index.scss
│  └─ object/
│     ├─ component/
│     │  ├─ _button.scss
│     │  ├─ _header.scss
│     │  └─ _index.scss
│     ├─ project/
│     │  ├─ _section.scss
│     │  └─ _index.scss
│     └─ utility/
│        ├─ _visually-hidden.scss
│        ├─ _helpers.scss
│        └─ _index.scss
├─ scripts/
│  └─ app.js
└─ assets/img/
   └─ .gitkeep

public/
├─ assets/
│  ├─ css/
│  │  ├─ style.css              # 開発用（本番アップ不要）
│  │  ├─ style.min.css          # ビルド後に rev によりハッシュ付きファイル名へ変換
│  │  └─ style-xxxxxxxx.min.css # 本番アップロード対象（ハッシュ付き）
│  ├─ js/
│  │  ├─ app.js                 # 開発用（本番アップ不要）
│  │  ├─ app.min.js             # ビルド後に rev によりハッシュ付きファイル名へ変換
│  │  └─ app-xxxxxxxx.min.js    # 本番アップロード対象（ハッシュ付き）
│  └─ img/
│     └─ ...                    # 画像はすべてアップロード
├─ rev-manifest.json            # 参照マッピング（アップしても問題なし）
└─ *.html
```

---

### **7. CSS設計ルール**
- FLOCSS + BEM
	- Component: c-
	- Project: p-
	-	Utility: u-
	-	BEM: __（Element）, --（Modifier）
-	読み込み順: Global → Foundation → Layout → Object
-	各フォルダには _index.scss を設置し、style.scss から一括読み込み

---

### **8. reset.cssについて**
- 使用リセット: destyle.css（MIT）
-	バージョン：v4.0.1
- 出店URL：https://github.com/nicolas-cusan/destyle.css?tab=readme-ov-file

-	reset.css は外部CDNを利用
-	推奨: sanitize.css, ress.css など商用利用可能なもの
- 使用リセット: sanitize.css（MIT）など
-	バージョン・出典URLを社内管理ドキュメントに記録

---

### **9. 開発ポートと MAMP ポートの使い分け**
-	BrowserSync 側（300x ポート）
	-	npm run dev 実行時に自動で立ち上がるポート（例: http://localhost:300x/）。
	-	編集検知 → 自動リロードが有効。
	-	開発中の作業確認は基本的にこちらを利用する。
-	MAMP 側（プロジェクトごとの指定ポート, 例: http://localhost:{設定ポート番号}/）
	-	httpd-vhosts.conf に設定した DocumentRoot。
	-	本番に近い環境での確認用。
	-	BrowserSync のスクリプトを埋め込んでいないため 自動リロード不可。
	-	必要に応じて手動でリロードして確認する。

---

### **10. 運用メモ**
-	Sass のビルド対象: src/styles/*.scss （_*.scss は対象外）
-	追加ページ専用 CSS を作る場合は、src/styles/top.scss などを追加

---

### **11. 学習ポイント / 工夫した点**
-	学んだこと: FLOCSS 構成の実装、Gulp による自動化
-	工夫点: ディレクトリ設計をポートフォリオ案件に合わせて整理
-	今後改善したい点: 画像最適化処理の追加など

---

### **12. コードレビュー体制（AI活用）

本プロジェクトでは、OpenAI Codex を第三者レビュワーとして活用しています。

■ 活用目的
- 構文ミスや仕様逸脱の検出
- CSS設計（FLOCSS + BEM）の整合性確認
- パフォーマンス改善の検討（Lighthouse対策）
- 可読性・保守性観点の指摘

■ 運用方針
- AIの提案は必ず一次情報（MDN / W3C仕様）と照合
- 自動生成コードの丸写しは行わない
- Validator / Lighthouse と併用し多角的に確認

AIを「補助ツール」ではなく「レビュー観点の拡張」として活用しています。

---

### **12. ライセンス**
-	自作部分は MIT ライセンス**
-	使用ライブラリ:
	-	autoprefixer (MIT)
	-	browser-sync (MIT)
	-	sanitize.css (MIT)
---

## プロジェクトメモ
- Pattern: Static HTML
- Port   : 8012
- URL    : http://localhost:8012/
- DocRoot: /Applications/MAMP/htdocs/8012-daymaga-html/public