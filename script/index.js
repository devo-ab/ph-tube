const btnContainer = document.getElementById('btn-container');
const cardContainer = document.getElementById('card-container');
const errorElement = document.getElementById('error-element');
const sortBtn = document.getElementById('sort-btn');

let selectedCategories = 1000;
let sortByView = false;
sortBtn.addEventListener('click', () => {
    sortByView = true;
    fetchDataByCatagories(selectedCategories, sortByView);
});

const fetchCatagories = () => {
  const url = 'https://openapi.programming-hero.com/api/videos/categories';
  fetch(url)
    .then((res) => res.json())
    .then(({data}) => {
        data.forEach((card) => {
            const newBtn = document.createElement('button');
            newBtn.className = 'btn category-btn btn-ghost bg-slate-700 text-white text-lg';
            newBtn.innerText = card.category
            newBtn.addEventListener('click', () => {
                fetchDataByCatagories(card.category_id)
                const allBtns = document.querySelectorAll('.category-btn')
                for(const btn of allBtns){
                    btn.classList.remove('bg-red-600');
                }
                newBtn.classList.add('bg-red-600');
            })
            btnContainer.appendChild(newBtn);
        })
    });
};


const fetchDataByCatagories = (categoryID, sortByView) => {
    selectedCategories = categoryID;
    const url = `https://openapi.programming-hero.com/api/videos/category/${categoryID}`;
  fetch(url)
    .then((res) => res.json())
    .then(({data}) => {

        if(sortByView){
            data.sort((a, b) => {
                const totalViewsStrFirst = a.others?.views;
                const totalViewsStrSecond = b.others?.views;
                const totalViewsStrFirstNumber = parseFloat(totalViewsStrFirst.replace("k", '')) || 0;
                const totalViewsStrSecondNumber = parseFloat(totalViewsStrSecond.replace("k", '')) || 0;
                return totalViewsStrSecondNumber - totalViewsStrFirstNumber;
            })
        }

        if(data.length === 0){
            errorElement.classList.remove('hidden');
        }
        else{
            errorElement.classList.add('hidden');
        }
        cardContainer.innerHTML = '';
        data.forEach((video) => {
            let verifiedBadge = '';
            if(video.authors[0].verified){
                verifiedBadge = `<img class="w-6 h-6" src="./images/verify.png" alt=""></img>`
            }

            console.log(video)
            const newCard = document.createElement('div');
            newCard.innerHTML = `
            <div class="card w-full bg-base-100 shadow-xl">
            <figure class="overflow-hidden h-72">
                <img class="w-full" src="${video.thumbnail}" alt="Videos" />
                <h6 class="absolute bottom-[40%] right-12">${video.others.posted_date}</h6>
            </figure>
            <div class="card-body">
                <div class="flex space-x-4 justify-start items-start">
                    <div>
                        <img class="w-12 h-12 rounded-full" src="${video.authors[0].profile_picture}" alt="Artists Images" />
                    </div>
                    <div>
                        <h2 class="card-title">${video.title}</h2>
                        <div class="flex mt-3">
                            <p class="">${video.authors[0].profile_name}</p>
                            ${verifiedBadge}
                        </div>
                        <p class="mt-3">${video.others.views}</p>
                    </div>
                </div>
            </div>
        </div>
            `
            cardContainer.appendChild(newCard)
            
        })
    })
}



fetchCatagories();
fetchDataByCatagories(selectedCategories, sortByView);
