"use strict";

/* -------------------------------------------------------------
 * 1) 依存パッケージ
 * ----------------------------------------------------------- */
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssSorter = require("css-declaration-sorter");
const mmq = require("gulp-merge-media-queries");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const terser = require("gulp-terser");
const htmlBeautify = require("gulp-html-beautify");
const htmlmin = require("gulp-htmlmin");
const htmlreplace = require("gulp-html-replace");
const gulpIf = require("gulp-if");
const browserSync = require("browser-sync").create();
const del = require("del");

// ★ rev（ハッシュ付与）関連
const _rev = require("gulp-rev");
const rev = _rev.default || _rev;
const _revRewrite = require("gulp-rev-rewrite");
const revRewrite = _revRewrite.default || _revRewrite;
const _revDel = require("gulp-rev-delete-original");
const revDel = _revDel.default || _revDel;

// Node 組み込み
const fs = require("fs");
const path = require("path");
const glob = require("glob");

/* -------------------------------------------------------------
 * 2) 環境・パス
 * ----------------------------------------------------------- */
const isProd = process.env.NODE_ENV === "production";
const DEST = "./public";

// ▼ ポート／URLの決定ロジック（WP有無を問わず利用可）
const SITE_URL_PLACEHOLDER = "http://localhost:8012/";
const ENV_SITE_URL = process.env.SITE_URL || "";
const ENV_PORT = process.env.PORT || "";
const REPLACED_URL =
  SITE_URL_PLACEHOLDER.includes("http://localhost:8012/") ? "" : SITE_URL_PLACEHOLDER;
const SITE_URL = ENV_SITE_URL || (ENV_PORT ? `http://localhost:${ENV_PORT}/` : REPLACED_URL);

/** ▼ 中規模LPを想定した構成
 *  - styles: 複数エントリー（例：style.scss / form.scss / campaign.scss など）
 *  - scripts: 複数エントリー（例：app.js / form.js など）
 *  - html: 複数ページ（index.html / thanks.html / policy.html など）
 */
const paths = {
  styles: {
    src: ["./src/styles/*.scss", "!./src/styles/**/_*.scss"], // エントリーのみ
    watch: "./src/styles/**/*.scss",
    dest: `${DEST}/assets/css/`,
  },
  scripts: {
    src: "./src/scripts/**/*.js",
    dest: `${DEST}/assets/js/`,
  },
  images: {
    src: "./src/assets/img/**/*.{png,jpg,jpeg,gif,svg,webp,ico,webmanifest}",
    dest: `${DEST}/assets/img/`,
  },
  static: {
    // フォント/ドキュメントなど静的ファイル（任意）
    src: "./src/assets/static/**/*",
    dest: `${DEST}/assets/static/`,
  },
  html: {
    src: "./src/**/*.html",
    dest: `${DEST}/`,
  },
};

/* -------------------------------------------------------------
 * 3) クリーニング
 * ----------------------------------------------------------- */
function clean() {
  return del([DEST]);
}

/* -------------------------------------------------------------
 * 4) スタイル：複数エントリー対応（dev: sourcemap, prod: min）
 *    出力: <name>.css / <name>.min.css
 * ----------------------------------------------------------- */
function styles() {
  const enableMap = !isProd;

  return gulp
    .src(paths.styles.src, { sourcemaps: enableMap })
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssSorter()]))
    .pipe(mmq())
    // 非min（*.css）
    .pipe(gulp.dest(paths.styles.dest, { sourcemaps: false }))
    // min（*.min.css）
    .pipe(cleanCss({ rebase: false }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.styles.dest, { sourcemaps: enableMap ? "." : false }));
}

/* -------------------------------------------------------------
 * 5) スクリプト：複数エントリー対応
 *    出力: <name>.js / <name>.min.js
 * ----------------------------------------------------------- */
function scripts() {
  const enableMap = !isProd;

  return gulp
    .src(paths.scripts.src, { sourcemaps: enableMap })
    // 非min（*.js）
    .pipe(gulp.dest(paths.scripts.dest, { sourcemaps: false }))
    // min（*.min.js）
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.scripts.dest, { sourcemaps: enableMap ? "." : false }));
}

/* -------------------------------------------------------------
 * 6) HTML：.min参照を差し込み → prodで圧縮
 *    ※ 参照は .min 固定。prod 後段の revRewrite() がハッシュ名に置換
 *    ※ 複数CSS/JSがある場合は必要数を配列で指定
 * ----------------------------------------------------------- */
