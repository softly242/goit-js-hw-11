const axios = require('axios').default;

const apiURL =
  'https://pixabay.com/api/?key=35694281-fbf60c309cfec9b53fc38f17f';

export default async function fetchPictures(name, page = 1) {
  const URL = `${apiURL}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  const { data } = await axios.get(URL);
  return data;
}

/* export default function fetchPictures(name, page = 1) {
  const URL = `https://pixabay.com/api/?key=35694281-fbf60c309cfec9b53fc38f17f&q=${name}
  &image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return fetch(URL).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Not found');
  });
} */
