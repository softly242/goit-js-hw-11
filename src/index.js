import './css/style.css';
import fetchPictures from './fetchPictures';
import { Notify } from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

const lightbox = new SimpleLightbox('.photo-card', {
  sourceAttr: 'data-image',
  captionsData: 'alt',
});

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const buttonLoad = document.querySelector('.load-more');

form.addEventListener('submit', onSubmit);
buttonLoad.addEventListener('click', onLoadMore);

let page = 1;
let category = '';

async function onSubmit(event) {
  event.preventDefault();
  const inputValue = event.target.searchQuery.value;
  clearInfo();
  if (inputValue) {
    buttonLoad.classList.add('hidden');
    try {
      const { hits, totalHits } = await fetchPictures(inputValue);
      if (hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        clearInfo();
        return;
      }
      category = inputValue;
      putPictures(hits);
      !(totalHits <= hits.length) && buttonLoad.classList.remove('hidden');
      Notify.success(`Hooray! We found ${totalHits} images.`);
    } catch (err) {
      Notify.failure('Oops, something went wrong...');
    }
  }
}

function clearInfo() {
  page = 1;
  category = '';
  gallery.replaceChildren();
}

function putPictures(pictures) {
  const listHTML = pictures
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card" data-image=${largeImageURL}>
          <img class="gallery-image"src ="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${downloads}
            </p>
          </div>
        </div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', listHTML);
  lightbox.refresh();
}

async function onLoadMore() {
  try {
    page += 1;
    const { hits, totalHits } = await fetchPictures(category, page);
    putPictures(hits);
    if (isEnd(totalHits, page)) {
      Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      buttonLoad.classList.add('hidden');
    }
    autoScroll();
  } catch (e) {
    Notify.failure('Oops, something went wrong...');
  }
}

function isEnd(totalHits, page) {
  return Math.ceil(totalHits / 40) === page;
}

function autoScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

/* fetchPictures('asdsadasdasdsadaasadasd', 1).then(pictures => {
  console.log(pictures);
}); */

// fetch + then

/* fetchPictures(inputValue)
      .then(pictures => {
        if (pictures.hits.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          clearInfo();
          return;
        }
        category = inputValue;
        putPictures(pictures.hits);
        buttonLoad.classList.remove('hidden');
      })
      .catch(err => {
        console.error(err);
        Notify.failure('Oops, there is no country with that name');
      }); */

/*
  fetchPictures(category, page).then(pictures => {
    putPictures(pictures.hits);
    if (isEnd(pictures.totalHits, page)) {
      Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      buttonLoad.classList.add('hidden');
    }
  }); */
