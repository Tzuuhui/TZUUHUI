const today = new Date();
today.setHours(0, 0, 0, 0);

const saleDate = new Date(2026, 10, 8);
const daysLeft = Math.ceil((saleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
const countdown = document.getElementById('倒數');

if (countdown) {
  countdown.textContent = daysLeft > 0 ? `還有 ${daysLeft} 天` : daysLeft === 0 ? '今天開賣' : '預購已截止';
}

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    menuToggle.setAttribute('aria-label', isExpanded ? '開啟導覽選單' : '關閉導覽選單');
    navLinks.classList.toggle('is-open', !isExpanded);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', '開啟導覽選單');
      navLinks.classList.remove('is-open');
    });
  });
}

const taxonomyDialog = document.getElementById('taxonomy-dialog');
const taxonomyOpenButton = document.getElementById('open-taxonomy');
const taxonomyCloseButton = taxonomyDialog?.querySelector('.taxonomy-close');

taxonomyOpenButton?.addEventListener('click', () => taxonomyDialog?.showModal());
taxonomyCloseButton?.addEventListener('click', () => taxonomyDialog?.close());
taxonomyDialog?.addEventListener('click', (event) => {
  if (event.target === taxonomyDialog) {
    taxonomyDialog.close();
  }
});

const favoritesDialog = document.getElementById('favorites-dialog');
const favoritesOpenButton = document.getElementById('open-favorites');
const favoritesCloseButton = favoritesDialog?.querySelector('.favorites-close');

favoritesOpenButton?.addEventListener('click', () => favoritesDialog?.showModal());
favoritesCloseButton?.addEventListener('click', () => favoritesDialog?.close());
favoritesDialog?.addEventListener('click', (event) => {
  if (event.target === favoritesDialog) {
    favoritesDialog.close();
  }
});

const editorSlides = [
  {
    image: 'images/6.jpg',
    alt: '《鳴鳥不飛》漫畫插畫',
    title: '鳴鳥不飛',
    caption: '沉默之中，仍有無法忽視的心意',
  },
  {
    image: 'images/10.jpg',
    alt: '《被擦掉的初戀》漫畫封面',
    title: '被擦掉的初戀',
    caption: '一塊寫著名字的橡皮擦，讓青澀戀情悄悄開始',
  },
  {
    image: 'images/11.jpg',
    alt: '《同級生》漫畫封面',
    title: '同級生',
    caption: '不同世界的兩個少年，因音樂相遇的青春故事',
  },
];

const editorImage = document.getElementById('editor-image');
const editorWorkTitle = document.getElementById('editor-work-title');
const editorWorkCaption = document.getElementById('editor-work-caption');
const editorSlideNumber = document.getElementById('editor-slide-number');
const editorArt = document.getElementById('editor-art');
const editorSlideCount = document.getElementById('editor-slide-count');
const editorPagination = document.querySelector('.editor-pagination');
const editorSlideButtons = editorPagination ? Array.from(editorPagination.querySelectorAll('button')) : [];
const editorSection = document.getElementById('editor-picks');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentEditorSlide = 0;
let editorAutoplay;

function showEditorSlide(index) {
  if (!editorImage || !editorWorkTitle || !editorWorkCaption || !editorSlideNumber || !editorArt || !editorSlideCount || editorSlideButtons.length !== editorSlides.length) {
    return;
  }

  currentEditorSlide = (index + editorSlides.length) % editorSlides.length;
  const slide = editorSlides[currentEditorSlide];
  editorImage.classList.add('is-changing');
  editorImage.src = slide.image;
  editorImage.alt = slide.alt;
  editorWorkTitle.textContent = slide.title;
  editorWorkCaption.textContent = slide.caption;
  editorSlideNumber.textContent = String(currentEditorSlide + 1).padStart(2, '0');
  editorArt.setAttribute('aria-label', `編輯推薦《${slide.title}》`);
  editorSlideCount.textContent = `${String(currentEditorSlide + 1).padStart(2, '0')} — ${String(editorSlides.length).padStart(2, '0')}`;

  editorSlideButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === currentEditorSlide;
    button.classList.toggle('active', isActive);
    if (isActive) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  });

  window.setTimeout(() => editorImage.classList.remove('is-changing'), 250);
}

function stopEditorAutoplay() {
  if (editorAutoplay) {
    window.clearInterval(editorAutoplay);
    editorAutoplay = undefined;
  }
}

function startEditorAutoplay() {
  stopEditorAutoplay();
  if (!reducedMotion.matches && !document.hidden) {
    editorAutoplay = window.setInterval(() => showEditorSlide(currentEditorSlide + 1), 2000);
  }
}

editorSlideButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    showEditorSlide(index);
    startEditorAutoplay();
  });
});

document.addEventListener('visibilitychange', startEditorAutoplay);
reducedMotion.addEventListener('change', startEditorAutoplay);
showEditorSlide(currentEditorSlide);
startEditorAutoplay();

const workDialog = document.getElementById('work-dialog');
const dialogTitle = document.getElementById('work-dialog-title');
const dialogCover = document.getElementById('dialog-cover');
const dialogDescription = document.getElementById('dialog-description');
const dialogTags = document.getElementById('dialog-tags');
const chapterList = document.getElementById('chapter-list');
const commentList = document.getElementById('comment-list');
const commentEmpty = document.getElementById('comment-empty');
const commentCount = document.getElementById('comment-count');
const commentForm = document.getElementById('comment-form');
const commentName = document.getElementById('comment-name');
const commentMessage = document.getElementById('comment-message');
const commentStatus = document.getElementById('comment-status');
const commentsStorageKey = 'blkoi-comments';
let commentsByWork = new Map();
let commentsLoadFailed = false;
let activeWorkTitle = '';
const commentCountLabels = ['5,000+', '1萬+', '8,000+', '3,000+', '2萬+', '1萬+', '5,000+', '8,000+', '1萬+', '5,000+', '2萬+', '8,000+', '3,000+', '1萬+'];
const sampleCommentMessages = [
  '我已經不是人了。',
  '我的腦子只剩他們兩個。',
  '我宣布今天是我的精神出嫁日。',
  '作者是不是在我腦袋裝監視器？',
  '我看起來很正常，其實已經瘋了。',
  '作者大大什麼時候更新！',
  '蹲下一章',
  '求婚後生活番外！',
  '不夠看，完全不夠看！',
  '這個斷章真的會逼死人',
  '作者你沒有心！',
  '我到底做錯了什麼？',
  '剛剛還在笑，現在哭成狗。',
  '拜託不要再虐他了。',
  '我需要心理諮商',
  '這手！這腰！這腿！',
  '這張臉是犯法的程度。',
  '肩寬腰窄簡直是藝術品。',
  '這個鎖骨我可以研究一整天。',
  '作者的線條功力太可怕了。',
  '他越不正常我越喜歡。',
  '這不是愛情，這是執念',
  '好可怕，但我好愛。',
  '正常人退散，瘋子請上桌',
  '這種瘋批攻我真的沒辦法拒絕',
  '不准看別人！',
  '他絕對吃醋了！',
  '這種佔有慾我可以。',
  '其他男人全部退散！',
  '恨不得把受藏起來。',
  '這個攻根本是披著羊皮的狼。',
  '受真的好會撩。',
  '平常這麼冷淡，遇到受就變狗。',
  '這個反差我真的愛死了。',
  '到底誰馴服誰？',
  '我的思想已經不乾淨了。',
  '這腰真的太犯規了。',
  '請把衣服脫了再談。',
  '作者不要逼我跪下來求你。',
  '我的道德底線正在消失。',
  '作者你懂我們想看什麼吧？',
  '這個氣氛不對勁！',
  '拜託不要停在這裡！',
  '我已經開始腦補了',
  '你們兩個趕快結婚！',
  '這根本是真愛吧！',
  '眼神已經出賣一切了。',
  '這對 CP 我鎖死！',
  '啊啊啊啊啊！',
  '救命！我死了！',
  '我真的受不了了！',
  '這是什麼神仙 CP！',
];
const sampleCommentNames = ['熬夜追漫中', '今天也在蹲更新', '心動觀察員', '嗑到失去理智', '讀者小花', '不想等下一話'];
const sampleCommentReactions = ['🥹', '😭', '😍', '❤️', '(๑˃̵ᴗ˂̵)و', 'இдஇ'];

try {
  const savedComments = localStorage.getItem(commentsStorageKey);
  if (savedComments) {
    const parsedComments = JSON.parse(savedComments);
    if (!parsedComments || typeof parsedComments !== 'object' || Array.isArray(parsedComments)) {
      throw new TypeError('Saved comments must be an object.');
    }

    for (const [title, comments] of Object.entries(parsedComments)) {
      if (!Array.isArray(comments) || !comments.every((comment) =>
        comment && typeof comment.name === 'string' && typeof comment.message === 'string'
      )) {
        throw new TypeError(`Invalid saved comments for "${title}".`);
      }
    }

    commentsByWork = new Map(Object.entries(parsedComments));
  }
} catch (error) {
  console.error('Unable to load saved BLKOI comments.', error);
  commentsLoadFailed = true;
}

