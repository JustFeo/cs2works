/* ==============================================================
   Custom “Preview with…” dropdown
   -------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* -------- 0. locate the original <select> ------------------- */
  const realSelect = document.getElementById('extraSelect');
  if (!realSelect) { console.warn('[custom-select] #extraSelect missing'); return; }

  /* -------- 1. hide it, keep it in the form ------------------- */
  realSelect.style.display = 'none';

  /* -------- 2. create fake pill ------------------------------- */
  const fake = document.createElement('div');
  fake.id = 'previewFake';
  fake.textContent = realSelect.options[realSelect.selectedIndex].textContent || 'Preview with…';

  /* pill style */
  Object.assign(fake.style, {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
    minWidth: '16rem', height: '2.5rem', padding: '0 1.25rem',
    border: '1px solid #b3b3b3', borderRadius: '2rem', cursor: 'pointer',
    background: '#fff', font: '400 15px/1.2 var(--font-body-primary, sans-serif)'
  });
  /* arrow */
  const arrow = document.createElement('span');
  arrow.textContent = '▼';
  arrow.style.fontSize = '.6rem';
  arrow.style.marginLeft = '.5rem';
  fake.append(arrow);

  /* -------- 3. build the list --------------------------------- */
  const list = document.createElement('ul');
  list.id = 'previewList';
  Object.assign(list.style, {
    position: 'absolute', maxHeight: '16rem', overflow: 'auto',
    marginTop: '.25rem', minWidth: '16rem', listStyle: 'none', padding: '0',
    border: '1px solid #b3b3b3', borderRadius: '.75rem', background: '#fff',
    zIndex: '9998', boxShadow: '0 8px 20px rgba(0,0,0,.08)', display: 'none'
  });

  [...realSelect.options].forEach(opt => {
    if (opt.disabled) return;            // skip the “Preview with…” placeholder
    const li = document.createElement('li');
    li.textContent = opt.textContent;
    li.dataset.value = opt.value;
    Object.assign(li.style, { padding: '.55rem 1.25rem', cursor: 'pointer', whiteSpace: 'nowrap' });
    li.onmouseenter = () => li.style.background = '#f5f5f5';
    li.onmouseleave = () => li.style.background = '';
    li.onclick = () => {
      /* 1. update the hidden <select> so your preview script fires */
      realSelect.value = opt.value;
      realSelect.dispatchEvent(new Event('change'));

      /* 2. update the pill label */
      fake.childNodes[0].textContent = opt.textContent;

      /* 3. close menu */
      list.style.display = 'none';
    };
    list.appendChild(li);
  });

  /* -------- 4. insert into DOM -------------------------------- */
  realSelect.parentNode.insertBefore(fake, realSelect.nextSibling);
  realSelect.parentNode.insertBefore(list, fake.nextSibling);

  /* -------- 5. toggle behaviour ------------------------------- */
  fake.onclick = (e) => {
    e.stopPropagation();
    list.style.display = list.style.display === 'block' ? 'none' : 'block';
  };
  document.addEventListener('click', () => list.style.display = 'none');
});
