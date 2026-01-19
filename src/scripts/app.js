// JavaScriptテンプレート
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
  const initSwiperAbout = () => {
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
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  };
  window.addEventListener("load", function () {
    initSwiperAbout(); // ページ読み込み後に初期化
  });
})();