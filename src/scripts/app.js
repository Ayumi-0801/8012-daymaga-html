(() => {
  // 年の自動更新
  const y = document.getElementById('js-year');
  if (y) y.textContent = String(new Date().getFullYear());

  /* ==============================================
  ヘッダー開閉
  ============================================== */
  const btn  = document.querySelector('.js-btn-drawer');   // <button>
  const nav  = document.getElementById('global-nav');      // <nav>
  const header = document.getElementById('header');
  if (!btn || !nav) return;

  let isLock = false; // 二重連打防止

  // transition（transform）の完了を待ってisLockを解除する
  const onTransitionEnd = (e) => {
    if (e.propertyName !== 'transform') return; // transform の終了だけ見る
    nav.removeEventListener('transitionend', onTransitionEnd);
    isLock = false; // アニメーション完了後にfalseに戻す

    // 「閉じ切った後」に hidden を付ける
    if (btn.getAttribute('aria-expanded') !== 'true') {
      nav.setAttribute('hidden', '');
    }
  };

  const open = () => {
    if (isLock) return;
    isLock = true; // クリック無効化

    // 先に表示可能にして 1フレーム待つ（トランジション発火のため）
    nav.removeAttribute('hidden');
    // リフロー強制（初期 transform を確定させる）
    void nav.offsetWidth;

    btn.setAttribute('aria-expanded', 'true');
    header.classList.add('is-open');

    // クリック無効化を解除
    nav.addEventListener('transitionend', onTransitionEnd);
  };

  const close = () => {
    if (isLock) return;
    isLock = true; // クリック無効化

    btn.setAttribute('aria-expanded', 'false');
    header.classList.remove('is-open');

    // クリック無効化を解除
    nav.addEventListener('transitionend', onTransitionEnd);
  };

  const toggle = () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  };

  // トグル
  btn.addEventListener('click', toggle);

  // ドロワー内のページ内リンクをクリックしたら閉じる（モバイルで便利）
  nav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', close);
  });

  // 任意：Esc で閉じる（キーボード操作配慮）
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  /* ==============================================
  ページ内リンクのクリック時にフォーカスを外す
  ============================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function() {
      this.blur();
    });
  });

  /* ==============================================
  スクロールしたらヘッダー表示変更
  ============================================== */
  document.addEventListener(`DOMContentLoaded`, () => {
    const header = document.querySelector('.js-header');
    const main = document.querySelector('.l-main');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        header.classList.add('is-scroll');
        main.classList.add('is-scroll');
      } else {
        header.classList.remove('is-scroll');
        main.classList.remove('is-scroll');
      }
    });
  });

  /* ==============================================
  ファーストビューSwiper
  ============================================== */
  const initSwiperFv = () => {
    const swiper = new Swiper(".js-swiper-fv", {
      centeredSlides: true, // 中央寄せ
      slidesPerView: "auto", // CSSでスライドの幅を管理
      rewind: true,
      freeMode: false,
      initialSlide: 1, // 初期表示は2番目のスライドを中央に表示
      spaceBetween: 16,
      breakpoints: {
        901: {
          spaceBetween: 64,
        },
      },
      navigation: {
        nextEl: ".p-home-fv__swiper-btn-next",
        prevEl: ".p-home-fv__swiper-btn-prev",
      },
    });
  };
  window.addEventListener("load", function () {
    initSwiperFv(); // ページ読み込み後に初期化
  });

  /* ==============================================
  記事Swiper（よく読まれている記事、関連記事）
  ============================================== */
  const initSwiperArticles = () => {
    const swiper = new Swiper(".js-swiper-articles", {
      centeredSlides: false, // 左寄せ
      slidesPerView: "auto", // CSSでスライドの幅を管理
      loop: false, // ループ禁止
      // rewind: true,
      freeMode: false,
      spaceBetween: 24,
      breakpoints: {
        901: {
          spaceBetween: 32,
        },
      },
      navigation: {
        nextEl: ".c-articles-swiper__btn-next",
        prevEl: ".c-articles-swiper__btn-prev",
      },
      scrollbar: {
        el: '.c-articles-swiper__scrollbar',
        draggable: true,
      },
    });
  };
  window.addEventListener("load", function () {
    initSwiperArticles(); // ページ読み込み後に初期化
  });
  /* ==============================================
  すべての記事一覧のカテゴリ判定
  ============================================== */
  // タブへのテーマクラス付与先
  const tabsRoot = document.querySelector('.js-category-tabs');
  // 記事一覧ブロックへのテーマクラス付与先
  const listRoot = document.querySelector('.c-article-list');
  // ラジオ
  const radios = document.querySelectorAll('.js-category-filter');
  // 記事カード
  const items = document.querySelectorAll('.c-article-list__item');

  // タブの各カテゴリテーマクラス対応表
  const tabsThemeMap = {
    all: 'c-category-tabs--theme-all',
    latest: 'c-category-tabs--theme-latest',
    tips: 'c-category-tabs--theme-tips',
    interview: 'c-category-tabs--theme-interview',
    news: 'c-category-tabs--theme-news',
  };

  // 記事一覧の各カテゴリテーマクラス対応表
  const listThemeMap = {
    all: 'c-article-list--theme-all',
    latest: 'c-article-list--theme-latest',
    tips: 'c-article-list--theme-tips',
    interview: 'c-article-list--theme-interview',
    news: 'c-article-list--theme-news',
  };

  // テーマ切替（共通：target に map のクラスを付け替える）
  const setTheme = (targetEl, themeMap, value) => {
    if (!targetEl) return;

    Object.values(themeMap).forEach((cls) => {
      targetEl.classList.remove(cls);
    });

    const themeClass = themeMap[value];
    if (themeClass) {
      targetEl.classList.add(themeClass);
    }
  };

  // 記事一覧のカード表示制御
  const updateList = (value) => {
    items.forEach((item) => {
      const category = item.dataset.category;
      const isShow = (value === 'all') || (category === value);
      item.hidden = !isShow;
    });
  };

  // 状態反映（value を受け取って、必要な更新を全部やる）
  const applyState = (value) => {
    setTheme(tabsRoot, tabsThemeMap, value); // タブ側テーマ
    setTheme(listRoot, listThemeMap, value); // 記事一覧側テーマ
    updateList(value); // 表示フィルタ
  };

  // ラジオボタンの選択変更時
  radios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      applyState(e.target.value);
    });
  });

  // 初期状態の反映（HTMLで checked にしているものを読む）
  const checked = document.querySelector('.js-category-filter:checked');
  applyState(checked ? checked.value : 'all');
})();