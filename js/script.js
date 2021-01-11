document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach( item => {
            item.style.display = "none";
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        }); 
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach( (item, i) => {
                if(target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            }); 
        }

    });


    //Timer
    const deadline = '2021-02-11';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 *60) % 24)),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds

        };
    }

    function plusZero(num){
        if (num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);
            
            days.innerHTML = plusZero(t.days);
            hours.innerHTML = plusZero(t.hours);
            minutes.innerHTML = plusZero(t.minutes);
            seconds.innerHTML = plusZero(t.seconds);

            if ( t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);

    //Modal
    const modalButton = document.querySelectorAll('[data-modalButton]'),
          modal = document.querySelector('[data-modal]'),
          close = document.querySelector('[data-close]');

    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(timeToOpenModal);
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'visible';
    }

    modalButton.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    close.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if(e.target == modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.style.display == 'block') {
            closeModal();
        }
    });

    const timeToOpenModal = setTimeout(openModal, 10000);

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    //Class
    class Menu {
        constructor(src, alt, title, descr, price, parent) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parent);
        }

        render() {
            const menuItem = document.createElement('div');
            menuItem.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(menuItem);
        }
    }

    new Menu(
        'img/tabs/vegy.jpg', 
        'vegy', 
        'Меню Тест', 
        'Обжаренные кусочки филе тунца, анчоусы, свежий огурец, помидоры черри, зелёная стручковая фасоль, отварной мини картофель, перепелиное яйцо, салат Айсберг, кольца красного лука, каперсы 260 г.', 
        325, 
        '.menu__field .container').render();

	
	//forms
	const forms = document.querySelectorAll('form'),
		  message = {
			load: 'Загрузка',
			success: 'Данные успешно отправлены!',
			error: 'Ошибка, повторите снова...'
		  };


	forms.forEach(item => {
		postForms(item);
	});

	function postForms(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const messageOnSite = document.createElement('div');
			messageOnSite.textContent = message.load;
			form.append(messageOnSite);

			const request = new XMLHttpRequest();
			request.open('POST', 'server.php');

			const formData = new FormData(form);
			request.send(formData);

			request.addEventListener('load', () => {
				if (request.status === 200) {
					console.log(request.response);
					form.reset();
					messageOnSite.textContent = message.success;
					setTimeout(() => {
						messageOnSite.remove();
					}, 2000);
				} else {
					messageOnSite.textContent = message.error;
				}
			});


		});
	}



});
