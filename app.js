(function () {
  // 1. Define the available module paths
  const modulePaths = {
    '1.6': 'modules/module1.6.js',
    '1.7': 'modules/module1.7.js'
  };

  // 2. Check the URL for a selected module (default to 1.6)
  const urlParams = new URLSearchParams(window.location.search);
  const currentMod = urlParams.get('mod') || '1.6';

  // 3. Dynamically load the selected script file
  const script = document.createElement('script');
  script.src = modulePaths[currentMod];
  
  // 4. Wait for the data to load before building the slides
  script.onload = () => {
    initApp();
  };
  
  script.onerror = () => {
    document.getElementById('dynamic-slides').innerHTML = '<div style="color:white; text-align:center; margin-top:20vh; font-family:monospace; font-size:24px;">Error: Module data not found.</div>';
  };
  
  document.head.appendChild(script);

  // --- EXISTING LOGIC WRAPPED IN A FUNCTION ---
  function initApp() {
    // NOTE: Make sure your module1.6.js and module1.7.js files define 
    // the variable globally as: var slideConfigs = [ ... ];
    // DO NOT use "const" or "let" in the module files if they are in the global scope.

    function buildTerm(lines) {
      return lines.map(l => {
        if (l.editor) {
          const escapedCode = l.code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          return '<div class="term-line"><span class="out" style="color:#E8A07A">Opening nano...</span></div><div class="editor-ui"><span class="editor-header">  GNU nano 6.2           ' + l.editor + '</span><pre class="editor-code">' + escapedCode + '</pre></div>';
        }
        if (l.p) return '<div class="term-line"><span class="prompt"><span class="user">ajsacay@dorsu</span>:<span class="path">' + l.p + '</span>$</span> <span class="cmd">' + (l.c || '') + '</span></div>';
        if (l.o) return '<div class="term-line"><span class="out">' + l.o + '</span></div>';
        if (l.e) return '<div class="term-line"><span class="err">' + l.e + '</span></div>';
        if (l.raw) return '<div class="term-line"><span class="out">' + l.raw + '</span></div>';
        return '<div class="term-line">' + (l.raw || '') + '</div>';
      }).join('');
    }

    let slidesHtml = '';
    
    slideConfigs.forEach((config, idx) => {
      // Create a display number for the bottom right corner
      const displayNum = String(idx + 1).padStart(2, '0') + ' / ' + String(slideConfigs.length).padStart(2, '0');

      if (config.type === 'cover') {
        slidesHtml += `
          <section class="slide cover">
            <div class="topbar">
              <span><span class="dot"></span>ITP 141 · SYSTEMS ADMINISTRATION & MAINTENANCE</span>
              <!-- The dropdown is now injected directly into the Cover's topbar -->
              <select id="module-selector" class="module-selector" aria-label="Select Module">
                <option value="1.6" ${currentMod === '1.6' ? 'selected' : ''}>Topic 06: Dual-OS Part 1</option>
                <option value="1.7" ${currentMod === '1.7' ? 'selected' : ''}>Topic 07: Dual-OS Part 2</option>
              </select>
            </div>
            <div class="content">
              <div class="cover-left">
                <div><div class="tag">Lecture Notes · Lab Session</div><h1>${config.title}</h1><p class="sub">${config.subtitle}</p></div>
                <div>
                  <div class="cover-meta"><div><span>Course</span><strong>ITP 141</strong></div><div><span>Credit Hours</span><strong>3 Units</strong></div><div><span>Program</span><strong>BS Information Technology</strong></div><div><span>Institution</span><strong>Davao Oriental State University</strong></div></div>
                  <div style="display:flex;align-items:center;gap:20px;margin-top:40px"><div style="width:60px;height:60px;border-radius:50%;border:2px solid var(--ink);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-style:italic;font-size:24px">A</div><div style="font-family:'Fraunces',serif;font-size:24px;line-height:1.2">Ar-Jay R. Sacay<span style="display:block;font-family:'JetBrains Mono',monospace;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mute);margin-top:4px">Faculty · Course Instructor</span></div></div>
                </div>
              </div>
              <div class="cover-right">
                <div class="label">Topic ${config.topicNum} of the Module</div><div class="module-num">${config.topicNum}<sup>${config.topicTag}</sup></div>
                <div class="topic">${config.graphicText}</div>
                <div class="objectives-mini">
                  ${config.miniObjectives.map(obj => `<div>${obj}</div>`).join('')}
                </div>
              </div>
            </div>
            <div class="footbar"><span>DAVAO ORIENTAL STATE UNIVERSITY</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'objectives') {
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>OBJECTIVES</span></div>
            <div class="content">
              <div class="obj-grid">
                <div class="obj-left"><div><div class="tag" style="color:var(--mute)"><span style="background:var(--mute);width:24px;height:2px;display:inline-block;margin-right:12px"></span>By the end of this topic</div><h2>What you<br>will be <em>able</em><br>to do.</h2><p class="desc">${config.desc}</p></div><div class="eyebrow">${config.kicker}</div></div>
                <div class="obj-right">
                  <div class="lede">${config.lede}</div>
                  <div class="obj-list">
                    ${config.list.map((item, i) => `<div class="obj-item"><div class="num">${String(i + 1).padStart(2, '0')}</div><p>${item}</p></div>`).join('')}
                  </div>
                </div>
              </div>
            </div>
            <div class="footbar"><span>OBJECTIVES · ITP 141</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'closing') {
        slidesHtml += `
          <section class="slide closing">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>CLOSING</span></div>
            <div class="content">
              <div><div class="tag">${config.tag}</div><h2>${config.title}</h2></div>
              <div class="summary">
                <div class="sum-card"><div class="n">${config.leftCardNum}</div><h4>${config.leftCardTitle}</h4><p>${config.leftCardDesc}</p></div>
                <div class="sum-card"><div class="n">${config.rightCardNum}</div><h4>${config.rightCardTitle}</h4><p>${config.rightCardDesc}</p></div>
              </div>
              <div class="footrow">
                <div class="left">"The dual-OS environment is the sysadmin's laboratory. Master both, and you can deploy anything, anywhere."</div>
                <div class="right"><div class="name">Ar-Jay R. Sacay</div><div class="role">Faculty · ITP 141 · BS Information Technology</div></div>
              </div>
            </div>
            <div class="footbar"><span>${config.tag.toUpperCase()}</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'lesson') {
        // --- THIS IS YOUR EXISTING LESSON HTML LOGIC ---
        const titleParts = config.title.split(":");
        const titleMain = titleParts[0];
        const titleSub = titleParts[1] || '';
        const flagsHtml = config.flags ? '<div class="flag-list">' + config.flags.map(f => '<div class="flag-item"><code>' + f.f + '</code><span><strong>' + f.s + '</strong>' + f.d + '</span></div>').join('') + '</div>' : '';
        
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>MODULE 01 · DUAL-OS INSTALL</span><span>${config.title.toUpperCase()}</span></div>
            <div class="content">
              <div class="cmd-head">
                <div class="left"><div class="tag">${config.category}</div><h2>${titleMain} <em>· ${titleSub}</em></h2></div>
                <div class="right"><div class="range">${displayNum}</div></div>
              </div>
              <div class="cmd-slide-content">
                <div class="cmd-left">
                  <div class="cmd-hero">
                    <div class="cmd-desc">${config.desc}</div>
                    <div class="cmd-syntax">${config.syntax}</div>
                    ${flagsHtml}
                    <div class="cmd-explain">${config.explain || ''}</div>
                  </div>
                </div>
                <div class="cmd-right">
                  <div class="terminal-mock">
                    <div class="terminal-header"><div class="dots"><span></span><span></span><span></span></div>bash -- 80x24</div>
                    <div class="terminal-body">
                      ${buildTerm(config.term)}
                      <div class="term-line"><span class="prompt"><span class="user">ajsacay@dorsu</span>:<span class="path">~</span>$</span> <span class="cursor"></span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="footbar"><span>§ DUAL-OS INSTALL</span><span class="pagenum">${displayNum}</span></div>
          </section>`;
      }
    });

    // Inject all slides into the new container
    document.getElementById('slide-container').innerHTML = slidesHtml;

    // --- ATTACH DROPDOWN LISTENER HERE ---
    const selector = document.getElementById('module-selector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        window.location.href = `?mod=${e.target.value}`;
      });
    }

  // --- Navigation Logic ---
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const counter = document.getElementById('slideCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  slides.forEach((slide, i) => {
    const pageNum = slide.querySelector('.pagenum');
    if (pageNum) pageNum.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0');
  });

  function scalePresentation() {
    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if (w === 0 || h === 0) return;
    var scale = Math.min(w / 1920, h / 1080);
    slides.forEach(function(slide) { slide.style.transform = 'translate(-50%, -50%) scale(' + scale + ')'; });
  }
  
  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    slides.forEach((slide, i) => { slide.classList.toggle('active', i === index); });
    currentSlide = index;
    updateCounter();
  }

  function changeSlide(direction) { showSlide(currentSlide + direction); }

  function updateCounter() {
    counter.textContent = String(currentSlide + 1).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0');
    prevBtn.disabled = (currentSlide === 0);
    nextBtn.disabled = (currentSlide === totalSlides - 1);
  }

  // Attach event listeners
  prevBtn.addEventListener('click', () => changeSlide(-1));
  nextBtn.addEventListener('click', () => changeSlide(1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); changeSlide(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); changeSlide(-1); }
  });

  let touchStartX = 0, touchEndX = 0;
  const swipeThreshold = 50;
  document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - swipeThreshold) changeSlide(1);
      if (touchEndX > touchStartX + swipeThreshold) changeSlide(-1);
  }, { passive: true });

  scalePresentation();
  showSlide(0);
  window.addEventListener('resize', scalePresentation);
  }
})();
