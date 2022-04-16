export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const mock = async (response: Object): Promise<Object> =>
  new Promise((resolve) => {
    setTimeout(resolve.bind(null, response), 200);
  });