let hasNewSampleComments = false;
const workCards = [...document.querySelectorAll('.comic-grid .comic-card, .favorites-grid .favorite-card')];
workCards.forEach((card, workIndex) => {
  const title = card.querySelector('.comic-info h3, .favorite-card h3')?.textContent?.trim();
  const savedWorkComments = title ? commentsByWork.get(title) : undefined;
  if (!title || savedWorkComments?.length) {
    return;
  }

  const shuffledMessages = [...sampleCommentMessages];
  for (let index = shuffledMessages.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledMessages[index], shuffledMessages[randomIndex]] = [shuffledMessages[randomIndex], shuffledMessages[index]];
  }

  const sampleComments = shuffledMessages.slice(0, 8).map((message, index) => ({
    name: sampleCommentNames[Math.floor(Math.random() * sampleCommentNames.length)],
    message: Math.random() < 0.35
      ? `${message} ${sampleCommentReactions[Math.floor(Math.random() * sampleCommentReactions.length)]}`
      : message,
  }));
  commentsByWork.set(title, sampleComments);
  hasNewSampleComments = true;

  if (workIndex >= commentCountLabels.length) {
    console.warn(`No sample comment count configured for "${title}"; using the default count.`);
  }
});

if (hasNewSampleComments && !commentsLoadFailed) {
  try {
    localStorage.setItem(commentsStorageKey, JSON.stringify(Object.fromEntries(commentsByWork)));
  } catch (error) {
    console.error('Unable to save BLKOI sample comments.', error);
    commentsLoadFailed = true;
  }
}

function getCommentCountLabel(title) {
  const workIndex = workCards.findIndex((card) =>
    card.querySelector('.comic-info h3, .favorite-card h3')?.textContent?.trim() === title
  );
  return `${commentCountLabels[workIndex] || '1,000+'} 則留言`;
}

function appendComment(name, message) {
  const item = document.createElement('li');
  item.className = 'comment-item';

  const author = document.createElement('strong');
  author.textContent = name;

  const content = document.createElement('p');
  content.textContent = message;

  item.append(author, content);
  commentList.append(item);
}

function renderComments(title) {
  const comments = commentsByWork.get(title) || [];
  commentList.replaceChildren();
  comments.forEach(({ name, message }) => appendComment(name, message));
  commentCount.textContent = getCommentCountLabel(title);
  commentEmpty.hidden = comments.length > 0;
}

function openWorkDirectory(link) {
  const card = link.closest('.comic-card, .favorite-card');
  const title = card?.querySelector('.comic-info h3, .favorite-card h3')?.textContent?.trim();
  const cover = link.querySelector('img');
  const description = card?.querySelector('.comic-info > p')?.textContent?.trim() || link.dataset.description;

  if (!workDialog || !card || !title || !cover || !description || !dialogTitle || !dialogCover || !dialogDescription || !dialogTags || !chapterList || !commentStatus || !commentForm) {
    return;
  }

  activeWorkTitle = title;
  dialogTitle.textContent = title;
  dialogCover.src = cover.src;
  dialogCover.alt = cover.alt;
  dialogDescription.textContent = description;
  dialogTags.replaceChildren();
  const tags = [...card.querySelectorAll('.tags span')].map((tag) => tag.textContent);
  const favoriteTags = link.dataset.tags?.split('|') || [];
  (tags.length ? tags : favoriteTags).forEach((tag) => {
    const tagElement = document.createElement('span');
    tagElement.textContent = tag;
    dialogTags.append(tagElement);
  });

  chapterList.replaceChildren();
  for (let chapter = 1; chapter <= 8; chapter += 1) {
    const item = document.createElement('li');
    const chapterTitle = document.createElement('span');
    const chapterStatus = document.createElement('small');
    chapterTitle.textContent = `第 ${String(chapter).padStart(2, '0')} 話`;
    chapterStatus.textContent = '目錄示意';
    item.append(chapterTitle, chapterStatus);
    chapterList.append(item);
  }

  commentForm.reset();
  commentStatus.textContent = '';
  renderComments(title);
  if (commentsLoadFailed) {
    commentStatus.textContent = '無法讀取已保存的留言，請檢查瀏覽器儲存空間設定。';
  }
  workDialog.showModal();
}

document.querySelectorAll('.comic-grid .cover-link').forEach((link) => {
  const title = link.closest('.comic-card')?.querySelector('.comic-info h3')?.textContent?.trim();
  const overlay = link.querySelector('.cover-overlay');
  if (title) {
    link.setAttribute('aria-label', `查看《${title}》目錄與留言`);
  }
  if (overlay?.firstChild) {
    overlay.firstChild.textContent = '查看目錄與留言 ';
  }
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openWorkDirectory(link);
  });
});

