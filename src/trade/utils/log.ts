import util from 'util';

export const log = (value: any) => {
  console.log(util.inspect(value, { showHidden: false, depth: null, colors: true }));
};
