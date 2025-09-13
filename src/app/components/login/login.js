
document.addEventListener('mousemove', function(e) {
    const circles = document.querySelectorAll('.decoration');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.5;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        circle.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
});