let returnToFavorites = false;
document.querySelectorAll('.favorites-grid .favorite-open').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    returnToFavorites = Boolean(favoritesDialog?.open);
    if (returnToFavorites) {
      favoritesDialog.close();
    }
    openWorkDirectory(link);
  });
});

workDialog?.querySelector('.dialog-close')?.addEventListener('click', () => workDialog.close());
workDialog?.addEventListener('click', (event) => {
  if (event.target === workDialog) {
    workDialog.close();
  }
});
workDialog?.addEventListener('close', () => {
  if (returnToFavorites && favoritesDialog) {
    returnToFavorites = false;
    favoritesDialog.showModal();
  }
});

commentForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = commentName?.value.trim();
  const message = commentMessage?.value.trim();

  if (!name || !message || !activeWorkTitle) {
    commentStatus.textContent = '請填寫暱稱與留言內容。';
    return;
  }

  const comments = commentsByWork.get(activeWorkTitle) || [];
  const updatedComments = [...comments, { name, message }];
  const updatedCommentsByWork = new Map(commentsByWork);
  updatedCommentsByWork.set(activeWorkTitle, updatedComments);
  try {
    localStorage.setItem(commentsStorageKey, JSON.stringify(Object.fromEntries(updatedCommentsByWork)));
  } catch (error) {
    console.error('Unable to save BLKOI comment.', error);
    commentStatus.textContent = '留言保存失敗，請檢查瀏覽器儲存空間設定後再試。';
    return;
  }

  commentsByWork = updatedCommentsByWork;
  commentsLoadFailed = false;
  appendComment(name, message);
  commentCount.textContent = getCommentCountLabel(activeWorkTitle);
  commentEmpty.hidden = true;
  commentForm.reset();
  commentStatus.textContent = '留言已新增。';
});

const previewPages = [
  {
    image: 'images/12.webp',
    title: '夜畫帳',
    alt: '《夜畫帳》漫畫插畫',
    dialogue: '「有些心意，<br>難以只用畫筆說明。」',
    caption: '《夜畫帳》｜在筆墨之間，藏著難以言說的情意。',
  },
  {
    image: 'images/13.webp',
    title: '水邊之夜',
    alt: '《水邊之夜》漫畫插畫',
    dialogue: '「即使沉默，<br>也想再靠近一點。」',
    caption: '《水邊之夜》｜在交錯的心意裡，一步步靠近彼此。',
  },
  {
    image: 'images/15.webp',
    title: 'FLASH LIGHT',
    alt: '《FLASH LIGHT》漫畫插畫',
    dialogue: '「你出現以後，<br>黑夜也有了光。」',
    caption: '《FLASH LIGHT》｜光影交錯之中，照亮彼此的心意。',
  },
  {
    image: 'images/16.jpg',
    title: '覆血難收',
    alt: '《覆血難收》漫畫插畫',
    dialogue: '「即使知道危險，<br>還是無法移開視線。」',
    caption: '《覆血難收》｜在危險與牽引之間，難以抽身。',
  },
];

const previousButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const previewImage = document.getElementById('preview-image');
const frameNumber = document.getElementById('frame-number');
const frameDialogue = document.getElementById('frame-dialogue');
const pageNumber = document.getElementById('current-page');
const pageCount = document.getElementById('page-count');
const readerCaption = document.getElementById('reader-caption');
const previewWork = document.getElementById('preview-work');
let currentPage = 0;

function showPreviewPage(index) {
  if (!previewPages.length || !previewImage || !frameNumber || !frameDialogue || !pageNumber || !pageCount || !readerCaption || !previewWork || !previousButton || !nextButton) {
    return;
  }

  currentPage = (index + previewPages.length) % previewPages.length;
  const page = previewPages[currentPage];
  previewImage.src = page.image;
  previewImage.alt = `試閱畫格：${page.alt}`;
  previewImage.classList.toggle('fit-contain', page.image === 'images/16.jpg');
  previewWork.textContent = page.title;
  frameNumber.textContent = String(currentPage + 1).padStart(2, '0');
  frameDialogue.innerHTML = page.dialogue;
  pageNumber.textContent = String(currentPage + 1);
  pageCount.textContent = String(currentPage + 1);
  readerCaption.textContent = page.caption;
}

previousButton?.addEventListener('click', () => showPreviewPage(currentPage - 1));
nextButton?.addEventListener('click', () => showPreviewPage(currentPage + 1));
