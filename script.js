// Dados iniciais
const facts = [
  {
    id:1,
    species:"Tubarão-branco",
    title:"Predador ápice com olfato aguçado",
    fact:"O tubarão-branco pode detectar uma gota de sangue em 25 litros de água e sentir vibrações a grandes distâncias.   Pode atingir até 6 metros de comprimento e pesar mais de 2 toneladas.   Tem um olfato tão apurado que consegue detectar uma gota de sangue em grandes volumes de água.  Apesar da fama de “assassino”, ataques a humanos são raros; muitas vezes o tubarão confunde surfistas com focas.   Habita mares temperados e costeiros, retornando sempre às mesmas áreas de alimentação.",
    img:"tubarão-branco.jpg",
    tags:["olfato","predador","grande porte"]
  },
  {
    id:2,
    species:"Tubarão-baleia",
    title:"O maior peixe do mundo",
    fact:"O tubarão-baleia pode ultrapassar 12 metros e se alimenta filtrando plâncton e pequenos peixes.  É o maior peixe do mundo, podendo chegar a 20 metros de comprimento.  Apesar do tamanho, é inofensivo: alimenta-se de plâncton e pequenos peixes. Possui uma coloração única, com manchas brancas que funcionam como camuflagem.  Está ameaçado de extinção devido à pesca predatória e ao turismo descontrolado.",
    img:"tubarão-baleia.jpg",
    tags:["filtrador","plâncton","gigante"]
  },
  {
    id:3,
    species:"Tubarão-martelo",
    title:"Cabeça em forma de martelo",
    fact:"A cabeça em 'T' aumenta a área sensorial, ajudando a localizar presas e a manobrar melhor.  Pode medir até 6 metros, dependendo da espécie. Existem cerca de 10 espécies diferentes de tubarão-martelo.",
    img:"tubarão-martelo.jpg",
    tags:["sensores","maneabilidade","cabeça"]
  },
  {
    id:4,
    species:"Tubarão-tigre",
    title:"Dieta variada",
    fact:"O tubarão-tigre come de tudo: peixes, tartarugas, aves e até lixo marinho, por isso é chamado de 'lixeiro do mar.  É o quarto maior tubarão do planeta e o segundo maior predador. Pode ser encontrado em mares tropicais e temperados em várias partes do mundo. É considerado um dos tubarões mais perigosos para humanos, devido à sua dieta variada.",
    img:"tubarão-tigre.jpg",
    tags:["onívoro","lixo marinho","tigre"]
  },
  {
    id:5,
    species:"Tubarão-lixa",
    title:"Pequeno e resistente",
    fact:"O tubarão-lixa é pequeno, vive em águas rasas e tem pele áspera que o protege de parasitas. Pode viver cerca de 25 anos e atingir até 4 metros de comprimento. É uma espécie calma e pouco agressiva, mas pode reagir se for perturbada. ",
    img:"tubarão-lixa.jpg",
    tags:["rasas","pele","pequeno"]
  }
];

let showingFavorites = false;

const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter');
const randomBtn = document.getElementById('randomBtn');
const showFavsBtn = document.getElementById('showFavs');
const modalBack = document.getElementById('modalBack');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalFact = document.getElementById('modalFact');
const modalTags = document.getElementById('modalTags');
const modalClose = document.getElementById('modalClose');

const favKey = 'shark_favs_v1';
function getFavs(){ try { return JSON.parse(localStorage.getItem(favKey)) || []; } catch(e){ return []; } }
function toggleFav(id){
  const favs = getFavs();
  const idx = favs.indexOf(id);
  if(idx === -1) favs.push(id); else favs.splice(idx,1);
  localStorage.setItem(favKey, JSON.stringify(favs));
  render();
}
function isFav(id){ return getFavs().includes(id); }

function populateFilter(){
  const species = Array.from(new Set(facts.map(f=>f.species))).sort();
  species.forEach(s=>{
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    filterEl.appendChild(opt);
  });
}

function render(){
  const q = searchEl.value.trim().toLowerCase();
  const sel = filterEl.value;
  const favs = getFavs();

  let data = facts.filter(f=>{
    if(showingFavorites && !favs.includes(f.id)) return false;
    if(sel !== 'all' && f.species !== sel) return false;
    if(!q) return true;
    return (f.title + ' ' + f.fact + ' ' + f.species + ' ' + f.tags.join(' ')).toLowerCase().includes(q);
  });

  listEl.innerHTML = '';
  if(data.length === 0){
    const empty = document.createElement('div');
    empty.style.gridColumn = '1/-1';
    empty.style.padding = '28px';
    empty.style.textAlign = 'center';
    empty.innerHTML = `<div style="color:var(--muted)">Nenhum resultado encontrado.</div>`;
    listEl.appendChild(empty);
    return;
  }

  data.forEach(item=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('aria-labelledby','title-'+item.id);

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.species + ' - ' + item.title;
    thumb.appendChild(img);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const species = document.createElement('div');
    species.innerHTML = `<div class="species" id="title-${item.id}">${item.species}</div><div class="muted">${item.title}</div>`;
    const actions = document.createElement('div');
    actions.className = 'actions';

    const favBtn = document.createElement('button');
    favBtn.className = 'icon-btn fav';
    if(isFav(item.id)) favBtn.classList.add('active');
    favBtn.title = 'Favoritar';
    favBtn.innerHTML = isFav(item.id) ? '★' : '☆';
    favBtn.onclick = (e)=>{ e.stopPropagation(); toggleFav(item.id); };

    const moreBtn = document.createElement('button');
    moreBtn.className = 'icon-btn';
    moreBtn.textContent = 'Ver';
    moreBtn.onclick = ()=> openModal(item);

    actions.appendChild(favBtn);
    actions.appendChild(moreBtn);
    meta.appendChild(species);
    meta.appendChild(actions);

    const factP = document.createElement('p');
    factP.className = 'fact';
    factP.textContent = item.fact;

    card.appendChild(thumb);
    card.appendChild(meta);
    card.appendChild(factP);

    card.onclick = ()=> openModal(item);

    listEl.appendChild(card);
  });
}

function openModal(item){
  modalImg.innerHTML = '';
  const img = document.createElement('img');
  img.src = item.img;
  img.alt = item.species;
  img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
  modalImg.appendChild(img);

  modalTitle.textContent = item.species + ' — ' + item.title;
  modalFact.textContent = item.fact;
  modalTags.innerHTML = '';
  item.tags.forEach(t=>{
    const span = document.createElement('div');
    span.className = 'tag';
    span.textContent = t;
    modalTags.appendChild(span);
  });

  modalBack.style.display = 'flex';
}
modalClose.onclick = ()=> modalBack.style.display = 'none';
modalBack.onclick = (e)=> { if(e.target === modalBack) modalBack.style.display = 'none'; };

randomBtn.addEventListener('click', ()=>{
  const pool = showingFavorites ? facts.filter(f=>isFav(f.id)) : facts;
  if(pool.length === 0){ alert('Nenhum fato disponível para mostrar.'); return; }
  const item = pool[Math.floor(Math.random()*pool.length)];
  openModal(item);
});

showFavsBtn.addEventListener('click', ()=>{
  showingFavorites = !showingFavorites;
  showFavsBtn.textContent = showingFavorites ? 'Mostrar todos' : 'Favoritos';
  showFavsBtn.style.background = showingFavorites ? '#00b4d8' : '#ffb703';
  render();
});

searchEl.addEventListener('input', ()=> render());
filterEl.addEventListener('change', ()=> render());

populateFilter();
render();

document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') modalBack.style.display = 'none'; });