function html() {
  // 例：ページ共通で読み込むCSS/JSをここに列挙（必要に応じて増減OK）
  // ページ別の差し分がある場合は、ファイル名規約で分岐させるか、後述の「ブロック式」に変更可能。
  const cssBundle = [
    "assets/css/style.min.css",
    // "assets/css/form.min.css",
    // "assets/css/campaign.min.css",
  ];
  const jsBundle = [
    "assets/js/app.min.js",
    // "assets/js/form.min.js",
  ];

  return gulp
    .src(paths.html.src)
    .pipe(htmlBeautify({ indent_size: 2, indent_with_tabs: true }))
    .pipe(
      htmlreplace({
        css: { src: cssBundle, tpl: '<link rel="stylesheet" href="%s">' },
        js: { src: jsBundle, tpl: '<script src="%s" defer></script>' },
      })
    )
    .pipe(gulpIf(isProd, htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest(paths.html.dest));
}

/* -------------------------------------------------------------
 * 7) 画像：無加工コピー
 * ----------------------------------------------------------- */
function images() {
  const files = glob.sync(paths.images.src.replace("./", ""));
  files.forEach((srcFile) => {
    const destFile = srcFile.replace(/^src\//, "public/");
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.copyFileSync(srcFile, destFile);
  });
  return Promise.resolve();
}

/* -------------------------------------------------------------
 * 8) 静的ファイル（フォント等）：無加工コピー（任意）
 * ----------------------------------------------------------- */
function staticAssets() {
  if (!fs.existsSync("./src/assets/static")) return Promise.resolve();
  const files = glob.sync(paths.static.src.replace("./", ""));
  files.forEach((srcFile) => {
    const destFile = srcFile.replace(/^src\//, "public/");
    fs.mkdirSync(path.dirname(destFile), { recursive: true });
    fs.copyFileSync(srcFile, destFile);
  });
  return Promise.resolve();
}

/* -------------------------------------------------------------
 * 9) .map の一掃（prodのみ・安全策）
 * ----------------------------------------------------------- */
function purgeMaps() {
  if (!isProd) return Promise.resolve();
  return del([`${DEST}/assets/css/*.map`, `${DEST}/assets/js/*.map`]);
}

/* -------------------------------------------------------------
 * 10) rev（内容ハッシュ付与）＆ HTML参照書き換え（prodのみ）
 *      対象は *.min.css / *.min.js
 * ----------------------------------------------------------- */
function revAssets() {
  if (!isProd) return Promise.resolve();

  return gulp
    .src([`${DEST}/assets/css/*.min.css`, `${DEST}/assets/js/*.min.js`], { base: DEST })
    .pipe(rev())
    .pipe(revDel()) // 元の *.min.* を削除（ハッシュ付きのみ残す）
    .pipe(gulp.dest(DEST))
    .pipe(rev.manifest("rev-manifest.json", { merge: true }))
    .pipe(gulp.dest(DEST));
}

function rewriteHtml() {
  if (!isProd) return Promise.resolve();

  const manifest = fs.readFileSync(`${DEST}/rev-manifest.json`);
  return gulp
    .src(`${DEST}/**/*.html`)
    .pipe(revRewrite({ manifest }))
    .pipe(gulp.dest(DEST));
}

/* -------------------------------------------------------------
 * 11) BrowserSync（proxy or static）
 * ----------------------------------------------------------- */
function serve(done) {
  if (SITE_URL) {
    console.log(`[Browsersync] proxy => ${SITE_URL}`);
    browserSync.init({ proxy: SITE_URL, ui: false, notify: false, open: true });
  } else {
    console.log(`[Browsersync] static server => ${DEST}`);
    browserSync.init({ server: { baseDir: DEST }, ui: false, notify: false, open: true });
  }
  done();
}
function reload(done) {
  browserSync.reload();
  done();
}

/* -------------------------------------------------------------
 * 12) 監視
 * ----------------------------------------------------------- */
function watch() {
  gulp.watch(paths.styles.watch, gulp.series(styles, reload));
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
  gulp.watch(paths.html.src, gulp.series(html, reload));
  gulp.watch(paths.images.src, gulp.series(images, reload));
  gulp.watch(paths.static.src, gulp.series(staticAssets, reload));
}

/* -------------------------------------------------------------
 * 13) ビルド定義
 *     dev：ハッシュなし
 *     prod：map削除 → rev → HTML置換
 * ----------------------------------------------------------- */
const buildDev = gulp.series(
  clean,
  gulp.parallel(html, scripts, styles, images, staticAssets)
);

const buildProd = gulp.series(
  clean,
  gulp.parallel(html, scripts, styles, images, staticAssets),
  purgeMaps,
  revAssets,
  rewriteHtml
);

const build = isProd ? buildProd : buildDev;
const dev = gulp.series(build, gulp.parallel(serve, watch));

/* -------------------------------------------------------------
 * 14) タスク公開
 * ----------------------------------------------------------- */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.static = staticAssets;
exports.purgeMaps = purgeMaps;
exports.revAssets = revAssets;
exports.rewriteHtml = rewriteHtml;

exports.build = build;     // ← NODE_ENV で dev/prod 切替
exports.dev = dev;
exports.watch = watch;
exports.serve = serve;