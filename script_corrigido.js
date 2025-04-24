
document.addEventListener('DOMContentLoaded', function() {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const totalScoreElement = document.getElementById('total-score');
    const profiles = document.querySelectorAll('.profile');
    const emailModal = document.getElementById('email-modal');
    const closeModalButton = document.getElementById('close-modal');
    const emailForm = document.getElementById('email-form');
    const formStatus = document.getElementById('form-status');

    updateTotalScore();
    showRelevantProfile();

    radioButtons.forEach(button => {
        button.addEventListener('change', function() {
            updateTotalScore();
            showRelevantProfile();
        });
    });

    closeModalButton.addEventListener('click', hideEmailModal);

    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        formStatus.textContent = "Enviando...";

        try {
            const response = await fetch(this.action, {
                method: this.method,
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = "Recebemos sua mensagem! Em breve, você vai descobrir que seu maior projeto é você mesmo. Fique de olho no seu e-mail — algo transformador está a caminho. Ah, e se não encontrar nossa mensagem, dá uma olhadinha na sua caixa de spam!";
                emailForm.reset();
                setTimeout(hideEmailModal, 5000);
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    formStatus.textContent = data.errors.map(error => error.message).join(", ");
                } else {
                    formStatus.textContent = "Ops! Ocorreu um problema ao enviar o formulário. Por favor, tente novamente.";
                }
            }
        } catch (error) {
            formStatus.textContent = "Ops! Ocorreu um problema ao enviar o formulário. Por favor, tente novamente.";
        }
    });

    window.addEventListener('click', function(e) {
        if (e.target === emailModal) {
            hideEmailModal();
        }
    });

    document.querySelectorAll('textarea').forEach(textarea => {
        if (textarea.closest('#email-form')) return;

        const savedValue = localStorage.getItem(textarea.closest('.reflection-box').querySelector('h3').textContent);
        if (savedValue) {
            textarea.value = savedValue;
        }

        textarea.addEventListener('input', function() {
            localStorage.setItem(
                this.closest('.reflection-box').querySelector('h3').textContent,
                this.value
            );
        });
    });

    function updateTotalScore() {
        let total = 0;
        let answeredQuestions = 0;
        const questionGroups = {};

        radioButtons.forEach(button => {
            if (button.checked) {
                const questionName = button.name;
                questionGroups[questionName] = parseInt(button.value);
                answeredQuestions++;
            }
        });

        for (const question in questionGroups) {
            total += questionGroups[question];
        }

        totalScoreElement.textContent = total;

        if (answeredQuestions === 7) {
            totalScoreElement.style.color = '#fdbb2d';
            document.querySelector('.total-score').style.border = '2px solid #fdbb2d';
        }
    }

    function showRelevantProfile() {
        const score = parseInt(totalScoreElement.textContent);
        profiles.forEach(profile => profile.classList.remove('active'));

        if (score >= 7 && score <= 14) {
            document.getElementById('profile-1').classList.add('active');
        } else if (score >= 15 && score <= 21) {
            document.getElementById('profile-2').classList.add('active');
        } else if (score >= 22 && score <= 28) {
            document.getElementById('profile-3').classList.add('active');
        } else if (score >= 29 && score <= 35) {
            document.getElementById('profile-4').classList.add('active');
        }

        if (score > 0) {
            document.getElementById('results').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    function showEmailModal() {
        emailModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function hideEmailModal() {
        emailModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    setTimeout(function() {
        if (localStorage.getItem('modalShown') !== 'true') {
            showEmailModal();
            localStorage.setItem('modalShown', 'true');
        }
    }, 30000);

    const questionSections = document.querySelectorAll('.question-section');

    questionSections.forEach((section, index) => {
        if (index < questionSections.length - 1) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Próxima Pergunta →';
            nextButton.classList.add('cta-button', 'next-button');
            nextButton.addEventListener('click', function() {
                questionSections[index + 1].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });

            section.querySelector('.container').appendChild(nextButton);
        }
    });

    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '↑';
    backToTopButton.classList.add('back-to-top');
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.width = '50px';
    backToTopButton.style.height = '50px';
    backToTopButton.style.borderRadius = '50%';
    backToTopButton.style.backgroundColor = '#1a2a6c';
    backToTopButton.style.color = 'white';
    backToTopButton.style.border = 'none';
    backToTopButton.style.fontSize = '20px';
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.display = 'none';
    backToTopButton.style.zIndex = '99';
    backToTopButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
});
