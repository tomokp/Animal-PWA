'use strict';

window.addEventListener('load', async () => {
    const ul = document.querySelector('ul');
    const refresh = document.querySelector('#refresh');
    const form = document.querySelector('form');
    const username = 'tomokp';
    const animalForm = form.elements.greeting;
    
    if (navigator.serviceWorker) {
        try {
            await navigator.serviceWorker.register('./sw.js')
            const register = await navigator.serviceWorker.ready
            if (register.sync) {
                form.addEventListener("submit", async (event) => {
                    event.preventDefault();
                    const message = {
                        animalName: animalForm.value,
                    };
                    try {
                        await saveNewAnimalData("outbox", message);
                        await register.sync.register("send-message");
                    } catch (e) {
                        console.error(e.message);
                    } finally {
                        await init()
                    }
                });
            }
        } catch (e) {
            console.error("Error", e)
        }
    }

    const init = async () => {
        const data = [];
        let lastCache = []
        try {
            const greetings = await getAnimals();
            await saveNewAnimalData("cache", greetings)
            const cache = await loadNewAnimalData("cache")
            const lastCache = cache.pop()
            for (const message of lastCache) {
                data.push(message);
            }
            ul.innerHTML = '';
            data.forEach(item => {
                ul.innerHTML += `<ul>${item.animalName}</ul>`;
            });
        } catch (e) {
            console.log(e.message);
        }
    };

    await init()

    refresh.addEventListener('click', init);
});
