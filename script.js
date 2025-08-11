// 日付チップを生成（今日から21日分）
const dateGrid = document.getElementById('dateGrid');
const stickyBar = document.getElementById('stickyBar');
const selectedCount = document.getElementById('selectedCount');
const submitPublish = document.getElementById('submitPublish');
const clearSelection = document.getElementById('clearSelection');
const publishStatus = document.getElementById('publishStatus');
const lockOverlay = document.getElementById('lockOverlay');
const registerPanel = document.getElementById('registerPanel');
const openRegister = document.getElementById('openRegister');
const withdraw = document.getElementById('withdraw');
const toast = document.getElementById('toast');

const inviteButton = document.getElementById('inviteButton');
const inviteModal = document.getElementById('inviteModal');

function fmt(d) {
  return `${d.getMonth()+1}/${d.getDate()}`;
}
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

let selected = new Set();

function buildDates() {
  dateGrid.innerHTML = '';
  const today = new Date(); today.setHours(0,0,0,0);
  for (let i=0; i<21; i++) {
    const d = new Date(today); d.setDate(today.getDate()+i);
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.type = 'button';
    chip.setAttribute('role','option');
    chip.dataset.key = d.toISOString().slice(0,10);
    chip.textContent = fmt(d);

    // 過去日は無効（本日より前のみ）
    const isPast = d < today;
    if (isPast) {
      chip.setAttribute('aria-disabled','true');
    }

    chip.addEventListener('click', () => {
      if (chip.getAttribute('aria-disabled') === 'true') return;
      const key = chip.dataset.key;
      if (selected.has(key)) {
        selected.delete(key);
        chip.classList.remove('selected');
      } else {
        selected.add(key);
        chip.classList.add('selected');
      }
      updateSticky();
    });

    dateGrid.appendChild(chip);
  }
}

function updateSticky() {
  const count = selected.size;
  selectedCount.textContent = count;
  if (count > 0) {
    stickyBar.classList.remove('hidden');
    submitPublish.disabled = false;
  } else {
    submitPublish.disabled = true;
  }
}

openRegister.addEventListener('click', () => {
  registerPanel.classList.remove('hidden');
  showToast('登録対象の日付を選んでください');
});

clearSelection.addEventListener('click', () => {
  selected.clear();
  document.querySelectorAll('.chip.selected').forEach(el => el.classList.remove('selected'));
  updateSticky();
});

submitPublish.addEventListener('click', () => {
  if (selected.size === 0) return;
  // 「公開中」に変更し、ロックを解除
  publishStatus.textContent = '公開中';
  publishStatus.classList.add('on');
  lockOverlay.style.display = 'none';

  // リセット
  selected.clear();
  document.querySelectorAll('.chip.selected').forEach(el => el.classList.remove('selected'));
  updateSticky();

  showToast('公開しました');
});

withdraw.addEventListener('click', () => {
  // 「辞退する」押下で未登録に戻す想定
  publishStatus.textContent = '未登録';
  lockOverlay.style.display = '';
  showToast('辞退しました（未登録に戻しました）');
});

inviteButton.addEventListener('click', () => {
  if (typeof inviteModal.showModal === 'function') {
    inviteModal.showModal();
  } else {
    alert('現在は説明のみです。次のステップで有効化します。');
  }
});

buildDates();
updateSticky();
