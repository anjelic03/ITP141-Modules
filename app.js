(function () {
  // 1. Define the available module paths
  const modulePaths = {
    '1.1': 'modules/module1.1.js',
    '1.6': 'modules/module1.6.js',
    '1.7': 'modules/module1.7.js',
    '4.12': 'modules/module4.12.js'
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
      const displayNum = String(idx + 1).padStart(2, '0') + ' / ' + String(slideConfigs.length).padStart(2, '0');

      if (config.type === 'cover') {
        slidesHtml += `
          <section class="slide cover">
            <div class="topbar">
              <span><span class="dot"></span>ITP 141 · SYSTEMS ADMINISTRATION & MAINTENANCE</span>
              <select id="module-selector" class="module-selector" aria-label="Select Module">
                <option value="1.1" ${currentMod === '1.1' ? 'selected' : ''}>Topic 01: Foundations</option>
                <option value="1.6" ${currentMod === '1.6' ? 'selected' : ''}>Topic 06: Dual-OS Part 1</option>
                <option value="1.7" ${currentMod === '1.7' ? 'selected' : ''}>Topic 07: Dual-OS Part 2</option>
                <option value="4.12" ${currentMod === '4.12' ? 'selected' : ''}>Topic 12: Security, Hardening & Compliance</option>
              </select>
            </div>
            <div class="content">
              <div class="cover-left">
                <div><div class="tag">Lecture Notes · Module 01</div><h1>${config.title}</h1><p class="sub">${config.subtitle}</p></div>
                <div>
                  <div class="cover-meta"><div><span>Course</span><strong>ITP 141</strong></div><div><span>Credit Hours</span><strong>3 Units</strong></div><div><span>Program</span><strong>BS Information Technology</strong></div><div><span>Institution</span><strong>Davao Oriental State University</strong></div></div>
                  <div class="faculty-stamp"><div class="seal">A</div><div class="name">Ar-Jay R. Sacay<span>Faculty · Course Instructor</span></div></div>
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
                <div class="obj-left"><div><div class="tag lite">By the end of this topic</div><h2>What you<br>will be <em>able</em><br>to do.</h2><p class="desc">${config.desc}</p></div><div class="eyebrow">${config.kicker}</div></div>
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

      } else if (config.type === 'scope') {
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>SCOPE</span></div>
            <div class="content">
              <div class="scope-head"><div><div class="tag">In this topic</div><h2>${config.title}</h2></div><div class="eyebrow">${config.kicker}</div></div>
              <div class="topic-grid">
                ${config.topics.map(t => `
                  <div class="topic-cell">
                    <div class="topic-no">${t.no}</div>
                    <div class="tag lite" style="margin-top:16px">${t.tag}</div>
                    <h3>${t.title}</h3>
                    <p class="desc">${t.desc}</p>
                    <div class="points">${t.pts.map(p => `<div>${p}</div>`).join('')}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="footbar"><span>SCOPE · TOPIC 01</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'orientation') {
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>ORIENTATION</span></div>
            <div class="content">
              <div class="orient">
                <div class="orient-left">
                  <div class="tag">Module orientation</div><h2>${config.title}</h2>
                  <p class="lede">${config.lede}</p>
                  <p class="desc">${config.desc}</p>
                  <div class="anchor-list"><div class="label">Anchored in local practice</div><ul>${config.anchors.map(a => `<li>${a}</li>`).join('')}</ul></div>
                </div>
                <div class="orient-right">
                  <div class="timeline-box"><div class="label">One minute in a DOrSU lab</div><h4>${config.boxTitle}</h4><p>${config.boxDesc}</p></div>
                  <div class="stat-grid">${config.stats.map(s => `<div class="stat-cell"><div class="n">${s.n}</div><div class="l">${s.l}</div></div>`).join('')}</div>
                  <div style="border:1px solid var(--rule);padding:30px 36px;background:var(--paper-2)"><div class="tag" style="color:var(--moss);margin-bottom:16px"><span style="background:var(--moss)"></span>The standard</div><p style="font-family:'Fraunces',serif;font-size:22px;line-height:1.45;color:#2a221b">${config.standard}</p></div>
                </div>
              </div>
            </div>
            <div class="footbar"><span>ORIENTATION</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'roles') {
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>SYSADMIN ROLES & LIFECYCLE</span></div>
            <div class="content">
              <div class="section-head"><div class="big-num">${config.bigNum}</div><div><h2>${config.title}</h2><div class="sub">${config.sub}</div></div></div>
              <div class="roles-grid">
                <div>
                  <div class="tag lite" style="margin-bottom:20px">Core responsibilities</div>
                  <div class="roles-list">
                    ${config.roles.map(r => `<div class="role"><div class="n">${r.n}</div><div><h4>${r.title}</h4><p>${r.desc}</p></div></div>`).join('')}
                  </div>
                </div>
                <div style="display:flex;flex-direction:column">
                  <div class="tag lite" style="margin-bottom:20px">The system lifecycle</div>
                  <div class="lifecycle">
                    <h3>From a boxed machine to a retired one.</h3>
                    ${config.stages.map(st => `<div class="lc-stage"><div class="stage-n">${st.n}</div><div class="body"><strong>${st.title}</strong><p>${st.desc}</p></div></div>`).join('')}
                  </div>
                  <div class="roles-skill"><div class="tag">Skill profile</div><p>${config.skillText}</p></div>
                </div>
              </div>
            </div>
            <div class="footbar"><span>§ ROLES & LIFECYCLE</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'cligui') {
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>CLI vs GUI</span></div>
            <div class="content">
              <div class="section-head"><div class="big-num">${config.bigNum}</div><div><h2>${config.title}</h2><div class="sub">${config.sub}</div></div></div>
              <div class="cli-grid">
                <div class="cli-side cli">
                  <div class="label">Command-Line Interface · CLI</div><h3>The terminal.</h3><p class="desc">A text-only interface. The user types a command, presses Enter, and the shell interprets it. Every action is explicit, scriptable, and reproducible.</p>
                  <div class="term-cli">
                    <div class="term-line"><span class="prompt"><span class="user">ajsacay@dorsu</span>:<span class="path">~</span>$</span> <span class="cmd">sudo apt update</span></div>
                    <div class="term-line"><span class="out">Hit:1 http://archive.ubuntu.com jammy InRelease</span></div>
                    <div class="term-line"><span class="out">Reading package lists... Done</span></div>
                  </div>
                </div>
                <div class="cli-side gui">
                  <div class="label">Graphical User Interface · GUI</div><h3>The desktop.</h3><p class="desc">A pointer-driven interface of windows, menus, and icons. Friendly for new users, indispensable for graphics work — but slow for repetition.</p>
                  <div class="gui-mock">
                    <div class="bar"><span></span><span></span><span></span><span style="margin-left:20px;font-size:14px;font-family:'JetBrains Mono',monospace;color:#666">Software Updater</span></div>
                    <div class="gui-content"><strong>42 updates available</strong><span>Click "Install Now" to update your system.</span><div class="gui-buttons"><button class="primary">Install Now</button><button class="secondary">Remind Me Later</button></div></div>
                  </div>
                </div>
              </div>
              <div class="compare-rows">
                <div class="h row-label">Criterion</div><div class="h cli-h">CLI</div><div class="h">GUI</div>
                <div class="row-label">Speed of repetition</div><div>Fast — commands chain with &&, scripts repeat</div><div>Slow — each click must be re-performed</div>
                <div class="row-label">Remote over SSH</div><div>Native — works over any bandwidth</div><div>Poor — needs X forwarding or VNC</div>
                <div class="row-label">Scriptability</div><div>First-class — bash, awk, sed, pipes</div><div>Limited — GUI automation is brittle</div>
                <div class="row-label">Precision</div><div>Exact — every flag is explicit</div><div>Implicit — dialogs hide options</div>
              </div>
            </div>
            <div class="footbar"><span>§ CLI vs GUI</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'history') {
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>LINUX & ITS HISTORY</span></div>
            <div class="content">
              <div class="section-head"><div class="big-num">${config.bigNum}</div><div><h2>${config.title}</h2><div class="sub">${config.sub}</div></div></div>
              <div class="history-grid">
                <div class="hist-left">
                  <h3>An operating system written by a student, given freely to the world.</h3>
                  <p>${config.historyText}</p>
                  <div class="quote">${config.quote}<cite>${config.quoteCite}</cite></div>
                </div>
                <div class="timeline">
                  ${config.timeline.map(tl => `<div class="tl-item"><div class="yr">${tl.yr}</div><h4>${tl.title}</h4><p>${tl.desc}</p></div>`).join('')}
                </div>
              </div>
            </div>
            <div class="footbar"><span>§ LINUX & ITS HISTORY</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'linuxunix') {
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>LINUX vs UNIX</span></div>
            <div class="content">
              <div class="section-head"><div class="big-num">${config.bigNum}</div><div><h2>${config.title}</h2><div class="sub">${config.sub}</div></div></div>
              <div class="vs-grid">
                <div class="vs-col unix"><div class="label">Proprietary UNIX</div><h3>UNIX</h3><p class="desc">A family of multi-user operating systems descended from the original 1969 AT&amp;T codebase.</p><ul><li>Source code historically proprietary</li><li>Certified to the Single UNIX Specification</li><li>Kernel maintained by a single vendor</li><li>Ships on vendor hardware (IBM POWER, SPARC)</li><li>macOS Darwin is the most widely used UNIX today</li></ul></div>
                <div class="vs-divider"><span>vs</span></div>
                <div class="vs-col linux"><div class="label">The Linux kernel</div><h3>Linux</h3><p class="desc">A free, open-source kernel that, combined with GNU tools, forms an operating system that behaves like UNIX.</p><ul><li>Released under GPL v2 — free to use, modify, redistribute</li><li>Not certified; "UNIX-like" or "POSIX-compliant"</li><li>Kernel maintained by a global community led by Torvalds</li><li>Runs on virtually every architecture</li><li>Dominates servers, supercomputers, mobile, and cloud</li></ul></div>
              </div>
            </div>
            <div class="footbar"><span>§ LINUX vs UNIX</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'distros') {
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>DISTRIBUTIONS & PACKAGE MANAGEMENT</span></div>
            <div class="content">
              <div class="section-head"><div class="big-num">${config.bigNum}</div><div><h2>${config.title}</h2><div class="sub">${config.sub}</div></div></div>
              <div class="distros-grid">
                <div class="distro"><div class="fam">Family · Debian</div><h4>Debian</h4><div class="based">apt · .deb</div><p>The oldest community distribution. Renowned for stability; the basis of Ubuntu and dozens of derivatives.</p><div class="examples"><strong>Examples</strong>Debian, Ubuntu, Mint, Kali</div></div>
                <div class="distro"><div class="fam">Family · Red Hat</div><h4>Red Hat</h4><div class="based">dnf / yum · .rpm</div><p>The enterprise lineage. Source of RPM packaging and the ancestor of CentOS, Fedora and RHEL.</p><div class="examples"><strong>Examples</strong>RHEL, Fedora, Rocky, Alma</div></div>
                <div class="distro"><div class="fam">Family · Arch</div><h4>Arch</h4><div class="based">pacman · .pkg.tar.zst</div><p>A rolling-release, do-it-yourself distribution. Lightweight, current, and the foundation of Manjaro.</p><div class="examples"><strong>Examples</strong>Arch, Manjaro, EndeavourOS</div></div>
                <div class="distro"><div class="fam">Family · SUSE</div><h4>SUSE</h4><div class="based">zypper · .rpm</div><p>The European enterprise lineage. Maintains openSUSE and SLES — strong in enterprise and SAP.</p><div class="examples"><strong>Examples</strong>openSUSE Leap, Tumbleweed, SLES</div></div>
              </div>
            </div>
            <div class="footbar"><span>§ DISTROS & PACKAGES</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'filesystem') {
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>LINUX FILESYSTEM HIERARCHY</span></div>
            <div class="content">
              <div class="section-head"><div class="big-num">${config.bigNum}</div><div><h2>${config.title}</h2><div class="sub">${config.sub}</div></div></div>
              <div class="fs-grid">
                <div><div class="fs-tree"><div class="root">/</div><div><span class="branch">├──</span> <span class="dir">bin</span>      <span class="comment"># essential user binaries</span></div><div><span class="branch">├──</span> <span class="dir">boot</span>     <span class="comment"># kernel &amp; bootloader</span></div><div><span class="branch">├──</span> <span class="dir">etc</span>      <span class="comment"># system configuration</span></div><div><span class="branch">├──</span> <span class="dir">home</span>     <span class="comment"># user directories</span></div><div><span class="branch">└──</span> <span class="dir">var</span>      <span class="comment"># variable data, logs</span></div></div></div>
                <div class="fs-desc">
                  <h3>What each directory is for.</h3>
                  <div class="fs-row"><div class="path">/bin</div><div class="desc">Essential user binaries — <code>ls</code>, <code>cat</code>, <code>cp</code>.</div></div>
                  <div class="fs-row"><div class="path">/etc</div><div class="desc">System-wide configuration files — plain text.</div></div>
                  <div class="fs-row"><div class="path">/home</div><div class="desc">Personal directories for ordinary users.</div></div>
                  <div class="fs-row"><div class="path">/var</div><div class="desc">Variable data: logs, mail spools, databases.</div></div>
                </div>
              </div>
            </div>
            <div class="footbar"><span>§ FILESYSTEM HIERARCHY</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'lesson') {
        const range = `${String(idx + 1).padStart(2, '0')} / ${String(slideConfigs.length).padStart(2, '0')}`;
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>MODULE 01 · TOPIC ${currentMod === '1.6' ? '06' : '07'}</span><span>${config.category.toUpperCase()}</span></div>
            <div class="content">
              <div class="lesson-head">
                <div class="left"><div class="tag">${config.category}</div><h2>${config.title} <em>· ${config.subtitle}</em></h2></div>
                <div class="right"><div class="range">${range}</div><div class="label" style="font-family:'JetBrains Mono',monospace;font-size:14px;color:var(--mute)">Slide</div></div>
              </div>
              <div class="lesson-grid">
                <div class="lesson-left">
                  <div class="lesson-hero">
                    <div class="num">${config.subtitle}</div>
                    <div class="lesson-title">${config.title}</div>
                    <div class="lesson-cat">${config.category}</div>
                    <div class="lesson-desc">${config.desc}</div>
                    ${config.syntax ? `<div class="lesson-syntax">${config.syntax}</div>` : ''}
                    ${config.explain ? `<div class="lesson-explain">${config.explain}</div>` : ''}
                  </div>
                </div>
                <div class="lesson-right">
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
            <div class="footbar"><span>§ LESSON CONTENT</span><span class="pagenum">${displayNum}</span></div>
          </section>`;
          
      } else if (config.type === 'commandBasic') {
        const cmd = config.cmd;
        const range = `${String(config.index + 1).padStart(2, '0')} / 35`;
        const num = String(config.index + 1).padStart(2, '0');
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>MODULE 01 · TOPIC 01</span><span>LINUX ESSENTIALS · ${cmd.cat.toUpperCase()}</span></div>
            <div class="content">
              <div class="cmd-head">
                <div class="left"><div class="tag">${cmd.cat}</div><h2>${cmd.name} <em>· Basic Usage</em></h2></div>
                <div class="right"><div class="range">${range}</div><div class="label">${cmd.name}</div></div>
              </div>
              <div class="cmd-slide-content">
                <div class="cmd-left">
                  <div class="cmd-hero">
                    <div class="num">Command ${num}</div>
                    <div class="cmd-name">${cmd.name}</div>
                    <div class="cmd-cat">${cmd.basicTitle}</div>
                    <div class="cmd-desc">${cmd.basicDesc}</div>
                    <div class="cmd-syntax">${cmd.syntax}</div>
                  </div>
                </div>
                <div class="cmd-right">
                  <div class="terminal-mock">
                    <div class="terminal-header"><div class="dots"><span></span><span></span><span></span></div>bash -- 80x24</div>
                    <div class="terminal-body">
                      ${buildTerm(cmd.basicTerm)}
                      <div class="term-line"><span class="prompt"><span class="user">ajsacay@dorsu</span>:<span class="path">~</span>$</span> <span class="cursor"></span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="footbar"><span>§ 35 COMMANDS</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'commandAdv') {
        const cmd = config.cmd;
        const range = `${String(config.index + 1).padStart(2, '0')} / 35`;
        const flagsHtml = cmd.flags.map(f => `<div class="flag-item"><code>${f.f}</code><span><strong>${f.s}</strong>${f.d}</span></div>`).join('');
        slidesHtml += `
          <section class="slide">
            <div class="topbar"><span><span class="dot"></span>MODULE 01 · TOPIC 01</span><span>LINUX ESSENTIALS · ${cmd.cat.toUpperCase()}</span></div>
            <div class="content">
              <div class="cmd-head">
                <div class="left"><div class="tag">${cmd.cat}</div><h2>${cmd.name} <em>· Advanced Usage</em></h2></div>
                <div class="right"><div class="range">${range}</div><div class="label">${cmd.name}</div></div>
              </div>
              <div class="cmd-slide-content">
                <div class="cmd-left">
                  <div class="cmd-hero" style="justify-content: flex-start;">
                    <div class="num">Flag Breakdown</div>
                    <div class="flag-list">${flagsHtml}</div>
                  </div>
                </div>
                <div class="cmd-right">
                  <div class="terminal-mock">
                    <div class="terminal-header"><div class="dots"><span></span><span></span><span></span></div>bash -- 80x24</div>
                    <div class="terminal-body">
                      ${buildTerm(cmd.advTerm)}
                      <div class="term-line"><span class="prompt"><span class="user">ajsacay@dorsu</span>:<span class="path">~</span>$</span> <span class="cursor"></span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="footbar"><span>§ 35 COMMANDS</span><span class="pagenum">${displayNum}</span></div>
          </section>`;

      } else if (config.type === 'closing') {
        slidesHtml += `
          <section class="slide closing">
            <div class="topbar"><span><span class="dot"></span>${config.header}</span><span>CLOSING</span></div>
            <div class="content">
              <div><div class="tag">${config.tag}</div><h2>${config.title}</h2></div>
              <div class="summary" style="grid-template-columns:1fr 1fr 1fr">
                <div class="sum-card"><div class="n">${config.leftCardNum}</div><h4>${config.leftCardTitle}</h4><p>${config.leftCardDesc}</p></div>
                <div class="sum-card"><div class="n">${config.middleCardNum}</div><h4>${config.middleCardTitle}</h4><p>${config.middleCardDesc}</p></div>
                <div class="sum-card"><div class="n">${config.rightCardNum}</div><h4>${config.rightCardTitle}</h4><p>${config.rightCardDesc}</p></div>
              </div>
              <div class="footrow">
                <div class="left">"The best sysadmins are not the ones who know every command — they are the ones who, before they press Enter, can tell you what it will do."</div>
                <div class="right"><div class="name">Ar-Jay R. Sacay</div><div class="role">Faculty · ITP 141 · BS Information Technology</div></div>
              </div>
            </div>
            <div class="footbar"><span>END OF TOPIC 01 · MODULE 01</span><span class="pagenum">${displayNum}</span></div>
          </section>`;
      }
    });

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
