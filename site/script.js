const body=document.body,themeToggle=document.querySelector('.theme-toggle'),menuToggle=document.querySelector('.menu-toggle'),navLinks=document.querySelector('.nav-links');
if(localStorage.getItem('portfolio-theme')==='light'){body.classList.add('light');themeToggle.textContent='☾'}
themeToggle.addEventListener('click',()=>{body.classList.toggle('light');const light=body.classList.contains('light');themeToggle.textContent=light?'☾':'☀';localStorage.setItem('portfolio-theme',light?'light':'dark')});
menuToggle.addEventListener('click',()=>navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();
