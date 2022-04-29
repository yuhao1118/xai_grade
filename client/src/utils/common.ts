export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const mock = async (response: Object): Promise<Object> =>
  new Promise((resolve) => {
    setTimeout(resolve.bind(null, response), 200);
  });

interface IURLParams {
  [key: string]: string;
}

export const getUrlParams = (key: string, location: any) => {
  const search = location;
  const queryObj = {} as IURLParams;
  search.indexOf('?') !== -1 &&
    search
      .split('?')[1]
      .split('&')
      .forEach((queryPair: string) => {
        const [key, val] = queryPair.split('=');
        queryObj[key] = decodeURIComponent(val);
      });

  return queryObj[key];
};

export const isNumber = (value: any) => {
  return typeof value === 'number' && isFinite(value);
};

export const accumSumArray = (arr: number[]) => {
  let newArray: number[] = [];
  arr.reduce((prev, curr, i) => (newArray[i] = prev + curr), 0);
  return newArray;
};

export const capitaliseFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
