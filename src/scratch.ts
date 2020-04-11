import { promisify } from 'util';
const sleep = promisify(setTimeout);

async function fetchData(beforeFetch: any, afterFetch: any) {
  beforeFetch();
  await sleep(1000);
  afterFetch();
}

fetchData(
  () => {
    console.log('this should get called before data is fetched....');
  },
  () => {
    console.log('and this is called after.');
  }
);
