import {
  pipe,
  length,
  gt,
  lt,
  test,
  allPass,
  ifElse,
  tap,
  otherwise,
  andThen,
  prop,
} from 'ramda';
import Api from '../tools/api';

const api = new Api();

const isValidValue = allPass([
  // кол-во символов в числе должно быть меньше 10.
  pipe(length, gt(10)),
  // кол-во символов в числе должно быть больше 2.
  pipe(length, lt(2)),
  // символы в строке только [0-9] и точка + число должно быть положительным
  test(/^\d+\.?\d*$/),
]);

const parseAndRoundToInt = pipe(parseFloat, Math.round);
const pow2 = (value) => Math.pow(value, 2);
const mod3 = (value) => value % 3;

const convertDecimalIntoBinary = (value) =>
  api.get('https://api.tech/numbers/base', { from: 10, to: 2, number: value });

const getAnimal = (id) => api.get(`https:/animals.tech/${id}`, {});

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  // 1. Берем строку N. Пишем изначальную строку в writeLog.
  writeLog(value);

  ifElse(
    isValidValue,
    pipe(
      parseAndRoundToInt,
      tap(writeLog),
      convertDecimalIntoBinary,
      otherwise(handleError),
      andThen(
        pipe(
          prop(['result']),
          tap(writeLog),
          length,
          tap(writeLog),
          mod3,
          tap(writeLog),
          pow2,
          tap(writeLog),
          getAnimal,
          otherwise(handleError),
          andThen(pipe(prop(['result']), handleSuccess))
        )
      )
    ),
    () => handleError('ValidationError')
  )(value);
};

export default processSequence;
