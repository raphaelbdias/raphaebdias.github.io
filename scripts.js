document.addEventListener('DOMContentLoaded', () => {
    const skillButtons = document.querySelectorAll('.skill-button');

    skillButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});
